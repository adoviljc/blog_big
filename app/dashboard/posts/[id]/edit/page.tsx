"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    userId: "",
    categoryId: "",
    published: false,
    tagIds: [] as number[],
  });

  // Charger les données de l'article + catégories + tags en parallèle
  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch(`/api/posts/${id}`).then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      }),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/tags").then((r) => r.json()),
    ])
      .then(([post, cats, tgs]) => {
        setCategories(cats);
        setTags(tgs);
        setForm({
          title: post.title ?? "",
          slug: post.slug ?? "",
          content: post.content ?? "",
          excerpt: post.excerpt ?? "",
          userId: String(post.userId ?? ""),
          categoryId: String(post.categoryId ?? ""),
          published: post.published ?? false,
          tagIds: (post.tags ?? []).map((t: any) => t.id),
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setFetching(false));
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function toggleTag(tagId: number) {
    setForm((f) => ({
      ...f,
      tagIds: f.tagIds.includes(tagId)
        ? f.tagIds.filter((t) => t !== tagId)
        : [...f.tagIds, tagId],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          userId: Number(form.userId),
          categoryId: Number(form.categoryId),
        }),
      });
      if (res.ok) router.push("/posts");
    } finally {
      setLoading(false);
    }
  }

  // --- États de chargement / erreur ---

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-stone-400 text-sm animate-pulse">
          Chargement de l'article…
        </p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <p className="text-stone-700 font-medium">Article introuvable.</p>
        <button
          onClick={() => router.push("/posts")}
          className="text-sm text-amber-600 underline underline-offset-2"
        >
          Retour aux articles
        </button>
      </div>
    );
  }

  // --- Formulaire principal ---

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">
            Article #{id}
          </p>
          <h1 className="font-display text-3xl font-bold text-stone-900">
            Modifier l'article
          </h1>
        </div>

        {/* Badge statut courant */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            form.published
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-stone-100 text-stone-500 border-stone-200"
          }`}
        >
          {form.published ? "Publié" : "Brouillon"}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-stone-200 rounded-xl p-8 space-y-6"
      >
        {/* Titre + Slug */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <label className="text-sm font-medium text-stone-700">Titre</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Titre de l'article"
              className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-700">Slug</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              placeholder="mon-article"
              className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-700">
              ID Auteur
            </label>
            <input
              name="userId"
              type="number"
              value={form.userId}
              onChange={handleChange}
              required
              className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Extrait */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">Extrait</label>
          <input
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            placeholder="Courte description affichée dans les listes…"
            className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Contenu */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">Contenu</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={12}
            required
            className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
          <p className="text-xs text-stone-400 text-right">
            {form.content.length} caractères
          </p>
        </div>

        {/* Catégorie */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-stone-700">
            Catégorie
          </label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Choisir…</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((t: any) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTag(t.id)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  form.tagIds.includes(t.id)
                    ? "bg-amber-600 text-white border-amber-600"
                    : "border-stone-200 text-stone-600 hover:border-stone-400"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
          {form.tagIds.length > 0 && (
            <p className="text-xs text-stone-400">
              {form.tagIds.length} tag{form.tagIds.length > 1 ? "s" : ""}{" "}
              sélectionné{form.tagIds.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Publier */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm((f) => ({ ...f, published: e.target.checked }))
            }
            className="w-4 h-4 accent-amber-600"
          />
          <span className="text-sm text-stone-700">
            {form.published ? "Dépublier l'article" : "Publier l'article"}
          </span>
        </label>

        {/* Séparateur */}
        <div className="border-t border-stone-100" />

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Enregistrement…" : "Enregistrer les modifications"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-stone-200 text-stone-600 text-sm rounded-lg hover:bg-stone-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
