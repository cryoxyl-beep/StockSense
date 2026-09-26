import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .max(255)
  .transform((value) => value.toLowerCase());

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required").max(128),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: emailField,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  role: z.enum(["INVENTORY_MANAGER", "WAREHOUSE_STAFF"]),
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z.object({
  email: emailField,
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
