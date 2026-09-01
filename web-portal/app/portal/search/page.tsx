import Link from "next/link";
import { requireAcademyContext, getActiveEnrolment } from "@/lib/academy";
import { canAccessTier, modules, tierLabels, type Tier } from "@/lib/programme-data";

export const dynamic = "force-dynamic";

export default async function PortalSearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { academyUser } = await requireAcademyContext();
  const enrolment = await getActiveEnrolment(academyUser.id);
  if (!enrolment) return <div className="notice">Your programme enrolment is not active yet.</div>;

  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const tier = enrolment.tier as Tier;

  const accessible = modules.flatMap((module) =>
    module.lessons
      .filter((lesson) => canAccessTier(tier, lesson.minimumTier))
      .map((lesson) => ({ ...lesson, moduleSlug: module.slug, moduleTitle: module.title, moduleNumber: module.number }))
  );

  const matches = query
    ? accessible.filter((lesson) =>
        [lesson.title, lesson.description, lesson.moduleTitle, lesson.source]
          .some((value) => value.toLowerCase().includes(query))
      )
    : accessible;

  return (
    <>
      <div className="portal-top">
        <div>
          <span className="pill">{tierLabels[tier]}</span>
          <h1>Search programme</h1>
          <p className="muted">Find a lesson, template or operating area without clicking through every module.</p>
        </div>
      </div>

      <form method="get" className="portal-search-form card">
        <div className="field">
          <label htmlFor="programme-search">What are you looking for?</label>
          <input
            id="programme-search"
            name="q"
            defaultValue={q}
            placeholder="Try: CRM, Meta Ads, recruitment, reporting..."
            autoFocus
          />
        </div>
        <button className="btn btn-primary" type="submit">Search</button>
      </form>

      <div className="portal-search-summary">
        <strong>{matches.length}</strong>
        <span>{query ? "results for “" + q.trim() + "”" : "lessons available in your programme tier"}</span>
      </div>

      <div className="portal-search-results">
        {matches.length ? matches.map((lesson) => (
          <Link className="portal-search-result card" href={"/portal/lesson/" + lesson.id} key={lesson.id}>
            <div>
              <small>Module {String(lesson.moduleNumber).padStart(2, "0")} · {lesson.moduleTitle}</small>
              <h2>{lesson.title}</h2>
              <p>{lesson.description}</p>
            </div>
            <span>Open lesson →</span>
          </Link>
        )) : (
          <div className="notice">
            No lessons matched that search. Try a broader phrase or <Link href="/portal">return to the programme dashboard.</Link>
          </div>
        )}
      </div>
    </>
  );
}
