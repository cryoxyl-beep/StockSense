import { prisma } from "@/lib/prisma";
import { LocationForm } from "@/components/settings/location-form";

export const dynamic = "force-dynamic";

export default async function LocationsPage() {
  const [locations, warehouses] = await Promise.all([
    prisma.location.findMany({
      include: { warehouse: true },
      orderBy: { name: "asc" },
    }),
    prisma.warehouse.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Locations</h1>
      <LocationForm warehouses={warehouses} />
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Short code</th>
              <th className="px-4 py-2">Warehouse</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((l) => (
              <tr key={l.id} className="border-t border-zinc-100">
                <td className="px-4 py-2">{l.name}</td>
                <td className="px-4 py-2 font-mono">{l.shortCode}</td>
                <td className="px-4 py-2">{l.warehouse.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
