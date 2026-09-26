import type { AppRole } from "@/types/roles";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import type { RegisterInput } from "@/lib/validations/auth";
import { userRepository } from "@/repositories/user-repository";

const PUBLIC_ROLES = new Set<AppRole>(["INVENTORY_MANAGER", "WAREHOUSE_STAFF"]);

export async function authenticateCredentials(email: string, password: string) {
  const user = await userRepository.findByEmail(email);
  if (!user || !user.isActive) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function registerUser(input: RegisterInput) {
  if (!PUBLIC_ROLES.has(input.role)) {
    return {
      ok: false as const,
      status: 400,
      error: "That role cannot be assigned at signup.",
    };
  }

  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    return {
      ok: false as const,
      status: 409,
      error: "An account with that email already exists.",
    };
  }

  const passwordHash = await hashPassword(input.password);
  const user = await userRepository.create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: input.role,
  });

  return { ok: true as const, user };
}
