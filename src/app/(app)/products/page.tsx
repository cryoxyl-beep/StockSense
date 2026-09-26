import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <PlaceholderPage
      title="Products"
      description="Catalog of SKUs, units of measure, and categories. Product editing is not available yet."
    />
  );
}
