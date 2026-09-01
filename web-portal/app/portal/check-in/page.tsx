import { mondayWeekStart } from "@/lib/academy-rules";
import { requireAcademyContext, requireActiveEnrolment } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { saveWeeklyCheckIn } from "./actions";

export const dynamic = "force-dynamic";

export default async function WeeklyCheckInPage() {
  const { academyUser } = await requireAcademyContext();
  await requireActiveEnrolment(academyUser.id);

  const weekStart = mondayWeekStart();
  const sql = getSql();
  const [currentRows, history] = await Promise.all([
    sql.query("select * from participant_weekly_checkins where user_id = $1 and week_start = $2 limit 1", [academyUser.id, weekStart]),
    sql.query("select week_start, wins, blockers, next_focus, support_needed, confidence, submitted_at from participant_weekly_checkins where user_id = $1 order by week_start desc limit 8", [academyUser.id])
  ]);

  const current = currentRows[0] as Record<string, any> | undefined;

  return (
    <>
      <div className="portal-top">
        <div>
          <span className="pill">Weekly check-in</span>
          <h1>Keep Kydos close to what is happening.</h1>
          <p className="muted">Use this once a week to record progress, blockers and what you need help with. You can update the current week until it moves on.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel card">
          <span className="eyebrow">Week starting {weekStart}</span>
          <form action={saveWeeklyCheckIn}>
            <div className="field">
              <label>What moved forward this week?</label>
              <textarea name="wins" className="textarea" rows={4} maxLength={6000} defaultValue={current?.wins || ""} placeholder="Company setup, website progress, recruitment, client conversations, systems completed..." />
            </div>
            <div className="field">
              <label>What is blocking you?</label>
              <textarea name="blockers" className="textarea" rows={4} maxLength={6000} defaultValue={current?.blockers || ""} placeholder="Anything slowing implementation, decisions, recruitment or launch." />
            </div>
            <div className="field">
              <label>Your main focus before the next check-in</label>
              <textarea name="nextFocus" className="textarea" rows={4} maxLength={6000} defaultValue={current?.next_focus || ""} />
            </div>
            <div className="field">
              <label>What do you need from Kydos?</label>
              <textarea name="supportNeeded" className="textarea" rows={4} maxLength={6000} defaultValue={current?.support_needed || ""} placeholder="Questions, reviews, decisions or implementation support." />
            </div>
            <div className="field">
              <label>How confident do you feel about your current launch progress?</label>
              <select name="confidence" className="select" defaultValue={current?.confidence ? String(current.confidence) : ""}>
                <option value="">Select</option>
                <option value="1">1 - I feel stuck</option>
                <option value="2">2 - I need more support</option>
                <option value="3">3 - Moving, with some blockers</option>
                <option value="4">4 - Good progress</option>
                <option value="5">5 - Very confident</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">{current ? "Update this week" : "Submit weekly check-in"}</button>
          </form>
        </section>

        <section className="panel card">
          <span className="eyebrow">Recent history</span>
          <h2 style={{ marginTop: 12 }}>Your last check-ins</h2>
          <p className="muted">This gives you and Kydos a running record of what changed from week to week.</p>

          <div className="compact-list">
            {history.length ? history.map((item) => (
              <div key={String(item.week_start)}>
                <strong>Week of {String(item.week_start)}{item.confidence ? " · Confidence " + String(item.confidence) + "/5" : ""}</strong>
                <span>{item.next_focus ? "Next focus: " + String(item.next_focus).slice(0, 120) : "No next focus recorded."}</span>
              </div>
            )) : <span className="muted">Your weekly check-in history will appear here after the first submission.</span>}
          </div>
        </section>
      </div>
    </>
  );
}
