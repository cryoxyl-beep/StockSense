import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { locationSchema } from "@/lib/validations";

export async function GET() {
  const locations = await prisma.location.findMany({
    include: { warehouse: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(locations);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = locationSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  try {
    const location = await prisma.location.create({ data: parsed.data });
    return NextResponse.json(location);
  } catch {
    return NextResponse.json({ error: "Short code exists in warehouse" }, { status: 409 });
  }
}
