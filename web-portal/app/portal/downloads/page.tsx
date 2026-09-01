import Link from "next/link";
import { canAccessTier, modules, tierLabels, type Tier } from "@/lib/programme-data";
import { getActiveEnrolment, requireAcademyContext } from "@/lib/academy";

export const dynamic = "force-dynamic";

function fileLabel(source: string) {
  const name = source.split("/").pop() || source;
  if (name.endsWith(".csv")) return "Spreadsheet template";
  if (name.endsWith(".md")) return "Guide / template";
  if (name.endsWith(".pdf")) return "PDF";
  if (name.endsWith(".docx")) return "Word document";
  if (name.endsWith(".xlsx")) return "Excel workbook";
  return "Programme resource";
}

export default async function DownloadsPage() {
  const { academyUser } = await requireAcademyContext();
  const enrolment = await getActiveEnrolment(academyUser.id);

  if (!enrolment) return <div className="notice">Your programme enrolment is not active yet.</div>;
  const tier = enrolment.tier as Tier;

  const groups = modules
    .map((module) => ({
      ...module,
      lessons: module.lessons.filter((lesson) => canAccessTier(tier, lesson.minimumTier))
    }))
    .filter((module) => module.lessons.length > 0);

  return (
    <>
      <div className="portal-top">
        <div>
          <span className="pill">{tierLabels[tier]}</span>
          <h1>Downloads</h1>
          <p className="muted">Your guides, templates and operating documents in one place. Access follows your active programme tier.</p>
        </div>
      </div>

      <div className="notice">
        These files are licensed for use inside your own agency. Your programme access does not transfer ownership of Kydos intellectual property or permit resale of the template library itself.
      </div>

      <div className="download-groups">
        {groups.map((module) => (
          <section className="download-group card" key={module.slug}>
            <div className="download-group-heading">
              <div>
                <small>Module {String(module.number).padStart(2, "0")}</small>
                <h2>{module.title}</h2>
              </div>
              <Link href={"/portal/module/" + module.slug}>Open module →</Link>
            </div>

            <div className="download-list">
              {module.lessons.map((lesson) => (
                <div className="download-row" key={lesson.id}>
                  <div>
                    <strong>{lesson.title}</strong>
                    <span>{fileLabel(lesson.source)} · {lesson.source.split("/").pop()}</span>
                  </div>
                  <a className="btn" href={"/api/download?source=" + encodeURIComponent(lesson.source)}>Download</a>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
