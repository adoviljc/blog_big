"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Deconnexion from "./btn";



const links = [
  { href: "/dashboard", label: "dashboard" },
  { href: "/", label: "Articles / Blog" },
  { href: "/categories", label: "Catégories" },
  { href: "/tags", label: "Tags" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
      
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-stone-900">
          Mir<span className="text-amber-600">Blog</span>
        </Link>
        
       
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "bg-amber-50 text-amber-700"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
          
          
        </nav>
       
       
      </div>
    </header>
  );
}