"use server";

import { revalidatePath } from "next/cache";
import { requireAcademyContext } from "@/lib/academy";
import { getSql } from "@/lib/db";

export async function saveIntake(formData: FormData) {
  const { academyUser } = await requireAcademyContext();
  const sql = getSql();

  await sql.query(
    "insert into participant_intake (user_id, agency_name, company_status, target_launch_date, preferred_structure, location, goals, notes, submitted_at, updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,now(),now()) on conflict (user_id) do update set agency_name = excluded.agency_name, company_status = excluded.company_status, target_launch_date = excluded.target_launch_date, preferred_structure = excluded.preferred_structure, location = excluded.location, goals = excluded.goals, notes = excluded.notes, submitted_at = now(), updated_at = now()",
    [
      academyUser.id,
      String(formData.get("agencyName") || ""),
      String(formData.get("companyStatus") || ""),
      String(formData.get("targetLaunchDate") || "") || null,
      String(formData.get("preferredStructure") || ""),
      String(formData.get("location") || ""),
      String(formData.get("goals") || ""),
      String(formData.get("notes") || "")
    ]
  );

  revalidatePath("/portal/intake");
}
