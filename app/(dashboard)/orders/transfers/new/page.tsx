import { DocumentForm } from "@/components/DocumentForm";

export default function NewTransferPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Transfer stock</h1>
      <p className="mt-1 text-sm text-zinc-500">Create a draft transfer between warehouses</p>
      <div className="mt-8">
        <DocumentForm type="TRANSFER" partnerLabel="Transfer reason" listHref="/orders/transfers" />
      </div>
    </div>
  );
}
