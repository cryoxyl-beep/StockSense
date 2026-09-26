import { DocumentDetail } from "@/components/DocumentDetail";

export default async function TransferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1 className="text-2xl font-semibold">Transfer order</h1>
      <div className="mt-8">
        <DocumentDetail id={id} listHref="/orders/transfers" validateLabel="Validate transfer (move stock)" />
      </div>
    </div>
  );
}
