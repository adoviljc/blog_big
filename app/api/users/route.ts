import { NextRequest, NextResponse } from "next/server";
import { db} from "../../lib/prisma";

export async function GET() {
  try {
    const users = await db.user.findMany({
      include: { posts: true, comments: true ,_count: {
      select: { posts: true }, },
  },

    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[GET /api/users]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.email || !body.name) {
      return NextResponse.json({ error: "email et name sont requis" }, { status: 400 });
    }
    const user = await db.user.create({
      data: {
        email: body.email,
        name: body.name,
        bio: body.bio,
        avatar: body.avatar,
        role: body.role ?? "USER",
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/users]", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Cet email existe déjà" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}