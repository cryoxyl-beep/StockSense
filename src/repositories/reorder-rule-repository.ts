import { prisma } from "@/lib/prisma";

export const reorderRuleRepository = {
  list() {
    return prisma.reorderRule.findMany({
      orderBy: { updatedAt: "desc" },
      include: { product: true, location: true },
    });
  },
};
