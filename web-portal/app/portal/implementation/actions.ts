"use server";

import { revalidatePath } from "next/cache";
import { requireAcademyContext } from "@/lib/academy";
import { getSql } from "@/lib/db";

export async function addParticipantTaskUpdate(formData: FormData) {
  const { academyUser } = await requireAcademyContext();
  const taskId = String(formData.get("taskId") || "");
  const message = String(formData.get("message") || "").trim();

  if (!taskId || message.length < 2 || message.length > 4000) {
    throw new Error("Add a short update before sending.");
  }

  const sql = getSql();
  const tasks = await sql.query(
    "select id, status from implementation_tasks where id = $1 and user_id = $2 limit 1",
    [taskId, academyUser.id]
  );

  if (!tasks.length) throw new Error("Task not found.");

  await sql.query(
    "insert into implementation_task_updates (task_id, user_id, author_user_id, author_role, message) values ($1,$2,$3,$4,$5)",
    [taskId, academyUser.id, academyUser.id, "participant", message]
  );

  const currentStatus = String(tasks[0].status);
  if (currentStatus === "waiting_participant" || currentStatus === "not_started" || currentStatus === "in_progress") {
    await sql.query(
      "update implementation_tasks set status = 'review', updated_at = now() where id = $1 and user_id = $2",
      [taskId, academyUser.id]
    );
  }

  await sql.query(
    "insert into academy_audit_log (actor_user_id, action, target_type, target_id, details) values ($1,$2,$3,$4,$5::jsonb)",
    [academyUser.id, "participant_task_update_added", "implementation_task", taskId, JSON.stringify({ statusBefore: currentStatus })]
  );

  revalidatePath("/portal");
  revalidatePath("/portal/implementation");
}
