"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/auth/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";

export function ResetPasswordForm({ initialEmail }: { initialEmail: string }) {
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: initialEmail, code: "", password: "" },
  });

  async function onSubmit(values: ResetPasswordInput) {
    setFormError(null);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as { error?: string; message?: string };

    if (!response.ok) {
      setFormError(payload.error ?? "Could not reset the password.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-300">
          Your password was updated. Sign in with the new password.
        </p>
        <Link
          href="/login"
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-sky-500 text-sm font-medium text-zinc-950 hover:bg-sky-400"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="code">Reset code</Label>
        <Input
          id="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          {...register("code")}
        />
        <FieldError message={errors.code?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>
      {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Updating…" : "Update password"}
      </Button>
      <p className="text-center text-sm text-zinc-400">
        <Link href="/forgot-password" className="text-sky-400 hover:text-sky-300">
          Request a new code
        </Link>
      </p>
    </form>
  );
}
