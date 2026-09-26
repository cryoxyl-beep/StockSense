import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await verifyAuth();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });
    
    const { qrSeed } = await req.json();

    const matchedUser = await prisma.user.findUnique({
      where: { qrSeed },
    });

    if (matchedUser) {
      return NextResponse.json({ ok: true, role: matchedUser.role });
    }

    return NextResponse.json({ ok: false }, { status: 403 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
