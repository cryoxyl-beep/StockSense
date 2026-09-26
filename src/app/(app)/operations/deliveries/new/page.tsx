import { OperationType } from "@prisma/client";
import { OperationForm } from "@/components/operations/operation-form";
import { getOperationFormOptions } from "@/lib/operation-page-data";

export const dynamic = "force-dynamic";

export default async function NewDeliveryPage() {
  const opts = await getOperationFormOptions();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New delivery</h1>
      <OperationForm type={OperationType.DELIVERY} listPath="/operations/deliveries" {...opts} />
    </div>
  );
}
