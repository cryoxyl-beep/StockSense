import { z } from "zod";

export const signUpSchema = z
  .object({
    loginId: z.string().min(3).max(32),
    email: z.string().email(),
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  loginId: z.string().min(1),
  password: z.string().min(1),
});

export const otpRequestSchema = z.object({
  email: z.string().email(),
});

export const otpResetSchema = z
  .object({
    email: z.string().email(),
    code: z.string().length(6),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const warehouseSchema = z.object({
  name: z.string().min(1),
  shortCode: z.string().min(1).max(10),
  address: z.string().optional(),
});

export const locationSchema = z.object({
  name: z.string().min(1),
  shortCode: z.string().min(1).max(10),
  warehouseId: z.string().min(1),
});

export const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  categoryId: z.string().optional().nullable(),
  unitOfMeasure: z.string().min(1).default("Unit"),
  unitCost: z.coerce.number().min(0).default(0),
  reorderMin: z.coerce.number().int().min(0).default(0),
  initialStock: z.coerce.number().min(0).optional(),
  locationId: z.string().optional(),
});

export const operationLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().positive(),
});

export const operationSchema = z.object({
  contactId: z.string().optional().nullable(),
  fromLocationId: z.string().optional().nullable(),
  toLocationId: z.string().optional().nullable(),
  scheduleDate: z.coerce.date(),
  notes: z.string().optional(),
  lines: z.array(operationLineSchema).min(1),
});
