import { ImageResponse } from "next/og";

export const alt = "Kydos Academy | Build Your UK Digital Marketing Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://academy.kydosdigital.com";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px 82px",
          background: "linear-gradient(135deg,#07111f 0%,#0b2436 58%,#07111f 100%)",
          color: "#f7fbff",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <img
          src={new URL("/brand/kydos-academy-logo-light.svg", appUrl).toString()}
          alt=""
          width="700"
          height="166"
          style={{ objectFit: "contain", objectPosition: "left center" }}
        />
        <div style={{ marginTop: 54, fontSize: 57, lineHeight: 1.04, fontWeight: 800, letterSpacing: "-2px", maxWidth: 980 }}>
          Build Your UK Digital Marketing Agency
        </div>
        <div style={{ marginTop: 24, display: "flex", fontSize: 25, color: "#b6c4d4", maxWidth: 950 }}>
          Company, brand, website, CRM, sales, team and delivery systems, built from the way Kydos Digital operates.
        </div>
        <div style={{ marginTop: 42, display: "flex", alignItems: "center", gap: 14, fontSize: 20, color: "#b9f4ae" }}>
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#09B8AA" }} />
          academy.kydosdigital.com
        </div>
      </div>
    ),
    size
  );
}
