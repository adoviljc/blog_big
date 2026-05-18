import "server-only";

import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";


export const authOptions: NextAuthOptions = ({

  secret: process.env.NEXTAUTH_SECRET,  
  session: { strategy: "jwt" },
  pages: { signIn: "/login",error: "/login" },

  

 

  providers: [

 // ── 1. Email + mot de passe ──────────────────────────────────────
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
 
        const user = await db.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            password: true,
            role: true,
          },
        });
 
        // Compte inexistant ou créé via OAuth (pas de password)
        if (!user || !user.password) return null;
 
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
 
        return {
          id:    user.id,
          name:  user.name,
          email: user.email,
          image: user.avatar,
          role:  user.role ?? "USER",
        };
      },
    }),
    
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {

    async signIn({ user }) {
      await db.user.upsert({
        where: { email: user.email! },
        update: { name: user.name ?? "", avatar: user.image },
        create: {
          email: user.email!,
          name: user.name ?? "",
          avatar: user.image,
          password: null,   // compte OAuth : pas de mot de passe
          role: "USER",
        },
      });
      return true;
    },

    async session({ session, token }) {
      const dbUser = await db.user.findUnique({
        where: { email: session.user.email! },
        select: { id: true, role: true },
      });

      if (!dbUser) { throw new Error("Utilisateur non trouvé"); }

      session.user.id   = dbUser?.id;
      session.user.role = dbUser?.role ?? "USER";
      return session;
    },


    async jwt({ token, user }) {
    if (user) {
      token.role = (user as any).role;  // ← récupérer depuis la DB
    }
    return token;
  },
  },

  
});

