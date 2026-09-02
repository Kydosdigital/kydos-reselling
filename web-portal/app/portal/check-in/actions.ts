"use server";

import { revalidatePath } from "next/cache";
import { mondayWeekStart } from "@/lib/academy-rules";
import { requireAcademyContext, requireActiveEnrolment } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { recordAcademyActivity } from "@/lib/activity";

function clean(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function saveWeeklyCheckIn(formData: FormData) {
  const { academyUser } = await requireAcademyContext();
  await requireActiveEnrolment(academyUser.id);

  const wins = clean(formData, "wins");
  const blockers = clean(formData, "blockers");
  const nextFocus = clean(formData, "nextFocus");
  const supportNeeded = clean(formData, "supportNeeded");
  const confidenceRaw = clean(formData, "confidence");
  const confidence = confidenceRaw ? Number.parseInt(confidenceRaw, 10) : null;

  if ([wins, blockers, nextFocus, supportNeeded].some((value) => value.length > 6000)) {
    throw new Error("Weekly check-in answers are too long.");
  }

  if (confidence !== null && (!Number.isInteger(confidence) || confidence < 1 || confidence > 5)) {
    throw new Error("Confidence must be between 1 and 5.");
  }

  const weekStart = mondayWeekStart();
  const sql = getSql();

  await sql.query(
    "insert into participant_weekly_checkins (user_id, week_start, wins, blockers, next_focus, support_needed, confidence, submitted_at, updated_at) values ($1,$2,$3,$4,$5,$6,$7,now(),now()) on conflict (user_id, week_start) do update set wins = excluded.wins, blockers = excluded.blockers, next_focus = excluded.next_focus, support_needed = excluded.support_needed, confidence = excluded.confidence, submitted_at = now(), updated_at = now()",
    [academyUser.id, weekStart, wins, blockers, nextFocus, supportNeeded, confidence]
  );

  await sql.query(
    "insert into academy_audit_log (actor_user_id, action, target_type, target_id, details) values ($1,$2,$3,$4,$5::jsonb)",
    [academyUser.id, "weekly_checkin_saved", "participant_weekly_checkin", academyUser.id + ":" + weekStart, JSON.stringify({ weekStart, confidence })]
  );

  await recordAcademyActivity({
    userId: academyUser.id,
    eventType: "weekly_checkin_saved",
    entityType: "participant_weekly_checkin",
    entityId: academyUser.id + ":" + weekStart,
    metadata: { weekStart, confidence, hasBlockers: Boolean(blockers), requestedSupport: Boolean(supportNeeded) }
  });

  revalidatePath("/portal");
  revalidatePath("/portal/check-in");
}
