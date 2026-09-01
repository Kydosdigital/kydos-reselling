import Link from "next/link";

const consultationUrl =
  process.env.NEXT_PUBLIC_CONSULTATION_URL ||
  "/consultation";

export function PublicHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Kydos Academy home">
          <span className="brand-mark" />
          <span>Kydos Academy</span>
        </Link>

        <nav className="nav desktop-nav" aria-label="Primary navigation">
          <Link href="/programme">Programme</Link>
          <Link href="/compare">Compare plans</Link>
          <Link href="/consultation">Consultation</Link>
          <Link href="/login">Login</Link>
          <a className="btn btn-primary" href={consultationUrl}>Book a consultation</a>
        </nav>

        <details className="mobile-menu">
          <summary aria-label="Open navigation">
            <span />
            <span />
            <span />
          </summary>
          <nav className="mobile-menu-panel" aria-label="Mobile navigation">
            <Link href="/programme">Programme</Link>
            <Link href="/compare">Compare plans</Link>
            <Link href="/consultation">Consultation</Link>
            <Link href="/login">Participant login</Link>
            <a className="btn btn-primary" href={consultationUrl}>Book a consultation</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
