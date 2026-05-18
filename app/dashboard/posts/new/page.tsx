// app/dashboard/articles/new/page.tsx

import NewArticleForm from "./NewArticleForm";

export default async function NewArticlePage() {
 


  const [categories, tags] = await Promise.all([
    fetch("http://localhost:3000/api/categories").then((res) => res.json()),
    fetch("http://localhost:3000/api/tags").then((res) => res.json()),
  ]);

  return <NewArticleForm categories={categories} tags={tags} />;
}
