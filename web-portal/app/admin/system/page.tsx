import Link from "next/link";
import { requireAdminContext } from "@/lib/academy";
import { getSql, isDatabaseConfigured } from "@/lib/db";
import { isNeonAuthConfigured } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

type Check = {
  label: string;
  ok: boolean;
  detail: string;
  severity?: "normal" | "warning";
};

export default async function AdminSystemPage() {
  await requireAdminContext();

  let databaseReachable = false;
  let databaseError = "";
  if (isDatabaseConfigured()) {
    try {
      const sql = getSql();
      await sql.query("select 1 as ok");
      databaseReachable = true;
    } catch (error) {
      databaseError = error instanceof Error ? error.message : "Database connection failed";
    }
  }

  const requiredRuntime = [
    "DATABASE_URL",
    "NEON_AUTH_BASE_URL",
    "NEON_AUTH_COOKIE_SECRET",
    "ACADEMY_ADMIN_EMAILS",
    "NEXT_PUBLIC_APP_URL"
  ];

  const recommendedRuntime = [
    "NEON_DATA_API_URL",
    "NEXT_PUBLIC_CONSULTATION_URL"
  ];

  const stripeRuntime = [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PRICE_BLUEPRINT",
    "STRIPE_PRICE_BUILD",
    "STRIPE_PRICE_DFY"
  ];

  const missingRequired = requiredRuntime.filter((key) => !process.env[key]);
  const missingRecommended = recommendedRuntime.filter((key) => !process.env[key]);
  const missingStripe = stripeRuntime.filter((key) => !process.env[key]);

  const checkoutEnabled = process.env.ENABLE_LIVE_CHECKOUT === "true";
  const indexingEnabled = process.env.NEXT_PUBLIC_ENABLE_INDEXING === "true";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "Not configured";

  const checks: Check[] = [
    {
      label: "Neon database",
      ok: isDatabaseConfigured() && databaseReachable,
      detail: databaseReachable ? "Configured and responding to server-side queries." : databaseError || "DATABASE_URL is not configured."
    },
    {
      label: "Neon Managed Auth",
      ok: isNeonAuthConfigured(),
      detail: isNeonAuthConfigured() ? "Auth URL and cookie secret are configured." : "Managed Auth runtime variables are incomplete."
    },
    {
      label: "Neon Data API",
      ok: Boolean(process.env.NEON_DATA_API_URL),
      detail: process.env.NEON_DATA_API_URL ? "Data API endpoint is configured." : "NEON_DATA_API_URL has not been added to the runtime."
    },
    {
      label: "Core production variables",
      ok: missingRequired.length === 0,
      detail: missingRequired.length ? "Missing: " + missingRequired.join(", ") : "All core runtime variable names are present."
    },
    {
      label: "Stripe test configuration",
      ok: missingStripe.length === 0,
      detail: missingStripe.length ? "Still missing: " + missingStripe.join(", ") : "Stripe runtime variables are present. This does not mean live checkout is approved."
    },
    {
      label: "Live checkout safety gate",
      ok: !checkoutEnabled,
      detail: checkoutEnabled ? "Live checkout is ON. Confirm legal and QA approval immediately." : "Live checkout remains OFF, which is correct during prelaunch.",
      severity: checkoutEnabled ? "warning" : "normal"
    },
    {
      label: "Search indexing safety gate",
      ok: !indexingEnabled,
      detail: indexingEnabled ? "Search indexing is ON." : "Search indexing remains OFF during prelaunch.",
      severity: indexingEnabled ? "warning" : "normal"
    }
  ];

  return (
    <main className="container admin-page">
      <div className="admin-task-breadcrumbs">
        <Link href="/admin">Programme operations</Link>
        <span>→</span>
        <strong>System status</strong>
      </div>

      <div className="portal-top">
        <div>
          <span className="pill">Kydos Admin</span>
          <h1>System status</h1>
          <p className="muted">A safe operational view of the Academy runtime. This page never displays secret values.</p>
        </div>
      </div>

      <div className="system-check-grid">
        {checks.map((check) => (
          <section className={"system-check card " + (check.ok ? "is-ok" : "needs-attention")} key={check.label}>
            <div className="system-check-top">
              <span>{check.ok ? "✓" : "!"}</span>
              <strong>{check.label}</strong>
            </div>
            <p>{check.detail}</p>
          </section>
        ))}
      </div>

      <div className="admin-detail-grid system-meta-grid">
        <section className="panel card">
          <span className="eyebrow">Deployment</span>
          <dl className="account-details">
            <div><dt>App URL</dt><dd>{appUrl}</dd></div>
            <div><dt>Vercel environment</dt><dd>{process.env.VERCEL_ENV || "Local / unavailable"}</dd></div>
            <div><dt>Git commit</dt><dd>{process.env.VERCEL_GIT_COMMIT_SHA ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 12) : "Unavailable"}</dd></div>
            <div><dt>Deployment host</dt><dd>{process.env.VERCEL_URL || "Unavailable"}</dd></div>
          </dl>
        </section>

        <section className="panel card">
          <span className="eyebrow">Remaining configuration</span>
          <div className="compact-list">
            <div>
              <strong>Recommended runtime variables</strong>
              <span>{missingRecommended.length ? missingRecommended.join(", ") : "None missing"}</span>
            </div>
            <div>
              <strong>Stripe variables</strong>
              <span>{missingStripe.length ? missingStripe.join(", ") : "All present"}</span>
            </div>
            <div>
              <strong>Manual launch gates</strong>
              <span>Database migrations, first admin QA, Auth production settings, legal review and Stripe test-mode QA.</span>
            </div>
          </div>
        </section>
      </div>

      <div className="notice" style={{ marginTop: 18 }}>
        A green system check only confirms technical configuration. It does not override the legal, security, content or commercial launch gates in the Academy production checklist.
      </div>
    </main>
  );
}
