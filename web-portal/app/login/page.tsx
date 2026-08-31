import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-wrap">
      <section className="auth-card card">
        <Link href="/" className="brand">
          <span className="brand-mark" />
          <span>Kydos Digital</span>
        </Link>

        <h2 style={{ marginTop: 28 }}>Programme login</h2>
        <p className="muted">Access your agency launch plan, templates, progress and support information.</p>

        {params.error ? <div className="notice">The email or password was not recognised. Please try again.</div> : null}

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
