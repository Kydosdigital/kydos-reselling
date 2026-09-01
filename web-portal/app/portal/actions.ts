"use server";

import { revalidatePath } from "next/cache";
import { requireAcademyContext } from "@/lib/academy";
import { getSql } from "@/lib/db";

export async function setLessonCompletion(formData: FormData) {
  const lessonId = String(formData.get("lessonId") || "");
  const completed = String(formData.get("completed") || "") === "true";
  const moduleSlug = String(formData.get("moduleSlug") || "");
  if (!lessonId) return;

  const { academyUser } = await requireAcademyContext();
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

  revalidatePath("/portal");
  if (moduleSlug) revalidatePath("/portal/module/" + moduleSlug);
}
