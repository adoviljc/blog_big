// app/dashboard/tags/page.tsx
import { api } from "@/app/lib/api";

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}

export default async function TagsPage() {
const tags: Tag[] = await api.tags.getAll();

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
          <p className="text-white/40 text-sm mt-1">{tags.length} tag{tags.length > 1 ? "s" : ""}</p>
        </div>
        <button className="flex items-center gap-2 bg-amber-400 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-300 transition-colors">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouveau tag
        </button>
      </div>

      {/* Tags grid */}
      <div className="flex flex-wrap gap-3">
        {tags.map((tag: Tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-amber-400/40 hover:bg-amber-400/5 transition-all group cursor-pointer"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white/40 group-hover:text-amber-400 transition-colors">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            <span className="text-sm font-medium">{tag.name}</span>
            <span className="text-xs text-white/30 bg-white/10 px-1.5 py-0.5 rounded-full">
              {tag._count.posts}
            </span>
          </div>
        ))}
      </div>

      {/* Table détaillée */}
      <div className="rounded-xl border border-white/10 overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left px-4 py-3 text-white/40 font-medium">Nom</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">Slug</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">Articles</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {tags.map((tag, i) => (
              <tr key={tag.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === tags.length - 1 ? "border-0" : ""}`}>
                <td className="px-4 py-3 font-medium">{tag.name}</td>
                <td className="px-4 py-3 text-white/40 font-mono text-xs">{tag.slug}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-amber-400/10 text-amber-400 rounded-full text-xs font-medium">
                    {tag._count.posts} article{tag._count.posts > 1 ? "s" : ""}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-white/30 hover:text-red-400 transition-colors text-xs">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
