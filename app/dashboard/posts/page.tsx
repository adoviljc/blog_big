// app/dashboard/articles/page.tsx
import { db } from "../../lib/prisma";
import Link from "next/link";



type Post = {
  id: string;
  title: string;
  category: { name: string };
  tags: { tag: { id: string; name: string } }[];
  user: { name: string };
  published: boolean;
  createdAt: string;
};

export default async function ArticlesPage() {

const posts: Post[] = await fetch("http://localhost:3000/api/posts").then(res => res.json());

 
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
          <p className="text-white/40 text-sm mt-1">{posts.length} article{posts.length > 1 ? "s" : ""} au total</p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="flex items-center gap-2 bg-amber-400 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-300 transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvel article
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left px-4 py-3 text-white/40 font-medium">Titre</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">Catégorie</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">Tags</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">Auteur</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">Statut</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post, i) => (
              <tr key={post.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === posts.length - 1 ? "border-0" : ""}`}>
                <td className="px-4 py-3 font-medium max-w-180px truncate">{post.title}</td>
                <td className="px-4 py-3 text-white/50">{post.category.name}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {post.tags.slice(0, 2).map(({ tag }) => (
                      <span key={tag.id} className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/60">
                        {tag.name}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="px-2 py-0.5 bg-white/5 rounded-full text-xs text-white/30">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-white/50">{post.user.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.published ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"}`}>
                    {post.published ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/40">
                  {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/dashboard/articles/${post.id}/edit`} className="text-amber-400 hover:underline text-xs">
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
