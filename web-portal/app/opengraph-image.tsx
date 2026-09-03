import { ImageResponse } from "next/og";

export const alt = "Kydos Academy | Build Your UK Digital Marketing Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 116,
              height: 116,
              borderRadius: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              background: "#0b2548",
              border: "2px solid rgba(9,184,170,.35)"
            }}
          >
            <span style={{ fontSize: 76, lineHeight: 1, fontWeight: 900, color: "#ffffff", letterSpacing: "-7px", transform: "translateX(-4px)" }}>K</span>
            <span style={{ position: "absolute", top: 14, right: 13, fontSize: 35, color: "#09B8AA", fontWeight: 900 }}>↗</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span style={{ fontSize: 70, fontWeight: 900, letterSpacing: "-3px", color: "#ffffff" }}>Kydos</span>
            <span style={{ fontSize: 64, fontWeight: 400, letterSpacing: "-3px", color: "#09B8AA" }}>Academy</span>
          </div>
        </div>

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
