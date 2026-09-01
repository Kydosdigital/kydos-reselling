import test from "node:test";
import assert from "node:assert/strict";
import { accessibleLessons, canAccessTier, modules } from "../lib/programme-data.ts";

test("Blueprint cannot access DFY-only lessons", () => {
  assert.equal(canAccessTier("blueprint", "dfy"), false);
});

test("Done For You can access every minimum tier", () => {
  assert.equal(canAccessTier("dfy", "blueprint"), true);
  assert.equal(canAccessTier("dfy", "build"), true);
  assert.equal(canAccessTier("dfy", "dfy"), true);
});

test("programme lesson IDs are unique", () => {
  const ids = modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));
  assert.equal(new Set(ids).size, ids.length);
});

test("module slugs are unique", () => {
  const slugs = modules.map((module) => module.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("DFY receives at least as many lessons as Blueprint", () => {
  assert.ok(accessibleLessons("dfy").length >= accessibleLessons("blueprint").length);
});
