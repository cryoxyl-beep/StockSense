"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OperationType } from "@prisma/client";

type Option = { id: string; label: string };

export function OperationForm({
  type,
  listPath,
  products,
  contacts,
  locations,
  warehouses,
}: {
  type: OperationType;
  listPath: string;
  products: Option[];
  contacts: Option[];
  locations: Option[];
  warehouses: Option[];
}) {
  const router = useRouter();
  const [lines, setLines] = useState([{ productId: "", quantity: 1 }]);
  const [error, setError] = useState<string | null>(null);

  function addLine() {
    setLines((l) => [...l, { productId: "", quantity: 1 }]);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/operations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        warehouseId: form.get("warehouseId"),
        contactId: form.get("contactId") || null,
        fromLocationId: form.get("fromLocationId") || null,
        toLocationId: form.get("toLocationId") || null,
        scheduleDate: form.get("scheduleDate"),
        notes: form.get("notes"),
        lines: lines.filter((l) => l.productId && l.quantity > 0),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed");
      return;
    }
    router.push(`${listPath}/${data.id}`);
  }

  const isReceipt = type === "RECEIPT";
  const isDelivery = type === "DELIVERY";
  const isInternal = type === "INTERNAL";
  const isAdjust = type === "ADJUSTMENT";

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
      <select name="warehouseId" required className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
        <option value="">Warehouse (for reference)</option>
        {warehouses.map((w) => (
          <option key={w.id} value={w.id}>{w.label}</option>
        ))}
      </select>
      <select name="contactId" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
        <option value="">Contact</option>
        {contacts.map((c) => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
      {(isDelivery || isInternal) && (
        <select name="fromLocationId" required className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
          <option value="">From location</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>
      )}
      {(isReceipt || isInternal || isAdjust) && (
        <select name="toLocationId" required className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
          <option value="">To location</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>
      )}
      <Input name="scheduleDate" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
      <Input name="notes" placeholder="Notes" />
      <div className="space-y-2">
        <p className="text-sm font-medium">Products</p>
        {lines.map((line, i) => (
          <div key={i} className="flex gap-2">
            <select
              className="h-10 flex-1 rounded-md border border-zinc-300 px-3 text-sm"
              value={line.productId}
              onChange={(e) => {
                const next = [...lines];
                next[i].productId = e.target.value;
                setLines(next);
              }}
              required
            >
              <option value="">Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            <Input
              type="number"
              step="0.001"
              min={0.001}
              className="w-28"
              value={line.quantity}
              onChange={(e) => {
                const next = [...lines];
                next[i].quantity = Number(e.target.value);
                setLines(next);
              }}
              required
            />
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={addLine}>Add line</Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit">Create draft</Button>
    </form>
  );
}
