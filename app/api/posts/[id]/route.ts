import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
   
    const post = await db.post.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { id: true, name: true, avatar: true, bio: true } },
        category: true,
        tags: { include: { tag: true } },
        comments: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!post) return NextResponse.json({ error: "Post introuvable" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error("[GET /api/posts/:id]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const post = await db.post.update({
      where: { id: Number(id) },
      data: {
        ...body,
        publishedAt: body.published ? new Date() : undefined,
        ...(body.tagIds && {
          tags: {
            deleteMany: {},
            create: body.tagIds.map((tagId: number) => ({ tagId })),
          },
        }),
      },
      include: { tags: { include: { tag: true } } },
    });
    return NextResponse.json(post);
  } catch (error: any) {
    console.error("[PATCH /api/posts/:id]", error);
    if (error.code === "P2025") return NextResponse.json({ error: "Post introuvable" }, { status: 404 });
    if (error.code === "P2002") return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.postTag.deleteMany({ where: { postId: Number(id) } });
    await db.comment.deleteMany({ where: { postId: Number(id) } });
    await db.post.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Post supprimé" });
  } catch (error: any) {
    console.error("[DELETE /api/posts/:id]", error);
    if (error.code === "P2025") return NextResponse.json({ error: "Post introuvable" }, { status: 404 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}