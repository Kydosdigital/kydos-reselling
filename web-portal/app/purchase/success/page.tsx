import Link from "next/link";
import { createStripeClient } from "@/lib/stripe";
import { publicPlans, type PublicPlanSlug } from "@/lib/public-plans";
import { maskEmail } from "@/lib/privacy";

export const dynamic = "force-dynamic";

export default async function PurchaseSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  let email = "";
  let tier = "";
  let paid = false;

  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = createStripeClient();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      email = session.customer_details?.email || session.customer_email || "";
      tier = session.metadata?.programme_tier || "";
      paid = session.payment_status === "paid";
    } catch {
    }
  }

  const plan = tier in publicPlans ? publicPlans[tier as PublicPlanSlug] : null;

  return (
    <main className="auth-wrap">
      <section className="auth-card card purchase-success-card">
        <Link href="/" className="brand">
          <span className="brand-mark" />
          <span>Kydos Academy</span>
        </Link>

        <div style={{ marginTop: 28 }}>
          <span className="pill">{paid ? "Payment received" : "Checkout complete"}</span>
          <h2 style={{ marginTop: 14 }}>{paid ? "Welcome to Kydos Academy." : "We are confirming your payment."}</h2>
          <p className="muted">
            {plan ? "Your " + plan.name + " enrolment has been received. " : ""}
            {paid ? "The next step is to create your secure participant account." : "Refresh this page shortly if payment confirmation is still processing."}
          </p>

          {email ? (
            <div className="purchase-email-box">
              <small>Programme email</small>
              <strong>{maskEmail(email)}</strong>
            </div>
          ) : null}

          {paid && session_id ? (
            <Link className="btn btn-primary btn-large" style={{ width: "100%", marginTop: 18 }} href={"/activate?session_id=" + encodeURIComponent(session_id)}>
              Create my Academy account
            </Link>
          ) : null}

          <div className="notice" style={{ marginTop: 18 }}>
            Keep this page private. Account activation is tied to the payment session and the email address used at checkout. If you need help, contact Support@kydosdigital.com.
          </div>
        </div>
      </section>
    </main>
  );
}
