import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = z.object({ name: z.string().min(1) }).safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  try {
    const category = await prisma.category.create({ data: { name: parsed.data.name } });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Category exists" }, { status: 409 });
  }
}
