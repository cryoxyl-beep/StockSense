import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { cancelOperation } from "@/services/operation.service";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const op = await cancelOperation(id);
    return NextResponse.json(op);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Cancel failed" },
      { status: 400 },
    );
  }
}
