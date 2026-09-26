"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const body = {
      loginId: form.get("loginId"),
      email: form.get("email"),
      name: form.get("name"),
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
    };
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Sign up failed");
      return;
    }
    router.push("/login");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Login Id</label>
        <Input name="loginId" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <Input name="email" type="email" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <Input name="name" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Password</label>
        <Input name="password" type="password" required minLength={8} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Retype Password</label>
        <Input name="confirmPassword" type="password" required minLength={8} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating…" : "Sign up"}
      </Button>
    </form>
  );
}
