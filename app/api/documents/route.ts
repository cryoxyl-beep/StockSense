import { DocumentType } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  type: z.enum(["RECEIPT", "DELIVERY"]),
  partnerName: z.string().min(1),
  invoiceNo: z.string().min(1),
  docDate: z.string(),
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
    const document = await prisma.stockDocument.create({
      data: {
        type: body.type,
        partnerName: body.partnerName,
        invoiceNo: body.invoiceNo,
        docDate: new Date(body.docDate),
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
