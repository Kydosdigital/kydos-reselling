import Link from "next/link";
import { accessibleLessons, canAccessTier, modules, tierLabels, type Tier } from "@/lib/programme-data";
import { getActiveEnrolment, requireAcademyContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { daysRemaining, getLaunchReadiness } from "@/lib/academy-rules";

export const dynamic = "force-dynamic";

export default async function PortalDashboard() {
  const { academyUser } = await requireAcademyContext();
  const sql = getSql();

  const [enrolment, progress, tasks, intakeRows] = await Promise.all([
    getActiveEnrolment(academyUser.id),
    sql.query("select lesson_id from lesson_progress where user_id = $1", [academyUser.id]),
    sql.query("select status from implementation_tasks where user_id = $1", [academyUser.id]),
    sql.query("select user_id, company_status, domain_status, website_status, crm_status, team_status, acquisition_readiness from participant_intake where user_id = $1 limit 1", [academyUser.id])
  ]);

  if (!enrolment) {
    return (
      <section className="panel card">
        <span className="pill">Access pending</span>
        <h1>Your Academy account is ready.</h1>
        <p className="muted">Your programme enrolment has not been activated yet. If you have already paid, contact Support@kydosdigital.com and we will check your account.</p>
      </section>
    );
  }

  const tier = enrolment.tier as Tier;
  const allAccessible = accessibleLessons(tier);
  const completed = new Set(progress.map((p) => String(p.lesson_id)));
  const completeCount = allAccessible.filter((lesson) => completed.has(lesson.id)).length;
  const percent = allAccessible.length ? Math.round((completeCount / allAccessible.length) * 100) : 0;
  const firstName = academyUser.full_name?.split(" ")[0] || academyUser.email.split("@")[0] || "there";
  const nextLesson = allAccessible.find((lesson) => !completed.has(lesson.id));
  const nextModule = nextLesson
    ? modules.find((module) => module.lessons.some((lesson) => lesson.id === nextLesson.id))
    : null;
  const waitingOnYou = tasks.filter((task) => String(task.status) === "waiting_participant").length;
  const openTasks = tasks.filter((task) => String(task.status) !== "complete").length;
  const supportDays = daysRemaining(enrolment.support_end);
  const hasIntake = intakeRows.length > 0;
  const readiness = getLaunchReadiness((intakeRows[0] as Record<string, any> | undefined) || null);

  return (
    <>
      <div className="portal-top">
        <div>
          <span className="pill">{tierLabels[tier]}</span>
          <h1>Welcome back, {firstName}.</h1>
          <p className="muted">Keep moving through the build in order. The goal is a working agency, not completed lessons.</p>
        </div>
      </div>

      <div className="portal-stat-grid">
        <section className="portal-stat card">
          <small>Programme progress</small>
          <strong>{percent}%</strong>
          <span>{completeCount} of {allAccessible.length} lessons complete</span>
        </section>
        <section className="portal-stat card">
          <small>Support</small>
          <strong>{supportDays === null ? (tier === "dfy" ? "Handover" : "Pending") : supportDays}</strong>
          <span>{supportDays === null ? (tier === "dfy" ? "90 days starts after formal handover" : "Support date being set") : "days remaining in active support"}</span>
        </section>
        <section className="portal-stat card">
          <small>Implementation</small>
          <strong>{openTasks}</strong>
          <span>{waitingOnYou ? waitingOnYou + " waiting on you" : "open implementation tasks"}</span>
        </section>
        <section className="portal-stat card">
          <small>Launch readiness</small>
          <strong>{hasIntake ? readiness.percent + "%" : "Needed"}</strong>
          <span>{hasIntake ? readiness.stage : "Complete your intake to calculate readiness"}</span>
        </section>
      </div>

      {nextLesson && nextModule ? (
        <section className="next-step-card card">
          <div>
            <span className="eyebrow">Recommended next step</span>
            <small>Module {nextModule.number} · {nextModule.title}</small>
            <h2>{nextLesson.title}</h2>
            <p>{nextLesson.description}</p>
          </div>
          <Link className="btn btn-primary" href={"/portal/lesson/" + nextLesson.id}>Continue programme</Link>
        </section>
      ) : (
        <section className="next-step-card card">
          <div>
            <span className="eyebrow">Programme complete</span>
            <h2>You have marked every lesson in your tier complete.</h2>
            <p>Use the implementation board and your operating systems to keep the agency moving.</p>
          </div>
          <Link className="btn btn-primary" href="/portal/implementation">Open implementation board</Link>
        </section>
      )}

      {!hasIntake ? (
        <div className="notice portal-action-notice">
          Your participant intake has not been saved yet. <Link href="/portal/intake">Complete your intake →</Link>
        </div>
      ) : null}

      {waitingOnYou > 0 ? (
        <div className="notice portal-action-notice">
          {waitingOnYou} implementation {waitingOnYou === 1 ? "item is" : "items are"} waiting on you. <Link href="/portal/implementation">Review tasks →</Link>
        </div>
      ) : null}

      <section style={{ marginTop: 34 }}>
        <div className="portal-section-heading">
          <div>
            <span className="eyebrow">Programme library</span>
            <h2>Your modules</h2>
          </div>
          <div className="portal-heading-actions">
            <Link className="btn" href="/portal/launch">Launch plan</Link>
            <Link className="btn" href="/portal/downloads">View all downloads</Link>
          </div>
        </div>
        <div className="module-grid">
          {modules.map((module) => {
            const accessible = module.lessons.filter((lesson) => canAccessTier(tier, lesson.minimumTier));
            const moduleComplete = accessible.filter((lesson) => completed.has(lesson.id)).length;
            const locked = accessible.length === 0;
            const modulePercent = accessible.length ? Math.round((moduleComplete / accessible.length) * 100) : 0;
            return (
              <Link href={locked ? "#" : "/portal/module/" + module.slug} className={"module-card card" + (locked ? " module-locked" : "")} key={module.slug} aria-disabled={locked}>
                <div className="module-card-top">
                  <small>Module {String(module.number).padStart(2, "0")}</small>
                  <span>{locked ? "Locked" : modulePercent + "%"}</span>
                </div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                {!locked ? (
                  <>
                    <div className="progress-track module-progress" role="progressbar" aria-label={module.title + " completion"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={modulePercent}>
                      <div className="progress-bar" style={{ width: modulePercent + "%" }} />
                    </div>
                    <small>{moduleComplete}/{accessible.length} complete</small>
                  </>
                ) : <small>Not included in your tier</small>}
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
