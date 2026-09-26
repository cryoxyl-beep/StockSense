import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DocumentStatus, DocumentType } from "@prisma/client";
import { 
  ArrowRight,
  Package,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Activity
} from "lucide-react";

async function getStats() {
  const [productCount, balances, pendingReceipts, pendingDeliveries] = await Promise.all([
    prisma.product.count(),
    prisma.stockBalance.findMany({ include: { product: true } }),
    prisma.stockDocument.count({
      where: { type: DocumentType.RECEIPT, status: DocumentStatus.DRAFT },
    }),
    prisma.stockDocument.count({
      where: { type: DocumentType.DELIVERY, status: DocumentStatus.DRAFT },
    }),
  ]);

  const lowStock = balances.filter((b) => b.quantity <= Math.max(20, b.product.reorderLevel)).length;

  return { productCount, lowStock, pendingReceipts, pendingDeliveries };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const metrics = [
    { label: "Total Products", value: stats.productCount, icon: Package, href: "/stock", color: "text-blue-600", bg: "bg-blue-100/50" },
    { label: "Low Stock Items", value: stats.lowStock, icon: AlertTriangle, href: "/stock?filter=low", color: "text-amber-600", bg: "bg-amber-100/50" },
    { label: "Pending Receipts", value: stats.pendingReceipts, icon: ArrowDownToLine, href: "/orders/receipts", color: "text-emerald-600", bg: "bg-emerald-100/50" },
    { label: "Pending Deliveries", value: stats.pendingDeliveries, icon: ArrowUpFromLine, href: "/orders/deliveries", color: "text-indigo-600", bg: "bg-indigo-100/50" },
  ];

  const shortcuts = [
    { href: "/stock", title: "View Stock Levels", desc: "Check real-time quantities across all warehouses", icon: Package },
    { href: "/orders/receipts/new", title: "Receive Goods", desc: "Log incoming vendor shipments", icon: ArrowDownToLine },
    { href: "/orders/deliveries/new", title: "Dispatch Delivery", desc: "Process outgoing customer orders", icon: ArrowUpFromLine },
    { href: "/history", title: "Audit Ledger", desc: "Trace every stock movement", icon: Activity },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-500">Your inventory operations snapshot for today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link
              key={metric.label}
              href={metric.href}
              className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white/60 backdrop-blur-sm p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md"
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

      <div className="pt-8">
        <h2 className="text-lg font-medium tracking-tight text-zinc-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-white/60 backdrop-blur-sm p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-50 border border-zinc-100 group-hover:bg-white transition-colors">
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
