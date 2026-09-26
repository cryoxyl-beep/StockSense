import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";

  return (
    <AuthFrame title="Choose a new password" subtitle="Enter the code from your reset email.">
      <ResetPasswordForm initialEmail={email} />
    </AuthFrame>
  );
}
