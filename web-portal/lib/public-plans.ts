export const publicPlans = {
  blueprint: {
    slug: "blueprint",
    name: "Blueprint",
    price: "£2,500",
    strapline: "Build it yourself with the complete Kydos operating system.",
    bestFor: "Someone who wants the full structure, templates and support, but is comfortable implementing the business themselves.",
    support: "8 weeks standard WhatsApp support",
    included: [
      "Complete agency launch roadmap",
      "UK company setup and compliance guides",
      "Banking, accounting and finance system",
      "Brand, domain, email and website planning templates",
      "CRM setup manual, sales pipeline and automations",
      "Sales scripts, qualification and objection handling",
      "Client onboarding and social media fulfilment system",
      "Recruitment SOPs, job descriptions and candidate scorecards",
      "Meta Ads, Google Ads, SEO, website and CRM service SOPs",
      "Operations, reporting, retention and finance templates",
      "Editable calculators, trackers and worked examples",
      "8 weeks standard WhatsApp implementation support"
    ],
    notIncluded: [
      "Done-for-you branding",
      "Website build as standard",
      "Done-for-you CRM configuration",
      "Recruitment performed by Kydos",
      "Advertising spend",
      "Third-party software/provider fees"
    ],
    outcome: "You leave with the complete framework and tools to build and operate your own agency, while remaining responsible for implementation."
  },
  build: {
    slug: "build",
    name: "Build With Us",
    price: "£5,000",
    strapline: "Build the agency with Kydos actively implementing the core infrastructure.",
    bestFor: "Someone who wants to own and run the agency, but does not want to build every foundational system from scratch.",
    support: "12 weeks priority implementation support",
    included: [
      "Everything in Blueprint",
      "Logo, colour palette, typography and basic brand guidelines created",
      "One standard five-page agency website built",
      "Branded CRM configured",
      "Sales pipeline, booking calendar and Stripe connection",
      "Lead follow-up automations configured where supported",
      "Initial Account Manager, Creative and Sales Closer recruitment support",
      "Initial Meta lead-generation campaign setup support",
      "12 weeks priority implementation support"
    ],
    notIncluded: [
      "Permanent agency management by Kydos",
      "Operations Manager recruitment as standard",
      "Advertising spend",
      "Ongoing specialist fulfilment unless separately agreed",
      "Third-party software/provider and usage fees",
      "Custom software, ecommerce or complex website functionality"
    ],
    outcome: "You leave with the core agency infrastructure built and tested, then you run the company and manage the team."
  },
  dfy: {
    slug: "dfy",
    name: "Done For You",
    price: "£10,000",
    strapline: "Have Kydos establish the core agency infrastructure and initial operating team.",
    bestFor: "Someone who wants the strongest implementation support and a clearer route towards overseeing the agency rather than building every system personally.",
    support: "Build support plus 90 days after formal handover",
    included: [
      "Everything in Build With Us",
      "Account Manager recruitment",
      "Creative recruitment",
      "Sales Closer setup",
      "Operations Manager recruitment",
      "Initial team onboarding and training",
      "Client delivery and quality-control structure",
      "Capacity, client health and management reporting systems",
      "Initial Meta lead-generation launch setup",
      "Formal agency handover pack",
      "90 days active post-handover support"
    ],
    notIncluded: [
      "Permanent operation of your company by Kydos",
      "Guaranteed leads, clients, revenue or profit",
      "Advertising spend",
      "Ongoing payroll/staff salaries",
      "Third-party software/provider charges",
      "Personal legal, tax or immigration advice"
    ],
    outcome: "Kydos hands over the agreed agency infrastructure, systems and initial team so you can own and oversee the business."
  }
} as const;

export type PublicPlanSlug = keyof typeof publicPlans;
