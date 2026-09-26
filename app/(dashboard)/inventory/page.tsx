import { InventoryForms } from "@/components/InventoryForms";
import { QRScannerGate } from "@/components/QRScannerGate";

export default function InventoryPage() {
  return (
    <QRScannerGate requiredRole="ADMIN">
      <div>
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <p className="mt-1 text-sm text-zinc-500">Warehouses and product master data</p>
        <div className="mt-8">
          <InventoryForms />
        </div>
      </div>
    </QRScannerGate>
  );
}
