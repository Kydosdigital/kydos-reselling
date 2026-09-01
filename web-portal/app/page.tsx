import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata: Metadata = {
  title: "Build Your UK Digital Marketing Agency",
  description: "Build a structured UK digital marketing agency with the company, brand, website, CRM, sales, team and delivery systems behind Kydos Digital.",
  alternates: { canonical: "/" }
};

const consultationUrl =
  process.env.NEXT_PUBLIC_CONSULTATION_URL ||
  "/consultation";

const plans = [
  {
    name: "Blueprint",
    slug: "blueprint",
    price: "£2,500",
    kicker: "Build it yourself",
    description: "The complete Kydos agency operating system for someone who wants the playbook, templates and support, then wants to implement the business themselves.",
    features: [
      "Complete agency launch roadmap",
      "Company, finance and compliance guides",
      "CRM and sales system",
      "Client onboarding and fulfilment SOPs",
      "Recruitment system and templates",
      "Specialist-service operating guides",
      "8 weeks standard WhatsApp support",
      "Lifetime programme-material access"
    ]
  },
  {
    name: "Build With Us",
    slug: "build",
    price: "£5,000",
    kicker: "Build it with Kydos",
    description: "The operating system plus hands-on implementation of the core infrastructure you need to look, sell and operate like a real agency.",
    featured: true,
    features: [
      "Everything in Blueprint",
      "Logo and basic brand system created",
      "Standard five-page agency website built",
      "Branded CRM configured",
      "Stripe, pipeline and automations",
      "Initial recruitment support",
      "Initial Meta lead-generation setup",
      "12 weeks priority implementation support"
    ]
  },
  {
    name: "Done For You",
    slug: "dfy",
    price: "£10,000",
    kicker: "Have the core agency built for you",
    description: "Kydos establishes the core agency infrastructure, recruits the initial team, trains them and hands over an operating system you own.",
    features: [
      "Everything in Build With Us",
      "Account Manager recruitment",
      "Creative recruitment",
      "Sales Closer setup",
      "Operations Manager recruitment",
      "Initial team training",
      "Operations and owner dashboard setup",
      "90 days post-handover support"
    ]
  }
];

const buildItems = [
  ["Company", "Formation guidance, business banking, accounting and compliance foundation."],
  ["Brand", "Agency positioning, logo, colours, typography and professional identity."],
  ["Website", "A clear five-page agency site designed to turn interest into enquiries."],
  ["CRM", "Pipeline, booking, Stripe, lead notifications and follow-up automation."],
  ["Sales", "Qualification, scripts, objection handling, follow-up and closing process."],
  ["Team", "Account Manager, Creative, Sales Closer and Operations structure."],
  ["Delivery", "Client onboarding, content calendars, approvals, reporting and QA."],
  ["Growth", "Meta lead generation, retention, renewals, finance and capacity systems."]
];

export default function HomePage() {
  return (
    <>
      <PublicHeader />

      <main>
        <section className="hero hero-premium">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow">A practical agency build programme from Kydos Digital</span>
              <h1>Build a real UK digital marketing agency, not just another side hustle.</h1>
              <p className="hero-copy">
                Go from idea to an agency with the company, brand, website, CRM, sales process,
                team, client-delivery systems and acquisition infrastructure needed to operate professionally.
                The core launch plan can be completed in as little as 4 weeks.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary btn-large" href={consultationUrl}>Book your agency consultation</a>
                <Link className="btn btn-large" href="/compare">Compare the three ways to build</Link>
              </div>
              <div className="hero-proof">
                <div><strong>Manchester-based</strong><span>Kydos Digital team</span></div>
                <div><strong>3 build routes</strong><span>£2,500 · £5,000 · £10,000</span></div>
                <div><strong>Full operating system</strong><span>Sales to fulfilment</span></div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-frame">
                <img
                  src="https://images.pexels.com/photos/3931504/pexels-photo-3931504.jpeg?cs=srgb&fm=jpg"
                  alt="A diverse business team collaborating around a laptop in a modern office"
                  className="hero-photo"
                />
                <div className="image-shade" />
                <div className="hero-image-caption">
                  <small>Your agency build</small>
                  <strong>Company → Systems → Team → Clients</strong>
                </div>
              </div>

              <div className="floating-card floating-card-one">
                <span className="floating-icon">✓</span>
                <div>
                  <strong>CRM + sales pipeline</strong>
                  <small>Lead capture, follow-up and booking</small>
                </div>
              </div>

              <div className="floating-card floating-card-two">
                <span className="floating-icon">✓</span>
                <div>
                  <strong>Delivery team</strong>
                  <small>AM, Creative, Sales and Operations</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <div className="container trust-grid">
            <span>Company setup</span>
            <span>Professional website</span>
            <span>Branded CRM</span>
            <span>Sales process</span>
            <span>Team recruitment</span>
            <span>Client acquisition</span>
          </div>
        </section>

        <section id="what-you-build" className="section">
          <div className="container">
            <div className="section-head centred">
              <span className="eyebrow">What you are actually building</span>
              <h2 style={{ marginTop: 14 }}>Everything an agency needs to look credible and operate properly.</h2>
              <p>
                The programme is built around the things that normally take new agency owners months of trial and error to piece together.
              </p>
            </div>

            <div className="build-grid">
              {buildItems.map(([title, text], index) => (
                <article className="build-card" key={title}>
                  <span className="build-number">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container split-story">
            <div className="story-image-wrap">
              <img
                src="https://images.pexels.com/photos/5466236/pexels-photo-5466236.jpeg?cs=srgb&fm=jpg"
                alt="A diverse business team collaborating around a laptop in a bright modern office"
                className="story-image"
              />
              <div className="story-badge">
                <strong>Systems, not guesswork.</strong>
                <span>Built from the way a working digital agency actually runs.</span>
              </div>
            </div>

            <div className="story-copy">
              <span className="eyebrow">This is not a generic online course</span>
              <h2 style={{ marginTop: 14 }}>The point is to leave with an agency you can actually operate.</h2>
              <p>
                A lot of business courses stop at videos and motivation. This programme goes further.
                You get the operating documents, CRM structure, sales flow, hiring process, client onboarding,
                reporting framework and delivery systems needed to turn the idea into a functioning company.
              </p>

              <div className="story-points">
                <div><span>01</span><p><strong>Use real operating templates.</strong><br />Start with editable systems rather than a blank page.</p></div>
                <div><span>02</span><p><strong>Build before you advertise.</strong><br />Have the minimum team and delivery structure ready before leads arrive.</p></div>
                <div><span>03</span><p><strong>Know what to outsource.</strong><br />You do not need to personally become an SEO, PPC, design and development specialist.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="section">
          <div className="container">
            <div className="section-head centred">
              <span className="eyebrow">Your launch path</span>
              <h2 style={{ marginTop: 14 }}>A clear route from zero to launch-ready.</h2>
              <p>Move through the build in the order that reduces operational mistakes later.</p>
            </div>

            <div className="steps steps-premium">
              {[
                ["01", "Foundation", "Company, bank, accounting, compliance, name and business structure."],
                ["02", "Brand & systems", "Website, CRM, Stripe, booking, sales pipeline and lead follow-up."],
                ["03", "Team & delivery", "Recruit the core team and install the onboarding, content and QA workflow."],
                ["04", "Launch acquisition", "Test the full journey and start the initial Meta lead-generation campaign."]
              ].map(([n, title, text]) => (
                <article className="step card" key={n}>
                  <span className="step-num">{n}</span>
                  <h3>{title}</h3>
                  <p className="muted">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>


        <section className="section ownership-section">
          <div className="container ownership-grid">
            <div>
              <span className="eyebrow">Your agency, not ours</span>
              <h2 style={{ marginTop: 14 }}>You are building an independent company you control.</h2>
              <p className="hero-copy" style={{ fontSize: 17 }}>
                This is not a franchise and it is not a white-label client reselling scheme.
                Your company, brand, domain, website, clients and day-to-day commercial decisions belong to you.
                Kydos gives you the operating system, implementation support and the agreed build work for your tier.
              </p>
            </div>

            <div className="ownership-list">
              <div><span>01</span><strong>Your company</strong><p>Your own legal business and commercial identity.</p></div>
              <div><span>02</span><strong>Your brand</strong><p>Your own name, visual identity, website and positioning.</p></div>
              <div><span>03</span><strong>Your clients</strong><p>Your agency builds and owns its own client relationships.</p></div>
              <div><span>04</span><strong>Your operation</strong><p>Your team, CRM, processes and management structure.</p></div>
            </div>
          </div>
        </section>

        <section className="section section-image-break">
          <div className="container image-break-grid">
            <div>
              <span className="eyebrow">Build something that can grow beyond you</span>
              <h2 style={{ marginTop: 14 }}>The goal is not to create yourself another full-time job.</h2>
              <p className="hero-copy" style={{ fontSize: 17 }}>
                Start owner-led if that suits your budget, or build towards an Operations Manager structure
                where the team handles day-to-day delivery and you oversee the company.
              </p>
              <div className="mini-checks">
                <span>✓ Clear roles</span>
                <span>✓ Capacity tracking</span>
                <span>✓ Quality control</span>
                <span>✓ Owner reporting</span>
              </div>
            </div>

            <img
              src="https://images.pexels.com/photos/7988237/pexels-photo-7988237.jpeg?cs=srgb&fm=jpg"
              alt="A business team celebrating progress together in an office"
              className="wide-story-image"
            />
          </div>
        </section>

        <section id="plans" className="section">
          <div className="container">
            <div className="section-head centred">
              <span className="eyebrow">Choose your build route</span>
              <h2 style={{ marginTop: 14 }}>How much do you want Kydos to do for you?</h2>
              <p>
                Every route uses the same core operating system. The difference is how much implementation,
                recruitment and setup Kydos handles with you.
              </p>
            </div>

            <div className="pricing">
              {plans.map((plan) => (
                <article className={"price-card card" + (plan.featured ? " featured" : "")} key={plan.name}>
                  <div className="plan-topline">
                    <span className="plan-kicker">{plan.kicker}</span>
                    {plan.featured ? <span className="pill">Popular</span> : null}
                  </div>
                  <h3 style={{ fontSize: 25 }}>{plan.name}</h3>
                  <div className="price">{plan.price}</div>
                  <div className="price-note">Full payment before access or implementation starts.</div>
                  <p className="muted">{plan.description}</p>
                  <ul className="feature-list">
                    {plan.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  <div style={{ display: "grid", gap: 10, marginTop: 26 }}>
                    <a className="btn btn-primary" style={{ width: "100%" }} href={consultationUrl}>
                      Discuss this route
                    </a>
                    <Link className="btn" style={{ width: "100%" }} href={"/plans/" + plan.slug}>
                      See full plan details
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <p className="pricing-footnote">
              Advertising spend and third-party provider costs are separate unless expressly included in your written scope.
            </p>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container">
            <div className="section-head centred">
              <span className="eyebrow">Who this is for</span>
              <h2 style={{ marginTop: 14 }}>You do not need to already be a digital marketing expert.</h2>
            </div>

            <div className="audience-grid">
              <article className="audience-card card">
                <span className="audience-icon">01</span>
                <h3>You want to start properly</h3>
                <p>You are serious about building a company, not simply opening an Instagram page and hoping clients appear.</p>
              </article>
              <article className="audience-card card">
                <span className="audience-icon">02</span>
                <h3>You want structure</h3>
                <p>You want to know what to sell, how to price it, who to hire and how work should move through the agency.</p>
              </article>
              <article className="audience-card card">
                <span className="audience-icon">03</span>
                <h3>You want support</h3>
                <p>You want an experienced agency team available while you implement instead of working everything out alone.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="faq" className="section">
          <div className="container">
            <div className="section-head centred">
              <span className="eyebrow">Frequently asked questions</span>
              <h2 style={{ marginTop: 14 }}>Know exactly what you are buying.</h2>
            </div>

            <div className="faq faq-premium">
              {[
                ["Do I need digital marketing experience?", "No. The programme teaches the agency operating system. If you want to personally become a specialist media buyer, SEO practitioner or developer, that is a separate skill path."],
                ["Will Kydos guarantee clients or revenue?", "No. Kydos provides the systems, implementation and support included in your tier. Commercial results depend on execution, market, offer, sales, budget and team performance."],
                ["Is the £300 Meta budget included?", "No. £300 is the recommended initial starting point for the agency's own acquisition campaign and is separate from the programme fee."],
                ["Do I need staff before I start advertising?", "Yes. Our recommended minimum launch structure is an Account Manager, Creative and Sales Closer before paid lead generation starts, so the business can actually respond to and fulfil new work."],
                ["Do I personally have to fulfil Meta Ads, Google Ads and SEO?", "No. The core programme teaches you how to scope, sell, manage and quality-check specialist services. Those services can be fulfilled by competent specialist contractors."],
                ["Does this guarantee a sponsor licence or visa?", "No. The programme builds a genuine business. Immigration questions are handled separately by a suitably regulated immigration adviser or solicitor."],
                ["Can I keep and adapt the templates?", "The commercial intention is broad lifetime access and commercial use rights, subject to the final programme agreement, template licence and third-party rights."]
              ].map(([q, a]) => (
                <article className="faq-item card" key={q}>
                  <h3>{q}</h3>
                  <p>{a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="container final-cta-inner">
            <div>
              <span className="eyebrow">Ready to build?</span>
              <h2 style={{ marginTop: 14 }}>Start with a conversation about the agency you actually want.</h2>
              <p>
                We will talk through your starting point, budget, preferred operating model and which of the three build routes makes the most sense.
              </p>
            </div>
            <a className="btn btn-primary btn-large" href={consultationUrl}>Book your consultation</a>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
