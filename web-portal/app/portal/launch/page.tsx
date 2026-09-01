import Link from "next/link";
import { requireAcademyContext, getActiveEnrolment } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { getLaunchReadiness } from "@/lib/academy-rules";
import { tierLabels, type Tier } from "@/lib/programme-data";

export const dynamic = "force-dynamic";

const valueLabels: Record<string, string> = {
  not_started: "Not started",
  name_chosen: "Name chosen",
  incorporated: "Company incorporated",
  already_trading: "Already trading",
  chosen: "Chosen",
  purchased: "Purchased",
  connected: "Connected",
  briefing: "Briefing / planning",
  in_build: "In build",
  live: "Live",
  selected: "Platform selected",
  configuring: "Being configured",
  recruiting: "Recruiting",
  partial: "Some roles filled",
  launch_team_ready: "Launch team ready",
  not_ready: "Not ready",
  building_capacity: "Building capacity",
  ready_to_test: "Ready to test",
  already_acquiring: "Already acquiring clients"
};

export default async function LaunchPlanPage() {
  const { academyUser } = await requireAcademyContext();
  const sql = getSql();
  const [enrolment, intakeRows] = await Promise.all([
    getActiveEnrolment(academyUser.id),
    sql.query("select company_status, domain_status, website_status, crm_status, team_status, acquisition_readiness, target_launch_date, startup_budget_gbp, services_focus from participant_intake where user_id = $1 limit 1", [academyUser.id])
  ]);

  if (!enrolment) return <div className="notice">Your programme enrolment is not active yet.</div>;

  const intake = intakeRows[0] as Record<string, any> | undefined;
  const readiness = getLaunchReadiness(intake);
  const tier = enrolment.tier as Tier;

  return (
    <>
      <div className="portal-top">
        <div>
          <span className="pill">{tierLabels[tier]}</span>
          <h1>Launch plan</h1>
          <p className="muted">A simple view of whether the agency infrastructure is actually ready to support client acquisition.</p>
        </div>
      </div>

      <section className="launch-readiness-hero card">
        <div>
          <span className="eyebrow">Launch readiness</span>
          <strong>{readiness.percent}%</strong>
          <p>{readiness.stage} · {readiness.completeCount} of {readiness.total} core launch areas ready</p>
          <div className="progress-track launch-progress"><div className="progress-bar" style={{ width: readiness.percent + "%" }} /></div>
        </div>
        <div className="launch-meta">
          <div><small>Target launch</small><strong>{intake?.target_launch_date || "Not set"}</strong></div>
          <div><small>Startup operating budget</small><strong>{intake?.startup_budget_gbp !== null && intake?.startup_budget_gbp !== undefined ? "£" + Number(intake.startup_budget_gbp).toLocaleString("en-GB") : "Not set"}</strong></div>
          <div><small>Service focus</small><strong>{intake?.services_focus || "Not set"}</strong></div>
        </div>
      </section>

      {!intake ? (
        <div className="notice" style={{ marginTop: 16 }}>
          Your launch plan has no intake data yet. <Link href="/portal/intake">Complete your intake first →</Link>
        </div>
      ) : null}

      <section className="launch-checklist">
        {readiness.checks.map((check, index) => (
          <article className={"launch-check card " + (check.complete ? "is-complete" : "")} key={check.key}>
            <div className="launch-check-index">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <div className="launch-check-title">
                <h2>{check.label}</h2>
                <span>{check.complete ? "Ready" : "Needs work"}</span>
              </div>
              <p className="launch-current">Current: {valueLabels[check.value] || check.value || "Not provided"}</p>
              {!check.complete ? <p>{check.nextAction}</p> : <p>This area meets the Academy's current launch-readiness threshold.</p>}
              <div className="launch-check-actions">
                <Link className="btn" href={"/portal/module/" + check.moduleSlug}>Open relevant module</Link>
                <Link className="btn" href="/portal/intake">Update intake</Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="notice launch-warning">
        A 100% readiness score means the six core operating areas have reached the Academy's minimum launch threshold. It does not guarantee client acquisition, revenue or profitability.
      </div>
    </>
  );
}
