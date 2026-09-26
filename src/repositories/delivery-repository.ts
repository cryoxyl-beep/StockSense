import { prisma } from "@/lib/prisma";

export const deliveryRepository = {
  list() {
    return prisma.delivery.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true, source: true },
    });
  },
};
