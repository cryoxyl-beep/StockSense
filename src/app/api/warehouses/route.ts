import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { warehouseSchema } from "@/lib/validations";

export async function GET() {
  const warehouses = await prisma.warehouse.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(warehouses);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = warehouseSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  try {
    const warehouse = await prisma.warehouse.create({ data: parsed.data });
    return NextResponse.json(warehouse);
  } catch {
    return NextResponse.json({ error: "Short code already exists" }, { status: 409 });
  }
}
