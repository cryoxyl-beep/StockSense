import Link from "next/link";
import { getDashboardMetrics } from "@/services/dashboard.service";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const metrics = await getDashboardMetrics({
    type: params.type as import("@prisma/client").OperationType | undefined,
    status: params.status as import("@prisma/client").OperationStatus | undefined,
    categoryId: params.categoryId,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-zinc-500">Inventory operations snapshot</p>
      </div>
      <DashboardFilters />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Products in catalog" value={metrics.totalProducts} />
        <KpiCard label="Low stock items" value={metrics.lowStock} />
        <KpiCard label="Out of stock" value={metrics.outOfStock} />
        <KpiCard label="Internal transfers pending" value={metrics.pendingInternals} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard
          title="Receipts"
          href="/operations/receipts"
          late={metrics.receiptSummary.late}
          active={metrics.receiptSummary.active}
          waiting={metrics.receiptSummary.waiting}
        />
        <SummaryCard
          title="Delivery"
          href="/operations/deliveries"
          late={metrics.deliverySummary.late}
          active={metrics.deliverySummary.active}
          waiting={metrics.deliverySummary.waiting}
        />
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function SummaryCard({
  title,
  href,
  late,
  active,
  waiting,
}: {
  title: string;
  href: string;
  late: number;
  active: number;
  waiting: number;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-zinc-400"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <dt className="text-zinc-500">Late</dt>
          <dd className="text-xl font-semibold text-red-600">{late}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Operations</dt>
          <dd className="text-xl font-semibold">{active}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Waiting</dt>
          <dd className="text-xl font-semibold text-amber-600">{waiting}</dd>
        </div>
      </dl>
    </Link>
  );
}
