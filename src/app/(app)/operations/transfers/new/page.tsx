import { OperationType } from "@prisma/client";
import { OperationForm } from "@/components/operations/operation-form";
import { getOperationFormOptions } from "@/lib/operation-page-data";

export const dynamic = "force-dynamic";

export default async function NewTransferPage() {
  const opts = await getOperationFormOptions();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New internal transfer</h1>
      <OperationForm type={OperationType.INTERNAL} listPath="/operations/transfers" {...opts} />
    </div>
  );
}
