import { Resend } from "resend";

export async function sendResetCode(to: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("MAIL_NOT_CONFIGURED");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "StockSense <onboarding@resend.dev>",
    to,
    subject: "Your StockSense reset code",
    text: `Your password reset code is ${code}.\n\nIt expires in 10 minutes. If you did not request this, ignore this email.`,
  });

  if (error) {
    throw new Error(error.message);
  }
}
