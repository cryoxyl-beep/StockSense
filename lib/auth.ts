import { randomInt } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { sendResetCode } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "stocksense_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
  email: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const userId = payload.userId as string;
    const email = payload.email as string;
    if (!userId || !email) return null;
    return { userId, email };
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function registerUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }
  const passwordHash = await hashPassword(password);
  return prisma.user.create({
    data: { email, passwordHash },
  });
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new Error("INVALID_CREDENTIALS");
  }
  return user;
}

const OTP_TTL_MS = 10 * 60 * 1000;

export async function issuePasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { issued: false as const };
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error("MAIL_NOT_CONFIGURED");
  }

  const code = String(randomInt(100000, 1000000));
  const codeHash = await hashPassword(code);

  await prisma.passwordReset.deleteMany({ where: { email } });
  await prisma.passwordReset.create({
    data: {
      email,
      codeHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  try {
    await sendResetCode(email, code);
  } catch (error) {
    await prisma.passwordReset.deleteMany({ where: { email } });
    throw error;
  }

  return { issued: true as const };
}

export async function resetPasswordWithOtp(email: string, code: string, password: string) {
  const resets = await prisma.passwordReset.findMany({
    where: { email, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  let matched = false;
  for (const reset of resets) {
    if (await verifyPassword(code, reset.codeHash)) {
      matched = true;
      break;
    }
  }

  if (!matched) {
    throw new Error("INVALID_OTP");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("INVALID_OTP");
  }

  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
    prisma.passwordReset.deleteMany({ where: { email } }),
  ]);
}
