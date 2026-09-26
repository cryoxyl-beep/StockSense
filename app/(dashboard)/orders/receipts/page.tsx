import { DocumentList } from "@/components/DocumentList";

export default function ReceiptsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Manage — Receipts</h1>
      <p className="mt-1 text-sm text-zinc-500">Incoming stock from suppliers</p>
      <div className="mt-8">
        <DocumentList
          type="RECEIPT"
          newHref="/orders/receipts/new"
          detailPrefix="/orders/receipts"
        />
      </div>
    </div>
  );
}
