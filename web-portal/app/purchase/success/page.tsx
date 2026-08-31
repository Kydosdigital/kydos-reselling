import Link from "next/link";
import { createStripeClient } from "@/lib/stripe";

export default async function PurchaseSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  let email = "";
  let tier = "";

  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = createStripeClient();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      email = session.customer_details?.email || session.customer_email || "";
      tier = session.metadata?.programme_tier || "";
    } catch {
    }
  }

  return (
    <main className="auth-wrap">
      <section className="auth-card card">
        <Link href="/" className="brand">
          <span className="brand-mark" />
          <span>Kydos Digital</span>
        </Link>

        <div style={{ marginTop: 28 }}>
          <span className="pill">Payment received</span>
          <h2 style={{ marginTop: 14 }}>Welcome to the programme.</h2>
          <p className="muted">
            {tier ? "Your " + tier + " enrolment has been received. " : ""}
            We are preparing your programme access now.
          </p>

          {email ? (
            <p className="muted">
              Check <strong style={{ color: "white" }}>{email}</strong> for your access invitation and onboarding instructions.
            </p>
          ) : null}

          <div className="notice">
            If your access email does not arrive shortly, contact Support@kydosdigital.com and include the email address used at checkout.
          </div>
        </div>
      </section>
    </main>
  );
}
