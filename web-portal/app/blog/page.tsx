import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { blogArticles } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Digital Marketing Agency Guides UK",
  description: "Practical guides on starting, pricing, staffing and operating a UK digital marketing agency, written from the Kydos Digital operating model.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Digital Marketing Agency Guides UK | Kydos Academy",
    description: "Practical guides for building and operating a UK digital marketing agency.",
    url: "/blog",
    type: "website"
  }
};

export default function BlogPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kydos Academy Digital Marketing Agency Guides",
    itemListElement: blogArticles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: "https://academy.kydosdigital.com/blog/" + article.slug,
      name: article.title
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <PublicHeader />
      <main>
        <section className="subpage-hero blog-hero">
          <div className="container narrow centred">
            <span className="eyebrow">Kydos Academy Guides</span>
            <h1>How to build and operate a UK digital marketing agency.</h1>
            <p className="hero-copy">
              Practical guidance on company setup, pricing, sales, staffing, delivery and client acquisition,
              based on the operating systems behind Kydos Digital.
            </p>
          </div>
        </section>
        <section className="section blog-index-section">
          <div className="container blog-grid">
            {blogArticles.map((article, index) => (
              <article className={"blog-card card" + (index === 0 ? " blog-card-featured" : "")} key={article.slug}>
                <Link href={"/blog/" + article.slug} className="blog-card-image-link" aria-label={article.title}>
                  <img src={article.image} alt={article.imageAlt} className="blog-card-image" loading={index === 0 ? "eager" : "lazy"} />
                </Link>
                <div className="blog-card-body">
                  <div className="blog-meta"><span>{article.category}</span><span>{article.readingTime}</span></div>
                  <h2><Link href={"/blog/" + article.slug}>{article.title}</Link></h2>
                  <p>{article.excerpt}</p>
                  <div className="blog-card-footer">
                    <span>Updated {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(article.updated + "T12:00:00Z"))}</span>
                    <Link href={"/blog/" + article.slug}>Read guide →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="final-cta">
          <div className="container final-cta-inner">
            <div><span className="eyebrow">Want more than articles?</span><h2 style={{ marginTop: 14 }}>Build the operating system with Kydos.</h2><p>The Academy turns the guidance into templates, processes, systems and implementation support.</p></div>
            <Link className="btn btn-primary btn-large" href="/compare">Compare the three routes</Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
