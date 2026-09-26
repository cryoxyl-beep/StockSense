import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthFrame title="Sign in" subtitle="Use your work email to open the inventory workspace.">
      <LoginForm />
    </AuthFrame>
  );
}
