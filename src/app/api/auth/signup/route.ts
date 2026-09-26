import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signUpSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = signUpSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const { loginId, email, name, password } = parsed.data;
  const existing = await prisma.user.findFirst({
    where: { OR: [{ loginId }, { email }] },
  });
  if (existing) {
    return NextResponse.json({ error: "Login id or email already in use" }, { status: 409 });
  }
  await prisma.user.create({
    data: {
      loginId,
      email,
      name,
      passwordHash: await hashPassword(password),
    },
  });
  return NextResponse.json({ ok: true });
}
