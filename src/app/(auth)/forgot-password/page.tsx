import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthFrame
      title="Reset your password"
      subtitle="We will send a 6-digit code that expires in 10 minutes."
    >
      <ForgotPasswordForm />
    </AuthFrame>
  );
}
