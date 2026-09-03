import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { login, signInWithGoogle } from "./actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; setup?: string; activated?: string; oauth?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-wrap">
      <section className="auth-card card">
        <Link href="/" className="brand" aria-label="Kydos Academy home">
          <BrandLogo variant="light" className="academy-logo-auth" />
        </Link>

        <h2 style={{ marginTop: 28 }}>Programme login</h2>
        <p className="muted">Access your agency launch plan, templates, progress and support information.</p>

        {params.setup === "pending" ? (
          <div className="notice">
            Participant login is being prepared. The public Academy website is available now, but the student portal will be activated after the programme backend is connected.
          </div>
        ) : null}

        {params.activated ? (
          <div className="notice">Your Academy account has been created. Sign in with the email and password you set during activation.</div>
        ) : null}

        {params.error ? <div className="notice">The email or password was not recognised. Please try again.</div> : null}
        {params.oauth === "error" ? <div className="notice">Google sign-in could not be completed. Please try again.</div> : null}

        <form action={signInWithGoogle}>
          <button className="btn google-auth-btn" style={{ width: "100%", marginBottom: 14 }} type="submit">
            Continue with Google
          </button>
        </form>

        <div className="auth-divider"><span>or sign in with password</span></div>

        <form action={login}>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} type="submit">
            Sign in
          </button>
        </form>

        <p className="muted" style={{ fontSize: 13, marginTop: 18 }}>
          Access is created after programme enrolment. Need help? Email Support@kydosdigital.com.
        </p>
      </section>
    </main>
  );
}
