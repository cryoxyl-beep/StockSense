"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StatusBar } from "@/components/operations/status-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatQty } from "@/lib/utils";
import { OperationStatus, OperationType } from "@prisma/client";

type Line = {
  id: string;
  quantity: { toString(): string };
  product: { name: string; sku: string };
  shortage?: boolean;
};

export function OperationDetail({
  operation,
  listPath,
}: {
  operation: {
    id: string;
    reference: string;
    type: OperationType;
    status: OperationStatus;
    scheduleDate: string;
    contact?: { name: string } | null;
    responsible?: { name: string | null; loginId: string } | null;
    lines: Line[];
  };
  listPath: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function validate() {
    setError(null);
    const res = await fetch(`/api/operations/${operation.id}/validate`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Validate failed");
      return;
    }
    setMessage("Validated successfully");
    router.refresh();
  }

  async function cancel() {
    setError(null);
    const res = await fetch(`/api/operations/${operation.id}/cancel`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Cancel failed");
      return;
    }
    router.refresh();
  }

  const done = operation.status === "DONE" || operation.status === "CANCELED";

  return (
    <div className="space-y-6 print:space-y-4" id="operation-print">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm text-zinc-500">
            <a href={listPath} className="underline">Back</a>
          </p>
          <h1 className="font-mono text-2xl font-semibold">{operation.reference}</h1>
        </div>
        <Badge>{operation.status}</Badge>
      </div>
      <StatusBar status={operation.status} type={operation.type} />
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Schedule date</dt>
          <dd>{new Date(operation.scheduleDate).toLocaleDateString()}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Contact</dt>
          <dd>{operation.contact?.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Responsible</dt>
          <dd>{operation.responsible?.name ?? operation.responsible?.loginId ?? "—"}</dd>
        </div>
      </dl>
      {operation.type === "DELIVERY" && operation.lines.some((l) => l.shortage) && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          Some products are not in stock at the source location (lines in red).
        </p>
      )}
      <table className="min-w-full text-sm border border-zinc-200">
        <thead className="bg-zinc-50">
          <tr>
            <th className="px-3 py-2 text-left">Product</th>
            <th className="px-3 py-2 text-left">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {operation.lines.map((l) => (
            <tr
              key={l.id}
              className={l.shortage ? "bg-red-50 text-red-900" : "border-t border-zinc-100"}
            >
              <td className="px-3 py-2">{l.product.name} ({l.product.sku})</td>
              <td className="px-3 py-2">{formatQty(l.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!done && (
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button type="button" onClick={validate}>Validate</Button>
          <Button type="button" variant="secondary" onClick={() => window.print()}>Print</Button>
          <Button type="button" variant="destructive" onClick={cancel}>Cancel</Button>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </div>
  );
}
