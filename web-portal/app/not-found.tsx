import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export default function NotFound() {
  return (
    <>
      <PublicHeader />
      <main className="not-found-page">
        <div className="container centred narrow">
          <span className="eyebrow">404</span>
          <h1>This page isn’t part of the Academy.</h1>
          <p className="hero-copy">
            The link may have moved, or the page may not exist yet. You can return to the Academy homepage or review the programme.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link className="btn btn-primary btn-large" href="/">Back to Academy</Link>
            <Link className="btn btn-large" href="/programme">View the programme</Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
