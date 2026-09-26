import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export async function readJson(request: Request) {
  try {
    return { ok: true as const, body: (await request.json()) as unknown };
  } catch {
    return { ok: false as const };
  }
}

export function validationError(error: ZodError) {
  const message = error.issues[0]?.message ?? "Invalid input.";
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}
