"use client";

export default function AdminError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container admin-page">
      <section className="app-error card">
        <span className="eyebrow">Kydos Admin</span>
        <h1>This admin view couldn’t be loaded.</h1>
        <p>
          No corrective action has been taken automatically. Retry the request, then check System Status if the problem persists.
        </p>
        <div className="app-error-actions">
          <button className="btn btn-primary" type="button" onClick={() => reset()}>Try again</button>
          <a className="btn" href="/admin">Programme operations</a>
          <a className="btn" href="/admin/system">System status</a>
        </div>
      </section>
    </main>
  );
}
