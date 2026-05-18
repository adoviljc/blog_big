import { db } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [posts, categories, tags] = await Promise.all([
      db.post.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { category: true } }),
      db.category.findMany({ include: { _count: { select: { posts: true } } } }),
      db.tag.findMany({ include: { _count: { select: { posts: true } } } }),
    ]);

    return NextResponse.json({ posts, categories, tags });
  } catch (error) {
    return NextResponse.json({ error: "Erreur de récupération" }, { status: 500 });
  }
}
