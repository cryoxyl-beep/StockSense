import { adjustmentRepository } from "@/repositories/adjustment-repository";
import { deliveryRepository } from "@/repositories/delivery-repository";
import { ledgerRepository } from "@/repositories/ledger-repository";
import { receiptRepository } from "@/repositories/receipt-repository";
import { transferRepository } from "@/repositories/transfer-repository";

export function listReceipts() {
  return receiptRepository.list();
}

export function listDeliveries() {
  return deliveryRepository.list();
}

export function listTransfers() {
  return transferRepository.list();
}

export function listAdjustments() {
  return adjustmentRepository.list();
}

export function listLedger() {
  return ledgerRepository.list();
}
