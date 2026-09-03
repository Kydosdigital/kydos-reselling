import type { MetadataRoute } from "next";
import { blogArticles } from "@/lib/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_APP_URL || "https://academy.kydosdigital.com").replace(/\/$/, "");
  const today = new Date("2026-09-03T00:00:00Z");

  const routes = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/programme", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/compare", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/consultation", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/plans/blueprint", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/plans/build", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/plans/dfy", priority: 0.8, changeFrequency: "monthly" as const }
  ];

  const publicPages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: base + route.path,
    lastModified: today,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));

  const blogPages: MetadataRoute.Sitemap = blogArticles.map((article) => ({
    url: base + "/blog/" + article.slug,
    lastModified: new Date(article.updated + "T00:00:00Z"),
    changeFrequency: "monthly",
    priority: article.slug === "how-to-start-digital-marketing-agency-uk" ? 0.9 : 0.75
  }));

  return [...publicPages, ...blogPages];
}
