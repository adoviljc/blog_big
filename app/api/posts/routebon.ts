import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const published = searchParams.get("published");
    const categoryId = searchParams.get("categoryId");

    const posts = await db.post.findMany({
      where: {
        ...(published !== null && { published: published === "true" }),
        ...(categoryId && { categoryId: Number(categoryId) }),
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        category: true,
        tags: { include: { tag: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("[GET /api/posts]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {

    const session = await getServerSession(authOptions);
   
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

  try {
    const body = await req.json();
    if (!body.title || !body.slug || !body.content || !body.userId || !body.categoryId) {
      return NextResponse.json(
        { error: "title, slug, content, userId et categoryId sont requis" },
        { status: 400 }
      );
    }
    const post = await db.post.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        published: body.published ?? false,
        publishedAt: body.published ? new Date() : null,
        userId: body.userId,
        categoryId: Number(body.categoryId) ,
        tags: {
          create: body.tagIds?.map((tagId: number) => ({ tagId })) ?? [],
        },
      },
      include: { tags: { include: { tag: true } } },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/posts]", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}