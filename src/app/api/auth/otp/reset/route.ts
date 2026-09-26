import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashOtp, hashPassword } from "@/lib/password";
import { otpResetSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = otpResetSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const { email, code, password } = parsed.data;
  const otp = await prisma.passwordResetOtp.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });
  if (!otp || otp.expiresAt < new Date() || otp.codeHash !== hashOtp(code)) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }
  await prisma.user.update({
    where: { email },
    data: { passwordHash: await hashPassword(password) },
  });
  await prisma.passwordResetOtp.deleteMany({ where: { email } });
  return NextResponse.json({ ok: true });
}
