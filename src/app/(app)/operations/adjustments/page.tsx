import { OperationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { OperationList } from "@/components/operations/operation-list";

export const dynamic = "force-dynamic";

export default async function AdjustmentsPage() {
  const rows = await prisma.stockOperation.findMany({
    where: { type: OperationType.ADJUSTMENT },
    include: {
      contact: true,
      fromLocation: { include: { warehouse: true } },
      toLocation: { include: { warehouse: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return <OperationList type={OperationType.ADJUSTMENT} rows={rows} />;
}
