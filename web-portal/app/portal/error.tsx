"use client";

export default function PortalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="app-error card">
      <span className="eyebrow">Kydos Academy</span>
      <h1>We couldn’t load this part of your portal.</h1>
      <p>
        Your account has not been changed. Try the page again, and if the problem continues contact Kydos support with the page you were opening.
      </p>
      <div className="app-error-actions">
        <button className="btn btn-primary" type="button" onClick={() => reset()}>Try again</button>
        <a className="btn" href="/portal">Return to dashboard</a>
        <a className="btn" href="mailto:Support@kydosdigital.com?subject=Kydos%20Academy%20Portal%20Issue">Email support</a>
      </div>
    </section>
  );
}
