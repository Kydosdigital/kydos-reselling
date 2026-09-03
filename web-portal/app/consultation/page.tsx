import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata: Metadata = {
  title: "Digital Marketing Agency Startup Consultation",
  description: "Book a Kydos Academy consultation to plan your UK digital marketing agency setup, budget, team, systems and implementation route.",
  alternates: { canonical: "/consultation" }
};

const consultationUrl =
  process.env.NEXT_PUBLIC_CONSULTATION_URL ||
  "mailto:Support@kydosdigital.com?subject=Kydos%20Academy%20Consultation";

export default function ConsultationPage() {
  return (
    <>
      <PublicHeader />

      <main>
        <section className="subpage-hero">
          <div className="container consultation-grid">
            <div>
              <span className="eyebrow">Agency consultation</span>
              <h1>Let’s work out what you actually need to build.</h1>
              <p className="hero-copy">
                The consultation is for understanding your starting point, budget, preferred operating model
                and which programme route makes sense. It is not a pressure call.
              </p>

              <div className="consultation-points">
                <div><span>01</span><p><strong>Your starting point</strong><br />Do you already have a company, name, website or any agency experience?</p></div>
                <div><span>02</span><p><strong>Your operating model</strong><br />Do you want to run delivery yourself initially or build towards a management structure?</p></div>
                <div><span>03</span><p><strong>Your implementation level</strong><br />Do you want the blueprint, active build support or the Done For You setup?</p></div>
                <div><span>04</span><p><strong>Your launch budget</strong><br />We will separate programme cost, staff, software and advertising so the numbers are clear.</p></div>
              </div>
            </div>

            <aside className="consultation-card card">
              <span className="pill">Speak to Kydos</span>
              <h2>Book your consultation</h2>
              <p>
                Choose a consultation time that suits you. If you would rather speak by email or WhatsApp first, contact the Manchester team directly.
              </p>
              <a className="btn btn-primary btn-large" href={consultationUrl}>Choose a consultation time</a>

              <div className="contact-divider"><span>or</span></div>

              <div className="direct-contact">
                <a href="mailto:Support@kydosdigital.com">
                  <small>Email</small>
                  <strong>Support@kydosdigital.com</strong>
                </a>
                <a href="https://wa.me/447860254271">
                  <small>WhatsApp</small>
                  <strong>+44 7860 254271</strong>
                </a>
              </div>

              <p className="small-print">
                Personal immigration advice is not provided on the programme consultation.
                Where relevant, Kydos can refer you to the appropriate regulated professional.
              </p>
            </aside>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container centred narrow">
            <span className="eyebrow">Before the call</span>
            <h2 style={{ marginTop: 14 }}>Three things worth thinking about first.</h2>
            <div className="precall-grid">
              <div className="card"><strong>Budget</strong><p>What can you realistically invest in the programme, team, software and initial acquisition?</p></div>
              <div className="card"><strong>Time</strong><p>How quickly can you respond to company, brand, website and recruitment decisions?</p></div>
              <div className="card"><strong>Ownership</strong><p>How involved do you want to be in daily agency operations once clients start coming in?</p></div>
            </div>
            <p className="muted" style={{ marginTop: 24 }}>
              Want to review the differences first? <Link href="/compare" style={{ color: "#b9f4ae", fontWeight: 800 }}>Compare all three plans.</Link>
            </p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
