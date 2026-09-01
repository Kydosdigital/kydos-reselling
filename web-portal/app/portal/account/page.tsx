import Link from "next/link";
import { getActiveEnrolment, requireAcademyContext } from "@/lib/academy";
import { tierLabels, type Tier } from "@/lib/programme-data";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { academyUser, authUser } = await requireAcademyContext();
  const enrolment = await getActiveEnrolment(academyUser.id);
  const tier = enrolment?.tier as Tier | undefined;

  return (
    <>
      <div className="portal-top">
        <div>
          <span className="pill">My account</span>
          <h1>{academyUser.full_name}</h1>
          <p className="muted">Your programme identity, access and support information.</p>
        </div>
      </div>

      <div className="account-grid">
        <section className="panel card">
          <span className="eyebrow">Profile</span>
          <dl className="account-details">
            <div><dt>Name</dt><dd>{academyUser.full_name}</dd></div>
            <div><dt>Login email</dt><dd>{academyUser.email}</dd></div>
            <div><dt>Account role</dt><dd>{academyUser.role === "admin" ? "Kydos administrator" : "Participant"}</dd></div>
            <div><dt>Auth account</dt><dd>{authUser.email || academyUser.email}</dd></div>
          </dl>
        </section>

        <section className="panel card">
          <span className="eyebrow">Programme access</span>
          <dl className="account-details">
            <div><dt>Plan</dt><dd>{tier ? tierLabels[tier] : "Pending activation"}</dd></div>
            <div><dt>Status</dt><dd>{enrolment?.status || "Pending"}</dd></div>
            <div><dt>Programme start</dt><dd>{enrolment?.programme_start || "Not set"}</dd></div>
            <div><dt>Support end</dt><dd>{enrolment?.support_end || (tier === "dfy" ? "Begins after formal handover" : "Not set")}</dd></div>
            {tier === "dfy" ? <div><dt>Formal handover</dt><dd>{enrolment?.handover_date || "Not recorded yet"}</dd></div> : null}
          </dl>
        </section>
      </div>

      <section className="support-card card">
        <div>
          <span className="eyebrow">Need help?</span>
          <h2>Programme support</h2>
          <p>Use your agreed WhatsApp support route during your active support period, or email the Manchester team for account and access issues.</p>
        </div>
        <div className="support-actions">
          <a className="btn btn-primary" href="https://wa.me/447860254271">WhatsApp Kydos</a>
          <a className="btn" href="mailto:Support@kydosdigital.com?subject=Kydos%20Academy%20Support">Email support</a>
          <Link className="btn" href="/portal/implementation">Implementation board</Link>
        </div>
      </section>

      <div className="notice" style={{ marginTop: 18 }}>
        For login security or a password reset, contact Kydos support while the Academy email-reset flow is being finalised.
      </div>
    </>
  );
}
