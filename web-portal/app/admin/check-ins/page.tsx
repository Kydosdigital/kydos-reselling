import Link from "next/link";
import { requireAdminContext } from "@/lib/academy";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

function excerpt(value: unknown, fallback: string) {
  const text = String(value || "").trim();
  return text ? (text.length > 180 ? text.slice(0, 177) + "..." : text) : fallback;
}

export default async function AdminCheckInsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; signal?: string }>;
}) {
  await requireAdminContext();
  const filters = await searchParams;
  const sql = getSql();

  const checkIns = await sql.query(
    "select c.id, c.user_id, c.week_start, c.wins, c.blockers, c.next_focus, c.support_needed, c.confidence, c.submitted_at, c.updated_at, u.full_name, u.email, e.tier from participant_weekly_checkins c join academy_users u on u.id = c.user_id left join enrolments e on e.user_id = c.user_id and e.status = 'active' order by c.week_start desc, c.updated_at desc limit 250"
  );

  const q = String(filters.q || "").trim().toLowerCase();
  const signal = String(filters.signal || "");
  const filtered = checkIns.filter((row) => {
    const searchable = [row.full_name, row.email, row.wins, row.blockers, row.next_focus, row.support_needed]
      .map((value) => String(value || "").toLowerCase())
      .join(" ");
    const matchesText = !q || searchable.includes(q);
    const needsSupport = Boolean(String(row.support_needed || "").trim());
    const lowConfidence = Number(row.confidence || 0) > 0 && Number(row.confidence) <= 2;
    const hasBlockers = Boolean(String(row.blockers || "").trim());
    const matchesSignal = !signal ||
      (signal === "support" && needsSupport) ||
      (signal === "low_confidence" && lowConfidence) ||
      (signal === "blockers" && hasBlockers);
    return matchesText && matchesSignal;
  });

  const latestByParticipant = new Map<string, (typeof checkIns)[number]>();
  for (const row of checkIns) {
    const key = String(row.user_id);
    if (!latestByParticipant.has(key)) latestByParticipant.set(key, row);
  }
  const latest = Array.from(latestByParticipant.values());
  const lowConfidenceCount = latest.filter((row) => Number(row.confidence || 0) > 0 && Number(row.confidence) <= 2).length;
  const supportRequestedCount = latest.filter((row) => Boolean(String(row.support_needed || "").trim())).length;
  const blockerCount = latest.filter((row) => Boolean(String(row.blockers || "").trim())).length;

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
          <p className="muted">Review participant progress, blockers, confidence and requests for Kydos support in one place.</p>
        </div>
        <div className="admin-top-actions">
          <Link className="btn" href="/admin/attention">Attention queue</Link>
          <Link className="btn" href="/admin">Programme operations</Link>
        </div>
      </div>

      <div className="portal-stat-grid">
        <section className="portal-stat card"><small>Participants reporting</small><strong>{latest.length}</strong><span>Latest check-in represented</span></section>
        <section className="portal-stat card"><small>Support requested</small><strong>{supportRequestedCount}</strong><span>Latest check-in asks Kydos for help</span></section>
        <section className="portal-stat card"><small>Low confidence</small><strong>{lowConfidenceCount}</strong><span>Latest confidence is 1 or 2 out of 5</span></section>
        <section className="portal-stat card"><small>Blockers recorded</small><strong>{blockerCount}</strong><span>Latest check-in contains a blocker</span></section>
      </div>

      <section className="admin-filter-panel card">
        <form method="get" className="admin-filter-grid">
          <div className="field">
            <label htmlFor="checkin-q">Search</label>
            <input id="checkin-q" name="q" defaultValue={filters.q || ""} placeholder="Participant, email, blocker or support request" />
          </div>
          <div className="field">
            <label htmlFor="checkin-signal">Signal</label>
            <select id="checkin-signal" name="signal" className="select" defaultValue={signal}>
              <option value="">All check-ins</option>
              <option value="support">Support requested</option>
              <option value="low_confidence">Low confidence</option>
              <option value="blockers">Blockers recorded</option>
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
          <div><span className="eyebrow">Check-in history</span><h2>Participant updates</h2><p className="muted">{filtered.length} matching check-in{filtered.length === 1 ? "" : "s"}</p></div>
        </div>
        {filtered.length ? (
          <div className="attention-list">
            {filtered.map((row) => {
              const confidence = row.confidence ? Number(row.confidence) : null;
              const needsSupport = Boolean(String(row.support_needed || "").trim());
              const lowConfidence = confidence !== null && confidence <= 2;
              return (
                <article className="attention-row card" key={String(row.id)}>
                  <div>
                    <small>Week of {String(row.week_start)} · {row.tier ? String(row.tier) : "No active tier"}{confidence ? " · Confidence " + confidence + "/5" : ""}</small>
                    <strong>{String(row.full_name)}</strong>
                    <span>{excerpt(row.next_focus, "No next focus recorded.")}</span>
                    {row.blockers ? <span><b>Blockers:</b> {excerpt(row.blockers, "None recorded.")}</span> : null}
                    {needsSupport ? <span><b>Kydos support:</b> {excerpt(row.support_needed, "Support requested.")}</span> : null}
                    {lowConfidence ? <span><b>Attention:</b> Participant reported low confidence.</span> : null}
                  </div>
                  <Link className="btn" href={"/admin/participants/" + String(row.user_id)}>Review participant</Link>
                </article>
              );
            })}
          </div>
        ) : <div className="notice attention-clear">No weekly check-ins match the current filters.</div>}
      </section>
    </main>
  );
}
