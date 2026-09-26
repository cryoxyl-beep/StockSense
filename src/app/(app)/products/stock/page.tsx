import { listStockOverview } from "@/services/dashboard.service";
import { formatQty } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function StockPage() {
  const rows = await listStockOverview();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Stock</h1>
      <p className="text-sm text-zinc-500">On hand and free-to-use quantities by location</p>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 text-left">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Per unit cost</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">On hand</th>
              <th className="px-4 py-2">Free to use</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-zinc-100">
                <td className="px-4 py-2">
                  {r.productName}
                  {r.lowStock && <Badge variant="warning" className="ml-2">Low</Badge>}
                </td>
                <td className="px-4 py-2">{r.unitCost.toFixed(2)}</td>
                <td className="px-4 py-2 font-mono text-xs">{r.locationLabel}</td>
                <td className="px-4 py-2">{formatQty(r.onHand)}</td>
                <td className="px-4 py-2">{formatQty(r.freeToUse)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
