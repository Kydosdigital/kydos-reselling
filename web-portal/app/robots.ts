import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const allowIndexing = process.env.NEXT_PUBLIC_ENABLE_INDEXING === "true";
  const base = (process.env.NEXT_PUBLIC_APP_URL || "https://academy.kydosdigital.com").replace(/\/$/, "");

  if (!allowIndexing) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: base + "/sitemap.xml"
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/portal/",
          "/api/",
          "/login",
          "/activate",
          "/access-pending",
          "/purchase/",
          "/enrol/"
        ]
      }
    ],
    sitemap: base + "/sitemap.xml"
  };
}
