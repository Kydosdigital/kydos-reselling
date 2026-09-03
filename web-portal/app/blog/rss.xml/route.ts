import { blogArticles } from "@/lib/blog-data";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[char] || char));
}

export async function GET() {
  const base = "https://academy.kydosdigital.com";
  const items = blogArticles.map((article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${base}/blog/${article.slug}</link>
      <guid>${base}/blog/${article.slug}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${new Date(article.published + "T12:00:00Z").toUTCString()}</pubDate>
    </item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Kydos Academy Guides</title><link>${base}/blog</link><description>Practical guides for starting and operating a UK digital marketing agency.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
