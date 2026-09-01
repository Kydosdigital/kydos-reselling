import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminContext } from "@/lib/academy";
import { addParticipantAdminNote, updateEnrolmentStatus, updateSupportEnd } from "../../actions";
import { getSql } from "@/lib/db";
import { accessibleLessons, tierLabels, type Tier } from "@/lib/programme-data";
import { getLaunchReadiness } from "@/lib/academy-rules";

export const dynamic = "force-dynamic";

export default async function AdminParticipantPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminContext();
  const { id } = await params;
  const sql = getSql();

  const [users, enrolments, intakeRows, progressRows, tasks, orders, adminNotes] = await Promise.all([
    sql.query("select id, auth_user_id, email, full_name, role, created_at from academy_users where id = $1 limit 1", [id]),
    sql.query("select id, tier, status, programme_start, support_end, handover_date, created_at from enrolments where user_id = $1 order by created_at desc", [id]),
    sql.query("select * from participant_intake where user_id = $1 limit 1", [id]),
    sql.query("select lesson_id, completed_at from lesson_progress where user_id = $1 order by completed_at desc", [id]),
    sql.query("select id, area, title, owner, status, due_date, notes, created_at from implementation_tasks where user_id = $1 order by created_at desc", [id]),
    sql.query("select id, tier, amount_total, currency, status, created_at, stripe_session_id from programme_orders where user_id = $1 order by created_at desc", [id]),
    sql.query("select n.id, n.note, n.created_at, a.full_name as author_name from participant_admin_notes n left join academy_users a on a.id = n.author_user_id where n.user_id = $1 order by n.created_at desc limit 50", [id])
  ]);

  if (!users.length) notFound();

  const user = users[0];
  const active = enrolments.find((item) => String(item.status) === "active") || enrolments[0];
  const tier = active?.tier as Tier | undefined;
  const accessible = tier ? accessibleLessons(tier) : [];
  const completed = new Set(progressRows.map((row) => String(row.lesson_id)));
  const completeCount = accessible.filter((lesson) => completed.has(lesson.id)).length;
  const percent = accessible.length ? Math.round((completeCount / accessible.length) * 100) : 0;
  const intake = intakeRows[0] as Record<string, any> | undefined;
  const readiness = getLaunchReadiness(intake);

  return (
    <main className="container admin-participant-page">
      <Link className="muted" href="/admin">← Programme operations</Link>

      <div className="portal-top" style={{ marginTop: 18 }}>
        <div>
          <span className="pill">{tier ? tierLabels[tier] : "No active tier"}</span>
          <h1>{String(user.full_name)}</h1>
          <p className="muted">{String(user.email)}</p>
        </div>
      </div>

      <div className="portal-stat-grid">
        <section className="portal-stat card"><small>Progress</small><strong>{percent}%</strong><span>{completeCount}/{accessible.length} lessons</span></section>
        <section className="portal-stat card"><small>Open tasks</small><strong>{tasks.filter((task) => String(task.status) !== "complete").length}</strong><span>{tasks.filter((task) => String(task.status) === "waiting_participant").length} waiting on participant</span></section>
        <section className="portal-stat card"><small>Programme start</small><strong className="stat-date">{active?.programme_start ? String(active.programme_start) : "Not set"}</strong><span>Current enrolment</span></section>
        <section className="portal-stat card"><small>Support end</small><strong className="stat-date">{active?.support_end ? String(active.support_end) : tier === "dfy" ? "After handover" : "Not set"}</strong><span>{tier === "dfy" && active?.handover_date ? "Handover " + String(active.handover_date) : "Support window"}</span></section>
        <section className="portal-stat card"><small>Launch readiness</small><strong>{intake ? readiness.percent + "%" : "No intake"}</strong><span>{intake ? readiness.stage : "Waiting for participant intake"}</span></section>
      </div>

      <div className="admin-detail-grid">
        <section className="panel card">
          <span className="eyebrow">Participant intake</span>
          {intake ? (
            <dl className="account-details">
              <div><dt>Agency name</dt><dd>{intake.agency_name || "Not provided"}</dd></div>
              <div><dt>Company status</dt><dd>{intake.company_status || "Not provided"}</dd></div>
              <div><dt>Target launch</dt><dd>{intake.target_launch_date || "Not provided"}</dd></div>
              <div><dt>Operating structure</dt><dd>{intake.preferred_structure || "Not provided"}</dd></div>
              <div><dt>Location</dt><dd>{intake.location || "Not provided"}</dd></div>
              <div><dt>Domain</dt><dd>{intake.domain_status || "Not provided"}</dd></div>
              <div><dt>Website</dt><dd>{intake.website_status || "Not provided"}</dd></div>
              <div><dt>CRM</dt><dd>{intake.crm_status || "Not provided"}</dd></div>
              <div><dt>Team</dt><dd>{intake.team_status || "Not provided"}</dd></div>
              <div><dt>Acquisition</dt><dd>{intake.acquisition_readiness || "Not provided"}</dd></div>
              <div><dt>Current clients</dt><dd>{intake.current_clients ?? "Not provided"}</dd></div>
              <div><dt>Startup budget</dt><dd>{intake.startup_budget_gbp !== null && intake.startup_budget_gbp !== undefined ? "£" + Number(intake.startup_budget_gbp).toLocaleString("en-GB") : "Not provided"}</dd></div>
            </dl>
          ) : <div className="notice">Participant has not submitted an intake yet.</div>}
          {intake?.services_focus ? <div className="admin-long-answer"><small>Service focus</small><p>{String(intake.services_focus)}</p></div> : null}
          {intake?.goals ? <div className="admin-long-answer"><small>First-year goal</small><p>{String(intake.goals)}</p></div> : null}
          {intake?.notes ? <div className="admin-long-answer"><small>Implementation notes</small><p>{String(intake.notes)}</p></div> : null}
        </section>

        <section className="panel card">
          <span className="eyebrow">Enrolment history</span>
          <div className="compact-list">
            {enrolments.length ? enrolments.map((enrolment) => (
              <div key={String(enrolment.id)}>
                <strong>{tierLabels[String(enrolment.tier) as Tier] || String(enrolment.tier)}</strong>
                <span>{String(enrolment.status)} · started {enrolment.programme_start ? String(enrolment.programme_start) : "not set"}</span>
              </div>
            )) : <span className="muted">No enrolments recorded.</span>}
          </div>

          <span className="eyebrow" style={{ marginTop: 28 }}>Orders</span>
          <div className="compact-list">
            {orders.length ? orders.map((order) => (
              <div key={String(order.id)}>
                <strong>{String(order.tier)} · {order.amount_total ? ((Number(order.amount_total) / 100).toLocaleString("en-GB", { style: "currency", currency: String(order.currency || "GBP").toUpperCase() })) : "Amount not recorded"}</strong>
                <span>{String(order.status)} · {String(order.created_at)}</span>
              </div>
            )) : <span className="muted">No Stripe orders linked to this participant yet.</span>}
          </div>
        </section>
      </div>

      {active ? (
        <section className="panel card admin-control-panel">
          <div>
            <span className="eyebrow">Access controls</span>
            <h2>Manage current enrolment</h2>
          </div>
          <form action={updateEnrolmentStatus}>
            <input type="hidden" name="enrolmentId" value={String(active.id)} />
            <div className="field">
              <label>Status</label>
              <select name="status" className="select compact" defaultValue={String(active.status)}>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="complete">Complete</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button className="btn" type="submit">Update status</button>
          </form>
          <form action={updateSupportEnd}>
            <input type="hidden" name="enrolmentId" value={String(active.id)} />
            <div className="field">
              <label>Support end</label>
              <input type="date" name="supportEnd" defaultValue={active.support_end ? String(active.support_end) : ""} />
            </div>
            <button className="btn" type="submit">Update support date</button>
          </form>
        </section>
      ) : null}

      <section className="panel card admin-notes-panel">
        <div>
          <span className="eyebrow">Internal Kydos notes</span>
          <h2>Participant record</h2>
          <p className="muted">These notes are internal and are not shown in the participant portal.</p>
        </div>
        <form action={addParticipantAdminNote}>
          <input type="hidden" name="userId" value={id} />
          <div className="field"><label>Add note</label><textarea className="textarea" name="note" rows={4} required /></div>
          <button className="btn btn-primary" type="submit">Save internal note</button>
        </form>
        <div className="admin-note-list">
          {adminNotes.length ? adminNotes.map((note) => (
            <article key={String(note.id)}>
              <p>{String(note.note)}</p>
              <small>{note.author_name ? String(note.author_name) : "Kydos"} · {String(note.created_at)}</small>
            </article>
          )) : <span className="muted">No internal notes yet.</span>}
        </div>
      </section>

      <section style={{ marginTop: 30 }}>
        <div className="portal-section-heading"><div><span className="eyebrow">Implementation</span><h2>Participant tasks</h2></div></div>
        {tasks.length ? (
          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead><tr><th>Area</th><th>Task</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead>
              <tbody>{tasks.map((task) => (
                <tr key={String(task.id)}>
                  <td>{String(task.area)}</td><td>{String(task.title)}</td><td>{task.owner ? String(task.owner) : "Unassigned"}</td><td>{task.due_date ? String(task.due_date) : "Not set"}</td><td>{String(task.status)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <div className="notice">No implementation tasks have been created for this participant yet.</div>}
      </section>
    </main>
  );
}
