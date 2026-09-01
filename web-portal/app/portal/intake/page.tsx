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
              <label>Location</label>
              <input name="location" defaultValue={intake?.location || ""} placeholder="Manchester, UK" />
            </div>
          </div>
          <div className="field">
            <label>What do you want this agency to achieve in the first 12 months?</label>
            <textarea name="goals" className="textarea" defaultValue={intake?.goals || ""} rows={5} />
          </div>
          <div className="field">
            <label>Anything Kydos should know before implementation starts?</label>
            <textarea name="notes" className="textarea" defaultValue={intake?.notes || ""} rows={5} />
          </div>
          <button className="btn btn-primary" type="submit">Save intake</button>
        </form>
      </section>
    </>
  );
}
