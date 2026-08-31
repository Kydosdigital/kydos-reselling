import Link from "next/link";
import { signOut } from "@/app/login/actions";

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-layout">
      <aside className="sidebar">
        <Link href="/portal" className="brand">
          <span className="brand-mark" />
          <span>Kydos Digital</span>
        </Link>

        <nav className="side-nav">
          <Link href="/portal">Dashboard</Link>
          <Link href="/portal/module/start-here">Start Here</Link>
          <Link href="/portal/module/crm-sales">CRM & Sales</Link>
          <Link href="/portal/module/social-delivery">Delivery</Link>
          <Link href="/portal/module/recruitment">Recruitment</Link>
          <Link href="/portal/module/operations">Operations</Link>
        </nav>

        <form action={signOut} style={{ marginTop: 28 }}>
          <button className="btn" type="submit" style={{ width: "100%" }}>Sign out</button>
        </form>
      </aside>

      <main className="portal-main">{children}</main>
    </div>
  );
}
