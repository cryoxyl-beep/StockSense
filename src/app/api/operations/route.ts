import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { OperationType } from "@prisma/client";
import { z } from "zod";
import { createOperation } from "@/services/operation.service";
import { operationSchema } from "@/lib/validations";

const createSchema = operationSchema.extend({
  type: z.nativeEnum(OperationType),
  warehouseId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  try {
    const op = await createOperation(parsed.data.type, {
      contactId: parsed.data.contactId,
      fromLocationId: parsed.data.fromLocationId,
      toLocationId: parsed.data.toLocationId,
      scheduleDate: parsed.data.scheduleDate,
      notes: parsed.data.notes,
      lines: parsed.data.lines,
      responsibleId: session.user.id,
      warehouseId: parsed.data.warehouseId,
    });
    return NextResponse.json(op);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 400 },
    );
  }
}
