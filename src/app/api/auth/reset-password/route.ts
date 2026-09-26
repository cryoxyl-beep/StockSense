import { NextResponse } from "next/server";
import { readJson, validationError } from "@/lib/http";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { resetPassword } from "@/services/password-reset-service";

export async function POST(request: Request) {
  const json = await readJson(request);
  if (!json.ok) {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = resetPasswordSchema.safeParse(json.body);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const result = await resetPassword(parsed.data);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status },
      );
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Reset password failed", error);
    return NextResponse.json(
      { ok: false, error: "Could not reset the password." },
      { status: 500 },
    );
  }
}
