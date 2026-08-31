import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { accessibleLessons, canAccessTier, modules, tierLabels, type Tier } from "@/lib/programme-data";

export default async function PortalDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: enrolment }, { data: progress }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    supabase.from("enrolments").select("tier,programme_start,support_end,handover_date,status").eq("user_id", user.id).eq("status", "active").maybeSingle(),
    supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id)
  ]);

  const tier = ((enrolment?.tier as Tier) || "blueprint");
  const allAccessible = accessibleLessons(tier);
  const completed = new Set((progress || []).map((p) => p.lesson_id));
  const completeCount = allAccessible.filter((lesson) => completed.has(lesson.id)).length;
  const percent = allAccessible.length ? Math.round((completeCount / allAccessible.length) * 100) : 0;

  const firstName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <>
      <div className="portal-top">
        <div>
          <span className="pill">{tierLabels[tier]}</span>
          <h1>Welcome back, {firstName}.</h1>
          <p className="muted">Keep moving through the build in order. The goal is a working agency, not completed lessons.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "baseline" }}>
            <div>
              <small className="muted">Programme progress</small>
              <h2 style={{ marginTop: 8 }}>{percent}% complete</h2>
            </div>
            <strong>{completeCount}/{allAccessible.length}</strong>
          </div>

          <div className="progress-track" style={{ marginTop: 18 }}>
            <div className="progress-bar" style={{ width: percent + "%" }} />
          </div>

          <p className="muted" style={{ marginBottom: 0 }}>
            Programme start: {enrolment?.programme_start || "Set by Kydos"}<br />
            Active support ends: {enrolment?.support_end || "Set by Kydos"}
          </p>
        </section>

        <section className="panel card">
          <small className="muted">Your current operating rule</small>
          <h3 style={{ fontSize: 24 }}>Build capacity before acquisition.</h3>
          <p className="muted">
            Your minimum launch team is an Account Manager, Creative and Sales Closer before paid lead generation starts.
          </p>
        </section>
      </div>

      <section style={{ marginTop: 30 }}>
        <h2>Your modules</h2>
        <div className="module-grid">
          {modules.map((module) => {
            const accessible = module.lessons.filter((lesson) => canAccessTier(tier, lesson.minimumTier));
            const moduleComplete = accessible.filter((lesson) => completed.has(lesson.id)).length;
            const locked = accessible.length === 0;

            return (
              <Link
                href={locked ? "#" : "/portal/module/" + module.slug}
                className="module-card card"
                key={module.slug}
                aria-disabled={locked}
              >
                <small>Module {module.number}</small>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <small>{locked ? "Not included in your tier" : moduleComplete + "/" + accessible.length + " complete"}</small>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
