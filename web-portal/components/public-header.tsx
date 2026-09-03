import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function PublicHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner academy-header-inner">
        <Link href="/" className="brand" aria-label="Kydos Academy home">
          <BrandLogo variant="light" className="academy-logo-header" />
        </Link>

        <nav className="nav academy-nav" aria-label="Primary navigation">
          <Link href="/#what-you-build">What you build</Link>
          <Link href="/#how">How it works</Link>
          <Link href="/#plans">Plans</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/blog">Guides</Link>
          <Link href="/login">Login</Link>
          <Link className="btn btn-primary" href="/consultation">Book a consultation</Link>
        </nav>
      </div>
    </header>
  );
}
