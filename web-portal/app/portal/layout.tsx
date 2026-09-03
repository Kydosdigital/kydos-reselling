import type { Metadata } from "next";
import { PortalShell } from "@/components/portal-shell";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true }
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
