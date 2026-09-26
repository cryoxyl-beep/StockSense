export const dynamic = "force-dynamic";

import { DocumentForm } from "@/components/DocumentForm";

export default function NewReceiptPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Receive stock</h1>
      <p className="mt-1 text-sm text-zinc-500">Create a draft receipt</p>
      <div className="mt-8">
        <DocumentForm
          type="RECEIPT"
          partnerLabel="Supplier name"
          listHref="/orders/receipts"
        />
      </div>
    </div>
  );
}
