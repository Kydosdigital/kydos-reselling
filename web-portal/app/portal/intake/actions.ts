"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveIntake(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("participant_intake").upsert({
    user_id: user.id,
    agency_name: String(formData.get("agencyName") || ""),
    company_status: String(formData.get("companyStatus") || ""),
    target_launch_date: String(formData.get("targetLaunchDate") || "") || null,
    preferred_structure: String(formData.get("preferredStructure") || ""),
    location: String(formData.get("location") || ""),
    goals: String(formData.get("goals") || ""),
    notes: String(formData.get("notes") || ""),
    submitted_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  revalidatePath("/portal/intake");
}
