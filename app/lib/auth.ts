import "server-only"; 
// Empêche ce fichier d’être importé côté client.
// Ce module ne pourra être exécuté que sur le serveur Next.js.

import { NextAuthOptions } from "next-auth";
// Type principal de configuration de NextAuth.

import GitHubProvider from "next-auth/providers/github";
// Provider OAuth GitHub.

import GoogleProvider from "next-auth/providers/google";
// Provider OAuth Google.

import { db } from "./prisma";
// Instance Prisma permettant l'accès à la base de données.

import CredentialsProvider from "next-auth/providers/credentials";
// Provider permettant l'authentification via email + mot de passe.

import { compare } from "bcryptjs";
// Fonction utilisée pour comparer un mot de passe brut
// avec un hash enregistré en base.

export const authOptions: NextAuthOptions = {

  // Clé secrète utilisée pour signer les JWT et sécuriser NextAuth.
  secret: process.env.NEXTAUTH_SECRET,

  // ─── Stratégie JWT + durées d'expiration ────────────────────────────────
  session: {

    // Utilisation des JWT au lieu des sessions stockées en base.
    strategy: "jwt",

    // Durée totale de validité de la session utilisateur.
    maxAge: 60 * 60 * 24 * 7,        
    // 7 jours

    // Fréquence de rafraîchissement du token si l’utilisateur reste actif.
    updateAge: 60 * 60 * 24,          
    // 24 heures
  },

  jwt: {

    // Durée de validité du JWT.
    // Doit généralement correspondre à session.maxAge.
    maxAge: 60 * 60 * 24 * 7,
  },

  // Personnalisation des pages d’authentification.
  pages: {

    // Page de connexion personnalisée.
    signIn: "/login",

    // Redirection en cas d’erreur d’authentification.
    error: "/login",
  },

  providers: [

    // ── 1. Authentification Email + Mot de passe ────────────────────────
    CredentialsProvider({

      // Nom affiché du provider.
      name: "Credentials",

      // Champs attendus dans le formulaire de connexion.
      credentials: {

        // Champ email.
        email: { label: "Email", type: "email" },

        // Champ mot de passe.
        password: { label: "Password", type: "password" },
      },

      // Fonction exécutée lors de la tentative de connexion.
      async authorize(credentials, req) {

        // Vérifie que les champs sont présents.
        if (!credentials?.email || !credentials?.password) return null;

        // Recherche l'utilisateur dans la base via son email.
        const user = await db.user.findUnique({
          where: { email: credentials.email },

          // Sélection uniquement des champs nécessaires.
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            password: true,
            role: true,
          },
        });

        // Si aucun utilisateur trouvé
        // OU si le compte a été créé via OAuth (sans mot de passe)
        // alors on refuse la connexion.
        if (!user || !user.password) return null;

        // Compare le mot de passe saisi avec le hash stocké en base.
        const isValid = await compare(credentials.password, user.password);

        // Mot de passe invalide.
        if (!isValid) return null;

        // Objet utilisateur injecté dans NextAuth après connexion réussie.
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,

          // Rôle par défaut si aucun rôle défini.
          role: user.role ?? "USER",
        };
      },
    }),

    // ── 2. Authentification OAuth GitHub ────────────────────────────────
    GitHubProvider({

      // Client ID GitHub OAuth.
      clientId: process.env.GITHUB_CLIENT_ID!,

      // Secret OAuth GitHub.
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // ── 3. Authentification OAuth Google ────────────────────────────────
    GoogleProvider({

      // Client ID Google OAuth.
      clientId: process.env.GOOGLE_CLIENT_ID!,

      // Secret OAuth Google.
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {

    // ── Callback signIn ────────────────────────────────────────────────
    // Exécuté après une connexion réussie.
    // Sert ici à créer ou mettre à jour l'utilisateur en base.
    async signIn({ user }) {

      try {

        // upsert :
        // - update si l'utilisateur existe déjà
        // - create sinon
        await db.user.upsert({

          // Recherche via l’email.
          where: { email: user.email! },

          // Mise à jour si utilisateur existant.
          update: {
            name: user.name ?? "",
            avatar: user.image,
          },

          // Création si utilisateur inexistant.
          create: {
            email: user.email!,
            name: user.name ?? "",
            avatar: user.image,

            // Compte OAuth → pas de mot de passe local.
            password: null,

            // Rôle utilisateur par défaut.
            role: "USER",
          },
        });

        // Autorise la connexion.
        return true;

      } catch {

        // Si erreur BDD ou serveur :
        // connexion refusée proprement.
        return false;
      }
    },

    // ── Callback jwt ───────────────────────────────────────────────────
    // Construit ou met à jour le JWT.
    async jwt({ token, user, trigger, session }) {

      // Premier appel :
      // exécuté juste après la connexion.
      if (user) {

        // Ajout de l'id utilisateur dans le token.
        token.id =
          typeof user.id === "string"
            ? Number(user.id)
            : user.id;

        // Ajout du rôle utilisateur dans le token.
        token.role = (user as any).role ?? "USER";
      }

      // Cas particulier :
      // update() appelé côté client pour mettre à jour le token.
      if (trigger === "update" && session?.role) {

        // Mise à jour du rôle dans le JWT.
        token.role = session.role;
      }

      // Retour du token final.
      return token;
    },

    // ── Callback session ───────────────────────────────────────────────
    // Expose les données du JWT au client.
    async session({ session, token }) {

      // Injection de l'id utilisateur dans session.user.
      session.user.id = token.id as number;

      // Injection du rôle utilisateur dans session.user.
      session.user.role =
        (token.role as "USER" | "MODERATOR" | "ADMIN") ?? "USER";

      // Retour de la session enrichie.
      return session;
    },
  },
};