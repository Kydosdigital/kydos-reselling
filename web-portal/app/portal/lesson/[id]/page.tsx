import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { marked } from "marked";
import { canAccessTier, modules, tierLabels, type Tier } from "@/lib/programme-data";
import { getActiveEnrolment, requireAcademyContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import contentMap from "@/generated/content.json";
import { setLessonCompletion } from "../../actions";

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const module = modules.find((item) => item.lessons.some((lesson) => lesson.id === id));
  const lesson = module?.lessons.find((item) => item.id === id);
  if (!module || !lesson) notFound();

  const { academyUser } = await requireAcademyContext();
  const sql = getSql();
  const [enrolment, progress] = await Promise.all([
    getActiveEnrolment(academyUser.id),
    sql.query("select lesson_id from lesson_progress where user_id = $1 and lesson_id = $2 limit 1", [academyUser.id, lesson.id])
  ]);
  if (!enrolment) redirect("/portal");

  const tier = enrolment.tier as Tier;
  if (!canAccessTier(tier, lesson.minimumTier)) redirect("/portal/module/" + module.slug);

  const raw = (contentMap as Record<string, string>)[lesson.source] || "";
  const isCsv = lesson.source.endsWith(".csv");
  const html = isCsv ? "" : await marked.parse(raw || "# Content is being prepared");
  const isComplete = progress.length > 0;

  return (
    <>
      <div className="portal-top">
        <div>
          <Link className="muted" href={"/portal/module/" + module.slug}>← {module.title}</Link>
          <div style={{ marginTop: 14 }}><span className="pill">{tierLabels[tier]}</span></div>
          <h1>{lesson.title}</h1>
          <p className="muted">{lesson.description}</p>
        </div>
      </div>

      <div className="lesson-toolbar">
        <a className="btn" href={"/api/download?source=" + encodeURIComponent(lesson.source)}>Download source</a>
        <form action={setLessonCompletion}>
          <input type="hidden" name="lessonId" value={lesson.id} />
          <input type="hidden" name="moduleSlug" value={module.slug} />
          <input type="hidden" name="completed" value={isComplete ? "false" : "true"} />
          <button className={isComplete ? "btn" : "btn btn-primary"} type="submit">{isComplete ? "Mark incomplete" : "Mark complete"}</button>
        </form>
      </div>

      {isCsv ? (
        <section className="panel card">
          <div className="notice">This lesson is an editable spreadsheet/template source. Download it above and open it in Excel or Google Sheets.</div>
          <pre className="code-preview">{raw || "Template content is being synced."}</pre>
        </section>
      ) : (
        <article className="lesson-content card" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </>
  );
}
