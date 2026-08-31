import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canAccessTier, modules, tierLabels, type Tier } from "@/lib/programme-data";
import { setLessonCompletion } from "../../actions";

export default async function ModulePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const module = modules.find((item) => item.slug === slug);
  if (!module) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: enrolment }, { data: progress }] = await Promise.all([
    supabase.from("enrolments").select("tier").eq("user_id", user.id).eq("status", "active").maybeSingle(),
    supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id)
  ]);

  const tier = ((enrolment?.tier as Tier) || "blueprint");
  const completed = new Set((progress || []).map((item) => item.lesson_id));
  const lessons = module.lessons.filter((lesson) => canAccessTier(tier, lesson.minimumTier));

  return (
    <>
      <div className="portal-top">
        <div>
          <Link className="muted" href="/portal">← Dashboard</Link>
          <div style={{ marginTop: 14 }}><span className="pill">{tierLabels[tier]}</span></div>
          <h1>{module.title}</h1>
          <p className="muted">{module.description}</p>
        </div>
      </div>

      {lessons.length === 0 ? (
        <div className="notice">This module is not included in your current programme tier.</div>
      ) : (
        <div className="lesson-list">
          {lessons.map((lesson) => {
            const isComplete = completed.has(lesson.id);

            return (
              <article className="lesson card" key={lesson.id}>
                <div>
                  <small>{lesson.source}</small>
                  <h3>{lesson.title}</h3>
                  <p className="muted" style={{ margin: 0 }}>{lesson.description}</p>
                </div>

                <form action={setLessonCompletion}>
                  <input type="hidden" name="lessonId" value={lesson.id} />
                  <input type="hidden" name="moduleSlug" value={module.slug} />
                  <input type="hidden" name="completed" value={isComplete ? "false" : "true"} />
                  <button className={isComplete ? "btn" : "btn btn-primary"} type="submit">
                    {isComplete ? "Mark incomplete" : "Mark complete"}
                  </button>
                  {isComplete ? <div className="lesson-complete" style={{ marginTop: 8 }}>Completed ✓</div> : null}
                </form>
              </article>
            );
          })}
        </div>
      )}

      {slug === "business-readiness" ? (
        <div className="notice" style={{ marginTop: 18 }}>
          This module provides general business-readiness information only. Personal immigration questions must go to a suitably regulated immigration adviser or solicitor.
        </div>
      ) : null}
    </>
  );
}
