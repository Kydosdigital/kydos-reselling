import { getCurrentAcademyContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { rowsToCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

type ExportType = "participants" | "tasks" | "orders" | "engagement" | "activity";

const exportDefinitions: Record<ExportType, {
  filename: string;
  columns: string[];
  query: string;
}> = {
  participants: {
    filename: "kydos-academy-participants.csv",
    columns: [
      "full_name","email","tier","status","programme_start","support_end","handover_date",
      "agency_name","company_status","target_launch_date","preferred_structure","location",
      "website_status","domain_status","crm_status","team_status","acquisition_readiness",
      "services_focus","weekly_time_commitment","current_clients","startup_budget_gbp"
    ],
    query: "select u.full_name, u.email, e.tier, e.status, e.programme_start, e.support_end, e.handover_date, i.agency_name, i.company_status, i.target_launch_date, i.preferred_structure, i.location, i.website_status, i.domain_status, i.crm_status, i.team_status, i.acquisition_readiness, i.services_focus, i.weekly_time_commitment, i.current_clients, i.startup_budget_gbp from academy_users u left join enrolments e on e.user_id = u.id and e.status = 'active' left join participant_intake i on i.user_id = u.id where u.role = 'student' order by u.created_at desc"
  },
  tasks: {
    filename: "kydos-academy-implementation-tasks.csv",
    columns: ["full_name","email","area","title","owner","status","due_date","notes","created_at","updated_at"],
    query: "select u.full_name, u.email, t.area, t.title, t.owner, t.status, t.due_date, t.notes, t.created_at, t.updated_at from implementation_tasks t join academy_users u on u.id = t.user_id order by t.created_at desc"
  },
  orders: {
    filename: "kydos-academy-orders.csv",
    columns: ["full_name","email","tier","amount_total","currency","status","terms_accepted","digital_content_consent","early_service_start_consent","consent_timestamp","provisioned_at","created_at","stripe_session_id","stripe_payment_intent_id"],
    query: "select full_name, email, tier, amount_total, currency, status, terms_accepted, digital_content_consent, early_service_start_consent, consent_timestamp, provisioned_at, created_at, stripe_session_id, stripe_payment_intent_id from programme_orders order by created_at desc"
  },
  engagement: {
    filename: "kydos-academy-engagement.csv",
    columns: ["full_name","email","tier","last_login_at","last_seen_at","login_count","completed_lessons","latest_learning_at","latest_checkin_week","latest_confidence","support_requested"],
    query: "select u.full_name, u.email, e.tier, u.last_login_at, u.last_seen_at, u.login_count, coalesce(p.completed_lessons,0) as completed_lessons, p.latest_learning_at, c.week_start as latest_checkin_week, c.confidence as latest_confidence, case when coalesce(trim(c.support_needed),'') <> '' then true else false end as support_requested from academy_users u left join enrolments e on e.user_id = u.id and e.status = 'active' left join lateral (select count(*)::int as completed_lessons, max(completed_at) as latest_learning_at from lesson_progress lp where lp.user_id = u.id) p on true left join lateral (select week_start, confidence, support_needed from participant_weekly_checkins pc where pc.user_id = u.id order by week_start desc, updated_at desc limit 1) c on true where u.role = 'student' order by u.created_at desc"
  },
  activity: {
    filename: "kydos-academy-activity-events.csv",
    columns: ["full_name","email","event_type","entity_type","entity_id","created_at"],
    query: "select u.full_name, u.email, a.event_type, a.entity_type, a.entity_id, a.created_at from academy_activity_events a left join academy_users u on u.id = a.user_id order by a.created_at desc limit 10000"
  }
};

export async function GET(request: Request) {
  const context = await getCurrentAcademyContext();
  if (!context) return new Response("Unauthorised", { status: 401 });
  if (context.academyUser.role !== "admin") return new Response("Forbidden", { status: 403 });

  const type = new URL(request.url).searchParams.get("type") as ExportType | null;
  if (!type || !(type in exportDefinitions)) return new Response("Unknown export type", { status: 400 });

  const definition = exportDefinitions[type];
  const sql = getSql();
  const rows = await sql.query(definition.query);
  const csv = rowsToCsv(definition.columns, rows as Record<string, unknown>[]);

  await sql.query(
    "insert into academy_audit_log (actor_user_id, action, target_type, target_id, details) values ($1,$2,$3,$4,$5::jsonb)",
    [context.academyUser.id, "admin_export_downloaded", "export", type, JSON.stringify({ rowCount: rows.length })]
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="' + definition.filename + '"',
      "Cache-Control": "private, no-store"
    }
  });
}
