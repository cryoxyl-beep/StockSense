import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const user = await verifyAuth();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });
    
    const { productId } = await params;

    const ledger = await prisma.stockLedger.findMany({
      where: { productId },
      orderBy: { at: "asc" },
      select: {
        movement: true,
        quantityDelta: true,
        at: true,
      },
    });

    return NextResponse.json(ledger);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
