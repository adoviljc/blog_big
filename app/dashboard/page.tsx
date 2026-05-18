// app/dashboard/page.tsx

import Link from "next/link";
import { db } from "../lib/prisma"
import getStats from "../utils/getStats";
//import { requireRole } from "../lib/auth-utils";



export default async function DashboardPage() {

  // const session = await requireRole("ADMIN"); // redirige si pas ADMIN
  
  const { posts, categories, tags } = await getStats(); 

  const totalPublished = posts.filter((p: { published: boolean }) => p.published).length;

  const stats = [
    { label: "Articles", value: posts.length, sub: `${totalPublished} publiés`, href: "/dashboard/posts", color: "bg-amber-400 text-black" },
    { label: "Catégories", value: categories.length, sub: "au total", href: "/dashboard/categories", color: "bg-white/10 text-white" },
    { label: "Tags", value: tags.length, sub: "au total", href: "/dashboard/tags", color: "bg-white/10 text-white" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vue d'ensemble</h1>
        <p className="text-white/40 text-sm mt-1">Bienvenue dans votre espace d'administration</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-xl p-6 ${s.color} hover:scale-[1.02] transition-transform`}
          >
            <p className="text-4xl font-bold">{s.value}</p>
            <p className="text-lg font-semibold mt-1">{s.label}</p>
            <p className="text-sm opacity-60 mt-0.5">{s.sub}</p>
          </Link>
        ))}
      </div>

      {/* Derniers articles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white/80">Derniers articles</h2>
          <Link href="/dashboard/articles" className="text-sm text-amber-400 hover:underline">
            Voir tout →
          </Link>
        </div>
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left px-4 py-3 text-white/40 font-medium">Titre</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Catégorie</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Statut</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>


              
              {posts.map((post: any, i: number) => (
                <tr key={post.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === posts.length - 1 ? "border-0" : ""}`}>
                  <td className="px-4 py-3 font-medium truncate max-w-200px">{post.title}</td>
                  <td className="px-4 py-3 text-white/50">{post.category.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.published ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"}`}>
                      {post.published ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/40">
                    {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}






            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
