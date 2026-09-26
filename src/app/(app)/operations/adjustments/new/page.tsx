import { OperationType } from "@prisma/client";
import { OperationForm } from "@/components/operations/operation-form";
import { getOperationFormOptions } from "@/lib/operation-page-data";

export const dynamic = "force-dynamic";

export default async function NewAdjustmentPage() {
  const opts = await getOperationFormOptions();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New adjustment</h1>
      <p className="text-sm text-zinc-500">Line quantity = counted on-hand quantity at location</p>
      <OperationForm type={OperationType.ADJUSTMENT} listPath="/operations/adjustments" {...opts} />
    </div>
  );
}
