// app/dashboard/categories/page.tsx


type Category = {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
};

export default async function CategoriesPage() {
  const categories: Category[] = await fetch("http://localhost:3000/api/categories").then(res => res.json());

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catégories</h1>
          <p className="text-white/40 text-sm mt-1">{categories.length} catégorie{categories.length > 1 ? "s" : ""}</p>
        </div>
        <button className="flex items-center gap-2 bg-amber-400 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-300 transition-colors">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvelle catégorie
        </button>


        
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-white/10 bg-white/5 p-5 flex items-center justify-between hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <svg width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">{cat.name}</p>
                <p className="text-xs text-white/40">/{cat.slug}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-400">{cat._count.posts}</p>
              <p className="text-xs text-white/40">article{cat._count.posts > 1 ? "s" : ""}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
