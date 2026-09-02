import Link from "next/link";
import { requireAdminContext } from "@/lib/academy";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminAttentionPage() {
  await requireAdminContext();
  const sql = getSql();

  const [overdueTasks, expiringSupport, unprovisionedOrders, missingIntake, checkInSignals, engagementRisks] = await Promise.all([
    sql.query(
      "select t.id, t.user_id, t.area, t.title, t.owner, t.status, t.due_date, u.full_name, u.email from implementation_tasks t join academy_users u on u.id = t.user_id where t.status <> 'complete' and t.due_date is not null and t.due_date < current_date order by t.due_date asc limit 100"
    ),
    sql.query(
      "select e.id, e.user_id, e.tier, e.support_end, u.full_name, u.email from enrolments e join academy_users u on u.id = e.user_id where e.status = 'active' and e.support_end is not null and e.support_end between current_date and current_date + interval '14 days' order by e.support_end asc limit 100"
    ),
    sql.query(
      "select id, email, full_name, tier, amount_total, currency, created_at from programme_orders where status = 'paid' and provisioned_at is null order by created_at asc limit 100"
    ),
    sql.query(
      "select u.id, u.full_name, u.email, e.tier, e.programme_start from academy_users u join enrolments e on e.user_id = u.id and e.status = 'active' left join participant_intake i on i.user_id = u.id where u.role = 'student' and i.user_id is null order by e.programme_start asc nulls first limit 100"
    ),
    sql.query(
      "select * from (select distinct on (c.user_id) c.id, c.user_id, c.week_start, c.blockers, c.support_needed, c.confidence, c.updated_at, u.full_name, u.email, e.tier from participant_weekly_checkins c join academy_users u on u.id = c.user_id join enrolments e on e.user_id = c.user_id and e.status = 'active' where c.week_start >= current_date - interval '14 days' order by c.user_id, c.week_start desc, c.updated_at desc) latest where coalesce(trim(latest.support_needed), '') <> '' or latest.confidence <= 2 order by latest.week_start desc limit 100"
    ),
    sql.query(
      "select u.id, u.full_name, u.email, u.last_login_at, u.last_seen_at, u.login_count, e.tier, e.programme_start from academy_users u join enrolments e on e.user_id = u.id and e.status = 'active' where u.role = 'student' and ((u.last_login_at is null and coalesce(e.programme_start, u.created_at::date) <= current_date - 2) or (u.last_seen_at is not null and u.last_seen_at < now() - interval '14 days')) order by u.last_seen_at asc nulls first, e.programme_start asc limit 100"
    )
  ]);

  const totalAttention = overdueTasks.length + expiringSupport.length + unprovisionedOrders.length + missingIntake.length + checkInSignals.length + engagementRisks.length;

  return (
    <main className="container admin-page">
      <div className="admin-task-breadcrumbs">
        <Link href="/admin">Programme operations</Link>
        <span>→</span>
        <strong>Attention queue</strong>
      </div>

      <div className="portal-top">
        <div>
          <span className="pill">Operations</span>
          <h1>Attention queue</h1>
          <p className="muted">The items most likely to need a Kydos team action next.</p>
        </div>
        <div className="admin-top-actions">
          <Link className="btn" href="/admin/analytics">Super Admin Analytics</Link>
          <Link className="btn" href="/admin/check-ins">Weekly check-ins</Link>
          <Link className="btn" href="/admin">Programme operations</Link>
        </div>
      </div>

      <div className="portal-stat-grid">
        <section className="portal-stat card"><small>Total attention items</small><strong>{totalAttention}</strong><span>Across current operational checks</span></section>
        <section className="portal-stat card"><small>Check-in signals</small><strong>{checkInSignals.length}</strong><span>Recent support requests or low confidence</span></section>
        <section className="portal-stat card"><small>Overdue tasks</small><strong>{overdueTasks.length}</strong><span>Open tasks past their due date</span></section>
        <section className="portal-stat card"><small>Activation / intake</small><strong>{unprovisionedOrders.length + missingIntake.length}</strong><span>Paid access or onboarding follow-up</span></section>
        <section className="portal-stat card"><small>Engagement risk</small><strong>{engagementRisks.length}</strong><span>Never logged in or inactive 14+ days</span></section>
      </div>

      <section className="attention-section">
        <div className="portal-section-heading"><div><span className="eyebrow">Engagement</span><h2>Participants who may be drifting</h2></div><Link className="btn" href="/admin/analytics?engagement=stalled">Open analytics</Link></div>
        {engagementRisks.length ? (
          <div className="attention-list">
            {engagementRisks.map((row) => (
              <article className="attention-row card" key={String(row.id)}>
                <div>
                  <small>{String(row.tier)} · {row.last_login_at ? "inactive" : "never logged in"}</small>
                  <strong>{String(row.full_name)}</strong>
                  <span>{row.last_login_at ? "Last seen " + String(row.last_seen_at || row.last_login_at) : "Account has not recorded a successful login"} · {Number(row.login_count || 0)} logins</span>
                </div>
                <Link className="btn" href={"/admin/participants/" + String(row.id)}>Review participant</Link>
              </article>
            ))}
          </div>
        ) : <div className="notice attention-clear">No active participants currently meet the inactivity follow-up threshold.</div>}
      </section>

      <section className="attention-section">
        <div className="portal-section-heading"><div><span className="eyebrow">Participant pulse</span><h2>Weekly check-ins needing attention</h2></div><Link className="btn" href="/admin/check-ins">Review all check-ins</Link></div>
        {checkInSignals.length ? (
          <div className="attention-list">
            {checkInSignals.map((row) => (
              <article className="attention-row card" key={String(row.id)}>
                <div>
                  <small>Week of {String(row.week_start)} · {String(row.tier)}{row.confidence ? " · Confidence " + String(row.confidence) + "/5" : ""}</small>
                  <strong>{String(row.full_name)}</strong>
                  <span>{String(row.support_needed || "").trim() ? "Support requested: " + String(row.support_needed).slice(0, 180) : "Low confidence reported in the latest check-in."}</span>
                </div>
                <Link className="btn" href={"/admin/participants/" + String(row.user_id)}>Review participant</Link>
              </article>
            ))}
          </div>
        ) : <div className="notice attention-clear">No recent check-ins currently signal a direct support request or low confidence.</div>}
      </section>

      <section className="attention-section">
        <div className="portal-section-heading"><div><span className="eyebrow">Delivery</span><h2>Overdue implementation tasks</h2></div></div>
        {overdueTasks.length ? (
          <div className="attention-list">
            {overdueTasks.map((task) => (
              <article className="attention-row card" key={String(task.id)}>
                <div>
                  <small>{String(task.area)} · due {String(task.due_date)}</small>
                  <strong>{String(task.title)}</strong>
                  <span>{String(task.full_name)} · {task.owner ? String(task.owner) : "Owner not assigned"} · {String(task.status)}</span>
                </div>
                <Link className="btn" href={"/admin/tasks/" + String(task.id)}>Open task</Link>
              </article>
            ))}
          </div>
        ) : <div className="notice attention-clear">No open implementation tasks are overdue.</div>}
      </section>

      <section className="attention-section">
        <div className="portal-section-heading"><div><span className="eyebrow">Support</span><h2>Support periods ending soon</h2></div></div>
        {expiringSupport.length ? (
          <div className="attention-list">
            {expiringSupport.map((row) => (
              <article className="attention-row card" key={String(row.id)}>
                <div>
                  <small>{String(row.tier)} · support ends {String(row.support_end)}</small>
                  <strong>{String(row.full_name)}</strong>
                  <span>{String(row.email)}</span>
                </div>
                <Link className="btn" href={"/admin/participants/" + String(row.user_id)}>Review participant</Link>
              </article>
            ))}
          </div>
        ) : <div className="notice attention-clear">No active participant support periods end in the next 14 days.</div>}
      </section>

      <section className="attention-section">
        <div className="portal-section-heading"><div><span className="eyebrow">Payments</span><h2>Paid orders waiting for activation</h2></div></div>
        {unprovisionedOrders.length ? (
          <div className="attention-list">
            {unprovisionedOrders.map((row) => (
              <article className="attention-row card" key={String(row.id)}>
                <div>
                  <small>{String(row.tier)} · paid order</small>
                  <strong>{String(row.full_name || row.email)}</strong>
                  <span>{String(row.email)} · created {String(row.created_at)}</span>
                </div>
                <Link className="btn" href="/admin/orders">Open orders</Link>
              </article>
            ))}
          </div>
        ) : <div className="notice attention-clear">No paid orders are waiting for account provisioning.</div>}
      </section>

      <section className="attention-section">
        <div className="portal-section-heading"><div><span className="eyebrow">Onboarding</span><h2>Participants missing intake</h2></div></div>
        {missingIntake.length ? (
          <div className="attention-list">
            {missingIntake.map((row) => (
              <article className="attention-row card" key={String(row.id)}>
                <div>
                  <small>{String(row.tier)} · started {row.programme_start ? String(row.programme_start) : "date not set"}</small>
                  <strong>{String(row.full_name)}</strong>
                  <span>{String(row.email)}</span>
                </div>
                <Link className="btn" href={"/admin/participants/" + String(row.id)}>Review participant</Link>
              </article>
            ))}
          </div>
        ) : <div className="notice attention-clear">All active participants have submitted an intake.</div>}
      </section>
    </main>
  );
}
