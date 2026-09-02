import Link from "next/link";
import { requireAdminContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { accessibleLessons, canAccessTier, modules, tierLabels, type Tier } from "@/lib/programme-data";
import { getLaunchReadiness } from "@/lib/academy-rules";
import { analyticsDate, completionPercent, daysSince, isLearningStalled, isRecentlyActive } from "@/lib/analytics";

export const dynamic = "force-dynamic";

function formatDateTime(value: unknown) {
  const date = analyticsDate(value);
  if (!date) return "Never";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function money(amountPence: number) {
  return (amountPence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  });
}

function eventLabel(value: unknown) {
  return String(value || "").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function SuperAdminAnalyticsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; tier?: string; engagement?: string; page?: string }>;
}) {
  await requireAdminContext();
  const filters = await searchParams;
  const sql = getSql();

  const [participants, progressRows, intakeRows, checkIns, tasks, orders, activity, enrolmentHistory, dailyActivityRows, resourceDownloadRows] = await Promise.all([
    sql.query("select u.id, u.full_name, u.email, u.created_at, u.last_login_at, u.last_seen_at, u.login_count, e.tier, e.status, e.programme_start, e.support_end, e.handover_date from academy_users u left join enrolments e on e.user_id = u.id and e.status = 'active' where u.role = 'student' order by u.created_at desc"),
    sql.query("select user_id, lesson_id, completed_at from lesson_progress order by completed_at desc"),
    sql.query("select * from participant_intake"),
    sql.query("select distinct on (user_id) user_id, week_start, confidence, blockers, support_needed, submitted_at, updated_at from participant_weekly_checkins order by user_id, week_start desc, updated_at desc"),
    sql.query("select user_id, status, due_date, updated_at from implementation_tasks"),
    sql.query("select user_id, tier, amount_total, currency, status, provisioned_at, created_at from programme_orders order by created_at desc"),
    sql.query("select a.id, a.user_id, a.event_type, a.entity_type, a.entity_id, a.metadata, a.created_at, u.full_name, u.email from academy_activity_events a left join academy_users u on u.id = a.user_id order by a.created_at desc limit 300"),
    sql.query("select user_id, tier, status, programme_start, created_at from enrolments order by created_at asc"),
    sql.query("select created_at::date as day, count(*)::int as events, count(distinct user_id)::int as active_users from academy_activity_events where created_at >= current_date - interval '13 days' group by created_at::date order by day asc"),
    sql.query("select entity_id as lesson_id, count(*)::int as downloads, count(distinct user_id)::int as unique_users from academy_activity_events where event_type = 'resource_downloaded' and entity_id is not null group by entity_id order by downloads desc limit 10")
  ]);

  const participantRows = participants as Record<string, any>[];
  const progressData = progressRows as Record<string, any>[];
  const intakeData = intakeRows as Record<string, any>[];
  const checkInData = checkIns as Record<string, any>[];
  const taskData = tasks as Record<string, any>[];
  const orderData = orders as Record<string, any>[];
  const activityData = activity as Record<string, any>[];
  const enrolmentData = enrolmentHistory as Record<string, any>[];
  const dailyActivityData = dailyActivityRows as Record<string, any>[];
  const resourceDownloadData = resourceDownloadRows as Record<string, any>[];

  const progressByUser = new Map<string, Array<Record<string, any>>>();
  for (const row of progressData) {
    const key = String(row.user_id);
    const list = progressByUser.get(key) || [];
    list.push(row as Record<string, unknown>);
    progressByUser.set(key, list);
  }

  const intakeByUser = new Map(intakeData.map((row) => [String(row.user_id), row]));
  const checkinByUser = new Map(checkInData.map((row) => [String(row.user_id), row]));

  type ParticipantMetric = {
    id: string;
    full_name: string;
    email: string;
    created_at: unknown;
    last_login_at: unknown;
    last_seen_at: unknown;
    login_count: number;
    tier: Tier | undefined;
    status: string | null;
    programme_start: unknown;
    completedLessons: number;
    accessibleLessons: number;
    progressPercent: number;
    latestLessonAt: unknown;
    checkin: Record<string, any> | undefined;
    readiness: ReturnType<typeof getLaunchReadiness> | null;
    overdueTasks: number;
    active7: boolean;
    active30: boolean;
    neverLoggedIn: boolean;
    stalled: boolean;
  };

  const participantMetrics: ParticipantMetric[] = participantRows.map((participant): ParticipantMetric => {
    const id = String(participant.id);
    const tier = participant.tier as Tier | undefined;
    const accessible = tier ? accessibleLessons(tier) : [];
    const progress = progressByUser.get(id) || [];
    const completedIds = new Set(progress.map((row) => String(row.lesson_id)));
    const completed = accessible.filter((lesson) => completedIds.has(lesson.id)).length;
    const percent = completionPercent(completed, accessible.length);
    const latestLessonAt = progress.length ? progress[0].completed_at : null;
    const checkin = checkinByUser.get(id);
    const intake = intakeByUser.get(id);
    const readiness = intake ? getLaunchReadiness(intake) : null;
    const participantTasks = taskData.filter((task) => String(task.user_id) === id);
    const overdue = participantTasks.filter((task) => String(task.status) !== "complete" && task.due_date && analyticsDate(task.due_date)! < new Date()).length;
    const stalled = isLearningStalled({
      progressPercent: percent,
      programmeStart: participant.programme_start || participant.created_at,
      latestLearningAt: latestLessonAt
    });

    return {
      id,
      full_name: String(participant.full_name || ""),
      email: String(participant.email || ""),
      created_at: participant.created_at,
      last_login_at: participant.last_login_at,
      last_seen_at: participant.last_seen_at,
      login_count: Number(participant.login_count || 0),
      status: participant.status ? String(participant.status) : null,
      programme_start: participant.programme_start,
      tier,
      completedLessons: completed,
      accessibleLessons: accessible.length,
      progressPercent: percent,
      latestLessonAt,
      checkin,
      readiness,
      overdueTasks: overdue,
      active7: isRecentlyActive(participant.last_seen_at, 7),
      active30: isRecentlyActive(participant.last_seen_at, 30),
      neverLoggedIn: !participant.last_login_at,
      stalled
    };
  });

  const activeParticipants = participantMetrics.filter((row) => String(row.status) === "active");
  const q = String(filters.q || "").trim().toLowerCase();
  const tierFilter = String(filters.tier || "");
  const engagementFilter = String(filters.engagement || "");

  const filteredParticipants = participantMetrics.filter((row) => {
    const textMatch = !q || String(row.full_name).toLowerCase().includes(q) || String(row.email).toLowerCase().includes(q);
    const tierMatch = !tierFilter || row.tier === tierFilter;
    const engagementMatch =
      !engagementFilter ||
      (engagementFilter === "active7" && row.active7) ||
      (engagementFilter === "inactive30" && !row.active30) ||
      (engagementFilter === "never_logged_in" && row.neverLoggedIn) ||
      (engagementFilter === "stalled" && row.stalled) ||
      (engagementFilter === "complete" && row.progressPercent === 100);
    return textMatch && tierMatch && engagementMatch;
  });

  const pageSize = 50;
  const requestedPage = Math.max(1, Number.parseInt(String(filters.page || "1"), 10) || 1);
  const totalPages = Math.max(1, Math.ceil(filteredParticipants.length / pageSize));
  const currentPage = Math.min(requestedPage, totalPages);
  const visibleParticipants = filteredParticipants.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function paginationHref(page: number) {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (tierFilter) params.set("tier", tierFilter);
    if (engagementFilter) params.set("engagement", engagementFilter);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? "/admin/analytics?" + query : "/admin/analytics";
  }

  const loggedInEver = activeParticipants.filter((row) => !row.neverLoggedIn).length;
  const active7 = activeParticipants.filter((row) => row.active7).length;
  const active30 = activeParticipants.filter((row) => row.active30).length;
  const neverLoggedIn = activeParticipants.filter((row) => row.neverLoggedIn).length;
  const avgProgress = activeParticipants.length ? Math.round(activeParticipants.reduce((sum, row) => sum + row.progressPercent, 0) / activeParticipants.length) : 0;
  const completedProgramme = activeParticipants.filter((row) => row.progressPercent === 100).length;
  const stalled = activeParticipants.filter((row) => row.stalled).length;

  const recentCheckins = activeParticipants
    .map((row) => row.checkin)
    .filter((row): row is Record<string, any> => Boolean(row))
    .filter((row) => {
    const age = daysSince(row.week_start);
    return age !== null && age <= 7;
  });
  const confidenceValues = recentCheckins.map((row) => Number(row.confidence)).filter((value) => value >= 1 && value <= 5);
  const avgConfidence = confidenceValues.length ? (confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length).toFixed(1) : "—";
  const supportRequests = recentCheckins.filter((row) => String(row.support_needed || "").trim()).length;
  const lowConfidence = recentCheckins.filter((row) => Number(row.confidence || 0) > 0 && Number(row.confidence) <= 2).length;

  const openTasks = taskData.filter((task) => String(task.status) !== "complete");
  const overdueTasks = openTasks.filter((task) => task.due_date && analyticsDate(task.due_date)! < new Date()).length;
  const waitingKydos = openTasks.filter((task) => String(task.status) === "waiting_kydos").length;
  const waitingParticipants = openTasks.filter((task) => String(task.status) === "waiting_participant").length;

  const paidOrders = orderData.filter((row) => String(row.status) === "paid");
  const paidRevenue = paidOrders.reduce((sum, row) => sum + Number(row.amount_total || 0), 0);
  const provisionedPaid = paidOrders.filter((row) => row.provisioned_at).length;
  const activationRate = paidOrders.length ? Math.round((provisionedPaid / paidOrders.length) * 100) : 0;
  const refunds = orderData.filter((row) => String(row.status) === "refunded").length;
  const disputes = orderData.filter((row) => String(row.status) === "disputed").length;

  const progressBands = [
    { label: "Not started", count: activeParticipants.filter((row) => row.progressPercent === 0).length },
    { label: "1–24%", count: activeParticipants.filter((row) => row.progressPercent >= 1 && row.progressPercent <= 24).length },
    { label: "25–49%", count: activeParticipants.filter((row) => row.progressPercent >= 25 && row.progressPercent <= 49).length },
    { label: "50–74%", count: activeParticipants.filter((row) => row.progressPercent >= 50 && row.progressPercent <= 74).length },
    { label: "75–99%", count: activeParticipants.filter((row) => row.progressPercent >= 75 && row.progressPercent <= 99).length },
    { label: "Complete", count: activeParticipants.filter((row) => row.progressPercent === 100).length }
  ];
  const maxProgressBand = Math.max(1, ...progressBands.map((row) => row.count));

  const tierCounts = (["blueprint", "build", "dfy"] as Tier[]).map((tier) => ({
    tier,
    label: tierLabels[tier],
    count: activeParticipants.filter((row) => row.tier === tier).length
  }));
  const maxTierCount = Math.max(1, ...tierCounts.map((row) => row.count));

  const modulePerformance = modules.map((module) => {
    const eligible = activeParticipants.filter((participant) => participant.tier && module.lessons.some((lesson) => canAccessTier(participant.tier!, lesson.minimumTier)));
    const percentages = eligible.map((participant) => {
      const accessible = module.lessons.filter((lesson) => canAccessTier(participant.tier!, lesson.minimumTier));
      const completedIds = new Set((progressByUser.get(String(participant.id)) || []).map((row) => String(row.lesson_id)));
      const completed = accessible.filter((lesson) => completedIds.has(lesson.id)).length;
      return completionPercent(completed, accessible.length);
    });
    return {
      number: module.number,
      title: module.title,
      eligible: eligible.length,
      average: percentages.length ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length) : 0
    };
  });

  const enrolmentMonths = new Map<string, number>();
  for (const enrolment of enrolmentData) {
    const date = analyticsDate(enrolment.programme_start || enrolment.created_at);
    if (!date) continue;
    const key = date.toISOString().slice(0, 7);
    enrolmentMonths.set(key, (enrolmentMonths.get(key) || 0) + 1);
  }
  const cohortRows = Array.from(enrolmentMonths.entries()).sort(([a], [b]) => a.localeCompare(b)).slice(-12);
  const maxCohort = Math.max(1, ...cohortRows.map(([, count]) => count));

  const activeUserIds = new Set(activeParticipants.map((row) => String(row.id)));
  const lessonCompletionCounts = new Map<string, number>();
  for (const row of progressData) {
    if (!activeUserIds.has(String(row.user_id))) continue;
    const lessonId = String(row.lesson_id);
    lessonCompletionCounts.set(lessonId, (lessonCompletionCounts.get(lessonId) || 0) + 1);
  }

  const lessonPerformance = modules.flatMap((module) =>
    module.lessons.map((lesson) => {
      const eligible = activeParticipants.filter((participant) =>
        participant.tier ? canAccessTier(participant.tier, lesson.minimumTier) : false
      ).length;
      const completions = lessonCompletionCounts.get(lesson.id) || 0;
      return {
        id: lesson.id,
        title: lesson.title,
        module: module.title,
        eligible,
        completions,
        rate: completionPercent(completions, eligible)
      };
    })
  );
  const dropOffWatch = lessonPerformance
    .filter((row) => row.eligible > 0)
    .sort((a, b) => a.rate - b.rate || b.eligible - a.eligible)
    .slice(0, 8);

  const lessonLookup = new Map(
    modules.flatMap((module) => module.lessons.map((lesson) => [lesson.id, { title: lesson.title, module: module.title }] as const))
  );
  const topDownloads = resourceDownloadData.map((row) => {
    const lesson = lessonLookup.get(String(row.lesson_id));
    return {
      lessonId: String(row.lesson_id || ""),
      title: lesson?.title || String(row.lesson_id || "Unknown resource"),
      module: lesson?.module || "Programme resource",
      downloads: Number(row.downloads || 0),
      uniqueUsers: Number(row.unique_users || 0)
    };
  });

  const activityByDay = new Map(dailyActivityData.map((row) => [String(row.day), row]));
  const dailyActivity = Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (13 - index));
    const key = date.toISOString().slice(0, 10);
    const row = activityByDay.get(key);
    return {
      day: key,
      label: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(date),
      events: Number(row?.events || 0),
      activeUsers: Number(row?.active_users || 0)
    };
  });
  const maxDailyEvents = Math.max(1, ...dailyActivity.map((row) => row.events));
  const trackedEvents14d = dailyActivity.reduce((sum, row) => sum + row.events, 0);

  return (
    <main className="container admin-page super-admin-analytics">
      <div className="portal-top">
        <div>
          <span className="pill">Kydos Super Admin</span>
          <h1>Academy analytics</h1>
          <p className="muted">One view of enrolment, logins, learning progress, participant engagement, delivery risk, support demand and programme revenue.</p>
        </div>
        <div className="admin-top-actions">
          <Link className="btn" href="/admin">Operations</Link>
          <Link className="btn" href="/admin/check-ins">Check-ins</Link>
          <Link className="btn" href="/admin/orders">Orders</Link>
          <Link className="btn" href="/admin/attention">Attention queue</Link>
          <Link className="btn" href="/admin/exports">Exports</Link>
        </div>
      </div>

      <section className="analytics-kpi-grid">
        <article className="analytics-kpi card"><small>Active participants</small><strong>{activeParticipants.length}</strong><span>{loggedInEver} have logged in</span></article>
        <article className="analytics-kpi card"><small>Active in last 7 days</small><strong>{active7}</strong><span>{activeParticipants.length ? Math.round((active7 / activeParticipants.length) * 100) : 0}% of active participants</span></article>
        <article className="analytics-kpi card"><small>Never logged in</small><strong>{neverLoggedIn}</strong><span>Accounts needing activation follow-up</span></article>
        <article className="analytics-kpi card"><small>Average course progress</small><strong>{avgProgress}%</strong><span>{completedProgramme} fully complete</span></article>
        <article className="analytics-kpi card"><small>Stalled learners</small><strong>{stalled}</strong><span>No learning progress for 14+ days</span></article>
        <article className="analytics-kpi card"><small>Check-ins this week</small><strong>{recentCheckins.length}</strong><span>Avg confidence {avgConfidence}/5</span></article>
        <article className="analytics-kpi card"><small>Paid programme revenue</small><strong>{money(paidRevenue)}</strong><span>{paidOrders.length} paid orders</span></article>
        <article className="analytics-kpi card"><small>Paid account activation</small><strong>{activationRate}%</strong><span>{refunds} refunds · {disputes} disputes</span></article>
      </section>

      <div className="analytics-two-column">
        <section className="analytics-panel card">
          <div className="analytics-panel-head"><div><span className="eyebrow">Engagement</span><h2>Progress distribution</h2></div><span>{activeParticipants.length} active</span></div>
          <div className="analytics-bars">
            {progressBands.map((band) => (
              <div className="analytics-bar-row" key={band.label}>
                <span>{band.label}</span>
                <div className="analytics-bar-track"><div style={{ width: Math.max(2, Math.round((band.count / maxProgressBand) * 100)) + "%" }} /></div>
                <strong>{band.count}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="analytics-panel card">
          <div className="analytics-panel-head"><div><span className="eyebrow">Commercial</span><h2>Programme mix</h2></div><span>{active30} active in 30 days</span></div>
          <div className="analytics-bars">
            {tierCounts.map((row) => (
              <div className="analytics-bar-row" key={row.tier}>
                <span>{row.label}</span>
                <div className="analytics-bar-track"><div style={{ width: Math.max(2, Math.round((row.count / maxTierCount) * 100)) + "%" }} /></div>
                <strong>{row.count}</strong>
              </div>
            ))}
          </div>
          <div className="analytics-mini-stats">
            <div><small>Open tasks</small><strong>{openTasks.length}</strong></div>
            <div><small>Overdue</small><strong>{overdueTasks}</strong></div>
            <div><small>Waiting Kydos</small><strong>{waitingKydos}</strong></div>
            <div><small>Waiting participant</small><strong>{waitingParticipants}</strong></div>
          </div>
        </section>
      </div>

      <section className="analytics-panel card" style={{ marginTop: 18 }}>
        <div className="analytics-panel-head"><div><span className="eyebrow">Learning funnel</span><h2>Average progress by module</h2></div><span>Across eligible active participants</span></div>
        <div className="module-analytics-grid">
          {modulePerformance.map((module) => (
            <article key={module.number}>
              <small>Module {String(module.number).padStart(2, "0")} · {module.eligible} eligible</small>
              <strong>{module.title}</strong>
              <div className="progress-track" role="progressbar" aria-label={module.title + " average completion"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={module.average}><div className="progress-bar" style={{ width: module.average + "%" }} /></div>
              <span>{module.average}% average completion</span>
            </article>
          ))}
        </div>
      </section>

      <div className="analytics-two-column">
        <section className="analytics-panel card">
          <div className="analytics-panel-head"><div><span className="eyebrow">Cohorts</span><h2>Enrolments by month</h2></div><span>Latest 12 months represented</span></div>
          {cohortRows.length ? <div className="analytics-bars">{cohortRows.map(([month,count]) => (
            <div className="analytics-bar-row" key={month}><span>{month}</span><div className="analytics-bar-track"><div style={{ width: Math.max(2,Math.round((count/maxCohort)*100))+"%" }} /></div><strong>{count}</strong></div>
          ))}</div> : <div className="notice">No enrolment cohorts yet.</div>}
        </section>

        <section className="analytics-panel card">
          <div className="analytics-panel-head"><div><span className="eyebrow">Participant pulse</span><h2>Support and confidence</h2></div><Link href="/admin/check-ins">Open check-ins →</Link></div>
          <div className="analytics-pulse-grid">
            <div><small>Check-in coverage</small><strong>{activeParticipants.length ? Math.round((recentCheckins.length/activeParticipants.length)*100) : 0}%</strong><span>Submitted this week</span></div>
            <div><small>Average confidence</small><strong>{avgConfidence}</strong><span>Out of 5</span></div>
            <div><small>Support requests</small><strong>{supportRequests}</strong><span>Latest weekly check-in</span></div>
            <div><small>Low confidence</small><strong>{lowConfidence}</strong><span>Confidence 1 or 2</span></div>
          </div>
        </section>
      </div>

      <div className="analytics-two-column">
        <section className="analytics-panel card">
          <div className="analytics-panel-head"><div><span className="eyebrow">Engagement trend</span><h2>Academy activity, last 14 days</h2></div><span>{trackedEvents14d} tracked events</span></div>
          <div className="daily-activity-chart">
            {dailyActivity.map((row) => (
              <div className="daily-activity-column" key={row.day} title={row.events + " events · " + row.activeUsers + " active users"}>
                <div className="daily-activity-bar-wrap"><div className="daily-activity-bar" style={{ height: Math.max(3, Math.round((row.events / maxDailyEvents) * 100)) + "%" }} /></div>
                <strong>{row.events}</strong>
                <span>{row.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="analytics-panel card">
          <div className="analytics-panel-head"><div><span className="eyebrow">Resource usage</span><h2>Most downloaded resources</h2></div><span>Tracked downloads</span></div>
          {topDownloads.length ? (
            <div className="analytics-ranked-list">
              {topDownloads.map((row, index) => (
                <div key={row.lessonId}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{row.title}</strong><small>{row.module}</small></div>
                  <b>{row.downloads}<small>{row.uniqueUsers} users</small></b>
                </div>
              ))}
            </div>
          ) : <div className="notice">Download analytics will appear after participants begin using programme resources.</div>}
        </section>
      </div>

      <section className="analytics-panel card" style={{ marginTop: 18 }}>
        <div className="analytics-panel-head"><div><span className="eyebrow">Learning diagnostics</span><h2>Lesson drop-off watch</h2></div><span>Lowest completion rates among eligible participants</span></div>
        {dropOffWatch.length ? (
          <div className="dropoff-grid">
            {dropOffWatch.map((lesson) => (
              <article key={lesson.id}>
                <small>{lesson.module} · {lesson.completions}/{lesson.eligible} completed</small>
                <strong>{lesson.title}</strong>
                <div className="progress-track" role="progressbar" aria-label={lesson.title + " completion"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={lesson.rate}><div className="progress-bar" style={{ width: lesson.rate + "%" }} /></div>
                <span>{lesson.rate}% completion</span>
              </article>
            ))}
          </div>
        ) : <div className="notice">Lesson drop-off analytics will appear once active participants begin the programme.</div>}
      </section>

      <section className="admin-filter-panel card">
        <form method="get" className="admin-filter-grid">
          <div className="field"><label htmlFor="analytics-q">Search participant</label><input id="analytics-q" name="q" defaultValue={filters.q || ""} placeholder="Name or email" /></div>
          <div className="field"><label htmlFor="analytics-tier">Plan</label><select id="analytics-tier" name="tier" className="select" defaultValue={tierFilter}><option value="">All plans</option><option value="blueprint">Blueprint</option><option value="build">Build With Us</option><option value="dfy">Done For You</option></select></div>
          <div className="field"><label htmlFor="analytics-engagement">Engagement</label><select id="analytics-engagement" name="engagement" className="select" defaultValue={engagementFilter}><option value="">All participants</option><option value="active7">Active in 7 days</option><option value="inactive30">Inactive 30+ days</option><option value="never_logged_in">Never logged in</option><option value="stalled">Learning stalled</option><option value="complete">Course complete</option></select></div>
          <div className="admin-filter-actions"><button className="btn btn-primary" type="submit">Apply</button><Link className="btn" href="/admin/analytics">Clear</Link></div>
        </form>
      </section>

      <section style={{ marginTop: 28 }}>
        <div className="portal-section-heading"><div><span className="eyebrow">Participant analytics</span><h2>Everyone taking the programme</h2><p className="muted">{filteredParticipants.length} matching participant{filteredParticipants.length===1?"":"s"} · page {currentPage} of {totalPages}</p></div></div>
        <div className="admin-table-wrap card">
          <table className="admin-table analytics-participant-table">
            <thead><tr><th>Participant</th><th>Plan</th><th>Last login</th><th>Logins</th><th>Last seen</th><th>Progress</th><th>Latest learning</th><th>Check-in</th><th>Launch readiness</th><th>Signals</th></tr></thead>
            <tbody>{visibleParticipants.map((row) => {
              const checkin=row.checkin;
              const signals=[
                row.neverLoggedIn?"Never logged in":"",
                row.stalled?"Stalled":"",
                row.overdueTasks?row.overdueTasks+" overdue":"",
                checkin&&Number(checkin.confidence||0)>0&&Number(checkin.confidence)<=2?"Low confidence":"",
                checkin&&String(checkin.support_needed||"").trim()?"Support requested":""
              ].filter(Boolean);
              return <tr key={String(row.id)}>
                <td><Link className="admin-person-link" href={"/admin/participants/"+String(row.id)}>{String(row.full_name)}</Link><small className="table-subline">{String(row.email)}</small></td>
                <td>{row.tier?tierLabels[row.tier]:"No active plan"}</td>
                <td>{formatDateTime(row.last_login_at)}</td>
                <td>{Number(row.login_count||0)}</td>
                <td>{formatDateTime(row.last_seen_at)}</td>
                <td><strong>{row.progressPercent}%</strong><small className="table-subline">{row.completedLessons}/{row.accessibleLessons} lessons</small></td>
                <td>{formatDateTime(row.latestLessonAt)}</td>
                <td>{checkin?String(checkin.week_start)+(checkin.confidence?" · "+String(checkin.confidence)+"/5":""):"None"}</td>
                <td>{row.readiness?row.readiness.percent+"%":"No intake"}</td>
                <td>{signals.length?<div className="analytics-signals">{signals.map((signal)=><span key={signal}>{signal}</span>)}</div>:<span className="analytics-ok">Healthy</span>}</td>
              </tr>;
            })}</tbody>
          </table>
        </div>
        {totalPages > 1 ? (
          <nav className="analytics-pagination" aria-label="Participant analytics pages">
            {currentPage > 1 ? <Link className="btn" href={paginationHref(currentPage - 1)}>← Previous</Link> : <span />}
            <span>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredParticipants.length)} of {filteredParticipants.length}</span>
            {currentPage < totalPages ? <Link className="btn" href={paginationHref(currentPage + 1)}>Next →</Link> : <span />}
          </nav>
        ) : null}
      </section>

      <section className="analytics-panel card" style={{ marginTop: 28 }}>
        <div className="analytics-panel-head"><div><span className="eyebrow">Live activity</span><h2>Recent Academy activity</h2></div><Link href="/admin/audit">Full audit log →</Link></div>
        <div className="activity-feed">
          {activityData.slice(0,30).length ? activityData.slice(0,30).map((event) => (
            <article key={String(event.id)}>
              <span className="activity-dot" />
              <div><strong>{event.full_name?String(event.full_name):"System"} · {eventLabel(event.event_type)}</strong><small>{formatDateTime(event.created_at)}{event.entity_type?" · "+String(event.entity_type):""}</small></div>
              {event.user_id?<Link href={"/admin/participants/"+String(event.user_id)}>View</Link>:null}
            </article>
          )) : <div className="notice">Activity events will appear once participants begin using the Academy.</div>}
        </div>
      </section>
    </main>
  );
}
