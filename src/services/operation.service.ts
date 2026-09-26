import {
  OperationStatus,
  OperationType,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { decimalToNumber, formatQty } from "@/lib/utils";
import { nextReference } from "@/services/reference.service";
import { freeToUse, getOrCreateQuant } from "@/services/stock.service";

type LineInput = { productId: string; quantity: number };

export async function createOperation(
  type: OperationType,
  data: {
    contactId?: string | null;
    fromLocationId?: string | null;
    toLocationId?: string | null;
    scheduleDate: Date;
    notes?: string;
    lines: LineInput[];
    responsibleId: string;
    warehouseId: string;
  },
) {
  const reference = await nextReference(data.warehouseId, type);
  return prisma.stockOperation.create({
    data: {
      reference,
      type,
      status: OperationStatus.DRAFT,
      contactId: data.contactId,
      fromLocationId: data.fromLocationId,
      toLocationId: data.toLocationId,
      scheduleDate: data.scheduleDate,
      notes: data.notes,
      responsibleId: data.responsibleId,
      lines: {
        create: data.lines.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
        })),
      },
    },
    include: { lines: { include: { product: true } }, contact: true },
  });
}

export async function updateOperationDraft(
  id: string,
  data: {
    contactId?: string | null;
    fromLocationId?: string | null;
    toLocationId?: string | null;
    scheduleDate?: Date;
    notes?: string;
    lines?: LineInput[];
  },
) {
  const op = await prisma.stockOperation.findUniqueOrThrow({ where: { id } });
  if (op.status !== OperationStatus.DRAFT) {
    throw new Error("Only draft operations can be edited");
  }
  if (data.lines) {
    await prisma.stockOperationLine.deleteMany({ where: { operationId: id } });
    await prisma.stockOperationLine.createMany({
      data: data.lines.map((l) => ({
        operationId: id,
        productId: l.productId,
        quantity: l.quantity,
      })),
    });
  }
  return prisma.stockOperation.update({
    where: { id },
    data: {
      contactId: data.contactId,
      fromLocationId: data.fromLocationId,
      toLocationId: data.toLocationId,
      scheduleDate: data.scheduleDate,
      notes: data.notes,
    },
    include: { lines: { include: { product: true } }, contact: true },
  });
}

async function locationLabel(locationId: string | null | undefined) {
  if (!locationId) return null;
  const loc = await prisma.location.findUnique({
    where: { id: locationId },
    include: { warehouse: true },
  });
  if (!loc) return null;
  return `${loc.warehouse.shortCode}/${loc.shortCode}`;
}

async function writeLedger(
  tx: Prisma.TransactionClient,
  operation: {
    id: string;
    reference: string;
    status: OperationStatus;
    contact?: { name: string } | null;
  },
  entries: {
    productId: string;
    quantity: number;
    direction: "IN" | "OUT" | "INTERNAL" | "ADJUST";
    fromLabel: string | null;
    toLabel: string | null;
  }[],
) {
  for (const e of entries) {
    await tx.stockLedgerEntry.create({
      data: {
        operationId: operation.id,
        productId: e.productId,
        reference: operation.reference,
        contactName: operation.contact?.name ?? null,
        fromLabel: e.fromLabel,
        toLabel: e.toLabel,
        quantity: e.quantity,
        direction: e.direction,
        status: operation.status,
      },
    });
  }
}

export async function validateOperation(id: string) {
  const op = await prisma.stockOperation.findUniqueOrThrow({
    where: { id },
    include: {
      lines: { include: { product: true } },
      contact: true,
      fromLocation: { include: { warehouse: true } },
      toLocation: { include: { warehouse: true } },
    },
  });

  if (op.status === OperationStatus.DONE || op.status === OperationStatus.CANCELED) {
    return op;
  }

  if (op.type === OperationType.RECEIPT) {
    if (op.status === OperationStatus.DRAFT) {
      return prisma.stockOperation.update({
        where: { id },
        data: { status: OperationStatus.READY },
        include: { lines: { include: { product: true } }, contact: true },
      });
    }
    if (op.status === OperationStatus.READY) {
      if (!op.toLocationId) throw new Error("Destination location required");
      const toLabel = await locationLabel(op.toLocationId);
      return prisma.$transaction(async (tx) => {
        for (const line of op.lines) {
          const quant = await getOrCreateQuant(tx, line.productId, op.toLocationId!);
          await tx.stockQuant.update({
            where: { id: quant.id },
            data: { onHand: { increment: line.quantity } },
          });
        }
        const updated = await tx.stockOperation.update({
          where: { id },
          data: { status: OperationStatus.DONE },
          include: { lines: { include: { product: true } }, contact: true },
        });
        await writeLedger(
          tx,
          updated,
          op.lines.map((l) => ({
            productId: l.productId,
            quantity: decimalToNumber(l.quantity),
            direction: "IN",
            fromLabel: null,
            toLabel,
          })),
        );
        return updated;
      });
    }
  }

  if (op.type === OperationType.DELIVERY) {
    const fromId = op.fromLocationId;
    if (!fromId) throw new Error("Source location required");

    if (op.status === OperationStatus.DRAFT) {
      const shortages: string[] = [];
      for (const line of op.lines) {
        const quant = await prisma.stockQuant.findUnique({
          where: { productId_locationId: { productId: line.productId, locationId: fromId } },
        });
        const free = quant ? freeToUse(quant.onHand, quant.reserved) : 0;
        if (free < decimalToNumber(line.quantity)) {
          shortages.push(line.product.name);
        }
      }
      const nextStatus = shortages.length
        ? OperationStatus.WAITING
        : OperationStatus.READY;
      return prisma.$transaction(async (tx) => {
        if (nextStatus === OperationStatus.READY) {
          for (const line of op.lines) {
            const quant = await getOrCreateQuant(tx, line.productId, fromId);
            await tx.stockQuant.update({
              where: { id: quant.id },
              data: { reserved: { increment: line.quantity } },
            });
            await tx.stockOperationLine.update({
              where: { id: line.id },
              data: { reservedQty: line.quantity },
            });
          }
        }
        return tx.stockOperation.update({
          where: { id },
          data: { status: nextStatus },
          include: { lines: { include: { product: true } }, contact: true },
        });
      });
    }

    if (op.status === OperationStatus.WAITING) {
      const shortages: string[] = [];
      for (const line of op.lines) {
        const quant = await prisma.stockQuant.findUnique({
          where: { productId_locationId: { productId: line.productId, locationId: fromId } },
        });
        const free = quant ? freeToUse(quant.onHand, quant.reserved) : 0;
        if (free < decimalToNumber(line.quantity)) shortages.push(line.product.name);
      }
      if (shortages.length) {
        throw new Error(`Insufficient stock: ${shortages.join(", ")}`);
      }
      return prisma.$transaction(async (tx) => {
        for (const line of op.lines) {
          const quant = await getOrCreateQuant(tx, line.productId, fromId);
          await tx.stockQuant.update({
            where: { id: quant.id },
            data: { reserved: { increment: line.quantity } },
          });
          await tx.stockOperationLine.update({
            where: { id: line.id },
            data: { reservedQty: line.quantity },
          });
        }
        return tx.stockOperation.update({
          where: { id },
          data: { status: OperationStatus.READY },
          include: { lines: { include: { product: true } }, contact: true },
        });
      });
    }

    if (op.status === OperationStatus.READY) {
      const fromLabel = await locationLabel(fromId);
      const toLabel = await locationLabel(op.toLocationId);
      return prisma.$transaction(async (tx) => {
        for (const line of op.lines) {
          const quant = await getOrCreateQuant(tx, line.productId, fromId);
          const free = freeToUse(quant.onHand, quant.reserved);
          const qty = decimalToNumber(line.quantity);
          if (free < qty) {
            throw new Error(`Insufficient stock for ${line.product.name}`);
          }
          const reservedRelease = decimalToNumber(line.reservedQty);
          await tx.stockQuant.update({
            where: { id: quant.id },
            data: {
              onHand: { decrement: line.quantity },
              reserved: { decrement: reservedRelease > 0 ? line.reservedQty : 0 },
            },
          });
        }
        const updated = await tx.stockOperation.update({
          where: { id },
          data: { status: OperationStatus.DONE },
          include: { lines: { include: { product: true } }, contact: true },
        });
        await writeLedger(
          tx,
          updated,
          op.lines.map((l) => ({
            productId: l.productId,
            quantity: decimalToNumber(l.quantity),
            direction: "OUT",
            fromLabel,
            toLabel,
          })),
        );
        return updated;
      });
    }
  }

  if (op.type === OperationType.INTERNAL) {
    if (op.status === OperationStatus.DRAFT) {
      return prisma.stockOperation.update({
        where: { id },
        data: { status: OperationStatus.READY },
        include: { lines: { include: { product: true } }, contact: true },
      });
    }
    if (op.status === OperationStatus.READY) {
      if (!op.fromLocationId || !op.toLocationId) {
        throw new Error("From and to locations required");
      }
      const fromLabel = await locationLabel(op.fromLocationId);
      const toLabel = await locationLabel(op.toLocationId);
      return prisma.$transaction(async (tx) => {
        for (const line of op.lines) {
          const fromQuant = await getOrCreateQuant(tx, line.productId, op.fromLocationId!);
          const free = freeToUse(fromQuant.onHand, fromQuant.reserved);
          if (free < decimalToNumber(line.quantity)) {
            throw new Error(`Insufficient stock for ${line.product.name}`);
          }
          await tx.stockQuant.update({
            where: { id: fromQuant.id },
            data: { onHand: { decrement: line.quantity } },
          });
          const toQuant = await getOrCreateQuant(tx, line.productId, op.toLocationId!);
          await tx.stockQuant.update({
            where: { id: toQuant.id },
            data: { onHand: { increment: line.quantity } },
          });
        }
        const updated = await tx.stockOperation.update({
          where: { id },
          data: { status: OperationStatus.DONE },
          include: { lines: { include: { product: true } }, contact: true },
        });
        await writeLedger(
          tx,
          updated,
          op.lines.map((l) => ({
            productId: l.productId,
            quantity: decimalToNumber(l.quantity),
            direction: "INTERNAL",
            fromLabel,
            toLabel,
          })),
        );
        return updated;
      });
    }
  }

  if (op.type === OperationType.ADJUSTMENT) {
    if (op.status === OperationStatus.DRAFT) {
      return prisma.stockOperation.update({
        where: { id },
        data: { status: OperationStatus.READY },
        include: { lines: { include: { product: true } }, contact: true },
      });
    }
    if (op.status === OperationStatus.READY) {
      if (!op.toLocationId) throw new Error("Location required for adjustment");
      const locLabel = await locationLabel(op.toLocationId);
      return prisma.$transaction(async (tx) => {
        const ledgerEntries: {
          productId: string;
          quantity: number;
          direction: "ADJUST";
          fromLabel: string | null;
          toLabel: string | null;
        }[] = [];
        for (const line of op.lines) {
          const quant = await getOrCreateQuant(tx, line.productId, op.toLocationId!);
          const current = decimalToNumber(quant.onHand);
          const target = decimalToNumber(line.quantity);
          const delta = target - current;
          await tx.stockQuant.update({
            where: { id: quant.id },
            data: { onHand: target },
          });
          ledgerEntries.push({
            productId: line.productId,
            quantity: Math.abs(delta),
            direction: "ADJUST",
            fromLabel: delta < 0 ? locLabel : null,
            toLabel: delta >= 0 ? locLabel : null,
          });
        }
        const updated = await tx.stockOperation.update({
          where: { id },
          data: { status: OperationStatus.DONE },
          include: { lines: { include: { product: true } }, contact: true },
        });
        await writeLedger(tx, updated, ledgerEntries);
        return updated;
      });
    }
  }

  throw new Error(`Cannot validate operation in status ${op.status}`);
}

export async function cancelOperation(id: string) {
  const op = await prisma.stockOperation.findUniqueOrThrow({
    where: { id },
    include: { lines: true },
  });
  if (op.status === OperationStatus.DONE) {
    throw new Error("Cannot cancel completed operation");
  }
  return prisma.$transaction(async (tx) => {
    if (op.type === OperationType.DELIVERY && op.fromLocationId) {
      for (const line of op.lines) {
        const reserved = decimalToNumber(line.reservedQty);
        if (reserved > 0) {
          const quant = await getOrCreateQuant(tx, line.productId, op.fromLocationId);
          await tx.stockQuant.update({
            where: { id: quant.id },
            data: { reserved: { decrement: line.reservedQty } },
          });
        }
      }
    }
    return tx.stockOperation.update({
      where: { id },
      data: { status: OperationStatus.CANCELED },
      include: { lines: { include: { product: true } }, contact: true },
    });
  });
}

export function lineStockIssues(
  type: OperationType,
  lines: { productId: string; productName: string; quantity: number }[],
  fromLocationId: string | null,
  availability: Map<string, number>,
) {
  if (type !== OperationType.DELIVERY || !fromLocationId) return [];
  return lines.filter((l) => (availability.get(l.productId) ?? 0) < l.quantity);
}

export { formatQty };
