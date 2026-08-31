import Link from "next/link";
import { notFound } from "next/navigation";
import { createCheckoutSession } from "./actions";

const plans = {
  blueprint: {
    label: "Blueprint",
    price: "£2,500",
    support: "8 weeks standard WhatsApp support"
  },
  build: {
    label: "Build With Us",
    price: "£5,000",
    support: "12 weeks priority implementation support"
  },
  dfy: {
    label: "Done For You",
    price: "£10,000",
    support: "Build support plus 90 days after formal handover"
  }
} as const;

export default async function EnrolPage({
  params,
  searchParams
}: {
  params: Promise<{ tier: string }>;
  searchParams: Promise<{ error?: string; checkout?: string }>;
}) {
  const { tier } = await params;
  const query = await searchParams;

  if (!(tier in plans)) notFound();

  const plan = plans[tier as keyof typeof plans];
  const live = process.env.ENABLE_LIVE_CHECKOUT === "true";

  return (
    <main className="auth-wrap">
      <section className="auth-card card" style={{ width: "min(720px, 100%)" }}>
        <Link href="/" className="brand">
          <span className="brand-mark" />
          <span>Kydos Digital</span>
        </Link>

        <div style={{ marginTop: 28 }}>
          <span className="pill">{plan.label}</span>
          <h2 style={{ marginTop: 12 }}>{plan.price}</h2>
          <p className="muted">{plan.support}</p>
        </div>

        {!live ? (
          <div className="notice" style={{ marginBottom: 18 }}>
            Checkout is prepared but not yet live. Kydos will enable payment only after the programme contract and checkout consent wording have completed legal review.
          </div>
        ) : null}

        {query.error === "consent" ? <div className="notice">Please complete all required consent boxes before continuing.</div> : null}
        {query.error === "details" ? <div className="notice">Please provide your full name and email address.</div> : null}
        {query.checkout === "cancelled" ? <div className="notice">Checkout was cancelled. No payment was taken.</div> : null}

        <form action={createCheckoutSession}>
          <input type="hidden" name="tier" value={tier} />

          <div className="form-grid">
            <div className="field">
              <label>Full name</label>
              <input name="fullName" required />
            </div>

            <div className="field">
              <label>Email address</label>
              <input name="email" type="email" required />
            </div>
          </div>

          <div className="consent-list">
            <label className="consent">
              <input type="checkbox" name="termsAccepted" required />
              <span>
                I have read and agree to the Programme Participant Agreement, Terms and Conditions and Refund and Cancellation Policy.
              </span>
            </label>

            <label className="consent">
              <input type="checkbox" name="digitalContentConsent" required />
              <span>
                I expressly request immediate access to the digital programme materials before the end of any applicable cancellation period and understand the effect this may have on the applicable right to cancel digital-content supply.
              </span>
            </label>

            <label className="consent">
              <input type="checkbox" name="earlyServiceStartConsent" required />
              <span>
                I expressly request Kydos Digital to begin the agreed support or implementation services before the end of any applicable cancellation period and understand that proportionate payment rules may apply if I validly cancel after services have started.
              </span>
            </label>
          </div>

          <p className="muted" style={{ fontSize: 13 }}>
            Review the current draft documents before launch:
            {" "}
            <Link href="/legal/terms" style={{ textDecoration: "underline" }}>Terms</Link>,
            {" "}
            <Link href="/legal/refunds" style={{ textDecoration: "underline" }}>Refunds</Link>
            {" "}and{" "}
            <Link href="/legal/privacy" style={{ textDecoration: "underline" }}>Privacy</Link>.
          </p>

          <button className="btn btn-primary" type="submit" disabled={!live} style={{ width: "100%", opacity: live ? 1 : .55 }}>
            Continue to secure payment
          </button>
        </form>
      </section>
    </main>
  );
}
