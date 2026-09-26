import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = { title: "Warehouses" };

export default function WarehousesPage() {
  return (
    <PlaceholderPage
      title="Warehouses"
      description="Sites, locations, and hierarchy. Warehouse editing is not available yet."
    />
  );
}
