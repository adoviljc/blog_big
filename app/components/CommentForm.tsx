"use client";
import { useState } from "react";

export default function CommentForm({ postId }: { postId: number }) {
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content || !userId) return;
    setLoading(true);
    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, userId: Number(userId) }),
      });
      setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-stone-800">Laisser un commentaire</h3>
      <input
        type="number"
        placeholder="Votre ID utilisateur"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
      <textarea
        placeholder="Votre commentaire..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Envoi..." : "Publier"}
        </button>
        {success && <span className="text-sm text-green-600">Commentaire publié ✓</span>}
      </div>
    </form>
  );
}