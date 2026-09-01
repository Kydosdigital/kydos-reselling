import Stripe from "stripe";
import { headers } from "next/headers";
import { createStripeClient } from "@/lib/stripe";
import { getSql } from "@/lib/db";
import { supportEndForTier } from "@/lib/academy";

export async function POST(request: Request) {
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) return new Response("Webhook not configured.", { status: 400 });

  const stripe = createStripeClient();
  const body = await request.text();
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(body, signature, webhookSecret); }
  catch { return new Response("Invalid webhook signature.", { status: 400 }); }

  if (event.type !== "checkout.session.completed") return Response.json({ received: true });

  const session = event.data.object as Stripe.Checkout.Session;
  const email = (session.customer_details?.email || session.customer_email || "").toLowerCase();
  const fullName = session.metadata?.participant_name || session.customer_details?.name || "";
  const tier = session.metadata?.programme_tier || "";
  if (!email || !["blueprint","build","dfy"].includes(tier)) return Response.json({ received: true, provisioning: "missing_data" });

  const sql = getSql();
  await sql.query(
    "insert into programme_orders (stripe_session_id, stripe_payment_intent_id, email, full_name, tier, amount_total, currency, terms_accepted, digital_content_consent, early_service_start_consent, consent_timestamp, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) on conflict (stripe_session_id) do update set stripe_payment_intent_id = excluded.stripe_payment_intent_id, amount_total = excluded.amount_total, status = excluded.status",
    [session.id, typeof session.payment_intent === "string" ? session.payment_intent : null, email, fullName, tier, session.amount_total, session.currency, session.metadata?.terms_accepted === "true", session.metadata?.digital_content_consent === "true", session.metadata?.early_service_start_consent === "true", session.metadata?.consent_timestamp || null, "paid"]
  );

  const users = await sql.query("select id from academy_users where lower(email) = lower($1) limit 1", [email]);
  if (!users.length) return Response.json({ received: true, provisioning: "pending_account_creation" });

  const userId = String(users[0].id);
  const existing = await sql.query("select id from enrolments where user_id = $1 and status = $2 limit 1", [userId, "active"]);
  if (!existing.length) {
    const start = new Date().toISOString().slice(0, 10);
    await sql.query("insert into enrolments (user_id, tier, status, programme_start, support_end) values ($1,$2,$3,$4,$5)", [userId, tier, "active", start, supportEndForTier(tier)]);
  }
  await sql.query("update programme_orders set user_id = $1, provisioned_at = now() where stripe_session_id = $2", [userId, session.id]);
  return Response.json({ received: true, provisioning: "complete" });
}
