import { prisma } from "@/lib/prisma";

export const passwordResetRepository = {
  latestForUser(userId: string) {
    return prisma.passwordResetOtp.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  create(data: { userId: string; codeHash: string; expiresAt: Date }) {
    return prisma.passwordResetOtp.create({ data });
  },

  deleteById(id: string) {
    return prisma.passwordResetOtp.delete({ where: { id } });
  },

  latestActive(userId: string, now: Date) {
    return prisma.passwordResetOtp.findFirst({
      where: { userId, usedAt: null, expiresAt: { gt: now } },
      orderBy: { createdAt: "desc" },
    });
  },

  applyPasswordReset(userId: string, passwordHash: string, otpId: string) {
    const usedAt = new Date();
    return prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      prisma.passwordResetOtp.update({
        where: { id: otpId },
        data: { usedAt },
      }),
      prisma.passwordResetOtp.updateMany({
        where: { userId, usedAt: null, NOT: { id: otpId } },
        data: { usedAt },
      }),
    ]);
  },
};
