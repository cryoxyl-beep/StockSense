import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = productSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { initialStock, locationId, categoryId, ...rest } = parsed.data;
  try {
    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          ...rest,
          categoryId: categoryId || null,
        },
      });
      if (initialStock && initialStock > 0 && locationId) {
        await tx.stockQuant.create({
          data: {
            productId: created.id,
            locationId,
            onHand: initialStock,
            reserved: 0,
          },
        });
      }
      return created;
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
  }
}
