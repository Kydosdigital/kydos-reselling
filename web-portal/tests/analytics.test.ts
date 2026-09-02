import test from "node:test";
import assert from "node:assert/strict";
import { completionPercent, daysSince, isLearningStalled, isRecentlyActive } from "../lib/analytics.ts";

test("completionPercent handles normal and empty totals", () => {
  assert.equal(completionPercent(12, 48), 25);
  assert.equal(completionPercent(0, 0), 0);
  assert.equal(completionPercent(60, 48), 100);
});

test("daysSince returns null for missing dates", () => {
  assert.equal(daysSince(null, new Date("2026-09-10T00:00:00Z")), null);
});

test("recent activity uses the requested rolling window", () => {
  const now = new Date("2026-09-10T12:00:00Z");
  assert.equal(isRecentlyActive("2026-09-05T12:00:00Z", 7, now), true);
  assert.equal(isRecentlyActive("2026-08-20T12:00:00Z", 7, now), false);
});

test("stalled learners require programme age and learning inactivity", () => {
  const now = new Date("2026-09-30T12:00:00Z");
  assert.equal(isLearningStalled({
    progressPercent: 40,
    programmeStart: "2026-09-01",
    latestLearningAt: "2026-09-10T10:00:00Z",
    now
  }), true);
  assert.equal(isLearningStalled({
    progressPercent: 40,
    programmeStart: "2026-09-01",
    latestLearningAt: "2026-09-25T10:00:00Z",
    now
  }), false);
  assert.equal(isLearningStalled({
    progressPercent: 100,
    programmeStart: "2026-08-01",
    latestLearningAt: "2026-08-10T10:00:00Z",
    now
  }), false);
});
