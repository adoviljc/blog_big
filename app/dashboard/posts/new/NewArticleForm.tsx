// app/dashboard/articles/new/NewArticleForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Category = { id: number; name: string; slug: string };
type Tag = { id: number; name: string; slug: string };

export default function NewArticleForm({
  categories,
  tags,
}: {
  categories: Category[];
  tags: Tag[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    published: false,
  });
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-génère le slug depuis le titre
  const handleTitle = (value: string) => {
    const slug = value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setForm((f) => ({ ...f, title: value, slug }));
  };

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (published: boolean) => {
    if (!form.title || !form.content || !form.categoryId) {
      setError("Le titre, le contenu et la catégorie sont obligatoires.");
      return;
    }
    if (!session?.user?.id) {          // ← vérification session
      setError("Vous devez être connecté.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...form, 
          published, 
          tagIds: selectedTags ,
          userId: session.user.id,

          }),
      });

      if (!res.ok) throw new Error((await res.json()).message || "Erreur lors de la création de l'article.");

      router.push("/dashboard/posts");
      router.refresh();
    } catch (e) {
      setError((e as Error).message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nouvel article</h1>
          <p className="text-white/40 text-sm mt-1">Remplissez les informations ci-dessous</p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* ── Colonne principale ── */}
        <div className="col-span-2 space-y-5">
          {/* Titre */}
          <div className="space-y-2">
            <label className="text-sm text-white/60 font-medium">Titre *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitle(e.target.value)}
              placeholder="Mon super article..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-sm text-white/60 font-medium">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="mon-super-article"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/60 font-mono text-sm placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
            />
            <p className="text-xs text-white/30">Généré automatiquement depuis le titre</p>
          </div>

          {/* Extrait */}
          <div className="space-y-2">
            <label className="text-sm text-white/60 font-medium">Extrait</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Courte description de l'article..."
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
            />
          </div>

          {/* Contenu */}
          <div className="space-y-2">
            <label className="text-sm text-white/60 font-medium">Contenu *</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Rédigez votre article ici..."
              rows={16}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 transition-colors resize-none font-mono text-sm leading-relaxed"
            />
            <p className="text-xs text-white/30">{form.content.length} caractères</p>
          </div>
        </div>

        {/* ── Colonne latérale ── */}
        <div className="space-y-5">
          {/* Publication */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white/80">Publication</h3>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="w-full bg-amber-400 text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-300 transition-colors disabled:opacity-50"
            >
              {loading ? "En cours..." : "✓ Publier"}
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="w-full bg-white/10 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-white/15 transition-colors disabled:opacity-50"
            >
              Sauvegarder en brouillon
            </button>
          </div>

          {/* Catégorie */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white/80">Catégorie *</h3>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    form.categoryId === String(cat.id)
                      ? "bg-amber-400/10 border border-amber-400/30"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={form.categoryId === String(cat.id)}
                    onChange={() => setForm((f) => ({ ...f, categoryId: String(cat.id) }))}
                    className="accent-amber-400"
                  />
                  <span className="text-sm text-white/80">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white/80">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      active
                        ? "bg-amber-400 text-black"
                        : "bg-white/10 text-white/60 hover:bg-white/15"
                    }`}
                  >
                    {active ? "✓ " : "# "}{tag.name}
                  </button>
                );
              })}
            </div>
            {selectedTags.length > 0 && (
              <p className="text-xs text-white/30">{selectedTags.length} tag{selectedTags.length > 1 ? "s" : ""} sélectionné{selectedTags.length > 1 ? "s" : ""}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
