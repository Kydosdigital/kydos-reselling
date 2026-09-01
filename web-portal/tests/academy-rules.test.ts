import test from "node:test";
import assert from "node:assert/strict";
import { canProvisionAcademyProfile, daysRemaining, getLaunchReadiness, getWeeklyCheckInSignal, mondayWeekStart, supportEndForTier } from "../lib/academy-rules.ts";

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

test("an allowlisted Kydos admin can be provisioned without a paid order", () => {
  assert.equal(canProvisionAcademyProfile({ isAdminEmail: true, paidOrderStatus: null }), true);
});

test("a paid participant can be provisioned", () => {
  assert.equal(canProvisionAcademyProfile({ isAdminEmail: false, paidOrderStatus: "paid" }), true);
});

test("an arbitrary Neon Auth signup cannot create an Academy profile", () => {
  assert.equal(canProvisionAcademyProfile({ isAdminEmail: false, paidOrderStatus: null }), false);
  assert.equal(canProvisionAcademyProfile({ isAdminEmail: false, paidOrderStatus: "refunded" }), false);
  assert.equal(canProvisionAcademyProfile({ isAdminEmail: false, paidOrderStatus: "disputed" }), false);
});

test("weekly check-ins consistently use Monday as the week start", () => {
  assert.equal(mondayWeekStart(new Date("2026-09-01T23:00:00Z")), "2026-08-31");
  assert.equal(mondayWeekStart(new Date("2026-09-06T12:00:00Z")), "2026-08-31");
  assert.equal(mondayWeekStart(new Date("2026-09-07T00:01:00Z")), "2026-09-07");
});

test("weekly check-in signal prioritises a missing current-week check-in", () => {
  assert.equal(getWeeklyCheckInSignal({
    latestWeekStart: "2026-08-24",
    currentWeekStart: "2026-08-31",
    supportNeeded: "Please review my CRM setup",
    confidence: 1
  }), "missing");
});

test("weekly check-in signal surfaces explicit support requests", () => {
  assert.equal(getWeeklyCheckInSignal({
    latestWeekStart: "2026-08-31",
    currentWeekStart: "2026-08-31",
    supportNeeded: "Please review my CRM setup",
    confidence: 4
  }), "support_requested");
});

test("weekly check-in signal surfaces low confidence when no support request is written", () => {
  assert.equal(getWeeklyCheckInSignal({
    latestWeekStart: "2026-08-31",
    currentWeekStart: "2026-08-31",
    supportNeeded: "",
    confidence: 2
  }), "low_confidence");
});

test("weekly check-in signal stays clear for a current healthy check-in", () => {
  assert.equal(getWeeklyCheckInSignal({
    latestWeekStart: "2026-08-31",
    currentWeekStart: "2026-08-31",
    supportNeeded: "",
    confidence: 4
  }), "clear");
});
