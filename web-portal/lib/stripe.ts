import Stripe from "stripe";

export type CheckoutMode = "disabled" | "test" | "live";

type CheckoutEnvironment = {
  ENABLE_TEST_CHECKOUT?: string;
  ENABLE_LIVE_CHECKOUT?: string;
  STRIPE_SECRET_KEY?: string;
};

function checkoutEnvironmentFromProcess(): CheckoutEnvironment {
  return {
    ENABLE_TEST_CHECKOUT: process.env.ENABLE_TEST_CHECKOUT,
    ENABLE_LIVE_CHECKOUT: process.env.ENABLE_LIVE_CHECKOUT,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
  };
}

export function resolveCheckoutMode(env: CheckoutEnvironment = checkoutEnvironmentFromProcess()): CheckoutMode {
  const testEnabled = env.ENABLE_TEST_CHECKOUT === "true";
  const liveEnabled = env.ENABLE_LIVE_CHECKOUT === "true";
  const secret = env.STRIPE_SECRET_KEY || "";

  if (testEnabled && liveEnabled) {
    throw new Error("Test and live checkout cannot be enabled at the same time.");
  }

  if (liveEnabled) {
    if (!secret.startsWith("sk_live_")) {
      throw new Error("Live checkout requires a Stripe live-mode secret key.");
    }
    return "live";
  }

  if (testEnabled) {
    if (!secret.startsWith("sk_test_")) {
      throw new Error("Test checkout requires a Stripe test-mode secret key.");
    }
    return "test";
  }

  return "disabled";
}

export function canProcessStripeEvent(livemode: boolean, env: CheckoutEnvironment = checkoutEnvironmentFromProcess()) {
  const mode = resolveCheckoutMode(env);
  if (mode === "disabled") return false;
  return (mode === "live" && livemode) || (mode === "test" && !livemode);
}

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
