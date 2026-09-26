import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { InventoryError, validateDelivery, validateReceipt } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const document = await prisma.stockDocument.findUnique({ where: { id } });
  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    if (document.type === "RECEIPT") {
      await validateReceipt(id);
    } else {
      await validateDelivery(id);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof InventoryError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
