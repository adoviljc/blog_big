import { NextRequest, NextResponse } from "next/server";
import { db} from "../../../../../lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    if (!body.content) {
      return NextResponse.json({ error: "content est requis" }, { status: 400 });
    }
    const comment = await db.comment.update({
      where: { id: Number(params.id) },
      data: { content: body.content },
    });
    return NextResponse.json(comment);
  } catch (error: any) {
    console.error("[PATCH /api/comments/:id]", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Commentaire introuvable" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.comment.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Commentaire supprimé" });
  } catch (error: any) {
    console.error("[DELETE /api/comments/:id]", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Commentaire introuvable" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}