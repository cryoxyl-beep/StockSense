import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DocumentStatus, DocumentType } from "@prisma/client";

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

  const lowStock = balances.filter((b) => b.quantity <= b.product.reorderLevel).length;

  return { productCount, lowStock, pendingReceipts, pendingDeliveries };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Products", value: stats.productCount, href: "/stock" },
    { label: "Low / Out of Stock", value: stats.lowStock, href: "/stock" },
    { label: "Pending Receipts", value: stats.pendingReceipts, href: "/orders/receipts" },
    { label: "Pending Deliveries", value: stats.pendingDeliveries, href: "/orders/deliveries" },
  ];

  const shortcuts = [
    { href: "/stock", title: "Stock", desc: "View on-hand quantities" },
    { href: "/inventory", title: "Inventory", desc: "Warehouses & products" },
    { href: "/orders/receipts", title: "Orders — Receipts", desc: "Incoming goods" },
    { href: "/orders/deliveries", title: "Orders — Delivery", desc: "Outgoing goods" },
    { href: "/history", title: "History", desc: "Stock ledger" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">Inventory operations snapshot</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 hover:border-rose-500/40"
          >
            <p className="text-xs text-zinc-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-rose-300">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {shortcuts.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-zinc-800 p-4 hover:bg-zinc-950"
          >
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-zinc-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
