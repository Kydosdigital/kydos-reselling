import Link from "next/link";
import { requireAdminContext } from "@/lib/academy";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminAttentionPage() {
  await requireAdminContext();
  const sql = getSql();

  const [overdueTasks, expiringSupport, unprovisionedOrders, missingIntake] = await Promise.all([
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
    )
  ]);

  const totalAttention = overdueTasks.length + expiringSupport.length + unprovisionedOrders.length + missingIntake.length;

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
      </div>

      <div className="portal-stat-grid">
        <section className="portal-stat card"><small>Total attention items</small><strong>{totalAttention}</strong><span>Across current operational checks</span></section>
        <section className="portal-stat card"><small>Overdue tasks</small><strong>{overdueTasks.length}</strong><span>Open tasks past their due date</span></section>
        <section className="portal-stat card"><small>Support ending</small><strong>{expiringSupport.length}</strong><span>Within the next 14 days</span></section>
        <section className="portal-stat card"><small>Activation / intake</small><strong>{unprovisionedOrders.length + missingIntake.length}</strong><span>Paid access or onboarding follow-up</span></section>
      </div>

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
