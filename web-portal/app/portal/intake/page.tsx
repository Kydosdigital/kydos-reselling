import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveIntake } from "./actions";

export default async function IntakePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: intake } = await supabase
    .from("participant_intake")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

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
