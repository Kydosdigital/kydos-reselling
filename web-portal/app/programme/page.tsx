import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata: Metadata = {
  title: "Digital Marketing Agency Training Programme UK",
  description: "A practical UK digital marketing agency training programme covering company setup, pricing, CRM, sales, recruitment, delivery and client acquisition.",
  alternates: { canonical: "/programme" }
};

const phases = [
  {
    number: "01",
    title: "Set up the business properly",
    text: "Work through company formation, business banking, accounting, data protection, insurance and the essential records a UK agency needs."
  },
  {
    number: "02",
    title: "Create a credible brand and website",
    text: "Define the agency, secure the domain, set up professional email and build the website structure that prospective clients will actually see."
  },
  {
    number: "03",
    title: "Install your sales infrastructure",
    text: "Set up the CRM, pipeline, booking calendar, Stripe, lead notifications, follow-up and the sales process your closer will use."
  },
  {
    number: "04",
    title: "Build the minimum delivery team",
    text: "Recruit the Account Manager, Creative and Sales Closer before paid acquisition begins. Add an Operations Manager where the hands-off model requires one."
  },
  {
    number: "05",
    title: "Install client delivery systems",
    text: "Put onboarding, content planning, creative briefs, approvals, reporting, access management and quality control into one repeatable operating process."
  },
  {
    number: "06",
    title: "Launch client acquisition",
    text: "Test the lead journey from ad to CRM to salesperson, then start the initial Meta lead-generation campaign with a recommended £300 starting media budget."
  }
];

const systems = [
  "Company formation and compliance",
  "Banking, FreeAgent and accountant setup",
  "Agency naming and brand system",
  "Domain, business email and website",
  "CRM, Stripe and booking calendar",
  "Sales scripts and qualification",
  "Client onboarding and account access",
  "Social media delivery workflow",
  "Recruitment and staff onboarding",
  "Meta Ads, Google Ads, SEO and website SOPs",
  "Operations, QA and capacity management",
  "Reporting, retention and renewals",
  "Finance, margin and hiring calculators",
  "Optional business-readiness guidance"
];

export default function ProgrammePage() {
  return (
    <>
      <PublicHeader />

      <main>
        <section className="subpage-hero">
          <div className="container subpage-hero-grid">
            <div>
              <span className="eyebrow">The Kydos Academy programme</span>
              <h1>From an idea to an agency with systems behind it.</h1>
              <p className="hero-copy">
                The programme is structured around the order a real agency needs to be built:
                company first, then brand, sales infrastructure, team, client delivery and acquisition.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary btn-large" href="/compare">Compare the three routes</Link>
                <Link className="btn btn-large" href="/consultation">Book a consultation</Link>
              </div>
            </div>

            <div className="subpage-image-frame">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?cs=srgb&fm=jpg"
                alt="Business team working together around a table"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container">
            <div className="section-head centred">
              <span className="eyebrow">The build sequence</span>
              <h2 style={{ marginTop: 14 }}>Six stages that take you towards launch readiness.</h2>
              <p>
                Four weeks is the core launch target for a responsive participant and normal third-party processing.
                Eight-week and twelve-week pacing can be used where more time is needed.
              </p>
            </div>

            <div className="phase-grid">
              {phases.map((phase) => (
                <article className="phase-card card" key={phase.number}>
                  <span>{phase.number}</span>
                  <h3>{phase.title}</h3>
                  <p>{phase.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container programme-systems-grid">
            <div>
              <span className="eyebrow">What sits inside the system</span>
              <h2 style={{ marginTop: 14 }}>Not one skill. The whole agency operating model.</h2>
              <p className="hero-copy" style={{ fontSize: 17 }}>
                You do not need to personally become every specialist. The programme teaches you how the services fit together,
                what good delivery looks like, when to use contractors and how the owner keeps control of quality and margin.
              </p>
            </div>

            <div className="systems-list">
              {systems.map((item) => <div key={item}><span>✓</span>{item}</div>)}
            </div>
          </div>
        </section>

        <section className="section section-image-break">
          <div className="container image-break-grid">
            <div>
              <span className="eyebrow">Two ways to operate</span>
              <h2 style={{ marginTop: 14 }}>Run it yourself initially, or build towards a management layer.</h2>
              <p className="hero-copy" style={{ fontSize: 17 }}>
                The programme supports an owner-led model and a more hands-off structure where an Operations Manager
                runs daily delivery and reports back to the owner.
              </p>
            </div>
            <img
              src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?cs=srgb&fm=jpg"
              alt="Business professionals discussing work at a table"
              className="wide-story-image"
              loading="lazy"
            />
          </div>
        </section>

        <section className="final-cta">
          <div className="container final-cta-inner">
            <div>
              <span className="eyebrow">Choose how much help you want</span>
              <h2 style={{ marginTop: 14 }}>The operating system is the same. The implementation level changes.</h2>
              <p>Blueprint, Build With Us and Done For You are designed around how much of the setup you want Kydos to handle.</p>
            </div>
            <Link className="btn btn-primary btn-large" href="/compare">Compare all three plans</Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
