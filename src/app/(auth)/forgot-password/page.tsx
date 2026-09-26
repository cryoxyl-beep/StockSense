import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="text-sm text-zinc-500">OTP will be sent to your email (dev: server console)</p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
