"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", content: "", excerpt: "",
    userId: "", categoryId: "", published: false, tagIds: [] as number[],
  });

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
    fetch("/api/tags").then((r) => r.json()).then(setTags);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function toggleTag(id: number) {
    setForm((f) => ({
      ...f,
      tagIds: f.tagIds.includes(id) ? f.tagIds.filter((t) => t !== id) : [...f.tagIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: Number(form.userId), categoryId: Number(form.categoryId) }),
      });
      if (res.ok) router.push("/posts");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="font-display text-3xl font-bold">Nouvel article</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-8 space-y-6">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <label className="text-sm font-medium text-stone-700">Titre</label>
            <input name="title" value={form.title} onChange={handleChange} required
              className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-700">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} required
              className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-700">ID Auteur</label>
            <input name="userId" type="number" value={form.userId} onChange={handleChange} required
              className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">Extrait</label>
          <input name="excerpt" value={form.excerpt} onChange={handleChange}
            className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">Contenu</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={10} required
            className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">Catégorie</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} required
            className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option value="">Choisir...</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((t: any) => (
              <button key={t.id} type="button" onClick={() => toggleTag(t.id)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  form.tagIds.includes(t.id)
                    ? "bg-amber-600 text-white border-amber-600"
                    : "border-stone-200 text-stone-600 hover:border-stone-400"
                }`}>
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="w-4 h-4 accent-amber-600" />
          <span className="text-sm text-stone-700">Publier immédiatement</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors">
            {loading ? "Création..." : "Créer l'article"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2 border border-stone-200 text-stone-600 text-sm rounded-lg hover:bg-stone-50 transition-colors">
            Annuler
          </button>
        </div>

      </form>
    </div>
  );
}