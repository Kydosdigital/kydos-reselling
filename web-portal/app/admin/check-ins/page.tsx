import Link from "next/link";
import { requireAdminContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { getWeeklyCheckInSignal, mondayWeekStart } from "@/lib/academy-rules";

export const dynamic = "force-dynamic";

type CheckInRow = Record<string, unknown>;

const signalLabels = {
  missing: "Current check-in missing",
  support_requested: "Support requested",
  low_confidence: "Low confidence",
  clear: "Clear"
} as const;

export default async function AdminCheckInsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; signal?: string }>;
}) {
  await requireAdminContext();
  const filters = await searchParams;
  const sql = getSql();
  const currentWeekStart = mondayWeekStart();

  const rows = await sql.query(
    `select
      u.id as user_id,
      u.full_name,
      u.email,
      e.tier,
      e.programme_start,
      e.support_end,
      c.week_start,
      c.wins,
      c.blockers,
      c.next_focus,
      c.support_needed,
      c.confidence,
      c.submitted_at
    from enrolments e
    join academy_users u on u.id = e.user_id
    left join lateral (
      select week_start, wins, blockers, next_focus, support_needed, confidence, submitted_at
      from participant_weekly_checkins
      where user_id = u.id
      order by week_start desc
      limit 1
    ) c on true
    where e.status = 'active' and u.role = 'student'
    order by coalesce(c.week_start, date '1900-01-01') asc, u.full_name asc`
  );

  const q = String(filters.q || "").trim().toLowerCase();
  const signalFilter = String(filters.signal || "").trim();

  const participants = (rows as CheckInRow[]).map((row) => {
    const signal = getWeeklyCheckInSignal({
      latestWeekStart: row.week_start ? String(row.week_start) : null,
      currentWeekStart,
      supportNeeded: row.support_needed ? String(row.support_needed) : null,
      confidence: row.confidence == null ? null : Number(row.confidence)
    });
    return { ...row, signal };
  });

  const filtered = participants.filter((row) => {
    const matchesText = !q || String(row.full_name || "").toLowerCase().includes(q) || String(row.email || "").toLowerCase().includes(q);
    const matchesSignal = !signalFilter || row.signal === signalFilter;
    return matchesText && matchesSignal;
  });

  const supportRequested = participants.filter((row) => row.signal === "support_requested").length;
  const lowConfidence = participants.filter((row) => row.signal === "low_confidence").length;
  const missing = participants.filter((row) => row.signal === "missing").length;
  const clear = participants.filter((row) => row.signal === "clear").length;

  return (
    <main className="container admin-page">
      <div className="admin-task-breadcrumbs">
        <Link href="/admin">Programme operations</Link>
        <span>→</span>
        <strong>Weekly check-ins</strong>
      </div>

      <div className="portal-top">
        <div>
          <span className="pill">Participant pulse</span>
          <h1>Weekly check-ins</h1>
          <p className="muted">Review participant momentum, blockers and support requests for the week beginning {currentWeekStart}.</p>
        </div>
        <div className="admin-top-actions">
          <Link className="btn" href="/admin/attention">Attention queue</Link>
          <Link className="btn" href="/admin">Programme operations</Link>
        </div>
      </div>

      <div className="portal-stat-grid">
        <section className="portal-stat card"><small>Support requested</small><strong>{supportRequested}</strong><span>Participants who asked Kydos for help</span></section>
        <section className="portal-stat card"><small>Low confidence</small><strong>{lowConfidence}</strong><span>Current confidence score of 1 or 2</span></section>
        <section className="portal-stat card"><small>Missing this week</small><strong>{missing}</strong><span>No current-week check-in yet</span></section>
        <section className="portal-stat card"><small>Clear</small><strong>{clear}</strong><span>Current check-in with no support signal</span></section>
      </div>

      <section className="admin-filter-panel card">
        <form method="get" className="admin-filter-grid">
          <div className="field">
            <label htmlFor="checkin-q">Search</label>
            <input id="checkin-q" name="q" defaultValue={filters.q || ""} placeholder="Participant or email" />
          </div>
          <div className="field">
            <label htmlFor="checkin-signal">Support signal</label>
            <select id="checkin-signal" name="signal" className="select" defaultValue={signalFilter}>
              <option value="">All participants</option>
              <option value="support_requested">Support requested</option>
              <option value="low_confidence">Low confidence</option>
              <option value="missing">Current check-in missing</option>
              <option value="clear">Clear</option>
            </select>
          </div>
          <div className="admin-filter-actions">
            <button className="btn btn-primary" type="submit">Apply filters</button>
            <Link className="btn" href="/admin/check-ins">Clear</Link>
          </div>
        </form>
      </section>

      <section style={{ marginTop: 30 }}>
        <div className="portal-section-heading">
          <div>
            <span className="eyebrow">Current participant pulse</span>
            <h2>{filtered.length} participant{filtered.length === 1 ? "" : "s"}</h2>
            <p className="muted">The latest submitted check-in is shown. Support requests and low-confidence responses are only treated as current when they belong to this week.</p>
          </div>
        </div>

        {filtered.length ? (
          <div className="attention-list">
            {filtered.map((row) => (
              <article className="attention-row card" key={String(row.user_id)}>
                <div>
                  <small>{String(row.tier)} · {signalLabels[row.signal]}</small>
                  <strong>{String(row.full_name)}</strong>
                  <span>{String(row.email)}</span>
                  <span>
                    Latest week: {row.week_start ? String(row.week_start) : "No check-in yet"}
                    {row.confidence != null ? ` · confidence ${String(row.confidence)}/5` : ""}
                  </span>
                  {row.support_needed ? <span><strong>Support:</strong> {String(row.support_needed)}</span> : null}
                  {row.blockers ? <span><strong>Blockers:</strong> {String(row.blockers)}</span> : null}
                  {row.next_focus ? <span><strong>Next focus:</strong> {String(row.next_focus)}</span> : null}
                </div>
                <Link className="btn" href={"/admin/participants/" + String(row.user_id)}>Review participant</Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="notice attention-clear">No participants match these filters.</div>
        )}
      </section>
    </main>
  );
}
