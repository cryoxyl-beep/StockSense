import { OperationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function nextReference(
  warehouseId: string,
  type: OperationType,
): Promise<string> {
  return prisma.$transaction(async (tx) => {
    const warehouse = await tx.warehouse.findUniqueOrThrow({
      where: { id: warehouseId },
    });
    const seq = await tx.documentSequence.upsert({
      where: { warehouseId_type: { warehouseId, type } },
      create: { warehouseId, type, lastNumber: 1 },
      update: { lastNumber: { increment: 1 } },
    });
    const num = String(seq.lastNumber).padStart(3, "0");
    const suffix =
      type === "RECEIPT"
        ? "IN"
        : type === "DELIVERY"
          ? "OUT"
          : type === "INTERNAL"
            ? "INT"
            : "ADJ";
    return `${warehouse.shortCode}/${suffix}/${num}`;
  });
}
