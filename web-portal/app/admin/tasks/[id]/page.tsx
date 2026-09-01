import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { addAdminTaskUpdate } from "../../actions";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  waiting_participant: "Waiting participant",
  waiting_kydos: "Waiting Kydos",
  waiting_third_party: "Waiting third party",
  review: "Review",
  complete: "Complete"
};

export default async function AdminTaskPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminContext();
  const { id } = await params;
  const sql = getSql();

  const tasks = await sql.query(
    "select t.id, t.user_id, t.area, t.title, t.owner, t.status, t.due_date, t.notes, t.created_at, t.updated_at, u.full_name, u.email from implementation_tasks t join academy_users u on u.id = t.user_id where t.id = $1 limit 1",
    [id]
  );
  if (!tasks.length) notFound();

  const task = tasks[0];
  const updates = await sql.query(
    "select x.id, x.author_role, x.message, x.created_at, a.full_name as author_name from implementation_task_updates x left join academy_users a on a.id = x.author_user_id where x.task_id = $1 order by x.created_at asc",
    [id]
  );

  return (
    <main className="container admin-page admin-task-page">
      <div className="admin-task-breadcrumbs">
        <Link href="/admin">Programme operations</Link>
        <span>→</span>
        <Link href={"/admin/participants/" + String(task.user_id)}>{String(task.full_name)}</Link>
        <span>→</span>
        <strong>{String(task.title)}</strong>
      </div>

      <div className="portal-top">
        <div>
          <span className="pill">{statusLabels[String(task.status)] || String(task.status)}</span>
          <h1>{String(task.title)}</h1>
          <p className="muted">{String(task.area)} · {task.owner ? String(task.owner) : "Owner not assigned"}</p>
        </div>
      </div>

      <div className="admin-task-summary-grid">
        <section className="panel card">
          <span className="eyebrow">Participant</span>
          <h3>{String(task.full_name)}</h3>
          <p className="muted">{String(task.email)}</p>
          <Link className="btn" href={"/admin/participants/" + String(task.user_id)}>Open participant record</Link>
        </section>
        <section className="panel card">
          <span className="eyebrow">Task details</span>
          <dl className="account-details">
            <div><dt>Status</dt><dd>{statusLabels[String(task.status)] || String(task.status)}</dd></div>
            <div><dt>Owner</dt><dd>{task.owner ? String(task.owner) : "Not assigned"}</dd></div>
            <div><dt>Due date</dt><dd>{task.due_date ? String(task.due_date) : "Not set"}</dd></div>
            <div><dt>Created</dt><dd>{String(task.created_at)}</dd></div>
          </dl>
          {task.notes ? <p className="admin-task-notes">{String(task.notes)}</p> : null}
        </section>
      </div>

      <section className="panel card admin-task-thread-card">
        <div>
          <span className="eyebrow">Conversation</span>
          <h2>Implementation updates</h2>
          <p className="muted">Messages here are shared with this participant inside their implementation board.</p>
        </div>

        <div className="admin-task-thread">
          {updates.length ? updates.map((update) => (
            <article className={"task-message " + (String(update.author_role) === "participant" ? "participant-message" : "kydos-message")} key={String(update.id)}>
              <strong>{String(update.author_role) === "participant" ? String(task.full_name) : String(update.author_name || "Kydos")}</strong>
              <p>{String(update.message)}</p>
              <small>{String(update.created_at)}</small>
            </article>
          )) : <div className="notice">No conversation has started on this implementation task yet.</div>}
        </div>

        <form action={addAdminTaskUpdate} className="admin-task-reply">
          <input type="hidden" name="taskId" value={String(task.id)} />
          <div className="field">
            <label>Message to participant</label>
            <textarea className="textarea" name="message" rows={5} maxLength={4000} required placeholder="Explain what changed, what Kydos has completed, or what the participant needs to provide next." />
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Status after sending</label>
              <select className="select" name="status" defaultValue={String(task.status)}>
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="waiting_participant">Waiting participant</option>
                <option value="waiting_kydos">Waiting Kydos</option>
                <option value="waiting_third_party">Waiting third party</option>
                <option value="review">Review</option>
                <option value="complete">Complete</option>
              </select>
            </div>
            <div className="admin-task-send"><button className="btn btn-primary" type="submit">Send Kydos update</button></div>
          </div>
        </form>
      </section>
    </main>
  );
}
