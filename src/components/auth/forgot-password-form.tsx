"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/auth/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setFormError(null);
    setMessage(null);
    setDevOtp(null);
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as {
      message?: string;
      error?: string;
      devOtp?: string;
    };

    if (!response.ok) {
      setFormError(payload.error ?? "Could not start a password reset.");
      return;
    }

    setEmail(values.email);
    setMessage(payload.message ?? "Check your email for a reset code.");
    setDevOtp(payload.devOtp ?? null);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>
      {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}
      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
      {devOtp ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-3 text-sm text-amber-100">
          <p className="font-medium">Development code</p>
          <p className="mt-1 font-mono text-lg tracking-widest" data-testid="dev-otp">
            {devOtp}
          </p>
          <p className="mt-2 text-xs text-amber-200/80">
            Email delivery is not configured, so this code is shown only outside production.
          </p>
        </div>
      ) : null}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send reset code"}
      </Button>
      <p className="text-center text-sm text-zinc-400">
        <Link
          href={email ? `/reset-password?email=${encodeURIComponent(email)}` : "/reset-password"}
          className="text-sky-400 hover:text-sky-300"
        >
          I have a code
        </Link>
        <span className="mx-2 text-zinc-600">·</span>
        <Link href="/login" className="text-sky-400 hover:text-sky-300">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
