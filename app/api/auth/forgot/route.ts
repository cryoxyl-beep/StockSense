import { NextResponse } from "next/server";
import { issuePasswordReset } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const { email } = schema.parse(await request.json());
    const result = await issuePasswordReset(email.toLowerCase());
    return NextResponse.json({ ok: true, issued: result.issued });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    }
    if (error instanceof Error && error.message === "MAIL_NOT_CONFIGURED") {
      return NextResponse.json({ error: "RESEND_API_KEY is missing" }, { status: 503 });
    }
    if (error instanceof Error && error.message) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ error: "Could not send the email" }, { status: 500 });
  }
}
