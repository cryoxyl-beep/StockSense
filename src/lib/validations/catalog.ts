import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(120),
});

export const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  sku: z.string().trim().min(1).max(64),
  uom: z.string().trim().min(1).max(32),
  categoryId: z.string().min(1),
});

export const warehouseSchema = z.object({
  name: z.string().trim().min(1).max(200),
  code: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^[A-Za-z0-9_-]+$/, "Use letters, numbers, hyphens, or underscores"),
});

export const locationSchema = z.object({
  name: z.string().trim().min(1).max(200),
  code: z.string().trim().min(1).max(32),
  type: z.enum([
    "INTERNAL",
    "VENDOR",
    "CUSTOMER",
    "INVENTORY_LOSS",
    "PRODUCTION",
    "TRANSIT",
  ]),
  warehouseId: z.string().min(1).nullable().optional(),
  parentId: z.string().min(1).nullable().optional(),
});
