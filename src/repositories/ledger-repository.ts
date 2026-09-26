import type { OperationType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const ledgerRepository = {
  list() {
    return prisma.stockLedger.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: true, fromLocation: true, toLocation: true, user: true },
    });
  },

  append(data: {
    productId: string;
    operationType: OperationType;
    reference: string;
    quantity: Prisma.Decimal | number | string;
    fromLocationId?: string | null;
    toLocationId?: string | null;
    userId?: string | null;
  }) {
    return prisma.stockLedger.create({ data });
  },
};
