import { redirect } from "next/navigation";
import { getAuth, isNeonAuthConfigured } from "@/lib/auth/server";
import { getSql, isDatabaseConfigured } from "@/lib/db";
import type { Tier } from "@/lib/programme-data";
import { canProvisionAcademyProfile, supportEndForTier as calculateSupportEnd } from "@/lib/academy-rules";
import { recordAcademyActivity, touchAcademySeen } from "@/lib/activity";

export type AcademyUser = {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string;
  role: "student" | "admin";
  last_login_at?: string | null;
  last_seen_at?: string | null;
  login_count?: number;
  created_at: string;
};

export type AcademyEnrolment = {
  id: string;
  user_id: string;
  tier: Tier;
  status: "pending" | "active" | "paused" | "complete" | "cancelled";
  programme_start: string | null;
  support_end: string | null;
  handover_date: string | null;
  created_at: string;
};

function adminEmails() {
  return (process.env.ACADEMY_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function getCurrentAuthUser() {
  if (!isNeonAuthConfigured()) return null;
  const result = await getAuth().getSession();
  return result.data?.user || null;
}

export async function getCurrentAcademyContext() {
  const authUser = await getCurrentAuthUser();
  if (!authUser || !isDatabaseConfigured()) return null;

  const sql = getSql();
  let rows = await sql.query(
    "select id, auth_user_id, email, full_name, role, last_login_at, last_seen_at, login_count, created_at from academy_users where auth_user_id = $1 limit 1",
    [authUser.id]
  );

  let academyUser = rows[0] as AcademyUser | undefined;

  if (!academyUser) {
    const email = (authUser.email || "").trim().toLowerCase();
    const isAdminEmail = adminEmails().includes(email);
    const paidOrders = email
      ? await sql.query(
          "select status from programme_orders where lower(email) = lower($1) order by created_at desc limit 1",
          [email]
        )
      : [];
    const paidOrderStatus = paidOrders.length ? String(paidOrders[0].status) : null;

    if (!canProvisionAcademyProfile({ isAdminEmail, paidOrderStatus })) {
      return null;
    }

    const role = isAdminEmail ? "admin" : "student";
    const name = authUser.name || email.split("@")[0] || "Participant";

    rows = await sql.query(
      "insert into academy_users (auth_user_id, email, full_name, role, last_login_at, last_seen_at, login_count) values ($1,$2,$3,$4,now(),now(),1) on conflict (auth_user_id) do update set email = excluded.email, full_name = excluded.full_name, last_seen_at = now(), updated_at = now() returning id, auth_user_id, email, full_name, role, last_login_at, last_seen_at, login_count, created_at",
      [authUser.id, email, name, role]
    );

    academyUser = rows[0] as AcademyUser;
    await recordAcademyActivity({
      userId: academyUser.id,
      eventType: "academy_profile_provisioned",
      entityType: "academy_user",
      entityId: academyUser.id,
      metadata: { role }
    });
  }

  await touchAcademySeen(academyUser.id);
  return { authUser, academyUser };
}

export async function requireAcademyContext() {
  if (!isNeonAuthConfigured() || !isDatabaseConfigured()) {
    redirect("/login?setup=pending");
  }

  const context = await getCurrentAcademyContext();
  if (!context) {
    const authUser = await getCurrentAuthUser();
    if (authUser) redirect("/access-pending");
    redirect("/login");
  }
  return context;
}

export async function requireAdminContext() {
  const context = await requireAcademyContext();
  if (context.academyUser.role !== "admin") redirect("/portal");
  return context;
}

export async function getActiveEnrolment(userId: string) {
  const sql = getSql();
  const rows = await sql.query(
    "select id, user_id, tier, status, programme_start, support_end, handover_date, created_at from enrolments where user_id = $1 and status = $2 order by created_at desc limit 1",
    [userId, "active"]
  );
  return (rows[0] as AcademyEnrolment | undefined) || null;
}

export async function requireActiveEnrolment(userId: string) {
  const enrolment = await getActiveEnrolment(userId);
  if (!enrolment) throw new Error("No active programme access.");
  return enrolment;
}

export function supportEndForTier(tier: string, from = new Date()) {
  return calculateSupportEnd(tier, from);
}
