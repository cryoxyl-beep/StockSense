import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const document = await prisma.stockDocument.findUnique({
    where: { id },
    include: {
      sourceWarehouse: true,
      targetWarehouse: true,
      lines: { include: { product: true } },
    },
  });

  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(document);
}
