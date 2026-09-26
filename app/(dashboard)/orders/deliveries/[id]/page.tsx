export const dynamic = "force-dynamic";

import { DocumentDetail } from "@/components/DocumentDetail";

export default async function DeliveryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1 className="text-2xl font-semibold">Delivery order</h1>
      <div className="mt-8">
        <DocumentDetail
          id={id}
          listHref="/orders/deliveries"
          validateLabel="Validate delivery (remove stock)"
        />
      </div>
    </div>
  );
}
