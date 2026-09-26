import { prisma } from "@/lib/prisma";

export const stockRepository = {
  list() {
    return prisma.stock.findMany({
      orderBy: { updatedAt: "desc" },
      include: { product: true, location: true },
    });
  },
};
