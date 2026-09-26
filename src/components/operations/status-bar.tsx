import { OperationStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const receiptSteps = [OperationStatus.DRAFT, OperationStatus.READY, OperationStatus.DONE];
const deliverySteps = [
  OperationStatus.DRAFT,
  OperationStatus.WAITING,
  OperationStatus.READY,
  OperationStatus.DONE,
];

export function StatusBar({
  status,
  type,
}: {
  status: OperationStatus;
  type: "RECEIPT" | "DELIVERY" | "INTERNAL" | "ADJUSTMENT";
}) {
  const steps =
    type === "DELIVERY"
      ? deliverySteps
      : type === "RECEIPT"
        ? receiptSteps
        : [OperationStatus.DRAFT, OperationStatus.READY, OperationStatus.DONE];

  if (status === OperationStatus.CANCELED) {
    return <p className="text-sm font-medium text-red-600">Canceled</p>;
  }

  const currentIndex = steps.indexOf(status);

  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((step, i) => (
        <li
          key={step}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            i <= currentIndex ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500",
          )}
        >
          {step}
        </li>
      ))}
    </ol>
  );
}
