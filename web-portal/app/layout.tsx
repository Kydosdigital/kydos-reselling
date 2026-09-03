import type { Metadata } from "next";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://academy.kydosdigital.com";
const allowIndexing = process.env.NEXT_PUBLIC_ENABLE_INDEXING === "true";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Kydos Academy | Build Your UK Digital Marketing Agency",
    template: "%s | Kydos Academy"
  },
  description: "Learn how to start and operate a UK digital marketing agency with the company, website, CRM, sales, team and delivery systems behind Kydos Digital.",
  authors: [{ name: "Kydos Digital", url: "https://kydosdigital.com" }],
  creator: "Kydos Digital",
  publisher: "KYDOS DIGITAL LTD",
  keywords: ["start digital marketing agency UK", "digital marketing agency course UK", "how to start a marketing agency", "digital marketing agency training", "agency business programme"],
  applicationName: "Kydos Academy",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/brand/kydos-academy-app-icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/brand/kydos-academy-app-icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/kydos-academy-app-icon.svg", type: "image/svg+xml" }]
  },
  category: "Business education and agency implementation",
  alternates: {
    types: { "application/rss+xml": "/blog/rss.xml" }
  },
  openGraph: {
    title: "Kydos Academy | Build Your UK Digital Marketing Agency",
    description: "Build the company, brand, website, CRM, sales system, team and client-delivery infrastructure needed to operate a professional digital marketing agency.",
    url: appUrl,
    siteName: "Kydos Academy",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Kydos Academy | Build Your UK Digital Marketing Agency"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kydos Academy | Build Your UK Digital Marketing Agency",
    description: "A practical agency build programme from Kydos Digital.",
    images: ["/twitter-image"]
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false }
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en-GB"><body>{children}</body></html>;
}
