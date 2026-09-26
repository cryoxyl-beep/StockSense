import { prisma } from "@/lib/prisma";
import { WarehouseForm } from "@/components/settings/warehouse-form";

export const dynamic = "force-dynamic";

export default async function WarehousesPage() {
  const warehouses = await prisma.warehouse.findMany({
    orderBy: { name: "asc" },
    include: { locations: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Warehouses</h1>
      <WarehouseForm />
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Short code</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Locations</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w) => (
              <tr key={w.id} className="border-t border-zinc-100">
                <td className="px-4 py-2">{w.name}</td>
                <td className="px-4 py-2 font-mono">{w.shortCode}</td>
                <td className="px-4 py-2">{w.address}</td>
                <td className="px-4 py-2">{w.locations.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
