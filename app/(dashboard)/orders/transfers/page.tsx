import { DocumentList } from "@/components/DocumentList";

export default function TransfersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Warehouse transfers</h1>
      <p className="mt-1 text-sm text-zinc-500">Move stock between warehouses with validation checks</p>
      <div className="mt-8">
        <DocumentList type="TRANSFER" newHref="/orders/transfers/new" detailPrefix="/orders/transfers" />
      </div>
    </div>
  );
}
