import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = { title: "Move history" };

export default function LedgerPage() {
  return (
    <PlaceholderPage
      title="Move history"
      description="Append-only stock ledger. Browsing movements is not available yet."
    />
  );
}
