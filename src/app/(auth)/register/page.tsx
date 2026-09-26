import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthFrame
      title="Create an account"
      subtitle="Warehouse staff and inventory managers can register. Admin accounts are provisioned separately."
    >
      <RegisterForm />
    </AuthFrame>
  );
}
