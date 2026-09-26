"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Doc = {
  id: string;
  status: string;
  partnerName: string;
  invoiceNo: string;
  docDate: string;
  sourceWarehouse?: { name: string; code: string } | null;
  targetWarehouse?: { name: string; code: string } | null;
  lines: { product: { name: string }; quantity: number }[];
};

export function DocumentList({
  type,
  newHref,
  detailPrefix,
}: {
  type: "RECEIPT" | "DELIVERY" | "TRANSFER";
  newHref: string;
  detailPrefix: string;
}) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch(`/api/documents?type=${type}`)
      .then((r) => r.json())
      .then(setDocs);
  }, [type]);

  const filtered = docs.filter((d) => {
    if (!q) return true;
    const hay = `${d.invoiceNo} ${d.partnerName} ${d.sourceWarehouse?.name ?? ""} ${d.targetWarehouse?.name ?? ""} ${d.lines.map((l) => l.product.name).join(" ")}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const createLabel =
    type === "RECEIPT" ? "New receipt" : type === "DELIVERY" ? "New delivery" : "New transfer";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search orders…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
        />
        <Link
          href={newHref}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          {createLabel}
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-zinc-200">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Route</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No orders yet
                </td>
              </tr>
            ) : (
              filtered.map((doc) => (
                <tr key={doc.id} className="border-t border-zinc-200">
                  <td className="px-4 py-3">{doc.lines.map((l) => l.product.name).join(", ") || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        doc.status === "DONE"
                          ? "text-emerald-400"
                          : "text-amber-600 text-amber-700 font-medium"
                      }
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`${detailPrefix}/${doc.id}`} className="text-zinc-900 hover:underline">
                      {doc.id.slice(0, 8)}…
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{new Date(doc.docDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{doc.partnerName}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {doc.sourceWarehouse?.code ?? "—"} → {doc.targetWarehouse?.code ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
