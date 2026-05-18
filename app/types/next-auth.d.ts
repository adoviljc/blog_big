import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: "USER" | "MODERATOR" | "ADMIN";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    role: "USER" | "MODERATOR" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: "USER" | "MODERATOR" | "ADMIN";
  }
}