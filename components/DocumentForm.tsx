"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  sku: string;
  unitPrice: string;
};

type Line = {
  productId: string;
  quantity: string;
  unitPrice: string;
};

export function DocumentForm({
  type,
  partnerLabel,
  listHref,
}: {
  type: "RECEIPT" | "DELIVERY";
  partnerLabel: string;
  listHref: string;
}) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [partnerName, setPartnerName] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [docDate, setDocDate] = useState(new Date().toISOString().slice(0, 10));
  const [lines, setLines] = useState<Line[]>([
    { productId: "", quantity: "1", unitPrice: "" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data);
        if (data[0]) {
          setLines([
            {
              productId: data[0].id,
              quantity: "1",
              unitPrice: String(data[0].unitPrice),
            },
          ]);
        }
      });
  }, []);

  function updateLine(index: number, patch: Partial<Line>) {
    setLines((prev) =>
      prev.map((line, i) => {
        if (i !== index) return line;
        const next = { ...line, ...patch };
        if (patch.productId) {
          const product = products.find((p) => p.id === patch.productId);
          if (product) next.unitPrice = String(product.unitPrice);
        }
        return next;
      }),
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = {
      type,
      partnerName,
      invoiceNo,
      docDate,
      lines: lines.map((l) => ({
        productId: l.productId,
        quantity: parseInt(l.quantity, 10),
        unitPrice: parseFloat(l.unitPrice),
      })),
    };
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Could not save");
      return;
    }
    const doc = await res.json();
    router.push(`${listHref}/${doc.id}`);
  }

  const total = lines.reduce(
    (sum, l) => sum + (parseFloat(l.unitPrice) || 0) * (parseInt(l.quantity, 10) || 0),
    0,
  );

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs text-zinc-400">{partnerLabel}</label>
          <input
            required
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400">Invoice No.</label>
          <input
            required
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400">Date</label>
          <input
            type="date"
            required
            value={docDate}
            onChange={(e) => setDocDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-950 text-zinc-400">
            <tr>
              <th className="px-3 py-2 text-left">Product</th>
              <th className="px-3 py-2 text-left">Quantity</th>
              <th className="px-3 py-2 text-left">Unit Price</th>
              <th className="px-3 py-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => {
              const lineTotal =
                (parseFloat(line.unitPrice) || 0) * (parseInt(line.quantity, 10) || 0);
              return (
                <tr key={index} className="border-t border-zinc-800">
                  <td className="px-3 py-2">
                    <select
                      required
                      value={line.productId}
                      onChange={(e) => updateLine(index, { productId: e.target.value })}
                      className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1"
                    >
                      <option value="">Select…</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="1"
                      required
                      value={line.quantity}
                      onChange={(e) => updateLine(index, { quantity: e.target.value })}
                      className="w-24 rounded border border-zinc-700 bg-zinc-950 px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={line.unitPrice}
                      onChange={(e) => updateLine(index, { unitPrice: e.target.value })}
                      className="w-28 rounded border border-zinc-700 bg-zinc-950 px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-2 text-zinc-400">₹{lineTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() =>
          setLines((prev) => [...prev, { productId: products[0]?.id ?? "", quantity: "1", unitPrice: products[0] ? String(products[0].unitPrice) : "" }])
        }
        className="text-sm text-rose-400 hover:underline"
      >
        + Add line
      </button>

      <p className="text-sm text-zinc-400">Grand total: ₹{total.toFixed(2)}</p>
      {error && <p className="text-sm text-rose-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save draft"}
        </button>
      </div>
    </form>
  );
}
