import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OperationDetail } from "@/components/operations/operation-detail";
import { decimalToNumber } from "@/lib/utils";
import { getProductAvailability } from "@/services/stock.service";

const typeMap: Record<string, { prismaType: string; list: string }> = {
  receipts: { prismaType: "RECEIPT", list: "/operations/receipts" },
  deliveries: { prismaType: "DELIVERY", list: "/operations/deliveries" },
  transfers: { prismaType: "INTERNAL", list: "/operations/transfers" },
  adjustments: { prismaType: "ADJUSTMENT", list: "/operations/adjustments" },
};

export const dynamic = "force-dynamic";

export default async function OperationDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const meta = typeMap[type];
  if (!meta) notFound();

  const operation = await prisma.stockOperation.findFirst({
    where: { id, type: meta.prismaType as import("@prisma/client").OperationType },
    include: {
      lines: { include: { product: true } },
      contact: true,
      responsible: true,
    },
  });
  if (!operation) notFound();

  const lines = await Promise.all(
    operation.lines.map(async (l) => {
      let shortage = false;
      if (operation.type === "DELIVERY" && operation.fromLocationId) {
        const avail = await getProductAvailability(l.productId, operation.fromLocationId);
        shortage = avail.free < decimalToNumber(l.quantity);
      }
      return { ...l, shortage };
    }),
  );

  return (
    <OperationDetail
      listPath={meta.list}
      operation={{
        ...operation,
        scheduleDate: operation.scheduleDate.toISOString(),
        lines,
      }}
    />
  );
}
