import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kydos Digital Agency Programme",
  description: "Build and launch your own UK digital marketing agency using the systems behind Kydos Digital."
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
