import Link from "next/link";
import { requireAdminContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { accessibleLessons, tierLabels, type Tier } from "@/lib/programme-data";
import { impersonateE2EUser } from "./actions";

export const dynamic = "force-dynamic";

export default async function E2ELabPage() {
  await requireAdminContext();
  const sql = getSql();

  const [users, progress] = await Promise.all([
    sql.query(
      "select u.id, u.auth_user_id, u.full_name, u.email, u.last_login_at, u.last_seen_at, u.login_count, e.tier, e.programme_start, e.support_end from academy_users u join enrolments e on e.user_id = u.id and e.status = 'active' where u.role = 'student' and u.is_test = true order by e.tier"
    ),
    sql.query(
      "select lp.user_id, count(*)::int as completed from lesson_progress lp join academy_users u on u.id = lp.user_id where u.is_test = true group by lp.user_id"
    )
  ]);

  const progressMap = new Map(progress.map((row) => [String(row.user_id), Number(row.completed || 0)]));

  return (
    <main className="container admin-page">
      <div className="portal-top">
        <div>
          <span className="pill">Kydos Super Admin</span>
          <h1>E2E testing lab</h1>
          <p className="muted">Use the three synthetic participant accounts to test the real Blueprint, Build With Us and Done For You experiences without affecting live customer analytics.</p>
        </div>
        <div className="admin-top-actions">
          <Link className="btn" href="/admin/analytics">Analytics</Link>
          <Link className="btn" href="/admin">Operations</Link>
        </div>
      </div>

      <div className="notice">
        These accounts and their synthetic payments are explicitly marked as E2E test data. They are excluded from normal Super Admin commercial analytics unless you switch test mode on.
      </div>

      <section className="e2e-grid">
        {users.map((user) => {
          const tier = user.tier as Tier;
          const completed = progressMap.get(String(user.id)) || 0;
          const total = accessibleLessons(tier).length;
          const percent = total ? Math.round((completed / total) * 100) : 0;

          return (
            <article className="card e2e-card" key={String(user.id)}>
              <div>
                <span className="eyebrow">{tierLabels[tier]}</span>
                <h2>{String(user.full_name)}</h2>
                <p>{String(user.email)}</p>
              </div>

              <dl>
                <div><dt>Progress</dt><dd>{completed}/{total} lessons · {percent}%</dd></div>
                <div><dt>Login count</dt><dd>{Number(user.login_count || 0)}</dd></div>
                <div><dt>Last seen</dt><dd>{user.last_seen_at ? String(user.last_seen_at) : "Never"}</dd></div>
                <div><dt>Programme start</dt><dd>{String(user.programme_start || "Not set")}</dd></div>
              </dl>

              <form action={impersonateE2EUser}>
                <input type="hidden" name="academyUserId" value={String(user.id)} />
                <button className="btn btn-primary" style={{ width: "100%" }} type="submit">
                  Open {tierLabels[tier]} as participant
                </button>
              </form>
            </article>
          );
        })}
      </section>

      <section className="panel card" style={{ marginTop: 24 }}>
        <span className="eyebrow">E2E checklist</span>
        <h2>What to verify in each tier</h2>
        <div className="e2e-checklist">
          <span>Dashboard and next-step recommendation</span>
          <span>Module/lesson tier restrictions</span>
          <span>Lesson completion and notes</span>
          <span>Participant intake</span>
          <span>Weekly check-in</span>
          <span>Implementation task updates</span>
          <span>Launch plan and readiness</span>
          <span>Downloads and protected access</span>
          <span>Account/support dates</span>
          <span>Return to Super Admin</span>
        </div>
      </section>
    </main>
  );
}
