import { prisma } from "@/lib/prisma";

export const receiptRepository = {
  list() {
    return prisma.receipt.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true, destination: true },
    });
  },
};
