"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeftRight,
  LayoutDashboard,
  Menu,
  Package,
  UserRound,
  Warehouse,
  X,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, type AppRole } from "@/types/roles";

const icons = {
  dashboard: LayoutDashboard,
  products: Package,
  operations: ArrowLeftRight,
  warehouses: Warehouse,
  profile: UserRound,
} as const;

type ShellUser = {
  name?: string | null;
  email?: string | null;
  role: AppRole;
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
      {siteConfig.nav.map((item) => {
        if ("children" in item) {
          const Icon = icons[item.icon];
          const sectionActive = item.children.some((child) =>
            isActive(pathname, child.href),
          );
          return (
            <div key={item.title} className="mt-2">
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide",
                  sectionActive ? "text-sky-300" : "text-zinc-500",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.title}
              </div>
              <div className="ml-3 border-l border-zinc-800 pl-2">
                {item.children.map((child) => {
                  const active = isActive(pathname, child.href);
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm",
                        active
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
                      )}
                    >
                      {child.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }

        const Icon = icons[item.icon];
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
              active
                ? "bg-zinc-800 text-white"
                : "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const displayName = user.name || "Signed in";

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 md:flex">
        <Brand />
        <SidebarNav pathname={pathname} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-72 flex-col border-r border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button
                type="button"
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950/90 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-zinc-300 hover:bg-zinc-800 md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-sm text-zinc-400">Inventory workspace</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-zinc-100">{displayName}</p>
            <p className="text-xs text-zinc-400">
              {user.email}
              {user.email ? " · " : null}
              {ROLE_LABELS[user.role]}
            </p>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500 text-sm font-bold text-zinc-950">
        SS
      </span>
      <div>
        <p className="text-sm font-semibold tracking-tight">{siteConfig.name}</p>
        <p className="text-xs text-zinc-500">Inventory</p>
      </div>
    </div>
  );
}
