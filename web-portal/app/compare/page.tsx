import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata: Metadata = {
  title: "Compare Agency Build Plans",
  description: "Compare Blueprint, Build With Us and Done For You at Kydos Academy.",
  alternates: { canonical: "/compare" }
};

const rows = [
  ["Full programme library", "Included", "Included", "Included"],
  ["Agency setup guides & templates", "Included", "Included", "Included"],
  ["WhatsApp support", "8 weeks", "12 weeks priority", "Build period + 90 days after handover"],
  ["Logo & basic brand system created", "Guides only", "Kydos creates", "Kydos creates"],
  ["Standard five-page website", "Optional add-on", "Kydos builds", "Kydos builds"],
  ["Branded CRM configuration", "You configure", "Kydos configures", "Kydos configures"],
  ["Sales pipeline & automation setup", "Templates & guides", "Implemented with you", "Implemented for handover"],
  ["Account Manager recruitment", "Recruitment system", "Recruitment support", "Kydos recruits"],
  ["Creative recruitment", "Recruitment system", "Recruitment support", "Kydos recruits"],
  ["Sales Closer setup", "Recruitment system", "Recruitment support", "Kydos sets up"],
  ["Operations Manager", "Optional model guidance", "Optional", "Kydos recruits"],
  ["Initial team training", "Training materials", "Support as scoped", "Included"],
  ["Initial Meta lead-gen setup", "Guide", "Included", "Included"],
  ["Done-for-you operations handover", "No", "No", "Included"]
];

const plans = [
  {
    slug: "blueprint",
    name: "Blueprint",
    price: "£2,500",
    subtitle: "For the owner who wants the complete system and will implement it."
  },
  {
    slug: "build",
    name: "Build With Us",
    price: "£5,000",
    subtitle: "For the owner who wants Kydos actively building the core infrastructure with them.",
    featured: true
  },
  {
    slug: "dfy",
    name: "Done For You",
    price: "£10,000",
    subtitle: "For the owner who wants the core agency infrastructure and initial team set up for handover."
  }
];

export default function ComparePage() {
  return (
    <>
      <PublicHeader />

      <main>
        <section className="subpage-hero compact-hero">
          <div className="container centred narrow">
            <span className="eyebrow">Plan comparison</span>
            <h1>Same agency system. Three levels of implementation.</h1>
            <p className="hero-copy">
              Choose based on how much of the build you want to own personally and how much you want Kydos to implement.
            </p>
          </div>
        </section>

        <section className="section compare-section">
          <div className="container">
            <div className="compare-plan-cards">
              {plans.map((plan) => (
                <article className={"compare-plan card" + (plan.featured ? " featured" : "")} key={plan.slug}>
                  {plan.featured ? <span className="pill">Popular</span> : null}
                  <h2>{plan.name}</h2>
                  <div className="price">{plan.price}</div>
                  <p>{plan.subtitle}</p>
                  <div className="compare-plan-actions">
                    <Link className="btn btn-primary" href="/consultation">Discuss this route</Link>
                    <Link className="btn" href={"/plans/" + plan.slug}>Full plan details</Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="comparison-table-wrap card">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>What is included</th>
                    <th>Blueprint</th>
                    <th>Build With Us</th>
                    <th>Done For You</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row[0]}>
                      <td>{row[0]}</td>
                      <td>{row[1]}</td>
                      <td className="highlight-cell">{row[2]}</td>
                      <td>{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="compare-notes">
              <div className="notice">
                Programme fees are paid in full. Advertising spend, software/provider usage charges and professional third-party fees are separate unless your written scope expressly says otherwise.
              </div>
              <div className="notice">
                The four-week launch is a target, not a guarantee of third-party processing times, recruitment availability or commercial results.
              </div>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="container final-cta-inner">
            <div>
              <span className="eyebrow">Not sure which one fits?</span>
              <h2 style={{ marginTop: 14 }}>Start with the operating model you actually want.</h2>
              <p>We can talk through your budget, how hands-on you want to be and what is already in place.</p>
            </div>
            <Link className="btn btn-primary btn-large" href="/consultation">Book a consultation</Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
