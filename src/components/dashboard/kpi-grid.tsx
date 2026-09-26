const KPIS = [
  { label: "Total products in stock", value: "—" },
  { label: "Low/out of stock", value: "—" },
  { label: "Pending receipts", value: "—" },
  { label: "Pending deliveries", value: "—" },
  { label: "Internal transfers scheduled", value: "—" },
] as const;

export function KpiGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {KPIS.map((kpi) => (
        <article
          key={kpi.label}
          className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-5 py-4"
        >
          <p className="text-sm text-zinc-400">{kpi.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
            {kpi.value}
          </p>
        </article>
      ))}
    </div>
  );
}
