import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = { title: "Receipts" };

export default function ReceiptsPage() {
  return (
    <PlaceholderPage
      title="Receipts"
      description="Vendor inbound documents. Recording receipts and validating stock is not available yet."
    />
  );
}
