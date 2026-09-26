export const USER_ROLES = ["ADMIN", "INVENTORY_MANAGER", "WAREHOUSE_STAFF"] as const;

export type AppRole = (typeof USER_ROLES)[number];

export const PUBLIC_SIGNUP_ROLES = ["INVENTORY_MANAGER", "WAREHOUSE_STAFF"] as const;

export type PublicSignupRole = (typeof PUBLIC_SIGNUP_ROLES)[number];

export const ROLE_LABELS: Record<AppRole, string> = {
  ADMIN: "Admin",
  INVENTORY_MANAGER: "Inventory manager",
  WAREHOUSE_STAFF: "Warehouse staff",
};

export function isAppRole(value: string): value is AppRole {
  return USER_ROLES.some((role) => role === value);
}
