import { OperationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { OperationList } from "@/components/operations/operation-list";

export const dynamic = "force-dynamic";

export default async function TransfersPage() {
  const rows = await prisma.stockOperation.findMany({
    where: { type: OperationType.INTERNAL },
    include: {
      contact: true,
      fromLocation: { include: { warehouse: true } },
      toLocation: { include: { warehouse: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return <OperationList type={OperationType.INTERNAL} rows={rows} />;
}
