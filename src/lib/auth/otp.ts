import { createHash, randomInt, timingSafeEqual } from "node:crypto";

export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

export function generateResetCode() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashResetCode(code: string, secret: string) {
  return createHash("sha256").update(`${code}:${secret}`).digest("hex");
}

export function resetCodesMatch(storedHash: string, code: string, secret: string) {
  const actual = Buffer.from(hashResetCode(code, secret));
  const expected = Buffer.from(storedHash);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function requireAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return secret;
}
