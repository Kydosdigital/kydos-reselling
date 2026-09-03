import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { signOut } from "@/app/login/actions";


export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true }
};

export default function AccessPendingPage() {
  return (
    <main className="auth-wrap">
      <section className="auth-card card access-pending-card">
        <Link href="/" className="brand" aria-label="Kydos Academy home">
          <BrandLogo variant="light" className="academy-logo-auth" />
        </Link>

        <div style={{ marginTop: 28 }}>
          <span className="pill">Access not activated</span>
          <h2 style={{ marginTop: 14 }}>This login is not linked to an Academy place yet.</h2>
          <p className="muted">
            Your authentication account exists, but Kydos Academy has not found an authorised programme profile for this email address.
          </p>

          <div className="notice">
            If you have already paid or Kydos created this account for you, contact Support@kydosdigital.com using the same email address you used for your programme enrolment.
          </div>

          <div className="access-pending-actions">
            <a className="btn btn-primary" href="mailto:Support@kydosdigital.com?subject=Kydos%20Academy%20Access">Contact Kydos support</a>
            <form action={signOut}>
              <button className="btn" type="submit">Sign out</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
