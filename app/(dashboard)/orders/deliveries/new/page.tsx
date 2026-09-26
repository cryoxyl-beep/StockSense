export const dynamic = "force-dynamic";

import { DocumentForm } from "@/components/DocumentForm";

export default function NewDeliveryPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Delivery</h1>
      <p className="mt-1 text-sm text-zinc-500">Create a draft delivery order</p>
      <div className="mt-8">
        <DocumentForm
          type="DELIVERY"
          partnerLabel="Customer name"
          listHref="/orders/deliveries"
        />
      </div>
    </div>
  );
}
