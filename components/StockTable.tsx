"use client";

import { useEffect, useState, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { DemandChart } from "./DemandChart";

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  unitPrice: string;
  reorderLevel: number;
  balances: { quantity: number }[];
};

export function StockTable() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const [showLowOnly, setShowLowOnly] = useState(searchParams.get("filter") === "low");
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  // Compute displayed rows
  const displayedRows = rows.filter((row) => {
    const qty = row.balances.reduce((s, b) => s + b.quantity, 0);
    const low = qty <= Math.max(20, row.reorderLevel);
    if (showLowOnly && !low) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search SKU or product..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white/50 backdrop-blur-sm px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950"
        />
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showLowOnly}
            onChange={(e) => setShowLowOnly(e.target.checked)}
            className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950"
          />
          Show low stock only
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-600 border-b border-zinc-200">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Actual Stock</th>
              <th className="px-4 py-3 font-medium">Net Stock</th>
              <th className="px-4 py-3 font-medium">Price/Unit</th>
            </tr>
          </thead>
          <tbody className="bg-white/40">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  Loading...
                </td>
              </tr>
            ) : displayedRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  {showLowOnly ? "No low stock products found." : "No products yet. Add items in Inventory."}
                </td>
              </tr>
            ) : (
              displayedRows.map((row) => {
                const qty = row.balances.reduce((s, b) => s + b.quantity, 0);
                const isLow = qty <= Math.max(20, row.reorderLevel);
                const isExpanded = expandedRows.has(row.id);
                
                return (
                  <Fragment key={row.id}>
                    <tr 
                      onClick={() => toggleRow(row.id)}
                      className={`border-t border-zinc-200 transition-colors cursor-pointer hover:bg-zinc-100/50 ${isLow ? "bg-red-50/40" : ""}`}
                    >
                      <td className="px-4 py-3 font-medium text-zinc-900 flex items-center gap-2">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                        {row.name}
                      </td>
                      <td className="px-4 py-3 text-zinc-500">{row.sku}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={isLow ? "font-bold text-red-600" : "text-zinc-700"}>{qty}</span>
                          {isLow && (
                            <div className="group relative flex items-center justify-center h-4 w-4">
                              <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-700">{qty}</td>
                      <td className="px-4 py-3 text-zinc-600">₹{Number(row.unitPrice).toFixed(2)}</td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-zinc-50/50 border-t border-zinc-100">
                        <td colSpan={5} className="p-4">
                          <DemandChart productId={row.id} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
