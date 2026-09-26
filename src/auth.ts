import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        loginId: { label: "Login Id", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const loginId = credentials?.loginId as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!loginId || !password) return null;

        const user = await prisma.user.findUnique({ where: { loginId } });
        if (!user) return null;
        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name ?? user.loginId,
          email: user.email,
          role: user.role,
          loginId: user.loginId,
        };
      },
    }),
  ],
});
