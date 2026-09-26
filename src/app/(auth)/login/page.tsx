import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-zinc-500">Sign in with your Login Id</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-zinc-600">
        No account?{" "}
        <Link href="/signup" className="font-medium text-zinc-900 underline">
          Sign up
        </Link>
      </p>
      <p className="text-center text-sm">
        <Link href="/forgot-password" className="text-zinc-600 underline">
          Forgot password?
        </Link>
      </p>
    </div>
  );
}
