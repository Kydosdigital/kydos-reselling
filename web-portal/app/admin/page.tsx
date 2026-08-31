import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createImplementationTask, inviteParticipant, recordHandover, updateTaskStatus } from "./actions";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/portal");

  const admin = createAdminClient();

  const [{ data: profiles }, { data: enrolments }, { data: tasks }] = await Promise.all([
    admin.from("profiles").select("id,full_name,role,created_at").eq("role", "student").order("created_at", { ascending: false }),
    admin.from("enrolments").select("id,user_id,tier,status,programme_start,support_end,handover_date,created_at").order("created_at", { ascending: false }),
    admin.from("implementation_tasks").select("id,user_id,area,title,owner,status,due_date,created_at").order("created_at", { ascending: false }).limit(100)
  ]);

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
  const active = (enrolments || []).filter((e) => e.status === "active");

  return (
    <main className="container" style={{ padding: "34px 0 70px" }}>
      <div className="portal-top">
        <div>
          <span className="pill">Kydos Admin</span>
          <h1>Programme operations</h1>
          <p className="muted">Invite participants, assign tiers and manage implementation work.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel card">
          <h3>Invite participant</h3>
          <form action={inviteParticipant}>
            <div className="field">
              <label>Full name</label>
              <input name="fullName" required />
            </div>
            <div className="field">
              <label>Email</label>
              <input name="email" type="email" required />
            </div>
            <div className="field">
              <label>Programme tier</label>
              <select name="tier" defaultValue="blueprint" className="select">
                <option value="blueprint">Blueprint £2,500</option>
                <option value="build">Build With Us £5,000</option>
                <option value="dfy">Done For You £10,000</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">Invite and enrol</button>
          </form>
        </section>

        <section className="panel card">
          <small className="muted">Active participants</small>
          <h2 style={{ marginTop: 8 }}>{active.length}</h2>
          <p className="muted">
            Blueprint: {active.filter((e) => e.tier === "blueprint").length}<br />
            Build With Us: {active.filter((e) => e.tier === "build").length}<br />
            Done For You: {active.filter((e) => e.tier === "dfy").length}
          </p>
        </section>
      </div>

      <section style={{ marginTop: 26 }}>
        <h2>Participants</h2>
        <div className="admin-table-wrap card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Start</th>
                <th>Support end</th>
                <th>DFY handover</th>
              </tr>
            </thead>
            <tbody>
              {active.map((e) => (
                <tr key={e.id}>
                  <td>{profileMap.get(e.user_id)?.full_name || e.user_id}</td>
                  <td>{e.tier}</td>
                  <td>{e.status}</td>
                  <td>{e.programme_start || "Not set"}</td>
                  <td>{e.support_end || (e.tier === "dfy" ? "Starts after handover" : "Not set")}</td>
                  <td>
                    {e.tier === "dfy" ? (
                      <form action={recordHandover} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="hidden" name="enrolmentId" value={e.id} />
                        <input className="date-input" name="handoverDate" type="date" defaultValue={e.handover_date || ""} required />
                        <button className="btn" type="submit">{e.handover_date ? "Update" : "Set"}</button>
                      </form>
                    ) : "Not applicable"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: 34 }}>
        <h2>Create implementation task</h2>
        <div className="panel card">
          <form action={createImplementationTask} className="form-grid">
            <div className="field">
              <label>Participant</label>
              <select name="userId" className="select" required>
                <option value="">Select participant</option>
                {active.map((e) => (
                  <option value={e.user_id} key={e.user_id}>
                    {profileMap.get(e.user_id)?.full_name || e.user_id}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Area</label>
              <select name="area" className="select" required>
                <option>Company</option>
                <option>Brand</option>
                <option>Website</option>
                <option>CRM</option>
                <option>Recruitment</option>
                <option>Sales</option>
                <option>Operations</option>
                <option>Marketing Launch</option>
                <option>Handover</option>
              </select>
            </div>
            <div className="field">
              <label>Task</label>
              <input name="title" required />
            </div>
            <div className="field">
              <label>Owner</label>
              <input name="owner" placeholder="Kydos / Participant / Named owner" />
            </div>
            <div className="field">
              <label>Due date</label>
              <input name="dueDate" type="date" />
            </div>
            <div style={{ alignSelf: "end", paddingBottom: 16 }}>
              <button className="btn btn-primary" type="submit">Add task</button>
            </div>
          </form>
        </div>
      </section>

      <section style={{ marginTop: 34 }}>
        <h2>Recent implementation tasks</h2>
        <div className="admin-table-wrap card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Participant</th>
                <th>Area</th>
                <th>Task</th>
                <th>Owner</th>
                <th>Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(tasks || []).map((task) => (
                <tr key={task.id}>
                  <td>{profileMap.get(task.user_id)?.full_name || task.user_id}</td>
                  <td>{task.area}</td>
                  <td>{task.title}</td>
                  <td>{task.owner || "Unassigned"}</td>
                  <td>{task.due_date || "Not set"}</td>
                  <td>
                    <form action={updateTaskStatus}>
                      <input type="hidden" name="taskId" value={task.id} />
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <select name="status" defaultValue={task.status} className="select compact">
                          <option value="not_started">Not started</option>
                          <option value="in_progress">In progress</option>
                          <option value="waiting_participant">Waiting participant</option>
                          <option value="waiting_kydos">Waiting Kydos</option>
                          <option value="waiting_third_party">Waiting third party</option>
                          <option value="review">Review</option>
                          <option value="complete">Complete</option>
                        </select>
                        <button className="btn" type="submit">Save</button>
                      </div>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
