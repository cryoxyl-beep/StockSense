"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function requestOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const em = form.get("email") as string;
    const res = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: em }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Request failed");
      return;
    }
    setEmail(em);
    setMessage(data.message);
    setStep("reset");
  }

  async function resetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/otp/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        code: form.get("code"),
        password: form.get("password"),
        confirmPassword: form.get("confirmPassword"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Reset failed");
      return;
    }
    setMessage("Password updated. You can log in.");
  }

  if (step === "request") {
    return (
      <form onSubmit={requestOtp} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Input name="email" type="email" required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full">Send OTP</Button>
      </form>
    );
  }

  return (
    <form onSubmit={resetPassword} className="space-y-4">
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      <div>
        <label className="mb-1 block text-sm font-medium">OTP code</label>
        <Input name="code" required maxLength={6} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">New password</label>
        <Input name="password" type="password" required minLength={8} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Confirm password</label>
        <Input name="confirmPassword" type="password" required minLength={8} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full">Update password</Button>
    </form>
  );
}
