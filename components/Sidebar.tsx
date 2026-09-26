"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/stock", label: "Stock" },
  { href: "/inventory", label: "Inventory" },
  { href: "/orders/receipts", label: "Receipts" },
  { href: "/orders/deliveries", label: "Deliveries" },
  { href: "/history", label: "History" },
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-8">
        <p className="text-lg font-semibold text-rose-400">StockSense</p>
        <p className="mt-1 truncate text-xs text-zinc-500">{email}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-rose-500/20 text-rose-300"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          className="mt-4 w-full rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
        >
          Logout
        </button>
      </form>
    </aside>
  );
}
