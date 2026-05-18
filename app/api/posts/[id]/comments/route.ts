import { NextRequest, NextResponse } from "next/server";
import { db} from "../../../../lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const comments = await db.comment.findMany({
      where: { postId: Number(params.id) },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("[GET /api/posts/:id/comments]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    if (!body.content || !body.userId) {
      return NextResponse.json({ error: "content et userId sont requis" }, { status: 400 });
    }
    const comment = await db.comment.create({
      data: {
        content: body.content,
        userId: body.userId,
        postId: Number(params.id),
      },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/posts/:id/comments]", error);
    if (error.code === "P2003") {
      return NextResponse.json({ error: "Post ou utilisateur introuvable" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}