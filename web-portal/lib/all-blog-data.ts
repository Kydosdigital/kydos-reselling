import { blogArticles as foundationBlogArticles, type BlogArticle } from "@/lib/blog-data";
import { growthBlogArticles } from "@/lib/blog-data-growth";

export type { BlogArticle } from "@/lib/blog-data";

export const blogArticles: BlogArticle[] = [
  ...foundationBlogArticles,
  ...growthBlogArticles
];

export function getBlogArticle(slug: string) {
  return blogArticles.find((article) => article.slug === slug);
}
