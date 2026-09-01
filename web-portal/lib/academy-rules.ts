export type LaunchReadinessInput = {
  company_status?: string | null;
  domain_status?: string | null;
  website_status?: string | null;
  crm_status?: string | null;
  team_status?: string | null;
  acquisition_readiness?: string | null;
};

export type LaunchReadinessCheck = {
  key: "company" | "domain" | "website" | "crm" | "team" | "acquisition";
  label: string;
  complete: boolean;
  value: string;
  moduleSlug: string;
  nextAction: string;
};

const acceptable: Record<LaunchReadinessCheck["key"], string[]> = {
  company: ["incorporated", "already_trading"],
  domain: ["purchased", "connected"],
  website: ["in_build", "live"],
  crm: ["configuring", "live"],
  team: ["partial", "launch_team_ready"],
  acquisition: ["ready_to_test", "already_acquiring"]
};

const labels: Record<LaunchReadinessCheck["key"], string> = {
  company: "Company foundation",
  domain: "Domain",
  website: "Website",
  crm: "CRM",
  team: "Launch team",
  acquisition: "Client acquisition"
};

const modules: Record<LaunchReadinessCheck["key"], string> = {
  company: "company",
  domain: "brand-website",
  website: "brand-website",
  crm: "crm-sales",
  team: "recruitment",
  acquisition: "crm-sales"
};

const nextActions: Record<LaunchReadinessCheck["key"], string> = {
  company: "Finish the company setup before treating the agency as launch-ready.",
  domain: "Purchase and connect the agency domain.",
  website: "Move the website into build or get it live.",
  crm: "Configure the CRM, pipeline and lead follow-up.",
  team: "Recruit enough delivery and sales capacity for launch.",
  acquisition: "Only start paid acquisition when the core operating capacity is ready."
};

function normalise(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

export function getLaunchReadiness(input: LaunchReadinessInput | null | undefined) {
  const values: Record<LaunchReadinessCheck["key"], string> = {
    company: normalise(input?.company_status),
    domain: normalise(input?.domain_status),
    website: normalise(input?.website_status),
    crm: normalise(input?.crm_status),
    team: normalise(input?.team_status),
    acquisition: normalise(input?.acquisition_readiness)
  };

  const checks = (Object.keys(values) as LaunchReadinessCheck["key"][]).map((key) => ({
    key,
    label: labels[key],
    complete: acceptable[key].includes(values[key]),
    value: values[key],
    moduleSlug: modules[key],
    nextAction: nextActions[key]
  }));

  const completeCount = checks.filter((check) => check.complete).length;
  const percent = Math.round((completeCount / checks.length) * 100);

  let stage = "Foundation";
  if (percent >= 100) stage = "Ready to launch";
  else if (percent >= 67) stage = "Launch preparation";
  else if (percent >= 34) stage = "Infrastructure build";

  return {
    checks,
    completeCount,
    total: checks.length,
    percent,
    stage,
    nextIncomplete: checks.find((check) => !check.complete) || null
  };
}

export function supportEndForTier(tier: string, from = new Date()) {
  if (tier !== "blueprint" && tier !== "build") return null;

  const base = new Date(Date.UTC(
    from.getUTCFullYear(),
    from.getUTCMonth(),
    from.getUTCDate()
  ));
  base.setUTCDate(base.getUTCDate() + (tier === "blueprint" ? 56 : 84));
  return base.toISOString().slice(0, 10);
}

export function daysRemaining(dateOnly: string | null | undefined, now = new Date()) {
  if (!dateOnly) return null;
  const end = new Date(dateOnly + "T23:59:59.999Z");
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000));
}

export function canProvisionAcademyProfile(input: {
  isAdminEmail: boolean;
  paidOrderStatus?: string | null;
}) {
  if (input.isAdminEmail) return true;
  return String(input.paidOrderStatus || "").toLowerCase() === "paid";
}
