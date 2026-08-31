import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="container legal-page">
      <Link href="/" className="brand">
        <span className="brand-mark" />
        <span>Kydos Digital</span>
      </Link>

      <span className="pill" style={{ marginTop: 28 }}>Draft for data-protection review</span>
      <h1>Programme Privacy Notice</h1>

      <div className="notice">
        This notice remains a pre-launch draft while the programme's final processors, retention periods and production systems are being confirmed.
      </div>

      <section className="legal-copy">
        <h2>Who we are</h2>
        <p>KYDOS DIGITAL LTD is the provider of the Kydos Digital agency programme.</p>

        <h2>Information we use</h2>
        <p>We may process contact details, billing records, programme tier, support communications, implementation information and files supplied for programme delivery.</p>

        <h2>Why we use it</h2>
        <p>We use information to manage enquiries, perform the programme contract, provide support, process payments, manage security and comply with legal obligations.</p>

        <h2>Sharing</h2>
        <p>Information may be shared with relevant software providers, payment processors and professional advisers where required and on an appropriate legal basis.</p>

        <h2>Your rights</h2>
        <p>Applicable UK GDPR rights may include access, correction, erasure, restriction, objection and portability depending on the circumstances.</p>

        <h2>Contact</h2>
        <p>Privacy queries can be sent to Support@kydosdigital.com.</p>
      </section>
    </main>
  );
}
