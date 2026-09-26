import { OperationStatus, OperationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/utils";
import { freeToUse } from "@/services/stock.service";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getDashboardMetrics(filters?: {
  warehouseId?: string;
  locationId?: string;
  categoryId?: string;
  status?: OperationStatus;
  type?: OperationType;
}) {
  const today = startOfToday();

  const productWhere = filters?.categoryId
    ? { categoryId: filters.categoryId }
    : {};

  const products = await prisma.product.findMany({
    where: productWhere,
    include: { stockQuants: true },
  });

  let totalInStock = 0;
  let lowStock = 0;
  let outOfStock = 0;

  for (const p of products) {
    const total = p.stockQuants.reduce(
      (sum, q) => sum + decimalToNumber(q.onHand),
      0,
    );
    totalInStock += total;
    if (total === 0) outOfStock += 1;
    else if (total <= p.reorderMin) lowStock += 1;
  }

  const opWhere: Record<string, unknown> = {
    status: { notIn: [OperationStatus.DONE, OperationStatus.CANCELED] },
  };
  if (filters?.type) opWhere.type = filters.type;
  if (filters?.status) opWhere.status = filters.status;

  const pendingOps = await prisma.stockOperation.findMany({
    where: opWhere,
    include: { lines: true },
  });

  const receipts = pendingOps.filter((o) => o.type === OperationType.RECEIPT);
  const deliveries = pendingOps.filter((o) => o.type === OperationType.DELIVERY);
  const internals = pendingOps.filter((o) => o.type === OperationType.INTERNAL);

  const summarize = (ops: typeof pendingOps) => {
    let late = 0;
    let active = 0;
    let waiting = 0;
    for (const o of ops) {
      if (o.status === OperationStatus.WAITING) waiting += 1;
      if (o.scheduleDate < today) late += 1;
      else active += 1;
    }
    return { late, active, waiting, total: ops.length };
  };

  return {
    totalProducts: products.length,
    totalInStock,
    lowStock,
    outOfStock,
    pendingReceipts: receipts.length,
    pendingDeliveries: deliveries.length,
    pendingInternals: internals.length,
    receiptSummary: summarize(receipts),
    deliverySummary: summarize(deliveries),
  };
}

export async function listStockOverview(locationId?: string) {
  const quants = await prisma.stockQuant.findMany({
    where: locationId ? { locationId } : undefined,
    include: {
      product: { include: { category: true } },
      location: { include: { warehouse: true } },
    },
    orderBy: { product: { name: "asc" } },
  });

  return quants.map((q) => ({
    id: q.id,
    productId: q.productId,
    productName: q.product.name,
    sku: q.product.sku,
    category: q.product.category?.name,
    unitCost: decimalToNumber(q.product.unitCost),
    unitOfMeasure: q.product.unitOfMeasure,
    locationLabel: `${q.location.warehouse.shortCode}/${q.location.shortCode}`,
    onHand: decimalToNumber(q.onHand),
    freeToUse: freeToUse(q.onHand, q.reserved),
    reorderMin: q.product.reorderMin,
    lowStock: decimalToNumber(q.onHand) <= q.product.reorderMin,
  }));
}
