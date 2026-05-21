// components/SimpleCategoryDropdown.tsx
"use client";

import { useState } from "react";

export function SimpleCategoryDropdown({ categories, value, onChange }: any) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleCreate = async () => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName }),
    });
    
    if (res.ok) {
      const category = await res.json();
      onChange(category.id);
      setIsCreating(false);
      setNewCategoryName("");
      // Recharger la page ou mettre à jour la liste
      window.location.reload();
    }
  };

  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <option value="">Sélectionner une catégorie</option>
        {categories.map((cat: any) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {!isCreating ? (
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="text-sm text-amber-600 hover:text-amber-700"
        >
          + Créer une nouvelle catégorie
        </button>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nom de la catégorie"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1 px-3 py-1 text-sm border border-stone-200 rounded-md"
            autoFocus
          />
          <button
            onClick={handleCreate}
            className="px-3 py-1 text-sm bg-amber-600 text-white rounded-md"
          >
            Créer
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className="px-3 py-1 text-sm border border-stone-200 rounded-md"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}