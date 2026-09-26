"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Doc = {
  id: string;
  status: string;
  partnerName: string;
  invoiceNo: string;
  docDate: string;
  lines: { product: { name: string }; quantity: number }[];
};

export function DocumentList({
  type,
  newHref,
  detailPrefix,
}: {
  type: "RECEIPT" | "DELIVERY";
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
    const hay = `${d.invoiceNo} ${d.partnerName} ${d.lines.map((l) => l.product.name).join(" ")}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search orders…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        />
        <Link
          href={newHref}
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
        >
          {type === "RECEIPT" ? "New receipt" : "New delivery"}
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-950 text-zinc-400">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Partner</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  No orders yet
                </td>
              </tr>
            ) : (
              filtered.map((doc) => (
                <tr key={doc.id} className="border-t border-zinc-800">
                  <td className="px-4 py-3">
                    {doc.lines.map((l) => l.product.name).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        doc.status === "DONE"
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`${detailPrefix}/${doc.id}`}
                      className="text-rose-400 hover:underline"
                    >
                      {doc.id.slice(0, 8)}…
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(doc.docDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{doc.partnerName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
