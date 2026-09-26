import { prisma } from "@/lib/prisma";

export const locationRepository = {
  list() {
    return prisma.location.findMany({
      orderBy: [{ warehouseId: "asc" }, { code: "asc" }],
      include: { warehouse: true, parent: true },
    });
  },
};
