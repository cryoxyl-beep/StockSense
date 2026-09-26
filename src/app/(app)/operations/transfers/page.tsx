import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = { title: "Internal transfers" };

export default function TransfersPage() {
  return (
    <PlaceholderPage
      title="Internal transfers"
      description="Moves between warehouses and locations. Scheduling transfers is not available yet."
    />
  );
}
