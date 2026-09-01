import assert from "node:assert/strict";
import test from "node:test";
import { canProcessStripeEvent, resolveCheckoutMode } from "../lib/stripe.ts";

test("checkout is disabled by default", () => {
  assert.equal(resolveCheckoutMode({}), "disabled");
  assert.equal(canProcessStripeEvent(false, {}), false);
  assert.equal(canProcessStripeEvent(true, {}), false);
});

test("test checkout requires a Stripe test key", () => {
  const env = { ENABLE_TEST_CHECKOUT: "true", STRIPE_SECRET_KEY: "sk_test_example" };
  assert.equal(resolveCheckoutMode(env), "test");
  assert.equal(canProcessStripeEvent(false, env), true);
  assert.equal(canProcessStripeEvent(true, env), false);
  assert.throws(
    () => resolveCheckoutMode({ ENABLE_TEST_CHECKOUT: "true", STRIPE_SECRET_KEY: "sk_live_example" }),
    /test-mode secret key/i
  );
});

test("live checkout requires an explicit live flag and live key", () => {
  const env = { ENABLE_LIVE_CHECKOUT: "true", STRIPE_SECRET_KEY: "sk_live_example" };
  assert.equal(resolveCheckoutMode(env), "live");
  assert.equal(canProcessStripeEvent(true, env), true);
  assert.equal(canProcessStripeEvent(false, env), false);
  assert.throws(
    () => resolveCheckoutMode({ ENABLE_LIVE_CHECKOUT: "true", STRIPE_SECRET_KEY: "sk_test_example" }),
    /live-mode secret key/i
  );
});

test("test and live checkout cannot be enabled together", () => {
  assert.throws(
    () => resolveCheckoutMode({
      ENABLE_TEST_CHECKOUT: "true",
      ENABLE_LIVE_CHECKOUT: "true",
      STRIPE_SECRET_KEY: "sk_live_example"
    }),
    /cannot be enabled at the same time/i
  );
});
