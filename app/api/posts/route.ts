// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { GetPostsQuerySchema, CreatePostSchema } from "../../lib/schemas/post.schema";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // ── Validation des query params ──────────────────────────────────────
    const parsed = GetPostsQuerySchema.safeParse({
      published: searchParams.get("published") ?? undefined,
      categoryId: searchParams.get("categoryId") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // parsed.data est typé et transformé (categoryId est déjà un Number)
    const { published, categoryId } = parsed.data;

    const posts = await db.post.findMany({
      where: {
        ...(published !== undefined && { published: published === "true" }),
        ...(categoryId !== undefined && { categoryId }),
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
  // ── Authentification ─────────────────────────────────────────────────
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // ── Validation du body ───────────────────────────────────────────────
    const parsed = CreatePostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // userId can come as a string from the validated body; ensure it's a number
    const {
      title,
      slug,
      content,
      excerpt,
      published,
      userId: userIdRaw,
      categoryId,
      tagIds,
    } = parsed.data;

    const userId = Number(userIdRaw);
    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "userId invalide" }, { status: 400 });
    }

    // ── Vérification de cohérence : l'userId du body doit correspondre à la session ──
    // session.user.id may be a string; compare numeric values
    const sessionUserId = Number(session.user.id);
    if (userId !== sessionUserId && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Vous ne pouvez pas créer un post au nom d'un autre utilisateur" },
        { status: 403 }
      );
    }

    const post = await db.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        published,
        publishedAt: published ? new Date() : null,
        userId,
        categoryId,
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
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

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}