import { getSql } from "@/lib/db";

export async function recordAcademyActivity({
  userId,
  eventType,
  entityType,
  entityId,
  metadata
}: {
  userId?: string | null;
  eventType: string;
  entityType?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const sql = getSql();
  await sql.query(
    "insert into academy_activity_events (user_id, event_type, entity_type, entity_id, metadata) values ($1,$2,$3,$4,$5::jsonb)",
    [userId || null, eventType, entityType || null, entityId || null, JSON.stringify(metadata || {})]
  );
}

export async function touchAcademySeen(userId: string) {
  const sql = getSql();
  await sql.query(
    "update academy_users set last_seen_at = now() where id = $1 and (last_seen_at is null or last_seen_at < now() - interval '15 minutes')",
    [userId]
  );
}
