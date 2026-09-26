import { prisma } from "@/lib/prisma";

export async function getOperationFormOptions() {
  const [products, contacts, locations, warehouses] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    prisma.contact.findMany({ orderBy: { name: "asc" } }),
    prisma.location.findMany({ include: { warehouse: true }, orderBy: { name: "asc" } }),
    prisma.warehouse.findMany({ orderBy: { name: "asc" } }),
  ]);
  return {
    products: products.map((p) => ({ id: p.id, label: `${p.name} (${p.sku})` })),
    contacts: contacts.map((c) => ({ id: c.id, label: c.name })),
    locations: locations.map((l) => ({
      id: l.id,
      label: `${l.warehouse.shortCode}/${l.shortCode} — ${l.name}`,
    })),
    warehouses: warehouses.map((w) => ({ id: w.id, label: `${w.shortCode} — ${w.name}` })),
  };
}
