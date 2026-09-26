import { DocumentType } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  type: z.enum(["RECEIPT", "DELIVERY", "TRANSFER"]),
  partnerName: z.string().min(1),
  invoiceNo: z.string().min(1),
  docDate: z.string(),
  sourceWarehouseId: z.string().optional(),
  targetWarehouseId: z.string().optional(),
  lines: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
      }),
    )
    .min(1),
});

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as DocumentType | null;

  const documents = await prisma.stockDocument.findMany({
    where: type ? { type } : undefined,
    orderBy: { docDate: "desc" },
    include: {
      sourceWarehouse: true,
      targetWarehouse: true,
      lines: { include: { product: true } },
    },
  });

  return NextResponse.json(documents);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = createSchema.parse(await request.json());
    if (body.type === "RECEIPT" && !body.targetWarehouseId) {
      return NextResponse.json({ error: "Destination warehouse is required for receipts" }, { status: 400 });
    }
    if (body.type === "DELIVERY" && !body.sourceWarehouseId) {
      return NextResponse.json({ error: "Source warehouse is required for deliveries" }, { status: 400 });
    }
    if (body.type === "TRANSFER") {
      if (!body.sourceWarehouseId || !body.targetWarehouseId) {
        return NextResponse.json({ error: "Both source and destination warehouses are required for transfers" }, { status: 400 });
      }
      if (body.sourceWarehouseId === body.targetWarehouseId) {
        return NextResponse.json({ error: "Source and destination warehouses must be different" }, { status: 400 });
      }
    }
    const warehouseIds = [body.sourceWarehouseId, body.targetWarehouseId].filter(Boolean) as string[];
    if (warehouseIds.length > 0) {
      const existingCount = await prisma.warehouse.count({ where: { id: { in: warehouseIds } } });
      if (existingCount !== new Set(warehouseIds).size) {
        return NextResponse.json({ error: "Invalid warehouse selection" }, { status: 400 });
      }
    }

    const document = await prisma.stockDocument.create({
      data: {
        type: body.type,
        partnerName: body.partnerName,
        invoiceNo: body.invoiceNo,
        docDate: new Date(body.docDate),
        sourceWarehouseId:
          body.type === "DELIVERY" || body.type === "TRANSFER"
            ? body.sourceWarehouseId
            : null,
        targetWarehouseId:
          body.type === "RECEIPT" || body.type === "TRANSFER"
            ? body.targetWarehouseId
            : null,
        createdById: session.userId,
        lines: {
          create: body.lines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          })),
        },
      },
      include: { lines: true },
    });
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not create document" }, { status: 500 });
  }
}
