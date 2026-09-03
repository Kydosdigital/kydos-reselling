import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { createStripeClient } from "@/lib/stripe";
import { publicPlans, type PublicPlanSlug } from "@/lib/public-plans";
import { activatePaidAccount } from "./actions";
import { maskEmail } from "@/lib/privacy";

export const dynamic = "force-dynamic";

const errorCopy: Record<string, string> = {
  setup: "Account activation is not available yet because the Academy backend is still being configured.",
  session: "The payment session is missing. Return to your payment confirmation page.",
  password: "Choose a password with at least 12 characters.",
  match: "The two password fields do not match.",
  payment: "We could not confirm a paid programme order for this activation link.",
  account: "We could not create this account automatically. Contact Kydos support and we will complete the activation.",
  email: "The email address does not match the paid programme order."
};


export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true }
};

export default async function ActivatePage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string; error?: string }>;
}) {
  const query = await searchParams;
  const sessionId = query.session_id || "";
  let email = "";
  let name = "";
  let tier = "";
  let paid = false;

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = createStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      email = session.customer_details?.email || session.customer_email || "";
      name = session.metadata?.participant_name || session.customer_details?.name || "";
      tier = session.metadata?.programme_tier || "";
      paid = session.payment_status === "paid";
    } catch {
    }
  }

  const plan = tier in publicPlans ? publicPlans[tier as PublicPlanSlug] : null;

  return (
    <main className="auth-wrap">
      <section className="auth-card card activation-card">
        <Link href="/" className="brand" aria-label="Kydos Academy home">
          <BrandLogo variant="light" className="academy-logo-auth" />
        </Link>

        <div style={{ marginTop: 28 }}>
          <span className="pill">Participant activation</span>
          <h2 style={{ marginTop: 14 }}>Create your Academy login.</h2>
          <p className="muted">
            {plan ? plan.name + " · " : ""}
            Use the email from your paid order and choose a secure password for your participant account.
          </p>
        </div>

        {query.error ? <div className="notice">{errorCopy[query.error] || "We could not complete activation. Please try again."}</div> : null}

        {!paid ? (
          <div className="notice">
            We cannot activate this account until a paid Stripe session is confirmed. If you have already paid, contact Support@kydosdigital.com.
          </div>
        ) : (
          <>
            <div className="activation-identity">
              <div><small>Name</small><strong>{name || "Participant"}</strong></div>
              <div><small>Login email</small><strong>{maskEmail(email)}</strong></div>
            </div>

            <form action={activatePaidAccount}>
              <input type="hidden" name="sessionId" value={sessionId} />
              <div className="field">
                <label htmlFor="emailConfirmation">Confirm the email used at checkout</label>
                <input id="emailConfirmation" name="emailConfirmation" type="email" autoComplete="email" required />
                <small className="muted">For security, enter the full email address used for the paid order.</small>
              </div>
              <div className="field">
                <label htmlFor="password">Create password</label>
                <input id="password" name="password" type="password" minLength={12} autoComplete="new-password" required />
                <small className="muted">Use at least 12 characters and do not reuse a password from another service.</small>
              </div>
              <div className="field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" minLength={12} autoComplete="new-password" required />
              </div>
              <button className="btn btn-primary btn-large" type="submit" style={{ width: "100%" }}>Activate my account</button>
            </form>
          </>
        )}

        <p className="muted" style={{ fontSize: 12, marginTop: 18 }}>
          Access is tied to the programme order and cannot be transferred to another email without Kydos approval.
        </p>
      </section>
    </main>
  );
}
