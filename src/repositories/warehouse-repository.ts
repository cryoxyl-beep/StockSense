import { prisma } from "@/lib/prisma";

export const warehouseRepository = {
  list() {
    return prisma.warehouse.findMany({
      orderBy: { name: "asc" },
      include: { locations: { orderBy: { code: "asc" } } },
    });
  },
};
