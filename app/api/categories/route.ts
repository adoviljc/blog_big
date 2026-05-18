import { NextRequest, NextResponse } from "next/server";
import { db} from "../../lib/prisma";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("[GET /api/categories]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "name et slug sont requis" }, { status: 400 });
    }
    const category = await db.category.create({
      data: { name: body.name, slug: body.slug },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/categories]", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Cette catégorie existe déjà" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}