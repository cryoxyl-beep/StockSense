import { DocumentStatus, DocumentType, MovementType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class InventoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InventoryError";
  }
}

async function getDefaultWarehouseId() {
  const warehouse = await prisma.warehouse.findFirst({ orderBy: { createdAt: "asc" } });
  if (!warehouse) {
    throw new InventoryError("Create a warehouse before validating stock movements.");
  }
  return warehouse.id;
}

async function resolveWarehouseId(explicitId?: string | null) {
  if (explicitId) return explicitId;
  return getDefaultWarehouseId();
}

export async function validateReceipt(documentId: string) {
  const document = await prisma.stockDocument.findUnique({
    where: { id: documentId },
    include: { lines: true },
  });

  if (!document || document.type !== DocumentType.RECEIPT) {
    throw new InventoryError("Receipt not found.");
  }
  if (document.status === DocumentStatus.DONE) {
    throw new InventoryError("Receipt already validated.");
  }
  if (document.lines.length === 0) {
    throw new InventoryError("Add at least one product line.");
  }

  const warehouseId = await resolveWarehouseId(document.targetWarehouseId);

  await prisma.$transaction(async (tx) => {
    for (const line of document.lines) {
      await tx.stockBalance.upsert({
        where: {
          productId_warehouseId: { productId: line.productId, warehouseId },
        },
        create: {
          productId: line.productId,
          warehouseId,
          quantity: line.quantity,
        },
        update: {
          quantity: { increment: line.quantity },
        },
      });

      const lineTotal = new Prisma.Decimal(line.unitPrice).mul(line.quantity);
      await tx.stockLedger.create({
        data: {
          movement: MovementType.RECEIPT,
          quantityDelta: line.quantity,
          lineTotal,
          productId: line.productId,
          documentId: document.id,
          warehouseId,
        },
      });
    }

    await tx.stockDocument.update({
      where: { id: document.id },
      data: { status: DocumentStatus.DONE },
    });
  });
}

export async function validateDelivery(documentId: string) {
  const document = await prisma.stockDocument.findUnique({
    where: { id: documentId },
    include: { lines: true },
  });

  if (!document || document.type !== DocumentType.DELIVERY) {
    throw new InventoryError("Delivery not found.");
  }
  if (document.status === DocumentStatus.DONE) {
    throw new InventoryError("Delivery already validated.");
  }
  if (document.lines.length === 0) {
    throw new InventoryError("Add at least one product line.");
  }

  const warehouseId = await resolveWarehouseId(document.sourceWarehouseId);

  for (const line of document.lines) {
    const balance = await prisma.stockBalance.findUnique({
      where: {
        productId_warehouseId: { productId: line.productId, warehouseId },
      },
    });
    const available = balance?.quantity ?? 0;
    if (available < line.quantity) {
      const product = await prisma.product.findUnique({ where: { id: line.productId } });
      throw new InventoryError(
        `Insufficient stock for ${product?.name ?? "product"} (need ${line.quantity}, have ${available}).`,
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    for (const line of document.lines) {
      await tx.stockBalance.update({
        where: {
          productId_warehouseId: { productId: line.productId, warehouseId },
        },
        data: {
          quantity: { decrement: line.quantity },
        },
      });

      const lineTotal = new Prisma.Decimal(line.unitPrice).mul(line.quantity);
      await tx.stockLedger.create({
        data: {
          movement: MovementType.DELIVERY,
          quantityDelta: -line.quantity,
          lineTotal,
          productId: line.productId,
          documentId: document.id,
          warehouseId,
        },
      });
    }

    await tx.stockDocument.update({
      where: { id: document.id },
      data: { status: DocumentStatus.DONE },
    });
  });
}

export async function validateTransfer(documentId: string) {
  const document = await prisma.stockDocument.findUnique({
    where: { id: documentId },
    include: { lines: true },
  });

  if (!document || document.type !== DocumentType.TRANSFER) {
    throw new InventoryError("Transfer not found.");
  }
  if (document.status === DocumentStatus.DONE) {
    throw new InventoryError("Transfer already validated.");
  }
  if (document.lines.length === 0) {
    throw new InventoryError("Add at least one product line.");
  }

  const sourceWarehouseId = await resolveWarehouseId(document.sourceWarehouseId);
  const targetWarehouseId = await resolveWarehouseId(document.targetWarehouseId);
  if (sourceWarehouseId === targetWarehouseId) {
    throw new InventoryError("Source and destination warehouses must be different.");
  }

  for (const line of document.lines) {
    const balance = await prisma.stockBalance.findUnique({
      where: {
        productId_warehouseId: { productId: line.productId, warehouseId: sourceWarehouseId },
      },
    });
    const available = balance?.quantity ?? 0;
    if (available < line.quantity) {
      const product = await prisma.product.findUnique({ where: { id: line.productId } });
      throw new InventoryError(
        `Insufficient stock for ${product?.name ?? "product"} at source warehouse (need ${line.quantity}, have ${available}).`,
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    for (const line of document.lines) {
      await tx.stockBalance.update({
        where: {
          productId_warehouseId: { productId: line.productId, warehouseId: sourceWarehouseId },
        },
        data: {
          quantity: { decrement: line.quantity },
        },
      });

      await tx.stockBalance.upsert({
        where: {
          productId_warehouseId: { productId: line.productId, warehouseId: targetWarehouseId },
        },
        create: {
          productId: line.productId,
          warehouseId: targetWarehouseId,
          quantity: line.quantity,
        },
        update: {
          quantity: { increment: line.quantity },
        },
      });

      const lineTotal = new Prisma.Decimal(line.unitPrice).mul(line.quantity);
      await tx.stockLedger.createMany({
        data: [
          {
            movement: MovementType.TRANSFER_OUT,
            quantityDelta: -line.quantity,
            lineTotal,
            productId: line.productId,
            documentId: document.id,
            warehouseId: sourceWarehouseId,
          },
          {
            movement: MovementType.TRANSFER_IN,
            quantityDelta: line.quantity,
            lineTotal,
            productId: line.productId,
            documentId: document.id,
            warehouseId: targetWarehouseId,
          },
        ],
      });
    }

    await tx.stockDocument.update({
      where: { id: document.id },
      data: {
        status: DocumentStatus.DONE,
        sourceWarehouseId,
        targetWarehouseId,
      },
    });
  });
}
