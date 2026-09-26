import { prisma } from "@/lib/prisma";
import { formatQty } from "@/lib/utils";
import { MoveHistoryView } from "@/components/move-history/move-history-view";

export const dynamic = "force-dynamic";

export default async function MoveHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; q?: string }>;
}) {
  const { view, q } = await searchParams;
  const entries = await prisma.stockLedgerEntry.findMany({
    where: q
      ? {
          OR: [
            { reference: { contains: q, mode: "insensitive" } },
            { contactName: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { product: true, operation: true },
    orderBy: { date: "desc" },
    take: 200,
  });

  const rows = entries.map((e) => ({
    id: e.id,
    reference: e.reference,
    date: e.date.toISOString(),
    contactName: e.contactName,
    fromLabel: e.fromLabel,
    toLabel: e.toLabel,
    quantity: formatQty(e.quantity),
    direction: e.direction,
    status: e.status,
    productName: e.product.name,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Move history</h1>
      <MoveHistoryView rows={rows} view={view === "kanban" ? "kanban" : "list"} query={q ?? ""} />
    </div>
  );
}
