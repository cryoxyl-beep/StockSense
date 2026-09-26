"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
      }),
    });
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap gap-2 rounded-lg border border-zinc-200 bg-white p-4">
      <Input name="name" placeholder="Contact name" required />
      <Input name="email" placeholder="Email" type="email" />
      <Input name="phone" placeholder="Phone" />
      <Button type="submit">Add contact</Button>
    </form>
  );
}
