import Link from "next/link";
import CommentForm from "../../components/CommentForm";

async function getPost(id: string) {
  const res = await fetch(`http://localhost:3000/api/posts/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const post = await getPost((await params).id);

  console.log("voici l'articles "+post)
  if (!post) return <p className="text-stone-500">Article introuvable.</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link
            href="/posts"
            className="text-sm text-stone-400 hover:text-stone-700 transition-colors"
          >
            ← Articles
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
            {post.category?.name}
          </span>
        </div>
        <h1 className="font-display text-4xl font-bold leading-tight">{post.title}</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
              {post.user?.name?.[0]}
            </div>
            <span className="text-stone-600 text-sm">{post.user?.name}</span>
          </div>
          <div className="flex gap-1">
            {post.tags?.map((pt: any) => (
              <span key={pt.tag.id} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
                {pt.tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-stone-200 rounded-xl p-8">
        <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Comments */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold">
          Commentaires ({post.comments?.length ?? 0})
        </h2>

        <CommentForm postId={post.id} />

        <div className="space-y-4">
          {post.comments?.map((c: any) => (
            <div key={c.id} className="bg-white border border-stone-200 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-xs">
                  {c.user?.name?.[0]}
                </div>
                <span className="text-sm font-medium text-stone-700">{c.user?.name}</span>
                <span className="text-xs text-stone-400">
                  {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <p className="text-stone-600 text-sm">{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}