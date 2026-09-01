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
  description: "Build a structured UK digital marketing agency with the company, website, CRM, sales, team and delivery systems behind Kydos Digital.",
  applicationName: "Kydos Academy",
  category: "Business education and agency implementation",
  alternates: {
    canonical: "/"
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
        url: "https://images.pexels.com/photos/3931504/pexels-photo-3931504.jpeg?cs=srgb&fm=jpg",
        width: 1200,
        height: 630,
        alt: "Business team collaborating in a modern office"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kydos Academy | Build Your UK Digital Marketing Agency",
    description: "A practical agency build programme from Kydos Digital.",
    images: ["https://images.pexels.com/photos/3931504/pexels-photo-3931504.jpeg?cs=srgb&fm=jpg"]
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false }
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
