"use server";

import { revalidatePath } from "next/cache";
import { getActiveEnrolment, requireAcademyContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { canAccessTier, modules, type Tier } from "@/lib/programme-data";
import { recordAcademyActivity } from "@/lib/activity";

export async function setLessonCompletion(formData: FormData) {
  const lessonId = String(formData.get("lessonId") || "");
  const completed = String(formData.get("completed") || "") === "true";
  const moduleSlug = String(formData.get("moduleSlug") || "");
  if (!lessonId) return;

  const { academyUser } = await requireAcademyContext();
  const enrolment = await getActiveEnrolment(academyUser.id);
  if (!enrolment) throw new Error("No active programme access.");

  const lesson = modules.flatMap((module) => module.lessons).find((item) => item.id === lessonId);
  if (!lesson || !canAccessTier(enrolment.tier as Tier, lesson.minimumTier)) {
    throw new Error("This lesson is not included in your programme access.");
  }

  const sql = getSql();

  if (completed) {
    await sql.query(
      "insert into lesson_progress (user_id, lesson_id, completed_at) values ($1,$2,now()) on conflict (user_id, lesson_id) do update set completed_at = excluded.completed_at",
      [academyUser.id, lessonId]
    );
  } else {
    await sql.query(
      "delete from lesson_progress where user_id = $1 and lesson_id = $2",
      [academyUser.id, lessonId]
    );
  }

  await recordAcademyActivity({
    userId: academyUser.id,
    eventType: completed ? "lesson_completed" : "lesson_uncompleted",
    entityType: "lesson",
    entityId: lessonId,
    metadata: { moduleSlug: moduleSlug || null }
  });

  revalidatePath("/portal");
  if (moduleSlug) revalidatePath("/portal/module/" + moduleSlug);
}


export async function saveLessonNote(formData: FormData) {
  const lessonId = String(formData.get("lessonId") || "");
  const note = String(formData.get("note") || "");
  if (!lessonId || note.length > 10000) throw new Error("Invalid lesson note.");

  const { academyUser } = await requireAcademyContext();
  const enrolment = await getActiveEnrolment(academyUser.id);
  if (!enrolment) throw new Error("No active programme access.");

  const lesson = modules.flatMap((module) => module.lessons).find((item) => item.id === lessonId);
  if (!lesson || !canAccessTier(enrolment.tier as Tier, lesson.minimumTier)) {
    throw new Error("This lesson is not included in your programme access.");
  }

  const sql = getSql();
  if (note.trim()) {
    await sql.query(
      "insert into lesson_notes (user_id, lesson_id, note, updated_at) values ($1,$2,$3,now()) on conflict (user_id, lesson_id) do update set note = excluded.note, updated_at = now()",
      [academyUser.id, lessonId, note]
    );
  } else {
    await sql.query(
      "delete from lesson_notes where user_id = $1 and lesson_id = $2",
      [academyUser.id, lessonId]
    );
  }

  await recordAcademyActivity({
    userId: academyUser.id,
    eventType: note.trim() ? "lesson_note_saved" : "lesson_note_deleted",
    entityType: "lesson",
    entityId: lessonId
  });

  revalidatePath("/portal/lesson/" + lessonId);
}
