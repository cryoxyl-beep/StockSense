import { NextResponse } from "next/server";
import { readJson, validationError } from "@/lib/http";
import { registerSchema } from "@/lib/validations/auth";
import { registerUser } from "@/services/auth-service";

export async function POST(request: Request) {
  const json = await readJson(request);
  if (!json.ok) {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = json.body;
  if (raw && typeof raw === "object" && "role" in raw && raw.role === "ADMIN") {
    return NextResponse.json(
      { ok: false, error: "That role cannot be assigned at signup." },
      { status: 400 },
    );
  }

  const body =
    raw && typeof raw === "object"
      ? { role: "WAREHOUSE_STAFF", ...raw }
      : raw;
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const result = await registerUser(parsed.data);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status },
      );
    }
    return NextResponse.json({ ok: true, user: result.user }, { status: 201 });
  } catch (error) {
    console.error("Register failed", error);
    return NextResponse.json(
      { ok: false, error: "Could not create the account." },
      { status: 500 },
    );
  }
}
