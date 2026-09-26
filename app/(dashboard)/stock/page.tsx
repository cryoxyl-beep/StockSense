import { StockTable } from "@/components/StockTable";

export default function StockPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Stock</h1>
      <p className="mt-1 text-sm text-zinc-500">On-hand inventory overview</p>
      <div className="mt-8">
        <StockTable />
      </div>
    </div>
  );
}
