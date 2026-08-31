"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") throw new Error("Admin access required.");

  return createAdminClient();
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function inviteParticipant(formData: FormData) {
  const admin = await requireAdmin();
  const email = String(formData.get("email") || "").trim();
  const fullName = String(formData.get("fullName") || "").trim();
  const tier = String(formData.get("tier") || "blueprint");

  if (!email || !fullName || !["blueprint","build","dfy"].includes(tier)) {
    throw new Error("Missing participant details.");
  }

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName }
  });

  if (error || !data.user) {
    throw new Error(error?.message || "Unable to invite participant.");
  }

  await admin.from("profiles").upsert({
    id: data.user.id,
    full_name: fullName,
    role: "student"
  });

  const start = new Date();
  let supportEnd: string | null = null;

  if (tier === "blueprint") {
    const end = new Date(start);
    end.setDate(end.getDate() + 56);
    supportEnd = isoDate(end);
  }

  if (tier === "build") {
    const end = new Date(start);
    end.setDate(end.getDate() + 84);
    supportEnd = isoDate(end);
  }

  await admin.from("enrolments").insert({
    user_id: data.user.id,
    tier,
    status: "active",
    programme_start: isoDate(start),
    support_end: supportEnd
  });

  revalidatePath("/admin");
}

export async function createImplementationTask(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") || "");
  const area = String(formData.get("area") || "");
  const title = String(formData.get("title") || "");
  const owner = String(formData.get("owner") || "");
  const dueDate = String(formData.get("dueDate") || "") || null;

  if (!userId || !area || !title) throw new Error("Missing task details.");

  await admin.from("implementation_tasks").insert({
    user_id: userId,
    area,
    title,
    owner: owner || null,
    due_date: dueDate
  });

  revalidatePath("/admin");
}

export async function updateTaskStatus(formData: FormData) {
  const admin = await requireAdmin();
  const taskId = String(formData.get("taskId") || "");
  const status = String(formData.get("status") || "");

  if (!taskId) return;

  await admin
    .from("implementation_tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", taskId);

  revalidatePath("/admin");
}
