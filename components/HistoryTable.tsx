"use client";

import { useEffect, useState } from "react";

type Entry = {
  id: string;
  movement: string;
  quantityDelta: number;
  lineTotal: string;
  at: string;
  product: { name: string };
  document: { invoiceNo: string; partnerName: string };
};

export function HistoryTable() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Entry[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = q ? `?q=${encodeURIComponent(q)}` : "";
      fetch(`/api/history${params}`)
        .then((r) => r.json())
        .then(setRows);
    }, 200);
    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div>
      <input
        type="search"
        placeholder="Search product or invoice…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-4 w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
      />
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-950 text-zinc-400">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No movements yet
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-zinc-800">
                  <td className="px-4 py-3">{row.product.name}</td>
                  <td className="px-4 py-3">
                    {row.movement === "RECEIPT" ? "Received" : "Delivered"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{row.document.invoiceNo}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(row.at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {row.quantityDelta > 0 ? `+${row.quantityDelta}` : row.quantityDelta}
                  </td>
                  <td className="px-4 py-3">₹{Number(row.lineTotal).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
