import { getActiveEnrolment, requireAcademyContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { tierLabels, type Tier } from "@/lib/programme-data";
import { addParticipantTaskUpdate } from "./actions";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  waiting_participant: "Waiting on you",
  waiting_kydos: "Waiting on Kydos",
  waiting_third_party: "Waiting on third party",
  review: "Review",
  complete: "Complete"
};

export default async function ImplementationPage() {
  const { academyUser } = await requireAcademyContext();
  const sql = getSql();
  const [enrolment, tasks, updates] = await Promise.all([
    getActiveEnrolment(academyUser.id),
    sql.query("select id, area, title, owner, status, due_date, notes, created_at from implementation_tasks where user_id = $1 order by created_at asc", [academyUser.id]),
    sql.query("select task_id, author_role, message, created_at from implementation_task_updates where user_id = $1 order by created_at asc", [academyUser.id])
  ]);

  if (!enrolment) return <div className="notice">Your programme enrolment is not active yet.</div>;
  const tier = enrolment.tier as Tier;
  const updatesByTask = new Map<string, any[]>();
  for (const update of updates) {
    const taskId = String(update.task_id);
    const existing = updatesByTask.get(taskId) || [];
    existing.push(update);
    updatesByTask.set(taskId, existing);
  }

  return (
    <>
      <div className="portal-top">
        <div>
          <span className="pill">{tierLabels[tier]}</span>
          <h1>Implementation board</h1>
          <p className="muted">{tier === "blueprint" ? "Use this board for any Kydos implementation or support items attached to your programme." : "Track what Kydos is building, what you need to provide and what is waiting on a third party."}</p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="notice">No implementation tasks have been assigned yet. Your programme modules remain available from the dashboard.</div>
      ) : (
        <div className="lesson-list">
          {tasks.map((task) => {
            const taskUpdates = updatesByTask.get(String(task.id)) || [];
            return (
              <article className="implementation-task card" key={String(task.id)}>
                <div className="implementation-task-head">
                  <div>
                    <small>{String(task.area)} · {task.owner ? String(task.owner) : "Owner to be assigned"}</small>
                    <h3>{String(task.title)}</h3>
                    <p className="muted" style={{ margin: 0 }}>Due: {task.due_date ? String(task.due_date) : "No date set"}{task.notes ? " · " + String(task.notes) : ""}</p>
                  </div>
                  <span className="pill">{statusLabels[String(task.status)] || String(task.status)}</span>
                </div>

                {taskUpdates.length ? (
                  <div className="task-thread">
                    {taskUpdates.slice(-4).map((update, index) => (
                      <div className={"task-message " + (String(update.author_role) === "participant" ? "participant-message" : "kydos-message")} key={String(update.created_at) + index}>
                        <strong>{String(update.author_role) === "participant" ? "You" : "Kydos"}</strong>
                        <p>{String(update.message)}</p>
                        <small>{String(update.created_at)}</small>
                      </div>
                    ))}
                  </div>
                ) : <p className="task-thread-empty">No updates on this task yet.</p>}

                {String(task.status) !== "complete" ? (
                  <form action={addParticipantTaskUpdate} className="task-update-form">
                    <input type="hidden" name="taskId" value={String(task.id)} />
                    <textarea className="textarea" name="message" rows={3} maxLength={4000} placeholder="Send Kydos an update, confirm you have completed something, or ask a question about this task." required />
                    <button className="btn btn-primary" type="submit">Send update</button>
                  </form>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
