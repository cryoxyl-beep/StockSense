import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/utils";

export async function getOrCreateQuant(
  tx: Prisma.TransactionClient,
  productId: string,
  locationId: string,
) {
  return tx.stockQuant.upsert({
    where: { productId_locationId: { productId, locationId } },
    create: { productId, locationId, onHand: 0, reserved: 0 },
    update: {},
  });
}

export function freeToUse(onHand: Prisma.Decimal, reserved: Prisma.Decimal) {
  return decimalToNumber(onHand) - decimalToNumber(reserved);
}

export async function getProductAvailability(
  productId: string,
  locationId: string,
) {
  const quant = await prisma.stockQuant.findUnique({
    where: { productId_locationId: { productId, locationId } },
  });
  if (!quant) return { onHand: 0, reserved: 0, free: 0 };
  return {
    onHand: decimalToNumber(quant.onHand),
    reserved: decimalToNumber(quant.reserved),
    free: freeToUse(quant.onHand, quant.reserved),
  };
}
