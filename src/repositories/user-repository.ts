import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
} as const;

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
  }) {
    return prisma.user.create({
      data,
      select: publicUserSelect,
    });
  },
};
