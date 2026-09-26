"use client";

import { useEffect, useState } from "react";

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  unitPrice: string;
  reorderLevel: number;
  balances: { quantity: number }[];
};

export function StockTable() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      const params = q ? `?q=${encodeURIComponent(q)}` : "";
      const res = await fetch(`/api/products${params}`);
      const data = await res.json();
      setRows(data);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div>
      <input
        type="search"
        placeholder="Search SKU or product…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-4 w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
      />
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-950 text-zinc-400">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Actual Stock</th>
              <th className="px-4 py-3">Net Stock</th>
              <th className="px-4 py-3">Price/Unit</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  No products yet. Add items in Inventory.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const qty = row.balances.reduce((s, b) => s + b.quantity, 0);
                const low = qty <= row.reorderLevel;
                return (
                  <tr key={row.id} className="border-t border-zinc-800">
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3 text-zinc-400">{row.sku}</td>
                    <td className={`px-4 py-3 ${low ? "text-amber-400" : ""}`}>{qty}</td>
                    <td className="px-4 py-3">{qty}</td>
                    <td className="px-4 py-3">₹{Number(row.unitPrice).toFixed(2)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
