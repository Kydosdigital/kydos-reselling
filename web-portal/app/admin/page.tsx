import { requireAdminContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { createImplementationTask, createParticipant, recordHandover, updateTaskStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdminContext();
  const sql = getSql();
  const [participants, tasks] = await Promise.all([
    sql.query("select e.id, e.user_id, e.tier, e.status, e.programme_start, e.support_end, e.handover_date, e.created_at, u.full_name, u.email from enrolments e join academy_users u on u.id = e.user_id order by e.created_at desc"),
    sql.query("select t.id, t.user_id, t.area, t.title, t.owner, t.status, t.due_date, t.created_at, u.full_name, u.email from implementation_tasks t join academy_users u on u.id = t.user_id order by t.created_at desc limit 100")
  ]);
  const active = participants.filter((e) => String(e.status) === "active");

  return (
    <main className="container" style={{ padding: "34px 0 70px" }}>
      <div className="portal-top"><div><span className="pill">Kydos Admin</span><h1>Programme operations</h1><p className="muted">Create participants, assign tiers and manage implementation work.</p></div></div>
      <div className="dashboard-grid">
        <section className="panel card">
          <h3>Create participant</h3>
          <form action={createParticipant}>
            <div className="field"><label>Full name</label><input name="fullName" required /></div>
            <div className="field"><label>Email</label><input name="email" type="email" required /></div>
            <div className="field"><label>Programme tier</label><select name="tier" defaultValue="blueprint" className="select"><option value="blueprint">Blueprint £2,500</option><option value="build">Build With Us £5,000</option><option value="dfy">Done For You £10,000</option></select></div>
            <div className="field"><label>Temporary password</label><input name="temporaryPassword" type="password" minLength={12} required /><small className="muted">At least 12 characters. Send it securely to the participant and ask them to change it.</small></div>
            <button className="btn btn-primary" type="submit">Create and enrol</button>
          </form>
        </section>
        <section className="panel card">
          <small className="muted">Active participants</small>
          <h2 style={{ marginTop: 8 }}>{active.length}</h2>
          <p className="muted">Blueprint: {active.filter((e) => e.tier === "blueprint").length}<br />Build With Us: {active.filter((e) => e.tier === "build").length}<br />Done For You: {active.filter((e) => e.tier === "dfy").length}</p>
        </section>
      </div>

      <section style={{ marginTop: 26 }}><h2>Participants</h2><div className="admin-table-wrap card"><table className="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Tier</th><th>Status</th><th>Start</th><th>Support end</th><th>DFY handover</th></tr></thead><tbody>
        {active.map((e) => (
          <tr key={String(e.id)}>
            <td>{String(e.full_name)}</td><td>{String(e.email)}</td><td>{String(e.tier)}</td><td>{String(e.status)}</td><td>{e.programme_start ? String(e.programme_start) : "Not set"}</td><td>{e.support_end ? String(e.support_end) : e.tier === "dfy" ? "Starts after handover" : "Not set"}</td>
            <td>{e.tier === "dfy" ? (<form action={recordHandover} style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="hidden" name="enrolmentId" value={String(e.id)} /><input className="date-input" name="handoverDate" type="date" defaultValue={e.handover_date ? String(e.handover_date) : ""} required /><button className="btn" type="submit">{e.handover_date ? "Update" : "Set"}</button></form>) : "Not applicable"}</td>
          </tr>
        ))}
      </tbody></table></div></section>

      <section style={{ marginTop: 34 }}><h2>Create implementation task</h2><div className="panel card"><form action={createImplementationTask} className="form-grid">
        <div className="field"><label>Participant</label><select name="userId" className="select" required><option value="">Select participant</option>{active.map((e) => (<option value={String(e.user_id)} key={String(e.user_id)}>{String(e.full_name)}</option>))}</select></div>
        <div className="field"><label>Area</label><select name="area" className="select" required><option>Company</option><option>Brand</option><option>Website</option><option>CRM</option><option>Recruitment</option><option>Sales</option><option>Operations</option><option>Marketing Launch</option><option>Handover</option></select></div>
        <div className="field"><label>Task</label><input name="title" required /></div>
        <div className="field"><label>Owner</label><input name="owner" placeholder="Kydos / Participant / Named owner" /></div>
        <div className="field"><label>Due date</label><input name="dueDate" type="date" /></div>
        <div style={{ alignSelf: "end", paddingBottom: 16 }}><button className="btn btn-primary" type="submit">Add task</button></div>
      </form></div></section>

      <section style={{ marginTop: 34 }}><h2>Recent implementation tasks</h2><div className="admin-table-wrap card"><table className="admin-table"><thead><tr><th>Participant</th><th>Area</th><th>Task</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead><tbody>
        {tasks.map((task) => (<tr key={String(task.id)}><td>{String(task.full_name)}</td><td>{String(task.area)}</td><td>{String(task.title)}</td><td>{task.owner ? String(task.owner) : "Unassigned"}</td><td>{task.due_date ? String(task.due_date) : "Not set"}</td><td><form action={updateTaskStatus}><input type="hidden" name="taskId" value={String(task.id)} /><div style={{ display: "flex", gap: 8, alignItems: "center" }}><select name="status" defaultValue={String(task.status)} className="select compact"><option value="not_started">Not started</option><option value="in_progress">In progress</option><option value="waiting_participant">Waiting participant</option><option value="waiting_kydos">Waiting Kydos</option><option value="waiting_third_party">Waiting third party</option><option value="review">Review</option><option value="complete">Complete</option></select><button className="btn" type="submit">Save</button></div></form></td></tr>))}
      </tbody></table></div></section>
    </main>
  );
}
