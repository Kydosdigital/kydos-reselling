import type { Metadata } from "next";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kydosdigital.com";
const allowIndexing = process.env.NEXT_PUBLIC_ENABLE_INDEXING === "true";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Kydos Digital Agency Programme",
    template: "%s | Kydos Digital"
  },
  description: "Build and launch your own UK digital marketing agency using the systems behind Kydos Digital.",
  openGraph: {
    title: "Kydos Digital Agency Programme",
    description: "Build your own UK digital marketing agency with the company, CRM, team, delivery and sales systems behind Kydos Digital.",
    type: "website"
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false }
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
