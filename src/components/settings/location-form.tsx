"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Warehouse = { id: string; name: string };

export function LocationForm({ warehouses }: { warehouses: Warehouse[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        shortCode: form.get("shortCode"),
        warehouseId: form.get("warehouseId"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed");
      return;
    }
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-3 rounded-lg border border-zinc-200 bg-white p-4 md:grid-cols-2">
      <Input name="name" placeholder="Name" required />
      <Input name="shortCode" placeholder="Short code" required />
      <select
        name="warehouseId"
        required
        className="h-10 rounded-md border border-zinc-300 px-3 text-sm md:col-span-2"
        defaultValue=""
      >
        <option value="" disabled>Select warehouse</option>
        {warehouses.map((w) => (
          <option key={w.id} value={w.id}>{w.name}</option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
      <Button type="submit" className="md:col-span-2 w-fit">Add location</Button>
    </form>
  );
}
