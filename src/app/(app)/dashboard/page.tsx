import type { Metadata } from "next";
import { KpiGrid } from "@/components/dashboard/kpi-grid";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <section className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Dashboard</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
        Operational snapshot. Counts stay as placeholders until stock workflows are connected.
      </p>
      <div className="mt-8">
        <KpiGrid />
      </div>
    </section>
  );
}
