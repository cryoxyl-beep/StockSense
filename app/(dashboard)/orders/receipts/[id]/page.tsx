import { DocumentDetail } from "@/components/DocumentDetail";

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1 className="text-2xl font-semibold">Receipt</h1>
      <div className="mt-8">
        <DocumentDetail
          id={id}
          listHref="/orders/receipts"
          validateLabel="Validate receipt (add stock)"
        />
      </div>
    </div>
  );
}
