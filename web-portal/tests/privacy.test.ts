import test from "node:test";
import assert from "node:assert/strict";
import { maskEmail } from "../lib/privacy.ts";

test("maskEmail hides most of the local part", () => {
  assert.equal(maskEmail("participant@example.com"), "p********@example.com");
});

test("maskEmail handles short local parts", () => {
  assert.equal(maskEmail("a@example.com"), "a***@example.com");
});

test("maskEmail returns empty string for invalid input", () => {
  assert.equal(maskEmail("not-an-email"), "");
});
