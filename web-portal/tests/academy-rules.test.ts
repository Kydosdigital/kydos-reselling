import test from "node:test";
import assert from "node:assert/strict";
import { daysRemaining, getLaunchReadiness, supportEndForTier } from "../lib/academy-rules.ts";

test("Blueprint support lasts 56 days", () => {
  const from = new Date("2026-09-01T12:00:00Z");
  assert.equal(supportEndForTier("blueprint", from), "2026-10-27");
});

test("Build With Us support lasts 84 days", () => {
  const from = new Date("2026-09-01T12:00:00Z");
  assert.equal(supportEndForTier("build", from), "2026-11-24");
});

test("Done For You support begins after handover", () => {
  assert.equal(supportEndForTier("dfy", new Date("2026-09-01T12:00:00Z")), null);
});

test("launch readiness reaches 100 only when all six areas meet threshold", () => {
  const readiness = getLaunchReadiness({
    company_status: "incorporated",
    domain_status: "connected",
    website_status: "live",
    crm_status: "live",
    team_status: "launch_team_ready",
    acquisition_readiness: "ready_to_test"
  });
  assert.equal(readiness.percent, 100);
  assert.equal(readiness.stage, "Ready to launch");
  assert.equal(readiness.nextIncomplete, null);
});

test("launch readiness identifies the first incomplete area", () => {
  const readiness = getLaunchReadiness({
    company_status: "incorporated",
    domain_status: "chosen",
    website_status: "not_started",
    crm_status: "not_started",
    team_status: "not_started",
    acquisition_readiness: "not_ready"
  });
  assert.equal(readiness.completeCount, 1);
  assert.equal(readiness.nextIncomplete?.key, "domain");
});

test("daysRemaining never returns a negative number", () => {
  const now = new Date("2026-09-10T12:00:00Z");
  assert.equal(daysRemaining("2026-09-01", now), 0);
});
