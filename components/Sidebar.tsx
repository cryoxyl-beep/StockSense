"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  History,
  LogOut,
  Package2
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/stock", label: "Stock", icon: Package },
  { href: "/inventory", label: "Inventory", icon: Warehouse },
  { href: "/orders/receipts", label: "Receipts", icon: ArrowDownToLine },
  { href: "/orders/deliveries", label: "Deliveries", icon: ArrowUpFromLine },
  { href: "/history", label: "Ledger", icon: History },
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-16 items-center border-b border-zinc-100 px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950">
            <Package2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-zinc-950">StockSense</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <div className="mb-4 px-2">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Main</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-zinc-100/80 text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-zinc-900" : "text-zinc-500"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-100 p-4">
        <div className="mb-3 px-2">
          <p className="truncate text-sm font-medium text-zinc-900">{email}</p>
          <p className="text-xs text-zinc-500">Warehouse Admin</p>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
          >
            <LogOut className="h-4 w-4 text-zinc-500" />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
