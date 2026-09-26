import { prisma } from "@/lib/prisma";

export const categoryRepository = {
  list() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  },
};
