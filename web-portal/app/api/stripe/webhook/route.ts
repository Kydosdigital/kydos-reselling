import Stripe from "stripe";
import { headers } from "next/headers";
import { createStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function supportEndForTier(tier: string) {
  const start = new Date();

  if (tier === "blueprint") {
    const end = new Date(start);
    end.setDate(end.getDate() + 56);
    return isoDate(end);
  }

  if (tier === "build") {
    const end = new Date(start);
    end.setDate(end.getDate() + 84);
    return isoDate(end);
  }

  return null;
}

export async function POST(request: Request) {
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Response("Webhook not configured.", { status: 400 });
  }

  const stripe = createStripeClient();
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new Response("Invalid webhook signature.", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const email = session.customer_details?.email || session.customer_email;
  const fullName = session.metadata?.participant_name || session.customer_details?.name || "";
  const tier = session.metadata?.programme_tier || "";

  if (!email || !["blueprint","build","dfy"].includes(tier)) {
    return Response.json({ received: true, provisioning: "missing_data" });
  }

  const admin = createAdminClient();

  await admin.from("programme_orders").upsert({
    stripe_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
    email,
    full_name: fullName,
    tier,
    amount_total: session.amount_total,
    currency: session.currency,
    terms_accepted: session.metadata?.terms_accepted === "true",
    digital_content_consent: session.metadata?.digital_content_consent === "true",
    early_service_start_consent: session.metadata?.early_service_start_consent === "true",
    consent_timestamp: session.metadata?.consent_timestamp || null,
    status: "paid"
  }, { onConflict: "stripe_session_id" });

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  let userId = existingProfile?.id || null;

  if (!userId) {
    const { data: invite, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName }
    });

    if (!inviteError && invite.user) {
      userId = invite.user.id;
      await admin.from("profiles").upsert({
        id: userId,
        full_name: fullName,
        email,
        role: "student"
      });
    }
  }

  if (!userId) {
    return Response.json({ received: true, provisioning: "pending_manual_review" });
  }

  const { data: activeEnrolment } = await admin
    .from("enrolments")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (!activeEnrolment) {
    await admin.from("enrolments").insert({
      user_id: userId,
      tier,
      status: "active",
      programme_start: isoDate(new Date()),
      support_end: supportEndForTier(tier)
    });
  }

  await admin
    .from("programme_orders")
    .update({
      user_id: userId,
      provisioned_at: new Date().toISOString()
    })
    .eq("stripe_session_id", session.id);

  return Response.json({ received: true, provisioning: "complete" });
}
