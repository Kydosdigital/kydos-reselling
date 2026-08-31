import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { tierLabels, type Tier } from "@/lib/programme-data";

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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: enrolment }, { data: tasks }] = await Promise.all([
    supabase.from("enrolments").select("tier").eq("user_id", user.id).eq("status", "active").maybeSingle(),
    supabase.from("implementation_tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: true })
  ]);

  const tier = ((enrolment?.tier as Tier) || "blueprint");

  return (
    <>
      <div className="portal-top">
        <div>
          <span className="pill">{tierLabels[tier]}</span>
          <h1>Implementation board</h1>
          <p className="muted">
            {tier === "blueprint"
              ? "Use this board for any Kydos implementation or support items attached to your programme."
              : "Track what Kydos is building, what you need to provide and what is waiting on a third party."}
          </p>
        </div>
      </div>

      {(tasks || []).length === 0 ? (
        <div className="notice">
          No implementation tasks have been assigned yet. Your programme modules remain available from the dashboard.
        </div>
      ) : (
        <div className="lesson-list">
          {(tasks || []).map((task) => (
            <article className="lesson card" key={task.id}>
              <div>
                <small>{task.area} · {task.owner || "Owner to be assigned"}</small>
                <h3>{task.title}</h3>
                <p className="muted" style={{ margin: 0 }}>
                  Due: {task.due_date || "No date set"}
                  {task.notes ? " · " + task.notes : ""}
                </p>
              </div>
              <span className="pill">{statusLabels[task.status] || task.status}</span>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
