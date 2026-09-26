import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DocumentStatus, DocumentType, MovementType } from "@prisma/client";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  TrendingUp,
  AlertTriangle,
  Package,
  ArrowLeftRight,
  Activity,
} from "lucide-react";

const DAY_MS = 24 * 60 * 60 * 1000;

function dayLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

async function getDashboardData() {
  const now = new Date();
  const last14 = new Date(now.getTime() - 14 * DAY_MS);
  const last30 = new Date(now.getTime() - 30 * DAY_MS);

  const [products, pendingReceipts, pendingDeliveries, pendingTransfers, recentLedger] =
    await Promise.all([
      prisma.product.findMany({
        include: {
          balances: true,
          ledger: {
            where: {
              at: { gte: last30 },
              movement: { in: [MovementType.DELIVERY, MovementType.TRANSFER_OUT] },
            },
            select: { quantityDelta: true },
          },
        },
      }),
      prisma.stockDocument.count({ where: { type: DocumentType.RECEIPT, status: DocumentStatus.DRAFT } }),
      prisma.stockDocument.count({ where: { type: DocumentType.DELIVERY, status: DocumentStatus.DRAFT } }),
      prisma.stockDocument.count({ where: { type: DocumentType.TRANSFER, status: DocumentStatus.DRAFT } }),
      prisma.stockLedger.findMany({
        where: { at: { gte: last14 } },
        orderBy: { at: "asc" },
        include: { product: true },
      }),
    ]);

  const productCount = products.length;
  const lowStockProducts = products
    .map((p) => ({ ...p, qty: p.balances.reduce((sum, b) => sum + b.quantity, 0) }))
    .filter((p) => p.qty <= p.reorderLevel);

  const trendMap = new Map<string, { inbound: number; outbound: number }>();
  for (let i = 0; i < 14; i += 1) {
    const day = new Date(last14.getTime() + i * DAY_MS);
    trendMap.set(day.toISOString().slice(0, 10), { inbound: 0, outbound: 0 });
  }

  recentLedger.forEach((entry) => {
    const key = entry.at.toISOString().slice(0, 10);
    const day = trendMap.get(key);
    if (!day) return;
    if (entry.quantityDelta >= 0) day.inbound += entry.quantityDelta;
    else day.outbound += Math.abs(entry.quantityDelta);
  });

  const trends = Array.from(trendMap.entries()).map(([dateKey, values]) => ({
    date: dayLabel(new Date(`${dateKey}T00:00:00`)),
    ...values,
    net: values.inbound - values.outbound,
  }));

  const topMoving = [...products]
    .map((p) => {
      const movedQty = p.ledger.reduce((sum, l) => sum + Math.abs(l.quantityDelta), 0);
      return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        movedQty,
      };
    })
    .filter((p) => p.movedQty > 0)
    .sort((a, b) => b.movedQty - a.movedQty)
    .slice(0, 5);

  const predictions = products
    .map((p) => {
      const qty = p.balances.reduce((sum, b) => sum + b.quantity, 0);
      const outbound30 = p.ledger.reduce((sum, l) => sum + Math.abs(l.quantityDelta), 0);
      const dailyVelocity = outbound30 / 30;
      const daysLeft = dailyVelocity > 0 ? qty / dailyVelocity : Number.POSITIVE_INFINITY;
      const reorderQty = Math.max(p.reorderLevel * 2 - qty, p.reorderLevel - qty, 0);
      return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        qty,
        reorderLevel: p.reorderLevel,
        dailyVelocity,
        daysLeft,
        reorderQty,
      };
    })
    .filter((p) => p.qty <= p.reorderLevel * 1.5 || (Number.isFinite(p.daysLeft) && p.daysLeft <= 21))
    .sort((a, b) => {
      if (a.daysLeft === b.daysLeft) return a.qty - b.qty;
      if (!Number.isFinite(a.daysLeft)) return 1;
      if (!Number.isFinite(b.daysLeft)) return -1;
      return a.daysLeft - b.daysLeft;
    })
    .slice(0, 6);

  return {
    productCount,
    lowStockCount: lowStockProducts.length,
    pendingReceipts,
    pendingDeliveries,
    pendingTransfers,
    trends,
    topMoving,
    predictions,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const metrics = [
    { label: "Total Products", value: data.productCount, icon: Package, href: "/stock", color: "text-blue-600", bg: "bg-blue-100/50" },
    { label: "Low Stock Items", value: data.lowStockCount, icon: AlertTriangle, href: "/stock", color: "text-amber-600", bg: "bg-amber-100/50" },
    { label: "Pending Receipts", value: data.pendingReceipts, icon: ArrowDownToLine, href: "/orders/receipts", color: "text-emerald-600", bg: "bg-emerald-100/50" },
    { label: "Pending Deliveries", value: data.pendingDeliveries, icon: ArrowUpFromLine, href: "/orders/deliveries", color: "text-indigo-600", bg: "bg-indigo-100/50" },
    { label: "Pending Transfers", value: data.pendingTransfers, icon: ArrowLeftRight, href: "/orders/transfers", color: "text-violet-600", bg: "bg-violet-100/50" },
  ];

  const shortcuts = [
    { href: "/stock", title: "View Stock Levels", desc: "Check real-time quantities across all warehouses", icon: Package },
    { href: "/orders/receipts/new", title: "Receive Goods", desc: "Log incoming vendor shipments", icon: ArrowDownToLine },
    { href: "/orders/deliveries/new", title: "Dispatch Delivery", desc: "Process outgoing customer orders", icon: ArrowUpFromLine },
    { href: "/orders/transfers/new", title: "Transfer Stock", desc: "Move inventory between warehouse locations", icon: ArrowLeftRight },
    { href: "/history", title: "Audit Ledger", desc: "Trace every stock movement", icon: Activity },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-500">Operations analytics, stock velocity, and reorder intelligence.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link
              key={metric.label}
              href={metric.href}
              className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white/60 p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-500">{metric.label}</p>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${metric.bg}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-3xl font-semibold tracking-tight text-zinc-900">{metric.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white/60 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-zinc-600" />
            <h2 className="text-sm font-semibold text-zinc-900">14-Day Movement Trend</h2>
          </div>
          <div className="space-y-2 text-xs">
            {data.trends.slice(-7).map((d) => (
              <div key={d.date} className="grid grid-cols-4 items-center gap-2 rounded-md bg-zinc-50 px-3 py-2">
                <span className="text-zinc-600">{d.date}</span>
                <span className="text-emerald-600">+{d.inbound}</span>
                <span className="text-rose-600">-{d.outbound}</span>
                <span className={d.net >= 0 ? "text-zinc-900" : "text-rose-700"}>Net {d.net}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white/60 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-zinc-600" />
            <h2 className="text-sm font-semibold text-zinc-900">Top-Moving SKUs (30 days)</h2>
          </div>
          {data.topMoving.length === 0 ? (
            <p className="text-sm text-zinc-500">Not enough ledger activity yet.</p>
          ) : (
            <div className="space-y-2 text-sm">
              {data.topMoving.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-2">
                  <p className="font-medium text-zinc-900">#{index + 1} {item.name} <span className="text-xs text-zinc-500">({item.sku})</span></p>
                  <p className="text-zinc-700">{item.movedQty} units</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white/60 p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <h2 className="text-sm font-semibold text-zinc-900">Smart Low-Stock Predictions</h2>
        </div>
        {data.predictions.length === 0 ? (
          <p className="text-sm text-zinc-500">No urgent replenishment signals right now.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-600">
                <tr>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">On-hand</th>
                  <th className="px-3 py-2">Reorder level</th>
                  <th className="px-3 py-2">Velocity/day</th>
                  <th className="px-3 py-2">Predicted stockout</th>
                  <th className="px-3 py-2">Suggested reorder</th>
                </tr>
              </thead>
              <tbody>
                {data.predictions.map((item) => (
                  <tr key={item.id} className="border-t border-zinc-200">
                    <td className="px-3 py-2 font-medium text-zinc-900">{item.sku}</td>
                    <td className="px-3 py-2">{item.qty}</td>
                    <td className="px-3 py-2">{item.reorderLevel}</td>
                    <td className="px-3 py-2">{item.dailyVelocity.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      {Number.isFinite(item.daysLeft) ? `${Math.ceil(item.daysLeft)} days` : "Stable"}
                    </td>
                    <td className="px-3 py-2">{Math.max(item.reorderQty, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="pt-2">
        <h2 className="mb-4 text-lg font-medium tracking-tight text-zinc-900">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-white/60 p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-100 bg-zinc-50 transition-colors group-hover:bg-white">
                  <Icon className="h-5 w-5 text-zinc-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-zinc-900">{item.title}</p>
                  <p className="text-sm text-zinc-500">{item.desc}</p>
                </div>
                <div className="pr-2 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-zinc-600">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
