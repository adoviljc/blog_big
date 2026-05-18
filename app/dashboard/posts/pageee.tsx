import Link from "next/link";

async function getPosts() {
  const res = await fetch("http://localhost:3000/api/posts", { cache: "no-store" });
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Tous les articles</h1>
        <Link
          href="/posts/new"
          className="px-4 py-2 bg-stone-900 text-white text-sm rounded-lg hover:bg-stone-700 transition-colors"
        >
          + Nouveau
        </Link>
      </div>

      <div className="space-y-4">
        {posts?.map((post: any) => (
          <div
            key={post.id}
            className="bg-white border border-stone-200 rounded-xl p-6 flex items-start justify-between gap-4 hover:border-stone-300 transition-colors"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  {post.category?.name}
                </span>
                {!post.published && (
                  <span className="text-xs font-medium text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
                    Brouillon
                  </span>
                )}
              </div>
              <Link href={`/posts/${post.id}`}>
                <h2 className="font-display text-xl font-semibold text-stone-900 hover:text-amber-700 transition-colors">
                  {post.id}
                </h2>
              </Link>
              <p className="text-stone-500 text-sm line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-stone-400">
                <span>Par {post.user?.name}</span>
                <span>{post._count?.comments} commentaires</span>
                <div className="flex gap-1">
                  {post.tags?.map((pt: any) => (
                    <span key={pt.tag.id} className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                      {pt.tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Link
                href={`/posts/${post.id}/edit`}
                className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors text-center"
              >
                Modifier
              </Link>
              <DeletePostButton id={post.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
)
}

function DeletePostButton({ id }: { id: number }) {
  return (
    <form
      action={async () => {
        "use server";
        await fetch(`http://localhost:3000/api/posts/${id}`, { method: "DELETE" });
      }}
    >
      <button
        type="submit"
        className="w-full px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
      >
        Supprimer
      </button>
    </form>
  );
}