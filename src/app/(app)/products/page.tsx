import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { decimalToNumber, formatQty } from "@/lib/utils";
import { ProductForm } from "@/components/products/product-form";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, categories, locations] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, stockQuants: { include: { location: { include: { warehouse: true } } } } },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.location.findMany({ include: { warehouse: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/products/stock" className="text-sm font-medium underline">
          Stock view
        </Link>
      </div>
      <ProductForm categories={categories} locations={locations} />
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">UOM</th>
              <th className="px-4 py-2">On hand (total)</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const total = p.stockQuants.reduce(
                (s, q) => s + decimalToNumber(q.onHand),
                0,
              );
              const low = total <= p.reorderMin;
              return (
                <tr key={p.id} className="border-t border-zinc-100 align-top">
                  <td className="px-4 py-2 font-medium">{p.name}</td>
                  <td className="px-4 py-2 font-mono">{p.sku}</td>
                  <td className="px-4 py-2">{p.category?.name ?? "—"}</td>
                  <td className="px-4 py-2">{p.unitOfMeasure}</td>
                  <td className="px-4 py-2">{formatQty(total)}</td>
                  <td className="px-4 py-2">
                    {total === 0 ? (
                      <Badge variant="danger">Out</Badge>
                    ) : low ? (
                      <Badge variant="warning">Low</Badge>
                    ) : (
                      <Badge variant="success">OK</Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
