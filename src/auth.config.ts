import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAuthPage =
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/forgot-password");
      if (isAuthPage) {
        if (auth?.user) {
          return Response.redirect(new URL("/dashboard", request.nextUrl));
        }
        return true;
      }
      if (pathname.startsWith("/api/auth")) return true;
      return !!auth?.user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.loginId = (user as { loginId?: string }).loginId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as string | undefined;
        session.user.loginId = token.loginId as string | undefined;
      }
      return session;
    },
  },
};
