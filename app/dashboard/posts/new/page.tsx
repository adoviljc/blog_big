// app/dashboard/articles/new
import { api } from "@/app/lib/api";

import NewArticleForm from "./NewArticleForm";
export default async function NewArticlePage() {
 

const [categories, tags] = await Promise.all([
    api.categories.getAll(),
    api.tags.getAll(),
  ]);

  return <NewArticleForm categories={categories} tags={tags} />;
}
