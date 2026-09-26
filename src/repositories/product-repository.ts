import { prisma } from "@/lib/prisma";

export const productRepository = {
  list() {
    return prisma.product.findMany({
      orderBy: { name: "asc" },
      include: { category: true },
    });
  },

  findBySku(sku: string) {
    return prisma.product.findUnique({ where: { sku } });
  },
};
