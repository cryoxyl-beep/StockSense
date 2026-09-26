"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Category = { id: string; name: string };
type Location = { id: string; name: string; shortCode: string; warehouse: { shortCode: string } };

export function ProductForm({
  categories,
  locations,
}: {
  categories: Category[];
  locations: Location[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    let categoryId = form.get("categoryId") as string;
    if (newCategory.trim()) {
      const catRes = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      });
      const cat = await catRes.json();
      if (catRes.ok) categoryId = cat.id;
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        sku: form.get("sku"),
        categoryId: categoryId || null,
        unitOfMeasure: form.get("unitOfMeasure") || "Unit",
        unitCost: form.get("unitCost"),
        reorderMin: form.get("reorderMin"),
        initialStock: form.get("initialStock") || undefined,
        locationId: form.get("locationId") || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed");
      return;
    }
    e.currentTarget.reset();
    setNewCategory("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 md:grid-cols-3">
      <Input name="name" placeholder="Product name" required />
      <Input name="sku" placeholder="SKU" required />
      <Input name="unitOfMeasure" placeholder="Unit of measure" defaultValue="Unit" />
      <Input name="unitCost" placeholder="Unit cost" type="number" step="0.01" />
      <Input name="reorderMin" placeholder="Reorder min" type="number" defaultValue={0} />
      <select name="categoryId" className="h-10 rounded-md border border-zinc-300 px-3 text-sm">
        <option value="">Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <Input
        placeholder="Or new category name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <Input name="initialStock" placeholder="Initial stock (optional)" type="number" step="0.001" />
      <select name="locationId" className="h-10 rounded-md border border-zinc-300 px-3 text-sm">
        <option value="">Stock location</option>
        {locations.map((l) => (
          <option key={l.id} value={l.id}>
            {l.warehouse.shortCode}/{l.shortCode} — {l.name}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600 md:col-span-3">{error}</p>}
      <Button type="submit" className="md:col-span-3 w-fit">Add product</Button>
    </form>
  );
}
