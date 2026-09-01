"use server";

import { redirect } from "next/navigation";
import { createStripeClient, programmePrices, resolveCheckoutMode } from "@/lib/stripe";

const allowedTiers = ["blueprint","build","dfy"] as const;
type CheckoutTier = typeof allowedTiers[number];

export async function createCheckoutSession(formData: FormData) {
  const tier = String(formData.get("tier") || "") as CheckoutTier;
  const email = String(formData.get("email") || "").trim();
  const fullName = String(formData.get("fullName") || "").trim();
  const termsAccepted = formData.get("termsAccepted") === "on";
  const digitalContentConsent = formData.get("digitalContentConsent") === "on";
  const earlyServiceStartConsent = formData.get("earlyServiceStartConsent") === "on";

  if (!allowedTiers.includes(tier)) {
    throw new Error("Invalid programme tier.");
  }

  if (!email || !fullName || email.length > 320 || fullName.length > 200) {
    redirect("/enrol/" + tier + "?error=details");
  }

  if (!termsAccepted || !digitalContentConsent || !earlyServiceStartConsent) {
    redirect("/enrol/" + tier + "?error=consent");
  }

  const checkoutMode = resolveCheckoutMode();
  if (checkoutMode === "disabled") {
    redirect("/enrol/" + tier + "?checkout=disabled");
  }

  const priceId = programmePrices[tier];

  if (!priceId) {
    throw new Error("Stripe price is not configured for this programme tier.");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const stripe = createStripeClient();
  const consentTimestamp = new Date().toISOString();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: appUrl + "/purchase/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: appUrl + "/enrol/" + tier + "?checkout=cancelled",
    metadata: {
      programme_tier: tier,
      participant_name: fullName,
      checkout_mode: checkoutMode,
      terms_accepted: "true",
      digital_content_consent: "true",
      early_service_start_consent: "true",
      consent_timestamp: consentTimestamp
    },
    payment_intent_data: {
      metadata: {
        programme_tier: tier,
        participant_email: email,
        checkout_mode: checkoutMode
      }
    }
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  redirect(session.url);
}
