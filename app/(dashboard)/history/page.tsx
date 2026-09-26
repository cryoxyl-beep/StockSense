export const dynamic = "force-dynamic";

import { HistoryTable } from "@/components/HistoryTable";

export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Asset history</h1>
      <p className="mt-1 text-sm text-zinc-500">Stock ledger — receipts and deliveries</p>
      <div className="mt-8">
        <HistoryTable />
      </div>
    </div>
  );
}
