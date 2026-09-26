"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell, authButtonClass, authInputClass, authLabelClass } from "@/components/AuthShell";

export default function ForgotPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not send a code");
      return;
    }
    if (!data.issued) {
      setError("No account uses that email.");
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="We’ll email a 6-digit code. It expires in 10 minutes."
      footer={
        <Link href="/login" className="font-medium text-zinc-900 hover:underline underline-offset-4">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <div className="space-y-4">
          <p className="text-[14px] leading-6 text-zinc-600">
            Check the inbox for <span className="font-medium text-zinc-900">{email}</span>. The code is in that email.
          </p>
          <button
            type="button"
            className={authButtonClass}
            onClick={() => router.push(`/reset?email=${encodeURIComponent(email)}`)}
          >
            Enter code
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className={authLabelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInputClass}
            />
          </div>
          {error ? <p className="text-[13px] font-medium text-red-500">{error}</p> : null}
          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? "Sending" : "Send code"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
