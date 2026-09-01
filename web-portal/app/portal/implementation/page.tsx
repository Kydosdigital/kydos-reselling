import { getActiveEnrolment, requireAcademyContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { tierLabels, type Tier } from "@/lib/programme-data";

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
  const [enrolment, tasks] = await Promise.all([
    getActiveEnrolment(academyUser.id),
    sql.query("select id, area, title, owner, status, due_date, notes, created_at from implementation_tasks where user_id = $1 order by created_at asc", [academyUser.id])
  ]);

  if (!enrolment) return <div className="notice">Your programme enrolment is not active yet.</div>;
  const tier = enrolment.tier as Tier;

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
          {tasks.map((task) => (
            <article className="lesson card" key={String(task.id)}>
              <div>
                <small>{String(task.area)} · {task.owner ? String(task.owner) : "Owner to be assigned"}</small>
                <h3>{String(task.title)}</h3>
                <p className="muted" style={{ margin: 0 }}>Due: {task.due_date ? String(task.due_date) : "No date set"}{task.notes ? " · " + String(task.notes) : ""}</p>
              </div>
              <span className="pill">{statusLabels[String(task.status)] || String(task.status)}</span>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
