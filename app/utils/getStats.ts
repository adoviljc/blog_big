import { error } from "console";



export default async function getStats() {
  // L'URL doit être absolue si c'est côté serveur, ou relative côté client
  const res = await fetch("http://localhost:3000/api/stats", {
    cache: "no-store" // Pour avoir les données fraîches
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des statistiques");
    
  }

  return res.json();
}