"use server";

import { redirect } from "next/navigation";
import { requireAdminContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { getAuth } from "@/lib/auth/server";

export async function impersonateE2EUser(formData: FormData) {
  await requireAdminContext();
  const academyUserId = String(formData.get("academyUserId") || "");
  if (!academyUserId) throw new Error("Missing E2E participant.");

  const sql = getSql();
  const rows = await sql.query(
    "select id, auth_user_id, full_name, email from academy_users where id = $1 and role = 'student' and is_test = true limit 1",
    [academyUserId]
  );

  if (!rows.length) throw new Error("This account is not an approved E2E test participant.");

  const { error } = await getAuth().admin.impersonateUser({
    userId: String(rows[0].auth_user_id)
  });

  if (error) {
    throw new Error("Could not start E2E impersonation: " + error.message);
  }

  redirect("/portal");
}

export async function stopE2EImpersonation() {
  const { error } = await getAuth().admin.stopImpersonating();

  if (error) {
    redirect("/login");
  }

  redirect("/admin/e2e");
}
