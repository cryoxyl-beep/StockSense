import Link from "next/link";
import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sign up</h1>
        <p className="text-sm text-zinc-500">Create your StockSense account</p>
      </div>
      <SignUpForm />
      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline">
          Login
        </Link>
      </p>
    </div>
  );
}
