import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function PublicFooter() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand" aria-label="Kydos Academy home">
            <BrandLogo variant="light" className="academy-logo-footer" />
          </Link>
          <p>
            A Kydos Digital programme for building a structured UK digital marketing agency.
          </p>
        </div>

        <div>
          <strong>Explore</strong>
          <p>
            <Link href="/programme">Programme</Link><br />
            <Link href="/compare">Compare plans</Link><br />
            <Link href="/consultation">Consultation</Link><br />
            <Link href="/blog">Agency guides</Link><br />
            <a href="https://kydosdigital.com">Kydos Digital</a>
          </p>
        </div>

        <div>
          <strong>Participants</strong>
          <p>
            <Link href="/login">Login</Link><br />
            <Link href="/legal/terms">Terms</Link><br />
            <Link href="/legal/refunds">Refunds</Link><br />
            <Link href="/legal/privacy">Privacy</Link>
          </p>
        </div>

        <div>
          <strong>Contact</strong>
          <p>
            Support@kydosdigital.com<br />
            +44 7860 254271<br />
            Manchester, United Kingdom
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} KYDOS DIGITAL LTD. All rights reserved.</span>
        <span>Kydos Academy is operated by KYDOS DIGITAL LTD.</span>
      </div>
    </footer>
  );
}
