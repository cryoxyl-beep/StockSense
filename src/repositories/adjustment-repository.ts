import { prisma } from "@/lib/prisma";

export const adjustmentRepository = {
  list() {
    return prisma.adjustment.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  },
};
