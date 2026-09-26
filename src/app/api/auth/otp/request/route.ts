import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashOtp } from "@/lib/password";
import { otpRequestSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = otpRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return NextResponse.json({ error: "No account with this email" }, { status: 404 });
  }
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await prisma.passwordResetOtp.deleteMany({ where: { email: parsed.data.email } });
  await prisma.passwordResetOtp.create({
    data: { email: parsed.data.email, codeHash: hashOtp(code), expiresAt },
  });
  console.info(`[StockSense OTP] email=${parsed.data.email} code=${code}`);
  return NextResponse.json({
    ok: true,
    message: process.env.NODE_ENV === "production"
      ? "If the email exists, an OTP was sent."
      : `Dev mode: check server logs for OTP (email ${parsed.data.email})`,
  });
}
