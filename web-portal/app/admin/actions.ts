"use server";

import { revalidatePath } from "next/cache";
import { getAuth } from "@/lib/auth/server";
import { requireAdminContext, supportEndForTier } from "@/lib/academy";
import { getSql } from "@/lib/db";

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

async function writeAudit(actorId: string, action: string, targetType: string, targetId: string, details: Record<string, unknown> = {}) {
  const sql = getSql();
  await sql.query(
    "insert into academy_audit_log (actor_user_id, action, target_type, target_id, details) values ($1,$2,$3,$4,$5::jsonb)",
    [actorId, action, targetType, targetId, JSON.stringify(details)]
  );
}

export async function createParticipant(formData: FormData) {
  const { academyUser: adminUser } = await requireAdminContext();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const fullName = String(formData.get("fullName") || "").trim();
  const tier = String(formData.get("tier") || "blueprint");
  const temporaryPassword = String(formData.get("temporaryPassword") || "");

  if (!email || !fullName || !["blueprint","build","dfy"].includes(tier)) throw new Error("Missing participant details.");
  if (temporaryPassword.length < 12) throw new Error("Temporary password must contain at least 12 characters.");

  const sql = getSql();
  const existing = await sql.query("select id from academy_users where lower(email) = lower($1) limit 1", [email]);
  if (existing.length) throw new Error("A participant with this email already exists.");

  const created = await getAuth().admin.createUser({
    email,
    password: temporaryPassword,
    name: fullName,
    role: "user"
  });

  if (created.error || !created.data?.user) throw new Error(created.error?.message || "Unable to create Neon Auth user.");

  const authUserId = created.data.user.id;
  const userRows = await sql.query(
    "insert into academy_users (auth_user_id, email, full_name, role) values ($1,$2,$3,$4) returning id",
    [authUserId, email, fullName, "student"]
  );
  const userId = String(userRows[0].id);
  const start = isoDate(new Date());
  const supportEnd = supportEndForTier(tier);

  await sql.query(
    "insert into enrolments (user_id, tier, status, programme_start, support_end) values ($1,$2,$3,$4,$5)",
    [userId, tier, "active", start, supportEnd]
  );

  await writeAudit(adminUser.id, "participant_created", "academy_user", userId, { tier, email });
  revalidatePath("/admin");
}

export async function createImplementationTask(formData: FormData) {
  const { academyUser: adminUser } = await requireAdminContext();
  const userId = String(formData.get("userId") || "");
  const area = String(formData.get("area") || "");
  const title = String(formData.get("title") || "");
  const owner = String(formData.get("owner") || "");
  const dueDate = String(formData.get("dueDate") || "") || null;
  if (!userId || !area || !title) throw new Error("Missing task details.");

  const sql = getSql();
  const rows = await sql.query(
    "insert into implementation_tasks (user_id, area, title, owner, due_date) values ($1,$2,$3,$4,$5) returning id",
    [userId, area, title, owner || null, dueDate]
  );
  await writeAudit(adminUser.id, "implementation_task_created", "implementation_task", String(rows[0].id), { userId, area });
  revalidatePath("/admin");
}

export async function updateTaskStatus(formData: FormData) {
  const { academyUser: adminUser } = await requireAdminContext();
  const taskId = String(formData.get("taskId") || "");
  const status = String(formData.get("status") || "");
  if (!taskId) return;
  const sql = getSql();
  await sql.query("update implementation_tasks set status = $1, updated_at = now() where id = $2", [status, taskId]);
  await writeAudit(adminUser.id, "implementation_task_status_updated", "implementation_task", taskId, { status });
  revalidatePath("/admin");
}

export async function recordHandover(formData: FormData) {
  const { academyUser: adminUser } = await requireAdminContext();
  const enrolmentId = String(formData.get("enrolmentId") || "");
  const handoverDate = String(formData.get("handoverDate") || "");
  if (!enrolmentId || !handoverDate) throw new Error("Missing handover details.");

  const handover = new Date(handoverDate + "T00:00:00Z");
  const supportEnd = new Date(handover);
  supportEnd.setDate(supportEnd.getDate() + 90);
  const sql = getSql();
  await sql.query(
    "update enrolments set handover_date = $1, support_end = $2, updated_at = now() where id = $3 and tier = $4",
    [handoverDate, isoDate(supportEnd), enrolmentId, "dfy"]
  );
  await writeAudit(adminUser.id, "dfy_handover_recorded", "enrolment", enrolmentId, { handoverDate, supportEnd: isoDate(supportEnd) });
  revalidatePath("/admin");
}


export async function updateEnrolmentStatus(formData: FormData) {
  const { academyUser: adminUser } = await requireAdminContext();
  const enrolmentId = String(formData.get("enrolmentId") || "");
  const status = String(formData.get("status") || "");
  const allowed = ["pending","active","paused","complete","cancelled"];
  if (!enrolmentId || !allowed.includes(status)) throw new Error("Invalid enrolment update.");

  const sql = getSql();
  await sql.query("update enrolments set status = $1, updated_at = now() where id = $2", [status, enrolmentId]);
  await writeAudit(adminUser.id, "enrolment_status_updated", "enrolment", enrolmentId, { status });
  revalidatePath("/admin");
}

export async function updateSupportEnd(formData: FormData) {
  const { academyUser: adminUser } = await requireAdminContext();
  const enrolmentId = String(formData.get("enrolmentId") || "");
  const supportEnd = String(formData.get("supportEnd") || "") || null;
  if (!enrolmentId) throw new Error("Missing enrolment.");

  const sql = getSql();
  await sql.query("update enrolments set support_end = $1, updated_at = now() where id = $2", [supportEnd, enrolmentId]);
  await writeAudit(adminUser.id, "support_end_updated", "enrolment", enrolmentId, { supportEnd });
  revalidatePath("/admin");
}

export async function addParticipantAdminNote(formData: FormData) {
  const { academyUser: adminUser } = await requireAdminContext();
  const userId = String(formData.get("userId") || "");
  const note = String(formData.get("note") || "").trim();
  if (!userId || note.length < 2) throw new Error("Add a note before saving.");

  const sql = getSql();
  const rows = await sql.query(
    "insert into participant_admin_notes (user_id, author_user_id, note) values ($1,$2,$3) returning id",
    [userId, adminUser.id, note]
  );
  await writeAudit(adminUser.id, "participant_admin_note_added", "participant_admin_note", String(rows[0].id), { userId });
  revalidatePath("/admin/participants/" + userId);
}


export async function addAdminTaskUpdate(formData: FormData) {
  const { academyUser: adminUser } = await requireAdminContext();
  const taskId = String(formData.get("taskId") || "");
  const message = String(formData.get("message") || "").trim();
  const requestedStatus = String(formData.get("status") || "in_progress");
  const allowedStatuses = ["not_started","in_progress","waiting_participant","waiting_kydos","waiting_third_party","review","complete"];

  if (!taskId || message.length < 2 || message.length > 4000 || !allowedStatuses.includes(requestedStatus)) {
    throw new Error("Add a valid Kydos task update.");
  }

  const sql = getSql();
  const tasks = await sql.query(
    "select id, user_id, status from implementation_tasks where id = $1 limit 1",
    [taskId]
  );
  if (!tasks.length) throw new Error("Implementation task not found.");

  const task = tasks[0];
  await sql.query(
    "insert into implementation_task_updates (task_id, user_id, author_user_id, author_role, message) values ($1,$2,$3,$4,$5)",
    [taskId, task.user_id, adminUser.id, "admin", message]
  );

  await sql.query(
    "update implementation_tasks set status = $1, updated_at = now() where id = $2",
    [requestedStatus, taskId]
  );

  await writeAudit(adminUser.id, "admin_task_update_added", "implementation_task", taskId, {
    statusBefore: String(task.status),
    statusAfter: requestedStatus,
    userId: String(task.user_id)
  });

  revalidatePath("/admin");
  revalidatePath("/admin/tasks/" + taskId);
  revalidatePath("/admin/participants/" + String(task.user_id));
  revalidatePath("/portal/implementation");
}


export async function setParticipantTemporaryPassword(formData: FormData) {
  const { academyUser: adminUser } = await requireAdminContext();
  const userId = String(formData.get("userId") || "");
  const newPassword = String(formData.get("newPassword") || "");

  if (!userId || newPassword.length < 12) {
    throw new Error("Temporary password must contain at least 12 characters.");
  }

  const sql = getSql();
  const users = await sql.query(
    "select auth_user_id, email from academy_users where id = $1 and role = 'student' limit 1",
    [userId]
  );
  if (!users.length) throw new Error("Participant account not found.");

  const result = await getAuth().admin.setUserPassword({
    userId: String(users[0].auth_user_id),
    newPassword
  });

  if (result.error) throw new Error(result.error.message || "Unable to reset participant password.");

  await writeAudit(adminUser.id, "participant_password_reset_by_admin", "academy_user", userId, {
    email: String(users[0].email)
  });

  revalidatePath("/admin/participants/" + userId);
}

export async function revokeParticipantSessions(formData: FormData) {
  const { academyUser: adminUser } = await requireAdminContext();
  const userId = String(formData.get("userId") || "");
  if (!userId) throw new Error("Missing participant account.");

  const sql = getSql();
  const users = await sql.query(
    "select auth_user_id, email from academy_users where id = $1 and role = 'student' limit 1",
    [userId]
  );
  if (!users.length) throw new Error("Participant account not found.");

  const result = await getAuth().admin.revokeUserSessions({
    userId: String(users[0].auth_user_id)
  });

  if (result.error) throw new Error(result.error.message || "Unable to revoke participant sessions.");

  await writeAudit(adminUser.id, "participant_sessions_revoked", "academy_user", userId, {
    email: String(users[0].email)
  });

  revalidatePath("/admin/participants/" + userId);
}
