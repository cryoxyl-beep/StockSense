export const dynamic = "force-dynamic";

import { DocumentList } from "@/components/DocumentList";

export default function DeliveriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Delivery orders</h1>
      <p className="mt-1 text-sm text-zinc-500">Outgoing stock to customers</p>
      <div className="mt-8">
        <DocumentList
          type="DELIVERY"
          newHref="/orders/deliveries/new"
          detailPrefix="/orders/deliveries"
        />
      </div>
    </div>
  );
}
