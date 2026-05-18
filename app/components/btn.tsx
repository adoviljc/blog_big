import { signOut } from "next-auth/react";

export default function Deconnexion() {

   
    return (<button
               onClick={() => signOut({ callbackUrl: "/login" })}
               className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
             >
               <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                 <polyline points="16 17 21 12 16 7" />
                 <line x1="21" y1="12" x2="9" y2="12" />
               </svg>
               Déconnexion
             </button>)
}