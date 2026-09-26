import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = { title: "Delivery orders" };

export default function DeliveriesPage() {
  return (
    <PlaceholderPage
      title="Delivery orders"
      description="Outbound customer shipments. Picking, packing, and validation are not available yet."
    />
  );
}
