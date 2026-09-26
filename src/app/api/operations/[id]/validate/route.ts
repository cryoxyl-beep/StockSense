import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { validateOperation } from "@/services/operation.service";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const op = await validateOperation(id);
    return NextResponse.json(op);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Validation failed" },
      { status: 400 },
    );
  }
}
