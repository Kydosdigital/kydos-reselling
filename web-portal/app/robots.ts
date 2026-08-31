import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const allowIndexing = process.env.NEXT_PUBLIC_ENABLE_INDEXING === "true";
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://kydosdigital.com";

  if (!allowIndexing) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }]
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: base.replace(/\/$/, "") + "/sitemap.xml"
  };
}
