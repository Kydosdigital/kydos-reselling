import assert from "node:assert/strict";
import test from "node:test";
import { resolveCheckoutMode } from "../lib/stripe";

test("checkout is disabled by default", () => {
  assert.equal(resolveCheckoutMode({}), "disabled");
});

test("test checkout requires a Stripe test key", () => {
  assert.equal(
    resolveCheckoutMode({ ENABLE_TEST_CHECKOUT: "true", STRIPE_SECRET_KEY: "sk_test_example" }),
    "test"
  );
  assert.throws(
    () => resolveCheckoutMode({ ENABLE_TEST_CHECKOUT: "true", STRIPE_SECRET_KEY: "sk_live_example" }),
    /test-mode secret key/i
  );
});

test("live checkout requires an explicit live flag and live key", () => {
  assert.equal(
    resolveCheckoutMode({ ENABLE_LIVE_CHECKOUT: "true", STRIPE_SECRET_KEY: "sk_live_example" }),
    "live"
  );
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
