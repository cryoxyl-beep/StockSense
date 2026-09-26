import Link from "next/link";
import { OperationType } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { operationRoutes } from "@/lib/operations-ui";

type Row = {
  id: string;
  reference: string;
  status: string;
  scheduleDate: Date;
  contact?: { name: string } | null;
  fromLocation?: { shortCode: string; warehouse: { shortCode: string } } | null;
  toLocation?: { shortCode: string; warehouse: { shortCode: string } } | null;
};

function locLabel(
  loc?: { shortCode: string; warehouse: { shortCode: string } } | null,
) {
  if (!loc) return "—";
  return `${loc.warehouse.shortCode}/${loc.shortCode}`;
}

export function OperationList({ type, rows }: { type: OperationType; rows: Row[] }) {
  const base = operationRoutes[type].list;
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">{operationRoutes[type].label}s</h1>
        <Link
          href={`${base}/new`}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          New
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 text-left">
            <tr>
              <th className="px-4 py-2">Reference</th>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Schedule</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-zinc-100">
                <td className="px-4 py-2">
                  <Link href={`${base}/${r.id}`} className="font-mono underline">
                    {r.reference}
                  </Link>
                </td>
                <td className="px-4 py-2">{locLabel(r.fromLocation)}</td>
                <td className="px-4 py-2">{locLabel(r.toLocation)}</td>
                <td className="px-4 py-2">{r.contact?.name ?? "—"}</td>
                <td className="px-4 py-2">{r.scheduleDate.toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <Badge>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
