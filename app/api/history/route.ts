export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const entries = await prisma.stockLedger.findMany({
    orderBy: { at: "desc" },
    include: {
      product: true,
      document: true,
    },
    where: q
      ? {
          OR: [
            { product: { name: { contains: q } } },
            { document: { invoiceNo: { contains: q } } },
          ],
        }
      : undefined,
    take: 200,
  });

  return NextResponse.json(entries);
}
