import { sendPasswordResetEmail } from "@/lib/email";
import {
  OTP_RESEND_COOLDOWN_MS,
  OTP_TTL_MS,
  generateResetCode,
  hashResetCode,
  requireAuthSecret,
  resetCodesMatch,
} from "@/lib/auth/otp";
import { hashPassword } from "@/lib/auth/password";
import type { ForgotPasswordInput, ResetPasswordInput } from "@/lib/validations/auth";
import { passwordResetRepository } from "@/repositories/password-reset-repository";
import { userRepository } from "@/repositories/user-repository";

const GENERIC_MESSAGE =
  "If an account exists for that email, a reset code has been sent.";

export async function requestPasswordReset(input: ForgotPasswordInput) {
  const user = await userRepository.findByEmail(input.email);
  if (!user || !user.isActive) {
    return { ok: true as const, message: GENERIC_MESSAGE };
  }

  const latest = await passwordResetRepository.latestForUser(user.id);
  if (
    latest &&
    Date.now() - latest.createdAt.getTime() < OTP_RESEND_COOLDOWN_MS
  ) {
    return {
      ok: false as const,
      status: 429,
      error: "Please wait 60 seconds before requesting another code.",
    };
  }

  const secret = requireAuthSecret();
  const code = generateResetCode();
  const otp = await passwordResetRepository.create({
    userId: user.id,
    codeHash: hashResetCode(code, secret),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });

  try {
    const delivery = await sendPasswordResetEmail(user.email, code);
    if (!delivery.delivered) {
      console.info(`[stocksense] password reset code for ${user.email}: ${code}`);
      if (process.env.NODE_ENV !== "production") {
        return { ok: true as const, message: GENERIC_MESSAGE, devOtp: code };
      }
    }
  } catch (error) {
    await passwordResetRepository.deleteById(otp.id);
    console.error("Failed to send password reset email", error);
    return {
      ok: false as const,
      status: 502,
      error: "Could not send the reset email. Try again shortly.",
    };
  }

  return { ok: true as const, message: GENERIC_MESSAGE };
}

export async function resetPassword(input: ResetPasswordInput) {
  const user = await userRepository.findByEmail(input.email);
  if (!user || !user.isActive) {
    return { ok: false as const, status: 400, error: "Invalid or expired code." };
  }

  const otp = await passwordResetRepository.latestActive(user.id, new Date());
  const secret = requireAuthSecret();
  if (!otp || !resetCodesMatch(otp.codeHash, input.code, secret)) {
    return { ok: false as const, status: 400, error: "Invalid or expired code." };
  }

  const passwordHash = await hashPassword(input.password);
  await passwordResetRepository.applyPasswordReset(user.id, passwordHash, otp.id);

  return {
    ok: true as const,
    message: "Password updated. You can sign in with the new password.",
  };
}
