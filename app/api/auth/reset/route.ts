import { NextResponse } from "next/server";
import { resetPasswordWithOtp } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const { email, code, password } = schema.parse(await request.json());
    await resetPasswordWithOtp(email.toLowerCase(), code, password);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Check the code and password" }, { status: 400 });
    }
    if (error instanceof Error && error.message === "INVALID_OTP") {
      return NextResponse.json({ error: "That code is wrong or expired" }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not reset password" }, { status: 500 });
  }
}
