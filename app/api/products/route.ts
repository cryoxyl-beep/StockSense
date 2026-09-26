import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  unitPrice: z.number().positive(),
  category: z.string().optional(),
  uom: z.string().optional(),
  reorderLevel: z.number().int().nonnegative().optional(),
  initialQty: z.number().int().nonnegative().optional(),
  warehouseId: z.string().optional(),
});

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const products = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { sku: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
    include: {
      balances: { include: { warehouse: true } },
    },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = schema.parse(await request.json());
    const warehouse =
      body.warehouseId
        ? await prisma.warehouse.findUnique({ where: { id: body.warehouseId } })
        : await prisma.warehouse.findFirst({ orderBy: { createdAt: "asc" } });

    if (!warehouse) {
      return NextResponse.json({ error: "Create a warehouse first" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        sku: body.sku,
        unitPrice: body.unitPrice,
        category: body.category ?? "General",
        uom: body.uom ?? "Unit",
        reorderLevel: body.reorderLevel ?? 10,
      },
    });

    const qty = body.initialQty ?? 0;
    if (qty > 0) {
      await prisma.stockBalance.create({
        data: {
          productId: product.id,
          warehouseId: warehouse.id,
          quantity: qty,
        },
      });
    } else {
      await prisma.stockBalance.create({
        data: {
          productId: product.id,
          warehouseId: warehouse.id,
          quantity: 0,
        },
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not create product" }, { status: 500 });
  }
}
