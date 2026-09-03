import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { blogArticles, getBlogArticle } from "@/lib/blog-data";

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) return {};
  return {
    title: article.seoTitle,
    description: article.description,
    authors: [{ name: "Kydos Digital" }],
    creator: "Kydos Digital",
    publisher: "KYDOS DIGITAL LTD",
    alternates: { canonical: "/blog/" + article.slug },
    openGraph: {
      type: "article",
      title: article.seoTitle,
      description: article.description,
      url: "/blog/" + article.slug,
      publishedTime: article.published,
      modifiedTime: article.updated,
      authors: ["Kydos Digital"],
      images: [{ url: article.image, alt: article.imageAlt }]
    },
    twitter: { card: "summary_large_image", title: article.seoTitle, description: article.description, images: [article.image] }
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  const html = marked.parse(article.body) as string;
  const articleUrl = "https://academy.kydosdigital.com/blog/" + article.slug;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.description,
      image: article.image,
      datePublished: article.published,
      dateModified: article.updated,
      mainEntityOfPage: articleUrl,
      author: { "@type": "Organization", "@id": "https://kydosdigital.com/#organization", name: "Kydos Digital", url: "https://kydosdigital.com" },
      publisher: { "@type": "Organization", "@id": "https://kydosdigital.com/#organization", name: "KYDOS DIGITAL LTD", logo: { "@type": "ImageObject", url: "https://academy.kydosdigital.com/brand/kydos-academy-logo-primary.svg" } }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kydos Academy", item: "https://academy.kydosdigital.com/" },
        { "@type": "ListItem", position: 2, name: "Guides", item: "https://academy.kydosdigital.com/blog" },
        { "@type": "ListItem", position: 3, name: article.title, item: articleUrl }
      ]
    }
  ];

  const related = blogArticles.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <PublicHeader />
      <main>
        <article>
          <header className="blog-article-header">
            <div className="container blog-article-heading">
              <nav className="blog-breadcrumb" aria-label="Breadcrumb"><Link href="/">Kydos Academy</Link><span>›</span><Link href="/blog">Guides</Link><span>›</span><span>{article.category}</span></nav>
              <div className="blog-meta"><span>{article.category}</span><span>{article.readingTime}</span><span>Updated {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.updated + "T12:00:00Z"))}</span></div>
              <h1>{article.title}</h1>
              <p className="hero-copy">{article.description}</p>
              <div className="blog-author"><strong>Kydos Digital</strong><span>Agency operations team · Manchester, UK</span></div>
            </div>
            <div className="container blog-article-image-wrap"><img src={article.image} alt={article.imageAlt} className="blog-article-image" fetchPriority="high" /></div>
          </header>
          <div className="container blog-article-layout">
            <div className="blog-article-main">
              <div className="blog-prose" dangerouslySetInnerHTML={{ __html: html }} />
              <aside className="blog-sources card">
                <span className="eyebrow">Sources & further reading</span>
                <p>For legal, tax, company or employment decisions, use current official guidance and professional advice for your circumstances.</p>
                <ul>{article.sources.map((source) => <li key={source.href}><a href={source.href} rel="nofollow">{source.label} ↗</a></li>)}</ul>
              </aside>
            </div>
            <aside className="blog-article-sidebar">
              <div className="blog-cta-card card">
                <span className="pill">Kydos Academy</span>
                <h2>Want the complete agency operating system?</h2>
                <p>Get the templates, workflows, CRM structure, recruitment process and implementation support behind the guides.</p>
                <Link className="btn btn-primary" href="/compare">Compare plans</Link>
                <Link className="btn" href="/consultation">Book a consultation</Link>
              </div>
            </aside>
          </div>
        </article>
        <section className="section related-guides">
          <div className="container">
            <div className="portal-section-heading"><div><span className="eyebrow">Keep building</span><h2>Related agency guides</h2></div><Link className="btn" href="/blog">All guides</Link></div>
            <div className="related-blog-grid">
              {related.map((item) => <article className="card" key={item.slug}><span>{item.category}</span><h3><Link href={"/blog/" + item.slug}>{item.title}</Link></h3><p>{item.excerpt}</p><Link href={"/blog/" + item.slug}>Read guide →</Link></article>)}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
