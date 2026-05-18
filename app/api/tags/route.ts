import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/prisma";

export async function GET() {
  try {
    const tags = await db.tag.findMany({
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("[GET /api/tags]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "name et slug sont requis" }, { status: 400 });
    }
    const tag = await db.tag.create({
      data: { name: body.name, slug: body.slug },
    });
    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/tags]", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Ce tag existe déjà" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}