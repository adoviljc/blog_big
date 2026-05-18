import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";


const adapter = new PrismaMariaDb({
  host:  "localhost",
  port:  3306,
  user: "root",
  password: "root",
  database:"blog_db",
  connectionLimit: 5,
});

const db = new PrismaClient({ adapter });

async function main() {
  // ─── Catégories ───────────────────────────────────────────────
  const techCategory = await db.category.upsert({
    where: { slug: "technologie" },
    update: {},
    create: { name: "Technologie", slug: "technologie" },
  });

  const cultureCategory = await db.category.upsert({
    where: { slug: "culture" },
    update: {},
    create: { name: "Culture", slug: "culture" },
  });

  // ─── Tags ─────────────────────────────────────────────────────
  const tagIA = await db.tag.upsert({
    where: { slug: "intelligence-artificielle" },
    update: {},
    create: { name: "Intelligence Artificielle", slug: "intelligence-artificielle" },
  });

  const tagWeb = await db.tag.upsert({
    where: { slug: "web" },
    update: {},
    create: { name: "Web", slug: "web" },
  });

  const tagSociete = await db.tag.upsert({
    where: { slug: "societe" },
    update: {},
    create: { name: "Société", slug: "societe" },
  });

  // ─── Auteur ───────────────────────────────────────────────────
  const auteur = await db.user.upsert({
    where: { email: "auteur@example.com" },
    update: {},
    create: {
      name: "Jean Dupont",
      email: "auteur@example.com",
      role: "ADMIN",
    },
  });

  // ─── Article 1 ────────────────────────────────────────────────
  const post1 = await db.post.upsert({
    where: { slug: "lavenir-de-lintelligence-artificielle" },
    update: {},
    create: {
      title: "L'avenir de l'Intelligence Artificielle",
      slug: "lavenir-de-lintelligence-artificielle",
      excerpt: "Découvrez comment l'IA transforme notre quotidien et ce que l'avenir nous réserve.",
      content: `
L'intelligence artificielle est en train de révolutionner tous les secteurs de notre société. 
Des soins de santé à l'éducation, en passant par les transports et le divertissement, 
l'IA s'impose comme une technologie incontournable du XXIe siècle.

Les modèles de langage comme GPT ou Claude permettent aujourd'hui de générer du texte, 
du code, et même des images avec une qualité impressionnante. 
Mais quels sont les enjeux éthiques de cette révolution technologique ?

Les experts s'accordent à dire que l'IA ne remplacera pas l'humain, 
mais transformera profondément la nature du travail. 
La clé sera d'apprendre à collaborer avec ces nouveaux outils.
      `.trim(),
      published: true,
      publishedAt: new Date("2025-01-15"),
      userId: auteur.id,
      categoryId: techCategory.id,
    },
  });

  // ─── Article 2 ────────────────────────────────────────────────
  const post2 = await db.post.upsert({
    where: { slug: "les-tendances-du-developpement-web-en-2025" },
    update: {},
    create: {
      title: "Les tendances du développement web en 2025",
      slug: "les-tendances-du-developpement-web-en-2025",
      excerpt: "Tour d'horizon des technologies et frameworks qui dominent le développement web cette année.",
      content: `
Le développement web évolue à une vitesse fulgurante. En 2025, plusieurs tendances 
se démarquent et redéfinissent la façon dont nous construisons des applications web.

Next.js continue de dominer le marché des frameworks React, avec ses fonctionnalités 
de rendu côté serveur et ses optimisations de performance. TypeScript est désormais 
incontournable pour tout projet sérieux.

Les bases de données comme Prisma ORM simplifient l'interaction avec les données, 
tandis que des outils comme Tailwind CSS révolutionnent le design. 
L'avenir du web s'annonce rapide, typé et accessible.
      `.trim(),
      published: true,
      publishedAt: new Date("2025-02-20"),
      userId: auteur.id,
      categoryId: techCategory.id,
    },
  });

  // ─── Article 3 ────────────────────────────────────────────────
  const post3 = await db.post.upsert({
    where: { slug: "impact-du-numerique-sur-la-culture-africaine" },
    update: {},
    create: {
      title: "L'impact du numérique sur la culture africaine",
      slug: "impact-du-numerique-sur-la-culture-africaine",
      excerpt: "Comment la révolution numérique transforme et enrichit les cultures africaines.",
      content: `
L'Afrique connaît une transformation numérique sans précédent. Avec plus d'un milliard 
d'habitants et une population majoritairement jeune, le continent est en train de devenir 
un acteur majeur de l'économie numérique mondiale.

Des startups comme Wave, Flutterwave ou M-Pesa révolutionnent les services financiers. 
Les créateurs de contenu africains conquièrent les réseaux sociaux mondiaux, 
diffusant leur culture à travers le monde entier.

Le Cameroun, comme beaucoup de pays africains, voit émerger une nouvelle génération 
de développeurs, d'entrepreneurs et d'artistes numériques qui réinventent 
leur identité culturelle à travers la technologie.
      `.trim(),
      published: true,
      publishedAt: new Date("2025-03-10"),
      userId: auteur.id,
      categoryId: cultureCategory.id,
    },
  });

  // ─── Tags des articles ────────────────────────────────────────
  await db.postTag.createMany({
    skipDuplicates: true,
    data: [
      { postId: post1.id, tagId: tagIA.id },
      { postId: post2.id, tagId: tagWeb.id },
      { postId: post3.id, tagId: tagSociete.id },
      { postId: post3.id, tagId: tagIA.id },
    ],
  });

  console.log("✅ Seed terminé avec succès !");
  console.log(`   - 2 catégories créées`);
  console.log(`   - 3 tags créés`);
  console.log(`   - 1 auteur créé`);
  console.log(`   - 3 articles créés`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });