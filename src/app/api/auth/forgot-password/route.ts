import { NextResponse } from "next/server";
import { readJson, validationError } from "@/lib/http";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { requestPasswordReset } from "@/services/password-reset-service";

export async function POST(request: Request) {
  const json = await readJson(request);
  if (!json.ok) {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = forgotPasswordSchema.safeParse(json.body);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const result = await requestPasswordReset(parsed.data);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status },
      );
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Forgot password failed", error);
    return NextResponse.json(
      { ok: false, error: "Could not start a password reset." },
      { status: 500 },
    );
  }
}
