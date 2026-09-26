import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = { title: "Adjustments" };

export default function AdjustmentsPage() {
  return (
    <PlaceholderPage
      title="Adjustments"
      description="Physical count corrections. Adjustment entry is not available yet."
    />
  );
}
