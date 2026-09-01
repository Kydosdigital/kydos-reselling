import Link from "next/link";
import { requireAdminContext } from "@/lib/academy";

export const dynamic = "force-dynamic";

const exports = [
  {
    type: "participants",
    title: "Participants",
    description: "Active programme tier, support dates, agency intake, launch-readiness inputs and participant contact details."
  },
  {
    type: "tasks",
    title: "Implementation tasks",
    description: "Task ownership, status, due dates and implementation notes for programme operations."
  },
  {
    type: "orders",
    title: "Programme orders",
    description: "Stripe reconciliation fields, payment status and recorded checkout consent evidence."
  }
];

export default async function AdminExportsPage() {
  await requireAdminContext();

  return (
    <main className="container admin-page">
      <div className="admin-task-breadcrumbs">
        <Link href="/admin">Programme operations</Link>
        <span>→</span>
        <strong>Exports</strong>
      </div>

      <div className="portal-top">
        <div>
          <span className="pill">Kydos Admin</span>
          <h1>Data exports</h1>
          <p className="muted">Download operational CSV copies for authorised Kydos use, reconciliation and controlled backup workflows.</p>
        </div>
      </div>

      <div className="export-grid">
        {exports.map((item) => (
          <section className="export-card card" key={item.type}>
            <span className="eyebrow">CSV export</span>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <a className="btn btn-primary" href={"/api/admin/export?type=" + item.type}>Download CSV</a>
          </section>
        ))}
      </div>

      <div className="notice" style={{ marginTop: 18 }}>
        Exports may contain personal or commercially sensitive data. Store them only in approved Kydos locations, do not share them through public links, and delete copies when they are no longer needed.
      </div>
    </main>
  );
}
