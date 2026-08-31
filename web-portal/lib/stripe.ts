import Stripe from "stripe";

export function createStripeClient() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  return new Stripe(secret);
}

export const programmePrices = {
  blueprint: process.env.STRIPE_PRICE_BLUEPRINT,
  build: process.env.STRIPE_PRICE_BUILD,
  dfy: process.env.STRIPE_PRICE_DFY
} as const;
