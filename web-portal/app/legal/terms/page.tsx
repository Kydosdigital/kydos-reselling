import type { Metadata } from "next";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata: Metadata = {
  title: "Programme Terms",
  description: "Pre-launch Kydos Academy programme terms, pending solicitor approval.",
  alternates: { canonical: "/legal/terms" }
};

export default function ProgrammeTermsPage() {
  return (
    <>
      <PublicHeader />
      <main className="container legal-page">

      <span className="pill" >Draft for solicitor review</span>
      <h1>Programme Terms</h1>

      <div className="notice">
        This online copy is not marked final while Kydos completes its professional legal review. Live checkout remains disabled until the approved wording is published.
      </div>

      <section className="legal-copy">
        <h2>Programme structure</h2>
        <p>The programme is provided by KYDOS DIGITAL LTD and is designed to help participants establish and operate their own independent digital marketing agency.</p>

        <h2>Payment</h2>
        <p>Programme fees are paid in full before access or implementation begins.</p>

        <h2>Scope</h2>
        <p>The selected Blueprint, Build With Us or Done For You Delivery Pack defines the included services and support period.</p>

        <h2>No business-result guarantee</h2>
        <p>Kydos does not guarantee clients, leads, turnover, profit, advertising results, sponsor-licence approval or immigration outcomes.</p>

        <h2>Professional advice</h2>
        <p>Legal, tax, accounting and immigration matters that require regulated advice must be handled by the appropriate professional.</p>

        <h2>Statutory rights</h2>
        <p>Nothing in the final terms will exclude rights that cannot lawfully be excluded.</p>
      </section>
    </main>
      <PublicFooter />
    </>
  );
}
