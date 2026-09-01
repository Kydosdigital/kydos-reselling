import Link from "next/link";
import { requireAdminContext } from "@/lib/academy";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  await requireAdminContext();
  const sql = getSql();

  const rows = await sql.query(
    "select l.id, l.action, l.target_type, l.target_id, l.details, l.created_at, u.full_name as actor_name, u.email as actor_email from academy_audit_log l left join academy_users u on u.id = l.actor_user_id order by l.created_at desc limit 250"
  );

  return (
    <main className="container admin-page">
      <Link className="muted" href="/admin">← Programme operations</Link>

      <div className="portal-top" style={{ marginTop: 18 }}>
        <div>
          <span className="pill">Audit</span>
          <h1>Academy audit log</h1>
          <p className="muted">Recent participant, enrolment, implementation and handover actions recorded by the application.</p>
        </div>
      </div>

      <div className="admin-table-wrap card">
        <table className="admin-table audit-table">
          <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th><th>Details</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)}>
                <td>{String(row.created_at)}</td>
                <td>{row.actor_name ? String(row.actor_name) : "System"}<small className="table-subline">{row.actor_email ? String(row.actor_email) : ""}</small></td>
                <td><strong>{String(row.action).replaceAll("_", " ")}</strong></td>
                <td>{row.target_type ? String(row.target_type) : "—"}{row.target_id ? <small className="table-subline">{String(row.target_id)}</small> : null}</td>
                <td><code className="audit-details">{JSON.stringify(row.details || {})}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
