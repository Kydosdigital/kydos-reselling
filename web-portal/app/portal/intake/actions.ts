"use server";

import { revalidatePath } from "next/cache";
import { requireAcademyContext, requireActiveEnrolment } from "@/lib/academy";
import { getSql } from "@/lib/db";

function optionalInteger(formData: FormData, key: string) {
  const raw = String(formData.get(key) || "").trim();
  if (!raw) return null;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export async function saveIntake(formData: FormData) {
  const { academyUser } = await requireAcademyContext();
  await requireActiveEnrolment(academyUser.id);
  const sql = getSql();

  await sql.query(
    "insert into participant_intake (user_id, agency_name, company_status, target_launch_date, preferred_structure, location, website_status, domain_status, crm_status, team_status, acquisition_readiness, services_focus, weekly_time_commitment, current_clients, startup_budget_gbp, goals, notes, submitted_at, updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,now(),now()) on conflict (user_id) do update set agency_name = excluded.agency_name, company_status = excluded.company_status, target_launch_date = excluded.target_launch_date, preferred_structure = excluded.preferred_structure, location = excluded.location, website_status = excluded.website_status, domain_status = excluded.domain_status, crm_status = excluded.crm_status, team_status = excluded.team_status, acquisition_readiness = excluded.acquisition_readiness, services_focus = excluded.services_focus, weekly_time_commitment = excluded.weekly_time_commitment, current_clients = excluded.current_clients, startup_budget_gbp = excluded.startup_budget_gbp, goals = excluded.goals, notes = excluded.notes, submitted_at = now(), updated_at = now()",
    [
      academyUser.id,
      String(formData.get("agencyName") || ""),
      String(formData.get("companyStatus") || ""),
      String(formData.get("targetLaunchDate") || "") || null,
      String(formData.get("preferredStructure") || ""),
      String(formData.get("location") || ""),
      String(formData.get("websiteStatus") || ""),
      String(formData.get("domainStatus") || ""),
      String(formData.get("crmStatus") || ""),
      String(formData.get("teamStatus") || ""),
      String(formData.get("acquisitionReadiness") || ""),
      String(formData.get("servicesFocus") || ""),
      String(formData.get("weeklyTimeCommitment") || ""),
      optionalInteger(formData, "currentClients"),
      optionalInteger(formData, "startupBudgetGbp"),
      String(formData.get("goals") || ""),
      String(formData.get("notes") || "")
    ]
  );

  revalidatePath("/portal/intake");
  revalidatePath("/portal");
}
