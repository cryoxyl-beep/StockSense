import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Row = {
  id: string;
  reference: string;
  date: string;
  contactName: string | null;
  fromLabel: string | null;
  toLabel: string | null;
  quantity: string;
  direction: string;
  status: string;
  productName: string;
};

function directionVariant(direction: string) {
  if (direction === "IN") return "success";
  if (direction === "OUT") return "danger";
  return "default";
}

export function MoveHistoryView({
  rows,
  view,
  query,
}: {
  rows: Row[];
  view: "list" | "kanban";
  query: string;
}) {
  return (
    <div className="space-y-4">
      <form className="flex flex-wrap gap-2 print:hidden">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search reference or contact"
          className="h-10 rounded-md border border-zinc-300 px-3 text-sm"
        />
        <button type="submit" className="rounded-md bg-zinc-900 px-4 text-sm text-white">Search</button>
        <Link
          href={view === "list" ? "/move-history?view=kanban" : "/move-history"}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm"
        >
          {view === "list" ? "Kanban" : "List"}
        </Link>
      </form>
      {view === "kanban" ? (
        <div className="grid gap-4 md:grid-cols-4">
          {["DRAFT", "WAITING", "READY", "DONE"].map((status) => (
            <div key={status} className="rounded-lg border border-zinc-200 bg-white p-3">
              <h3 className="mb-2 font-medium">{status}</h3>
              <ul className="space-y-2 text-xs">
                {rows
                  .filter((r) => r.status === status)
                  .map((r) => (
                    <li key={r.id} className="rounded border border-zinc-100 p-2">
                      <p className="font-mono">{r.reference}</p>
                      <p>{r.productName}</p>
                      <Badge variant={directionVariant(r.direction)}>{r.direction}</Badge>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 text-left">
              <tr>
                <th className="px-3 py-2">Reference</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">From</th>
                <th className="px-3 py-2">To</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-zinc-100">
                  <td className="px-3 py-2 font-mono text-xs">{r.reference}</td>
                  <td className="px-3 py-2">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{r.contactName ?? "—"}</td>
                  <td className="px-3 py-2">{r.productName}</td>
                  <td className="px-3 py-2">{r.fromLabel ?? "—"}</td>
                  <td className="px-3 py-2">{r.toLabel ?? "—"}</td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        r.direction === "IN"
                          ? "text-emerald-700 font-medium"
                          : r.direction === "OUT"
                            ? "text-red-700 font-medium"
                            : ""
                      }
                    >
                      {r.direction} {r.quantity}
                    </span>
                  </td>
                  <td className="px-3 py-2">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
