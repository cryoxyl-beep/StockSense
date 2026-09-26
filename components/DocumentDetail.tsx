"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Doc = {
  id: string;
  type: string;
  status: string;
  partnerName: string;
  invoiceNo: string;
  docDate: string;
  lines: {
    quantity: number;
    unitPrice: string;
    product: { name: string; sku: string };
  }[];
};

export function DocumentDetail({
  id,
  listHref,
  validateLabel,
}: {
  id: string;
  listHref: string;
  validateLabel: string;
}) {
  const router = useRouter();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/documents/${id}`)
      .then((r) => r.json())
      .then(setDoc);
  }, [id]);

  async function validate() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/documents/${id}/validate`, { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Validation failed");
      return;
    }
    router.refresh();
    const updated = await fetch(`/api/documents/${id}`).then((r) => r.json());
    setDoc(updated);
  }

  if (!doc) {
    return <p className="text-zinc-500">Loading…</p>;
  }

  const total = doc.lines.reduce(
    (s, l) => s + Number(l.unitPrice) * l.quantity,
    0,
  );

  return (
    <div className="max-w-3xl space-y-6">
      <Link href={listHref} className="text-sm text-rose-400 hover:underline">
        ← Back to list
      </Link>
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-500">Order ID</p>
            <p className="font-mono text-sm">{doc.id}</p>
          </div>
          <span
            className={
              doc.status === "DONE" ? "text-emerald-400" : "text-amber-400"
            }
          >
            {doc.status}
          </span>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <dt className="text-zinc-500">Partner</dt>
            <dd>{doc.partnerName}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Invoice</dt>
            <dd>{doc.invoiceNo}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Date</dt>
            <dd>{new Date(doc.docDate).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-950 text-zinc-400">
            <tr>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Unit</th>
              <th className="px-4 py-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {doc.lines.map((line, i) => (
              <tr key={i} className="border-t border-zinc-800">
                <td className="px-4 py-2">{line.product.name}</td>
                <td className="px-4 py-2">{line.quantity}</td>
                <td className="px-4 py-2">₹{Number(line.unitPrice).toFixed(2)}</td>
                <td className="px-4 py-2">
                  ₹{(Number(line.unitPrice) * line.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm">Total: ₹{total.toFixed(2)}</p>
      {error && <p className="text-sm text-rose-400">{error}</p>}

      {doc.status === "DRAFT" && (
        <button
          type="button"
          onClick={validate}
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Validating…" : validateLabel}
        </button>
      )}
    </div>
  );
}
