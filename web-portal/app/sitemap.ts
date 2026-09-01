import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_APP_URL || "https://academy.kydosdigital.com").replace(/\/$/, "");

  const routes = [
    "",
    "/programme",
    "/compare",
    "/consultation",
    "/plans/blueprint",
    "/plans/build",
    "/plans/dfy"
  ];

  return routes.map((route, index) => ({
    url: base + route,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route === "/consultation" ? 0.9 : 0.8
  }));
}
