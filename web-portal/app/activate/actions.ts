"use server";

import { redirect } from "next/navigation";
import { getAuth, isNeonAuthConfigured } from "@/lib/auth/server";
import { getSql, isDatabaseConfigured } from "@/lib/db";
import { createStripeClient } from "@/lib/stripe";
import { supportEndForTier } from "@/lib/academy";

const allowedTiers = ["blueprint","build","dfy"] as const;

async function ensurePaidOrder(sessionId: string) {
  const stripe = createStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Payment is not confirmed.");
  }

  const email = (session.customer_details?.email || session.customer_email || "").trim().toLowerCase();
  const fullName = String(session.metadata?.participant_name || session.customer_details?.name || "").trim();
  const tier = String(session.metadata?.programme_tier || "");

  if (!email || !allowedTiers.includes(tier as (typeof allowedTiers)[number])) {
    throw new Error("The payment session is missing programme details.");
  }

  const sql = getSql();
  await sql.query(
    "insert into programme_orders (stripe_session_id, stripe_payment_intent_id, email, full_name, tier, amount_total, currency, terms_accepted, digital_content_consent, early_service_start_consent, consent_timestamp, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) on conflict (stripe_session_id) do update set stripe_payment_intent_id = excluded.stripe_payment_intent_id, amount_total = excluded.amount_total, currency = excluded.currency, status = excluded.status",
    [
      session.id,
      typeof session.payment_intent === "string" ? session.payment_intent : null,
      email,
      fullName,
      tier,
      session.amount_total,
      session.currency,
      session.metadata?.terms_accepted === "true",
      session.metadata?.digital_content_consent === "true",
      session.metadata?.early_service_start_consent === "true",
      session.metadata?.consent_timestamp || null,
      "paid"
    ]
  );

  return { sessionId: session.id, email, fullName, tier };
}

export async function activatePaidAccount(formData: FormData) {
  if (!isNeonAuthConfigured() || !isDatabaseConfigured() || !process.env.STRIPE_SECRET_KEY) {
    redirect("/activate?error=setup");
  }

  const sessionId = String(formData.get("sessionId") || "");
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!sessionId) redirect("/activate?error=session");
  if (password.length < 12) redirect("/activate?session_id=" + encodeURIComponent(sessionId) + "&error=password");
  if (password !== confirmPassword) redirect("/activate?session_id=" + encodeURIComponent(sessionId) + "&error=match");

  let order: Awaited<ReturnType<typeof ensurePaidOrder>>;
  try {
    order = await ensurePaidOrder(sessionId);
  } catch {
    redirect("/activate?session_id=" + encodeURIComponent(sessionId) + "&error=payment");
  }

  const sql = getSql();
  const orderRows = await sql.query(
    "select id, user_id, provisioned_at from programme_orders where stripe_session_id = $1 and status = 'paid' limit 1",
    [order.sessionId]
  );
  const programmeOrder = orderRows[0];

  if (programmeOrder?.provisioned_at && programmeOrder?.user_id) {
    redirect("/login?activated=existing");
  }

  const existing = await sql.query(
    "select id, auth_user_id from academy_users where lower(email) = lower($1) limit 1",
    [order.email]
  );

  let academyUserId = existing.length ? String(existing[0].id) : "";

  if (!academyUserId) {
    const created = await getAuth().signUp.email({
      email: order.email,
      password,
      name: order.fullName || order.email.split("@")[0]
    });

    if (created.error || !created.data?.user) {
      redirect("/activate?session_id=" + encodeURIComponent(sessionId) + "&error=account");
    }

    const userRows = await sql.query(
      "insert into academy_users (auth_user_id, email, full_name, role) values ($1,$2,$3,$4) returning id",
      [created.data.user.id, order.email, order.fullName || created.data.user.name || "Participant", "student"]
    );
    academyUserId = String(userRows[0].id);
  }

  const activeEnrolment = await sql.query(
    "select id from enrolments where user_id = $1 and status = 'active' limit 1",
    [academyUserId]
  );

  if (!activeEnrolment.length) {
    const start = new Date().toISOString().slice(0, 10);
    await sql.query(
      "insert into enrolments (user_id, tier, status, programme_start, support_end) values ($1,$2,$3,$4,$5)",
      [academyUserId, order.tier, "active", start, supportEndForTier(order.tier)]
    );
  }

  await sql.query(
    "update programme_orders set user_id = $1, provisioned_at = coalesce(provisioned_at, now()) where stripe_session_id = $2",
    [academyUserId, order.sessionId]
  );

  await sql.query(
    "insert into academy_audit_log (actor_user_id, action, target_type, target_id, details) values ($1,$2,$3,$4,$5::jsonb)",
    [academyUserId, "paid_account_activated", "academy_user", academyUserId, JSON.stringify({ tier: order.tier, stripeSessionId: order.sessionId })]
  );

  redirect("/login?activated=1");
}
