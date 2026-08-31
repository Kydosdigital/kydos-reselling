"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setLessonCompletion(formData: FormData) {
  const lessonId = String(formData.get("lessonId") || "");
  const completed = String(formData.get("completed") || "") === "true";
  const moduleSlug = String(formData.get("moduleSlug") || "");

  if (!lessonId) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  if (completed) {
    await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: lessonId,
      completed_at: new Date().toISOString()
    });
  } else {
    await supabase.from("lesson_progress").delete().eq("user_id", user.id).eq("lesson_id", lessonId);
  }

  revalidatePath("/portal");
  if (moduleSlug) revalidatePath("/portal/module/" + moduleSlug);
}
