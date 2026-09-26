import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

const AUTH_PAGES = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]);

function isPublicApi(pathname: string) {
  return pathname === "/api/health" || pathname.startsWith("/api/auth");
}

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = Boolean(auth?.user);
      const isAuthPage = AUTH_PAGES.has(pathname);

      if (isPublicApi(pathname)) {
        return true;
      }

      if (pathname === "/" || isAuthPage) {
        if (isLoggedIn) {
          return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
        }
        return true;
      }

      if (!isLoggedIn) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { ok: false, error: "Unauthorized" },
            { status: 401 },
          );
        }
        return false;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role ?? "WAREHOUSE_STAFF";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
