// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // ── Validation basique ───────────────────────────────────────────
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    // ── Vérifier si l'email est déjà utilisé ─────────────────────────
    const existing = await db.user.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json(
        { message: "Un compte existe déjà avec cet email." },
        { status: 409 }
      );
    }

    // ── Créer l'utilisateur avec password hashé ──────────────────────
    const hashedPassword = await hash(password, 12);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role:     "USER",
      },
    });

    return NextResponse.json(
      { message: "Compte créé avec succès." },
      { status: 201 }
    );

  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}