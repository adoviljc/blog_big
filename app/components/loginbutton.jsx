"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();
  
  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">Bienvenue {session.user?.name}</span>
        <button
          onClick={() => signOut( { callbackUrl: "/" })}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Déconnexion
        </button>
      </div>
    );
  }
  
  return (
    <button onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
  Se connecter avec GitHub
</button>
  );
}