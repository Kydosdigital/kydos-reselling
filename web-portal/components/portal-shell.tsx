import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { getActiveEnrolment, requireAcademyContext } from "@/lib/academy";
import { modules, tierLabels, type Tier } from "@/lib/programme-data";

export async function PortalShell({ children }: { children: React.ReactNode }) {
  const { academyUser } = await requireAcademyContext();
  const enrolment = await getActiveEnrolment(academyUser.id);
  const tier = enrolment?.tier as Tier | undefined;

  return (
    <div className="portal-layout">
      <aside className="sidebar">
        <Link href="/portal" className="brand">
          <span className="brand-mark" />
          <span>Kydos Academy</span>
        </Link>

        <div className="side-profile">
          <strong>{academyUser.full_name}</strong>
          <span>{tier ? tierLabels[tier] : "Access pending"}</span>
        </div>

        <div className="side-nav-section">
          <small>Workspace</small>
          <nav className="side-nav">
            <Link href="/portal">Dashboard</Link>
            <Link href="/portal/search">Search</Link>
            <Link href="/portal/intake">My Intake</Link>
            <Link href="/portal/implementation">Implementation</Link>
            <Link href="/portal/launch">Launch Plan</Link>
            <Link href="/portal/downloads">Downloads</Link>
            <Link href="/portal/account">My Account</Link>
            {academyUser.role === "admin" ? <Link href="/admin">Kydos Admin</Link> : null}
          </nav>
        </div>

        <div className="side-nav-section side-programme">
          <small>Programme</small>
          <nav className="side-nav module-side-nav">
            {modules.map((module) => (
              <Link href={"/portal/module/" + module.slug} key={module.slug}>
                <span>{String(module.number).padStart(2, "0")}</span>
                {module.title}
              </Link>
            ))}
          </nav>
        </div>

        <form action={signOut} className="sidebar-signout">
          <button className="btn" type="submit" style={{ width: "100%" }}>Sign out</button>
        </form>
      </aside>
      <main className="portal-main">{children}</main>
    </div>
  );
}
