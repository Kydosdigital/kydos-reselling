import Link from "next/link";
import { requireAdminContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { createImplementationTask, createParticipant, recordHandover, updateTaskStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; tier?: string; taskStatus?: string }>;
}) {
  await requireAdminContext();
  const filters = await searchParams;
  const sql = getSql();
  const [participants, tasks] = await Promise.all([
    sql.query("select e.id, e.user_id, e.tier, e.status, e.programme_start, e.support_end, e.handover_date, e.created_at, u.full_name, u.email from enrolments e join academy_users u on u.id = e.user_id order by e.created_at desc"),
    sql.query("select t.id, t.user_id, t.area, t.title, t.owner, t.status, t.due_date, t.created_at, u.full_name, u.email from implementation_tasks t join academy_users u on u.id = t.user_id order by t.created_at desc limit 100")
  ]);
  const active = participants.filter((e) => String(e.status) === "active");
  const waitingKydos = tasks.filter((t) => String(t.status) === "waiting_kydos").length;
  const waitingParticipant = tasks.filter((t) => String(t.status) === "waiting_participant").length;
  const openTasks = tasks.filter((t) => String(t.status) !== "complete").length;
  const q = String(filters.q || "").trim().toLowerCase();
  const tierFilter = String(filters.tier || "");
  const taskStatusFilter = String(filters.taskStatus || "");

  const filteredParticipants = active.filter((participant) => {
    const matchesText = !q || String(participant.full_name).toLowerCase().includes(q) || String(participant.email).toLowerCase().includes(q);
    const matchesTier = !tierFilter || String(participant.tier) === tierFilter;
    return matchesText && matchesTier;
  });

  const filteredTasks = tasks.filter((task) => {
    const matchesText = !q || String(task.full_name).toLowerCase().includes(q) || String(task.email).toLowerCase().includes(q) || String(task.title).toLowerCase().includes(q);
    const matchesStatus = !taskStatusFilter || String(task.status) === taskStatusFilter;
    return matchesText && matchesStatus;
  });

  return (
    <main className="container admin-page">
      <div className="portal-top">
        <div><span className="pill">Kydos Admin</span><h1>Programme operations</h1><p className="muted">Create participants, assign tiers and manage implementation work.</p></div>
        <div className="admin-top-actions">
          <Link className="btn" href="/admin/orders">Orders</Link>
          <Link className="btn" href="/admin/audit">Audit log</Link>
          <Link className="btn" href="/admin/system">System</Link>
          <Link className="btn" href="/portal">Participant view</Link>
        </div>
      </div>

      <div className="portal-stat-grid">
        <section className="portal-stat card"><small>Active participants</small><strong>{active.length}</strong><span>{active.filter((e) => e.tier === "dfy").length} Done For You</span></section>
        <section className="portal-stat card"><small>Open tasks</small><strong>{openTasks}</strong><span>Across recent implementation work</span></section>
        <section className="portal-stat card"><small>Waiting on Kydos</small><strong>{waitingKydos}</strong><span>Items the team should move next</span></section>
        <section className="portal-stat card"><small>Waiting participant</small><strong>{waitingParticipant}</strong><span>Items requiring a client response</span></section>
      </div>

      <div className="dashboard-grid admin-create-grid">
        <section className="panel card">
          <h3>Create participant</h3>
          <form action={createParticipant}>
            <div className="field"><label>Full name</label><input name="fullName" required /></div>
            <div className="field"><label>Email</label><input name="email" type="email" required /></div>
            <div className="field"><label>Programme tier</label><select name="tier" defaultValue="blueprint" className="select"><option value="blueprint">Blueprint £2,500</option><option value="build">Build With Us £5,000</option><option value="dfy">Done For You £10,000</option></select></div>
            <div className="field"><label>Temporary password</label><input name="temporaryPassword" type="password" minLength={12} required /><small className="muted">At least 12 characters. Send it securely and ask the participant to reset it after first sign-in.</small></div>
            <button className="btn btn-primary" type="submit">Create and enrol</button>
          </form>
        </section>

        <section className="panel card">
          <span className="eyebrow">Programme mix</span>
          <div className="admin-tier-mix">
            <div><span>Blueprint</span><strong>{active.filter((e) => e.tier === "blueprint").length}</strong></div>
            <div><span>Build With Us</span><strong>{active.filter((e) => e.tier === "build").length}</strong></div>
            <div><span>Done For You</span><strong>{active.filter((e) => e.tier === "dfy").length}</strong></div>
          </div>
          <p className="muted">Open a participant record below to review their intake, progress, orders and implementation work.</p>
        </section>
      </div>

      <section className="admin-filter-panel card">
        <form method="get" className="admin-filter-grid">
          <div className="field">
            <label htmlFor="admin-q">Search</label>
            <input id="admin-q" name="q" defaultValue={filters.q || ""} placeholder="Participant, email or task" />
          </div>
          <div className="field">
            <label htmlFor="admin-tier">Participant tier</label>
            <select id="admin-tier" name="tier" className="select" defaultValue={tierFilter}>
              <option value="">All tiers</option>
              <option value="blueprint">Blueprint</option>
              <option value="build">Build With Us</option>
              <option value="dfy">Done For You</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="admin-task-status">Task status</label>
            <select id="admin-task-status" name="taskStatus" className="select" defaultValue={taskStatusFilter}>
              <option value="">All task statuses</option>
              <option value="not_started">Not started</option>
              <option value="in_progress">In progress</option>
              <option value="waiting_participant">Waiting participant</option>
              <option value="waiting_kydos">Waiting Kydos</option>
              <option value="waiting_third_party">Waiting third party</option>
              <option value="review">Review</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <div className="admin-filter-actions">
            <button className="btn btn-primary" type="submit">Apply filters</button>
            <Link className="btn" href="/admin">Clear</Link>
          </div>
        </form>
      </section>

      <section style={{ marginTop: 30 }}>
        <div className="portal-section-heading"><div><span className="eyebrow">Participants</span><h2>Active programme accounts</h2><p className="muted">{filteredParticipants.length} matching participant{filteredParticipants.length === 1 ? "" : "s"}</p></div></div>
        <div className="admin-table-wrap card"><table className="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Tier</th><th>Status</th><th>Start</th><th>Support end</th><th>DFY handover</th></tr></thead><tbody>
          {filteredParticipants.map((e) => (
            <tr key={String(e.id)}>
              <td><Link className="admin-person-link" href={"/admin/participants/" + String(e.user_id)}>{String(e.full_name)}</Link></td>
              <td>{String(e.email)}</td><td>{String(e.tier)}</td><td>{String(e.status)}</td><td>{e.programme_start ? String(e.programme_start) : "Not set"}</td><td>{e.support_end ? String(e.support_end) : e.tier === "dfy" ? "Starts after handover" : "Not set"}</td>
              <td>{e.tier === "dfy" ? (<form action={recordHandover} style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="hidden" name="enrolmentId" value={String(e.id)} /><input className="date-input" name="handoverDate" type="date" defaultValue={e.handover_date ? String(e.handover_date) : ""} required /><button className="btn" type="submit">{e.handover_date ? "Update" : "Set"}</button></form>) : "Not applicable"}</td>
            </tr>
          ))}
        </tbody></table></div>
      </section>

      <section style={{ marginTop: 34 }}><div className="portal-section-heading"><div><span className="eyebrow">Implementation</span><h2>Create task</h2></div></div><div className="panel card"><form action={createImplementationTask} className="form-grid">
        <div className="field"><label>Participant</label><select name="userId" className="select" required><option value="">Select participant</option>{active.map((e) => (<option value={String(e.user_id)} key={String(e.user_id)}>{String(e.full_name)}</option>))}</select></div>
        <div className="field"><label>Area</label><select name="area" className="select" required><option>Company</option><option>Brand</option><option>Website</option><option>CRM</option><option>Recruitment</option><option>Sales</option><option>Operations</option><option>Marketing Launch</option><option>Handover</option></select></div>
        <div className="field"><label>Task</label><input name="title" required /></div>
        <div className="field"><label>Owner</label><input name="owner" placeholder="Kydos / Participant / Named owner" /></div>
        <div className="field"><label>Due date</label><input name="dueDate" type="date" /></div>
        <div style={{ alignSelf: "end", paddingBottom: 16 }}><button className="btn btn-primary" type="submit">Add task</button></div>
      </form></div></section>

      <section style={{ marginTop: 34 }}><div className="portal-section-heading"><div><span className="eyebrow">Work queue</span><h2>Recent implementation tasks</h2></div></div><div className="admin-table-wrap card"><table className="admin-table"><thead><tr><th>Participant</th><th>Area</th><th>Task</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead><tbody>
        {filteredTasks.map((task) => (<tr key={String(task.id)}><td><Link className="admin-person-link" href={"/admin/participants/" + String(task.user_id)}>{String(task.full_name)}</Link></td><td>{String(task.area)}</td><td><Link className="admin-person-link" href={"/admin/tasks/" + String(task.id)}>{String(task.title)}</Link></td><td>{task.owner ? String(task.owner) : "Unassigned"}</td><td>{task.due_date ? String(task.due_date) : "Not set"}</td><td><form action={updateTaskStatus}><input type="hidden" name="taskId" value={String(task.id)} /><div style={{ display: "flex", gap: 8, alignItems: "center" }}><select name="status" defaultValue={String(task.status)} className="select compact"><option value="not_started">Not started</option><option value="in_progress">In progress</option><option value="waiting_participant">Waiting participant</option><option value="waiting_kydos">Waiting Kydos</option><option value="waiting_third_party">Waiting third party</option><option value="review">Review</option><option value="complete">Complete</option></select><button className="btn" type="submit">Save</button></div></form></td></tr>))}
      </tbody></table></div></section>
    </main>
  );
}
