import Link from "next/link";
import { requireAdminContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { tierLabels, type Tier } from "@/lib/programme-data";

export const dynamic = "force-dynamic";

function money(amount: unknown, currency: unknown) {
  if (amount === null || amount === undefined) return "Not recorded";
  return (Number(amount) / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: String(currency || "GBP").toUpperCase()
  });
}

export default async function AdminOrdersPage() {
  await requireAdminContext();
  const sql = getSql();

  const rows = await sql.query(
    "select o.id, o.stripe_session_id, o.stripe_payment_intent_id, o.user_id, o.email, o.full_name, o.tier, o.amount_total, o.currency, o.terms_accepted, o.digital_content_consent, o.early_service_start_consent, o.consent_timestamp, o.status, o.provisioned_at, o.created_at, u.full_name as participant_name from programme_orders o left join academy_users u on u.id = o.user_id order by o.created_at desc limit 250"
  );

  const paid = rows.filter((row) => String(row.status) === "paid");
  const awaitingActivation = paid.filter((row) => !row.provisioned_at);

  return (
    <main className="container admin-page">
      <Link className="muted" href="/admin">← Programme operations</Link>

      <div className="portal-top" style={{ marginTop: 18 }}>
        <div>
          <span className="pill">Payments</span>
          <h1>Programme orders</h1>
          <p className="muted">Stripe orders, consent evidence and account-provisioning status.</p>
        </div>
      </div>

      <div className="portal-stat-grid">
        <section className="portal-stat card"><small>Orders shown</small><strong>{rows.length}</strong><span>Most recent programme orders</span></section>
        <section className="portal-stat card"><small>Paid</small><strong>{paid.length}</strong><span>Orders currently marked paid</span></section>
        <section className="portal-stat card"><small>Awaiting activation</small><strong>{awaitingActivation.length}</strong><span>Paid orders without portal provisioning</span></section>
        <section className="portal-stat card"><small>Provisioned</small><strong>{paid.filter((row) => row.provisioned_at).length}</strong><span>Paid orders linked to an Academy account</span></section>
      </div>

      {awaitingActivation.length ? (
        <div className="notice">
          {awaitingActivation.length} paid {awaitingActivation.length === 1 ? "order is" : "orders are"} waiting for participant account activation.
        </div>
      ) : null}

      <section style={{ marginTop: 24 }}>
        <div className="admin-table-wrap card">
          <table className="admin-table order-table">
            <thead>
              <tr><th>Participant</th><th>Plan</th><th>Amount</th><th>Status</th><th>Consents</th><th>Provisioning</th><th>Created</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={String(row.id)}>
                  <td>
                    {row.user_id ? <Link className="admin-person-link" href={"/admin/participants/" + String(row.user_id)}>{String(row.participant_name || row.full_name || row.email)}</Link> : <strong>{String(row.full_name || row.email)}</strong>}
                    <small className="table-subline">{String(row.email)}</small>
                  </td>
                  <td>{tierLabels[String(row.tier) as Tier] || String(row.tier)}</td>
                  <td>{money(row.amount_total, row.currency)}</td>
                  <td><span className="table-status">{String(row.status)}</span></td>
                  <td>
                    <div className="consent-mini">
                      <span>{row.terms_accepted ? "✓" : "×"} Terms</span>
                      <span>{row.digital_content_consent ? "✓" : "×"} Digital</span>
                      <span>{row.early_service_start_consent ? "✓" : "×"} Early service</span>
                    </div>
                  </td>
                  <td>{row.provisioned_at ? "Provisioned" : "Activation pending"}</td>
                  <td>{String(row.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
