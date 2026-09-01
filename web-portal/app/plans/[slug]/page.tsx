import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { publicPlans, type PublicPlanSlug } from "@/lib/public-plans";

export function generateStaticParams() {
  return Object.keys(publicPlans).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plan = publicPlans[slug as PublicPlanSlug];

  if (!plan) return {};

  return {
    title: plan.name + " Agency Programme",
    description: plan.strapline
  };
}

export default async function PlanPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plan = publicPlans[slug as PublicPlanSlug];

  if (!plan) notFound();

  return (
    <>
      <PublicHeader />

      <main>
        <section className="subpage-hero compact-hero">
          <div className="container plan-detail-hero">
            <div>
              <span className="eyebrow">Kydos Academy · {plan.name}</span>
              <h1>{plan.strapline}</h1>
              <p className="hero-copy">{plan.bestFor}</p>
              <div className="hero-actions">
                <Link className="btn btn-primary btn-large" href="/consultation">Discuss {plan.name}</Link>
                <Link className="btn btn-large" href="/compare">Compare all plans</Link>
              </div>
            </div>

            <aside className="plan-price-panel card">
              <small>Programme fee</small>
              <div className="price">{plan.price}</div>
              <p>Paid in full before access or implementation starts.</p>
              <div className="plan-support">{plan.support}</div>
            </aside>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container plan-detail-grid">
            <div>
              <span className="eyebrow">Included</span>
              <h2 style={{ marginTop: 14 }}>What you get with {plan.name}.</h2>
              <ul className="detail-check-list">
                {plan.included.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            <div>
              <span className="eyebrow eyebrow-neutral">Separate or outside standard scope</span>
              <h2 style={{ marginTop: 14 }}>What you should budget or plan for separately.</h2>
              <ul className="detail-separate-list">
                {plan.notIncluded.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container outcome-card card">
            <div>
              <span className="eyebrow">The intended outcome</span>
              <h2 style={{ marginTop: 14 }}>What this route is designed to leave you with.</h2>
            </div>
            <p>{plan.outcome}</p>
          </div>
        </section>

        <section className="final-cta">
          <div className="container final-cta-inner">
            <div>
              <span className="eyebrow">Next step</span>
              <h2 style={{ marginTop: 14 }}>Talk through whether {plan.name} matches your starting point.</h2>
              <p>We will look at what already exists, what still needs building and the operating model you want after launch.</p>
            </div>
            <Link className="btn btn-primary btn-large" href="/consultation">Book a consultation</Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
