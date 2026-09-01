import type { Metadata } from "next";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "Pre-launch Kydos Academy refund and cancellation policy, pending legal approval.",
  alternates: { canonical: "/legal/refunds" }
};

export default function RefundPolicyPage() {
  return (
    <>
      <PublicHeader />
      <main className="container legal-page">

      <span className="pill" >Draft for solicitor review</span>
      <h1>Refund & Cancellation Policy</h1>

      <div className="notice">
        This is a pre-launch draft. The final customer-facing policy will be published after legal review.
      </div>

      <section className="legal-copy">
        <h2>Commercial position</h2>
        <p>Kydos requires full payment. The programme does not operate a general discretionary change-of-mind refund scheme after access and implementation have begun.</p>

        <h2>Consumer rights</h2>
        <p>Where UK consumer cancellation rights apply, they take priority over any inconsistent commercial wording.</p>

        <h2>Immediate digital access</h2>
        <p>The live checkout will record express consent and acknowledgement before immediate digital content is supplied where the law requires it.</p>

        <h2>Early service start</h2>
        <p>The live checkout will also record an express request before Kydos starts support or implementation services during any applicable cancellation period.</p>

        <h2>Delivery failure</h2>
        <p>If Kydos materially fails to provide contracted work, the complaints process and applicable legal remedies remain available.</p>
      </section>
    </main>
      <PublicFooter />
    </>
  );
}
