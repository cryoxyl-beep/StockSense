"use client";

import { useCallback, useEffect, useState } from "react";

type Warehouse = { id: string; name: string; code: string };

export function InventoryForms() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [whMessage, setWhMessage] = useState("");
  const [prodMessage, setProdMessage] = useState("");

  const [whName, setWhName] = useState("");
  const [whCode, setWhCode] = useState("");
  const [whAddress, setWhAddress] = useState("");

  const [prodName, setProdName] = useState("");
  const [sku, setSku] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [initialQty, setInitialQty] = useState("0");
  const [warehouseId, setWarehouseId] = useState("");

  const loadWarehouses = useCallback(async () => {
    const res = await fetch("/api/warehouses");
    const data = await res.json();
    setWarehouses(data);
    setWarehouseId((prev) => prev || data[0]?.id || "");
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadWarehouses();
  }, [loadWarehouses]);

  async function submitWarehouse(e: React.FormEvent) {
    e.preventDefault();
    setWhMessage("");
    const res = await fetch("/api/warehouses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: whName, code: whCode, address: whAddress }),
    });
    if (!res.ok) {
      setWhMessage("Could not save warehouse");
      return;
    }
    setWhMessage("Warehouse saved");
    setWhName("");
    setWhCode("");
    setWhAddress("");
    loadWarehouses();
  }

  async function submitProduct(e: React.FormEvent) {
    e.preventDefault();
    setProdMessage("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: prodName,
        sku,
        unitPrice: parseFloat(unitPrice),
        initialQty: parseInt(initialQty, 10) || 0,
        warehouseId: warehouseId || undefined,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setProdMessage(data.error ?? "Could not save product");
      return;
    }
    setProdMessage("Product saved");
    setProdName("");
    setSku("");
    setUnitPrice("");
    setInitialQty("0");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={submitWarehouse}
        className="rounded-xl border border-zinc-200 bg-white p-6"
      >
        <h2 className="font-medium text-zinc-900">Warehouse</h2>
        <div className="mt-4 space-y-3">
          <input
            placeholder="Name"
            required
            value={whName}
            onChange={(e) => setWhName(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm"
          />
          <input
            placeholder="Unit Code"
            required
            value={whCode}
            onChange={(e) => setWhCode(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Address"
            required
            value={whAddress}
            onChange={(e) => setWhAddress(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm"
            rows={3}
          />
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Save warehouse
          </button>
          {whMessage && <p className="text-sm text-zinc-500">{whMessage}</p>}
        </div>
      </form>

      <form
        onSubmit={submitProduct}
        className="rounded-xl border border-zinc-200 bg-white p-6"
      >
        <h2 className="font-medium text-zinc-900">Item entry</h2>
        <div className="mt-4 space-y-3">
          <input
            placeholder="Item Name"
            required
            value={prodName}
            onChange={(e) => setProdName(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm"
          />
          <input
            placeholder="Stock Code (SKU)"
            required
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm"
          />
          <input
            placeholder="Unit Price"
            required
            type="number"
            min="0"
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm"
          />
          <input
            placeholder="Initial stock"
            type="number"
            min="0"
            value={initialQty}
            onChange={(e) => setInitialQty(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm"
          />
          {warehouses.length > 0 && (
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm"
            >
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code})
                </option>
              ))}
            </select>
          )}
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Save product
          </button>
          {prodMessage && <p className="text-sm text-zinc-500">{prodMessage}</p>}
        </div>
      </form>
    </div>
  );
}
