import { requireAcademyContext } from "@/lib/academy";
import { getSql } from "@/lib/db";
import { saveIntake } from "./actions";

export const dynamic = "force-dynamic";

export default async function IntakePage() {
  const { academyUser } = await requireAcademyContext();
  const sql = getSql();
  const rows = await sql.query("select * from participant_intake where user_id = $1 limit 1", [academyUser.id]);
  const intake = rows[0] as Record<string, any> | undefined;

  return (
    <>
      <div className="portal-top">
        <div>
          <span className="pill">Agency setup</span>
          <h1>Participant intake</h1>
          <p className="muted">Tell Kydos what already exists so your launch plan starts from the right place.</p>
        </div>
      </div>

      <section className="panel card">
        <form action={saveIntake}>
          <div className="intake-section">
            <span className="eyebrow">Business foundation</span>
            <div className="form-grid">
              <div className="field">
                <label>Agency name, if chosen</label>
                <input name="agencyName" defaultValue={intake?.agency_name || ""} />
              </div>
              <div className="field">
                <label>Company status</label>
                <select name="companyStatus" defaultValue={intake?.company_status || "not_started"} className="select">
                  <option value="not_started">Not started</option>
                  <option value="name_chosen">Name chosen</option>
                  <option value="incorporated">Company incorporated</option>
                  <option value="already_trading">Already trading</option>
                </select>
              </div>
              <div className="field">
                <label>Location</label>
                <input name="location" defaultValue={intake?.location || ""} placeholder="Manchester, UK" />
              </div>
              <div className="field">
                <label>Target launch date</label>
                <input name="targetLaunchDate" type="date" defaultValue={intake?.target_launch_date || ""} />
              </div>
              <div className="field">
                <label>Operating structure</label>
                <select name="preferredStructure" defaultValue={intake?.preferred_structure || "owner_led"} className="select">
                  <option value="owner_led">Owner-led initially</option>
                  <option value="hands_off">Operations Manager / hands-off</option>
                  <option value="unsure">Not sure yet</option>
                </select>
              </div>
              <div className="field">
                <label>Time you can commit weekly</label>
                <select name="weeklyTimeCommitment" defaultValue={intake?.weekly_time_commitment || ""} className="select">
                  <option value="">Select</option>
                  <option value="under_5">Under 5 hours</option>
                  <option value="5_10">5 to 10 hours</option>
                  <option value="10_20">10 to 20 hours</option>
                  <option value="20_plus">20+ hours</option>
                </select>
              </div>
            </div>
          </div>

          <div className="intake-section">
            <span className="eyebrow">What is already in place?</span>
            <div className="form-grid">
              <div className="field"><label>Domain</label><select name="domainStatus" defaultValue={intake?.domain_status || "not_started"} className="select"><option value="not_started">Not started</option><option value="chosen">Chosen</option><option value="purchased">Purchased</option><option value="connected">Connected and live</option></select></div>
              <div className="field"><label>Website</label><select name="websiteStatus" defaultValue={intake?.website_status || "not_started"} className="select"><option value="not_started">Not started</option><option value="briefing">Briefing / planning</option><option value="in_build">In build</option><option value="live">Already live</option></select></div>
              <div className="field"><label>CRM</label><select name="crmStatus" defaultValue={intake?.crm_status || "not_started"} className="select"><option value="not_started">Not started</option><option value="selected">Platform selected</option><option value="configuring">Being configured</option><option value="live">Live and in use</option></select></div>
              <div className="field"><label>Team</label><select name="teamStatus" defaultValue={intake?.team_status || "not_started"} className="select"><option value="not_started">No team yet</option><option value="recruiting">Recruiting</option><option value="partial">Some roles filled</option><option value="launch_team_ready">Launch team ready</option></select></div>
              <div className="field"><label>Current paying clients</label><input name="currentClients" type="number" min="0" defaultValue={intake?.current_clients ?? ""} /></div>
              <div className="field"><label>Startup operating budget, GBP</label><input name="startupBudgetGbp" type="number" min="0" step="1" defaultValue={intake?.startup_budget_gbp ?? ""} placeholder="Excluding programme fee" /></div>
            </div>
          </div>

          <div className="intake-section">
            <span className="eyebrow">Services & acquisition</span>
            <div className="form-grid">
              <div className="field">
                <label>Services you want the agency to focus on</label>
                <input name="servicesFocus" defaultValue={intake?.services_focus || ""} placeholder="e.g. Social media, Meta Ads, websites" />
              </div>
              <div className="field">
                <label>Client acquisition readiness</label>
                <select name="acquisitionReadiness" defaultValue={intake?.acquisition_readiness || "not_ready"} className="select">
                  <option value="not_ready">Not ready yet</option>
                  <option value="building_capacity">Building team/capacity</option>
                  <option value="ready_to_test">Ready to test acquisition</option>
                  <option value="already_acquiring">Already acquiring clients</option>
                </select>
              </div>
            </div>
          </div>

          <div className="intake-section">
            <span className="eyebrow">Your goal</span>
            <div className="field">
              <label>What do you want this agency to achieve in the first 12 months?</label>
              <textarea name="goals" className="textarea" defaultValue={intake?.goals || ""} rows={5} />
            </div>
            <div className="field">
              <label>Anything Kydos should know before implementation starts?</label>
              <textarea name="notes" className="textarea" defaultValue={intake?.notes || ""} rows={5} />
            </div>
          </div>

          <button className="btn btn-primary" type="submit">Save intake</button>
        </form>
      </section>
    </>
  );
}
