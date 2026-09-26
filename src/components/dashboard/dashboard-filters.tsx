import { prisma } from "@/lib/prisma";
import Link from "next/link";

export async function DashboardFilters() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const types = ["RECEIPT", "DELIVERY", "INTERNAL", "ADJUSTMENT"];
  const statuses = ["DRAFT", "WAITING", "READY", "DONE", "CANCELED"];

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      <span className="text-zinc-500">Filter:</span>
      {types.map((t) => (
        <Link
          key={t}
          href={`/dashboard?type=${t}`}
          className="rounded-full border border-zinc-200 px-3 py-1 hover:bg-white"
        >
          {t}
        </Link>
      ))}
      {statuses.map((s) => (
        <Link
          key={s}
          href={`/dashboard?status=${s}`}
          className="rounded-full border border-zinc-200 px-3 py-1 hover:bg-white"
        >
          {s}
        </Link>
      ))}
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/dashboard?categoryId=${c.id}`}
          className="rounded-full border border-zinc-200 px-3 py-1 hover:bg-white"
        >
          {c.name}
        </Link>
      ))}
      <Link href="/dashboard" className="rounded-full px-3 py-1 text-zinc-600 underline">
        Clear
      </Link>
    </div>
  );
}
