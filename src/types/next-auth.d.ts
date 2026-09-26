import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role?: string;
      loginId?: string;
    };
  }

  interface User {
    role?: string;
    loginId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    loginId?: string;
  }
}
