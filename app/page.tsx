import Link from "next/link";
import { db } from "./lib/prisma";


async function getStats() {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const [posts, categories, tags] = await Promise.all([
    fetch(`${base}/api/posts?published=true`).then(r => r.json()),
    fetch(`${base}/api/categories`).then(r => r.json()),
    fetch(`${base}/api/tags`).then(r => r.json()),
  ]);

  return { posts, categories, tags };
}



export default async function HomePage() {
  const { posts, categories, tags } = await getStats();
  
  const featured = posts?.slice(0, 3) ?? [];

  return (
         
    <div className="space-y-16">
      {/* Hero */}
      <section className="py-16 text-center space-y-4">
        <p className="text-amber-600 text-2xl font-medium tracking-widest uppercase">Bienvenue</p>
        <h1 className="font-display text-5xl font-bold text-stone-900 leading-tight">
          Idées, tutoriels <br /> & actualités événementiels
        </h1>
        <p className="text-stone-500 text-lg max-w-xl mx-auto">
        Des articles soignés pour vous aider à transformer vos moments en souvenir éternels.
        </p>
        <Link
          href="/posts"
          className="inline-block mt-4 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
        >
          Lire les articles →
        </Link>
      
      </section>

     

      {/* Articles récents */}
      <section>
        <h2 className="font-display text-2xl font-bold mb-6">Articles récents</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((post: any) => (
            <Link
              key={post.id}
              href={`/articles/${post.id}`}
              className="group bg-white border border-stone-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-md transition-all space-y-3"
            >
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                {post.category?.name}
              </span>
              <h3 className="font-display text-lg font-semibold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-stone-500 text-sm line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>{post.user?.name}</span>
                <span>{post._count?.comments} commentaires</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

       {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        {[
          { label: "Articles publiés", value: posts?.length ?? 0 },
          { label: "Catégories", value: categories?.length ?? 0 },
          { label: "Tags", value: tags?.length ?? 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-xl p-6 text-center">
            <p className="font-display text-4xl font-bold text-amber-600">{s.value}</p>
            <p className="text-stone-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </section>
        
    </div>
   
 );
}