"use server";

import { redirect } from "next/navigation";
import { getAuth, isNeonAuthConfigured } from "@/lib/auth/server";
import { getSql, isDatabaseConfigured } from "@/lib/db";
import { recordAcademyActivity } from "@/lib/activity";

export async function login(formData: FormData) {
  if (!isNeonAuthConfigured()) {
    redirect("/login?setup=pending");
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const { error } = await getAuth().signIn.email({ email, password });

  if (error) {
    redirect("/login?error=1");
  }

  if (isDatabaseConfigured()) {
    const sql = getSql();
    const users = await sql.query(
      "update academy_users set last_login_at = now(), last_seen_at = now(), login_count = login_count + 1, updated_at = now() where lower(email) = lower($1) returning id, role",
      [email]
    );

    if (users.length) {
      await recordAcademyActivity({
        userId: String(users[0].id),
        eventType: "login_success",
        entityType: "academy_user",
        entityId: String(users[0].id)
      });

      if (String(users[0].role) === "admin") {
        redirect("/admin/analytics");
      }
    }
  }

  redirect("/portal");
}

export async function signOut() {
  if (isNeonAuthConfigured()) {
    await getAuth().signOut();
  }
  redirect("/");
}


export async function signInWithGoogle() {
  if (!isNeonAuthConfigured()) {
    redirect("/login?setup=pending");
  }

  const { data, error } = await getAuth().signIn.social({
    provider: "google",
    callbackURL: "/admin/analytics"
  });

  if (error) {
    redirect("/login?oauth=error");
  }

  const target = String((data as { url?: string } | null)?.url || "");
  if (target) redirect(target);

  redirect("/admin/analytics");
}
