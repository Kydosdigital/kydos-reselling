export function HomeStructuredData() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "KYDOS DIGITAL LTD",
      url: "https://kydosdigital.com",
      email: "Support@kydosdigital.com",
      telephone: "+44 7860 254271",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Manchester",
        addressCountry: "GB"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Kydos Academy",
      url: "https://academy.kydosdigital.com"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Kydos Academy Digital Marketing Agency Build Programme",
      provider: {
        "@type": "Organization",
        name: "KYDOS DIGITAL LTD"
      },
      areaServed: "United Kingdom",
      description: "A practical programme for building the company, brand, website, CRM, sales, team and delivery systems behind a UK digital marketing agency.",
      offers: [
        {
          "@type": "Offer",
          name: "Blueprint",
          price: "2500",
          priceCurrency: "GBP"
        },
        {
          "@type": "Offer",
          name: "Build With Us",
          price: "5000",
          priceCurrency: "GBP"
        },
        {
          "@type": "Offer",
          name: "Done For You",
          price: "10000",
          priceCurrency: "GBP"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do I need digital marketing experience?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The programme teaches the agency operating system. Specialist media buying, SEO or development skills can be learned separately or fulfilled by competent specialists."
          }
        },
        {
          "@type": "Question",
          name: "Will Kydos guarantee clients or revenue?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Kydos provides the systems, implementation and support included in the selected tier. Commercial results depend on execution, market, offer, sales, budget and team performance."
          }
        },
        {
          "@type": "Question",
          name: "Is the initial Meta advertising budget included?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The recommended £300 starting media budget is separate from the programme fee."
          }
        },
        {
          "@type": "Question",
          name: "Does this guarantee a sponsor licence or visa?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The programme is focused on building a genuine business. Personal immigration advice must be provided separately by a suitably regulated immigration adviser or solicitor."
          }
        }
      ]
    }
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
