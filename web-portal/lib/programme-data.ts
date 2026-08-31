export type Tier = "blueprint" | "build" | "dfy";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  source: string;
  minimumTier?: Tier;
};

export type ProgrammeModule = {
  slug: string;
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
};

const tierRank: Record<Tier, number> = {
  blueprint: 1,
  build: 2,
  dfy: 3,
};

export const tierLabels: Record<Tier, string> = {
  blueprint: "Blueprint",
  build: "Build With Us",
  dfy: "Done For You",
};

export const modules: ProgrammeModule[] = [
  {
    slug: "start-here",
    number: 1,
    title: "Start Here",
    description: "Set your launch pace, understand the model and know exactly what happens next.",
    lessons: [
      { id: "start-overview", title: "Programme Overview", description: "How the Kydos agency operating system works.", source: "docs/00-PROGRAMME-MASTER-PLAN.md" },
      { id: "start-roadmap", title: "4-Week Launch Roadmap", description: "The core launch sequence from company setup to acquisition.", source: "docs/03-4-WEEK-LAUNCH-ROADMAP.md" },
      { id: "start-tiers", title: "Your Programme Tier", description: "What Kydos builds and what you own.", source: "docs/02-PROGRAMME-TIERS.md" }
    ]
  },
  {
    slug: "company",
    number: 2,
    title: "Company & Finance",
    description: "Create the company, banking, accounting and compliance foundation.",
    lessons: [
      { id: "company-setup", title: "UK Company Setup", description: "Structure and register the agency correctly.", source: "docs/08-UK-COMPANY-SETUP-GUIDE.md" },
      { id: "company-anna", title: "ANNA Money Route", description: "The Kydos beginner company-formation route.", source: "docs/10-ANNA-MONEY-SETUP-GUIDE.md" },
      { id: "company-bank", title: "NatWest Business Banking", description: "Set up the operating bank and FreeAgent route.", source: "docs/11-NATWEST-BUSINESS-BANKING-GUIDE.md" },
      { id: "company-finance", title: "Finance Routine", description: "Know your MRR, margin, costs and tax reserve.", source: "docs/14-FINANCE-MONTHLY-ROUTINE.md" }
    ]
  },
  {
    slug: "brand-website",
    number: 3,
    title: "Brand & Website",
    description: "Create an agency identity and a website that can generate enquiries.",
    lessons: [
      { id: "brand-name", title: "Agency Naming", description: "Choose a name that can grow with the business.", source: "docs/19-AGENCY-NAMING-GUIDE.md" },
      { id: "brand-brief", title: "Brand Brief", description: "Define positioning, audience and visual direction.", source: "templates/brand/BRAND-BRIEF-TEMPLATE.md" },
      { id: "brand-domain", title: "Domain & Email", description: "Own the domain and set up professional business email.", source: "docs/20-GODADDY-DOMAIN-SETUP-GUIDE.md" },
      { id: "brand-site", title: "5-Page Website Brief", description: "Plan the standard five-page agency website.", source: "templates/website/5-PAGE-WEBSITE-BRIEF.md" }
    ]
  },
  {
    slug: "crm-sales",
    number: 4,
    title: "CRM & Sales",
    description: "Capture leads, call quickly, qualify properly and turn interest into payment.",
    lessons: [
      { id: "crm-setup", title: "CRM Setup", description: "Configure the branded CRM and core sales infrastructure.", source: "docs/24-CRM-SETUP-MANUAL.md" },
      { id: "crm-pipeline", title: "Sales Pipeline", description: "Use clear stages and next actions for every lead.", source: "templates/crm/SALES-PIPELINE-TEMPLATE.md" },
      { id: "sales-speed", title: "60-Second Lead Call", description: "Build speed-to-lead into the sales process.", source: "docs/26-60-SECOND-LEAD-CALL-SOP.md" },
      { id: "sales-script", title: "Sales Closer Script", description: "Qualify, recommend and close the right client.", source: "docs/27-SALES-CLOSER-SCRIPT.md" },
      { id: "sales-objections", title: "Objection Handling", description: "Handle price, timing and trust objections without pressure.", source: "docs/29-SALES-OBJECTION-HANDLING-GUIDE.md" }
    ]
  },
  {
    slug: "client-onboarding",
    number: 5,
    title: "Client Onboarding",
    description: "Move a paid client into a clean, repeatable delivery system.",
    lessons: [
      { id: "onboard-sop", title: "Client Onboarding SOP", description: "Payment to first approved content.", source: "docs/33-CLIENT-ONBOARDING-SOP.md" },
      { id: "onboard-form", title: "Onboarding Form", description: "Collect the information that prevents weak delivery.", source: "templates/onboarding/SOCIAL-MEDIA-ONBOARDING-FORM.md" },
      { id: "onboard-drive", title: "Client Drive", description: "Create a consistent folder system for every client.", source: "templates/onboarding/CLIENT-DRIVE-FOLDER-STRUCTURE.md" },
      { id: "onboard-rules", title: "Client Content Rules", description: "Turn every correction into permanent account memory.", source: "templates/onboarding/CLIENT-CONTENT-RULES-SHEET.md" }
    ]
  },
  {
    slug: "social-delivery",
    number: 6,
    title: "Social Media Delivery",
    description: "Run the Account Manager and Creative workflow from strategy to reporting.",
    lessons: [
      { id: "social-am", title: "Account Manager Manual", description: "The client-facing strategy and delivery role.", source: "docs/34-ACCOUNT-MANAGER-MANUAL.md" },
      { id: "social-creative", title: "Creative Manual", description: "Professional visual execution from approved briefs.", source: "docs/35-CREATIVE-MANUAL.md" },
      { id: "social-calendar", title: "Monthly Content Calendar", description: "Build the next month by the 25th.", source: "templates/social/MONTHLY-CONTENT-CALENDAR-TEMPLATE.csv" },
      { id: "social-brief", title: "Weekly Creative Brief", description: "Give the Creative everything needed for Monday delivery.", source: "templates/social/WEEKLY-CREATIVE-BRIEF-TEMPLATE.md" },
      { id: "social-report", title: "Monthly Reporting", description: "Explain what happened and what should happen next.", source: "docs/46-MONTHLY-REPORTING-SOP.md" }
    ]
  },
  {
    slug: "recruitment",
    number: 7,
    title: "Recruitment",
    description: "Hire the initial team before client acquisition begins.",
    lessons: [
      { id: "hire-system", title: "Recruitment Master SOP", description: "Source, screen, test, hire and onboard.", source: "docs/47-RECRUITMENT-MASTER-SOP.md" },
      { id: "hire-am", title: "Hire an Account Manager", description: "Recruit for research, copy and client ownership.", source: "templates/recruitment/ACCOUNT-MANAGER-JOB-DESCRIPTION.md" },
      { id: "hire-creative", title: "Hire a Creative", description: "Recruit for design, video and attention to detail.", source: "templates/recruitment/CREATIVE-JOB-DESCRIPTION.md" },
      { id: "hire-sales", title: "Hire a Sales Closer", description: "Set up the commission-led sales role.", source: "templates/recruitment/SALES-CLOSER-JOB-DESCRIPTION.md" },
      { id: "hire-ops", title: "Hire an Operations Manager", description: "Build the hands-off management layer.", source: "templates/recruitment/OPERATIONS-MANAGER-JOB-DESCRIPTION.md", minimumTier: "dfy" }
    ]
  },
  {
    slug: "specialist-services",
    number: 8,
    title: "Specialist Services",
    description: "Sell and manage paid ads, SEO, websites and CRM without pretending to be every specialist.",
    lessons: [
      { id: "service-meta", title: "Meta Ads", description: "Scope, hand off and quality-check Meta Ads.", source: "docs/53-META-ADS-SERVICE-SOP.md" },
      { id: "service-google", title: "Google Ads", description: "Run a clean Search Ads service model.", source: "docs/54-GOOGLE-ADS-SERVICE-SOP.md" },
      { id: "service-seo", title: "SEO", description: "Sell recurring SEO with clear package boundaries.", source: "docs/55-SEO-SERVICE-SOP.md" },
      { id: "service-web", title: "Website Development", description: "Scope the standard five-page website and custom work.", source: "docs/57-WEBSITE-DEVELOPMENT-SOP.md" },
      { id: "service-crm", title: "CRM & Automation", description: "Sell lead-management infrastructure as a recurring service.", source: "docs/59-CRM-AND-LEAD-AUTOMATION-SERVICE-SOP.md" }
    ]
  },
  {
    slug: "operations",
    number: 9,
    title: "Operations",
    description: "Manage capacity, quality, tasks and client risk without running the business from memory.",
    lessons: [
      { id: "ops-manager", title: "Operations Manager Manual", description: "Run daily delivery and report to the owner.", source: "docs/60-OPERATIONS-MANAGER-MANUAL.md", minimumTier: "dfy" },
      { id: "ops-tasks", title: "Task Management", description: "Every task has an owner, due date and status.", source: "docs/62-TASK-MANAGEMENT-SOP.md" },
      { id: "ops-dashboard", title: "Management Dashboard", description: "See money, leads, delivery, capacity and churn risk.", source: "docs/63-MANAGEMENT-DASHBOARD-SPECIFICATION.md" },
      { id: "ops-qa", title: "Quality Control", description: "Catch weak work before the client sees it.", source: "templates/operations/QUALITY-CONTROL-CHECKLIST.md" }
    ]
  },
  {
    slug: "finance-growth",
    number: 10,
    title: "Finance & Growth",
    description: "Know when the agency is healthy enough to hire, spend and scale.",
    lessons: [
      { id: "finance-monthly", title: "Monthly Finance Routine", description: "Run the numbers every month.", source: "docs/14-FINANCE-MONTHLY-ROUTINE.md" },
      { id: "finance-retention", title: "Client Retention", description: "Spot churn risk before cancellation.", source: "docs/64-CLIENT-RETENTION-SOP.md" },
      { id: "finance-renewal", title: "Renewals", description: "Move the first paid month into a suitable longer commitment.", source: "docs/65-CLIENT-RENEWAL-SOP.md" },
      { id: "finance-upsell", title: "Upsell & Cross-sell", description: "Recommend the next service only when there is a real need.", source: "docs/66-UPSELL-GUIDE.md" }
    ]
  },
  {
    slug: "business-readiness",
    number: 11,
    title: "Optional Business Readiness",
    description: "Keep a genuine UK business operationally ready for future due diligence and professional advice.",
    lessons: [
      { id: "ready-sponsor", title: "Sponsor Licence Business Readiness", description: "General business-readiness information, not immigration advice.", source: "docs/68-SPONSOR-LICENCE-BUSINESS-READINESS-GUIDE.md" },
      { id: "ready-records", title: "Business Records", description: "Keep the records a genuine operating company should have.", source: "templates/business-readiness/BUSINESS-RECORDS-CHECKLIST.md" },
      { id: "ready-paye", title: "PAYE Readiness", description: "Understand the employer setup before UK payroll is required.", source: "templates/business-readiness/PAYROLL-PAYE-READINESS-CHECKLIST.md" }
    ]
  },
  {
    slug: "downloads",
    number: 12,
    title: "Downloads & Worked Examples",
    description: "Use the editable operating templates and see how good completion should look.",
    lessons: [
      { id: "download-library", title: "Template Library", description: "Blank versions for your own agency.", source: "programme-packs/DOWNLOADABLE-TEMPLATE-LIBRARY-INDEX.md" },
      { id: "download-examples", title: "Worked Examples", description: "Fictional examples showing how Kydos uses the system.", source: "worked-examples/README.md" }
    ]
  }
];

export function canAccessTier(current: Tier, minimum?: Tier) {
  if (!minimum) return true;
  return tierRank[current] >= tierRank[minimum];
}

export function accessibleLessons(tier: Tier) {
  return modules.flatMap((module) => module.lessons.filter((lesson) => canAccessTier(tier, lesson.minimumTier)));
}
