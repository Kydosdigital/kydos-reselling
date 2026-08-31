import Link from "next/link";

const consultationUrl =
  process.env.NEXT_PUBLIC_CONSULTATION_URL ||
  "mailto:Support@kydosdigital.com?subject=Kydos%20Agency%20Programme%20Consultation";

const plans = [
  {
    name: "Blueprint",
    price: "£2,500",
    description: "The complete Kydos agency operating system for someone who wants to build it themselves.",
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
    price: "£5,000",
    description: "The operating system plus hands-on implementation of your core agency infrastructure.",
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
    price: "£10,000",
    description: "Kydos establishes the core agency infrastructure, initial team and handover system.",
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

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand">
            <span className="brand-mark" />
            <span>Kydos Digital</span>
          </Link>
          <nav className="nav">
            <a href="#how">How it works</a>
            <a href="#plans">Plans</a>
            <a href="#faq">FAQ</a>
            <Link href="/login">Login</Link>
            <a className="btn btn-primary" href={consultationUrl}>Book a consultation</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow">Built from a real Manchester agency operating system</span>
              <h1>Build your own UK digital marketing agency in as little as 4 weeks.</h1>
              <p className="hero-copy">
                Start from zero with the systems behind Kydos Digital. Build the company, brand, website,
                CRM, sales process, team, client onboarding, fulfilment and operations in one structured programme.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href={consultationUrl}>Book a consultation</a>
                <a className="btn" href="#plans">Compare the three routes</a>
              </div>
            </div>

            <aside className="hero-card">
              <span className="pill">Agency operating system</span>
              <h3 style={{ fontSize: 26, marginBottom: 6 }}>You are not buying a list of videos.</h3>
              <p className="muted">
                You are building a company with the systems needed to sell, deliver, recruit, report and scale.
              </p>
              <div className="metric-row">
                <div className="metric"><strong>3</strong><span>ways to build</span></div>
                <div className="metric"><strong>12</strong><span>programme modules</span></div>
                <div className="metric"><strong>£300</strong><span>recommended starting Meta budget</span></div>
                <div className="metric"><strong>4 weeks</strong><span>core launch target</span></div>
              </div>
            </aside>
          </div>
        </section>

        <section id="how" className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">How it works</span>
              <h2 style={{ marginTop: 14 }}>From company setup to a working agency.</h2>
              <p>The programme follows the same operating logic Kydos uses to run real client work.</p>
            </div>
            <div className="steps">
              {[
                ["1", "Build the foundation", "Company, bank, accounting, brand, domain and website."],
                ["2", "Install the systems", "CRM, Stripe, sales pipeline, booking and lead automation."],
                ["3", "Build the team", "Account Manager, Creative, Sales Closer and Operations Manager where required."],
                ["4", "Launch acquisition", "Test the full lead journey, then launch the initial Meta campaign."]
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

        <section id="plans" className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Choose your build route</span>
              <h2 style={{ marginTop: 14 }}>Build it yourself, build it with us, or have us set up the core agency.</h2>
              <p>All programme fees are paid in full. Advertising spend and third-party provider costs are separate unless expressly included.</p>
            </div>
            <div className="pricing">
              {plans.map((plan) => (
                <article className={"price-card card" + (plan.featured ? " featured" : "")} key={plan.name}>
                  {plan.featured ? <span className="pill">Most hands-on</span> : null}
                  <h3 style={{ fontSize: 24 }}>{plan.name}</h3>
                  <div className="price">{plan.price}</div>
                  <div className="price-note">Full payment before access or implementation starts.</div>
                  <p className="muted">{plan.description}</p>
                  <ul className="feature-list">
                    {plan.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  <a className="btn btn-primary" style={{ width: "100%", marginTop: 26 }} href={consultationUrl}>
                    Discuss this route
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">FAQ</span>
              <h2 style={{ marginTop: 14 }}>The important questions before you start.</h2>
            </div>
            <div className="faq">
              {[
                ["Do I need digital marketing experience?", "No. The programme teaches the agency operating system. If you want to personally become a specialist media buyer or SEO practitioner, that is a separate skill path."],
                ["Will Kydos guarantee clients or revenue?", "No. Kydos provides the systems, implementation and support included in your tier. Commercial results depend on execution, market, offer, sales, budget and team performance."],
                ["Is the £300 Meta budget included?", "No. £300 is the recommended initial starting point for the agency's own acquisition campaign and is separate from the programme fee."],
                ["Does this guarantee a sponsor licence or visa?", "No. The programme builds a genuine business. Immigration questions are handled separately by a suitably regulated immigration adviser or solicitor."],
                ["Can I keep the templates?", "The commercial intention is broad lifetime access and commercial use rights, subject to the final programme agreement, template licence and third-party rights."]
              ].map(([q, a]) => (
                <article className="faq-item card" key={q}>
                  <h3>{q}</h3>
                  <p>{a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          KYDOS DIGITAL LTD · Manchester, United Kingdom · Support@kydosdigital.com
        </div>
      </footer>
    </>
  );
}
