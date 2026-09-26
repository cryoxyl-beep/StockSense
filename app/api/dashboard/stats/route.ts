import { DocumentStatus, DocumentType } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [productCount, balances, pendingReceipts, pendingDeliveries, pendingTransfers] = await Promise.all([
    prisma.product.count(),
    prisma.stockBalance.findMany({
      include: { product: true },
    }),
    prisma.stockDocument.count({
      where: { type: DocumentType.RECEIPT, status: DocumentStatus.DRAFT },
    }),
    prisma.stockDocument.count({
      where: { type: DocumentType.DELIVERY, status: DocumentStatus.DRAFT },
    }),
    prisma.stockDocument.count({
      where: { type: DocumentType.TRANSFER, status: DocumentStatus.DRAFT },
    }),
  ]);

  const lowStock = balances.filter(
    (b) => b.quantity <= b.product.reorderLevel,
  ).length;

  return NextResponse.json({
    productCount,
    lowStock,
    pendingReceipts,
    pendingDeliveries,
    pendingTransfers,
  });
}
