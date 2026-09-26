ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'TRANSFER';
ALTER TYPE "MovementType" ADD VALUE IF NOT EXISTS 'TRANSFER_IN';
ALTER TYPE "MovementType" ADD VALUE IF NOT EXISTS 'TRANSFER_OUT';

ALTER TABLE "StockDocument"
  ADD COLUMN "sourceWarehouseId" TEXT,
  ADD COLUMN "targetWarehouseId" TEXT;

ALTER TABLE "StockLedger"
  ADD COLUMN "warehouseId" TEXT;

UPDATE "StockLedger"
SET "warehouseId" = sb."warehouseId"
FROM "StockDocumentLine" sdl
JOIN "StockBalance" sb ON sb."productId" = sdl."productId"
WHERE sdl."documentId" = "StockLedger"."documentId"
  AND sdl."productId" = "StockLedger"."productId"
  AND "StockLedger"."warehouseId" IS NULL;

ALTER TABLE "StockLedger"
  ALTER COLUMN "warehouseId" SET NOT NULL;

CREATE INDEX "StockDocument_sourceWarehouseId_idx" ON "StockDocument"("sourceWarehouseId");
CREATE INDEX "StockDocument_targetWarehouseId_idx" ON "StockDocument"("targetWarehouseId");
CREATE INDEX "StockLedger_warehouseId_idx" ON "StockLedger"("warehouseId");

ALTER TABLE "StockDocument"
  ADD CONSTRAINT "StockDocument_sourceWarehouseId_fkey"
  FOREIGN KEY ("sourceWarehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "StockDocument"
  ADD CONSTRAINT "StockDocument_targetWarehouseId_fkey"
  FOREIGN KEY ("targetWarehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "StockLedger"
  ADD CONSTRAINT "StockLedger_warehouseId_fkey"
  FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
