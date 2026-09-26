import { OperationType } from "@prisma/client";

export const operationRoutes: Record<
  OperationType,
  { list: string; label: string }
> = {
  RECEIPT: { list: "/operations/receipts", label: "Receipt" },
  DELIVERY: { list: "/operations/deliveries", label: "Delivery" },
  INTERNAL: { list: "/operations/transfers", label: "Internal transfer" },
  ADJUSTMENT: { list: "/operations/adjustments", label: "Adjustment" },
};
