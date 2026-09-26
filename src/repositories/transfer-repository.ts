import { prisma } from "@/lib/prisma";

export const transferRepository = {
  list() {
    return prisma.internalTransfer.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true, fromLocation: true, toLocation: true },
    });
  },
};
