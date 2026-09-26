import { Resend } from "resend";

export async function sendPasswordResetEmail(to: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { delivered: false as const };
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || "StockSense <onboarding@resend.dev>";
  const result = await resend.emails.send({
    from,
    to,
    subject: "Your StockSense password reset code",
    text: `Your StockSense password reset code is ${code}. It expires in 10 minutes.`,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return { delivered: true as const };
}
