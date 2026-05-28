import { C, SERIF, SANS } from "./constants";

// ─── APP LOGO ─────────────────────────────────────────────
// The "Lynn Hoa / Studio" wordmark. Pure text, no image — exactly as before.
export function AppLogo({ size = "nav" }: { size?: "nav" | "auth" | "web" }) {
  const big = size === "auth";
  const web = size === "web";
  return (
    <div style={{ textAlign: "center", lineHeight: 1, display: "inline-block" }}>
      <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: big ? 26 : web ? 24 : 18, letterSpacing: "0.02em", color: C.black, display: "block" }}>
        Lynn Hoa
      </span>
      <span style={{ fontFamily: SANS, fontSize: big ? 8 : web ? 7 : 6.5, letterSpacing: "0.26em", textTransform: "uppercase" as const, color: C.muted, display: "block", marginTop: big ? 4 : 2 }}>
        Studio
      </span>
    </div>
  );
}

// Note: SERIF kept in imports for later atoms that will live here (I, S, B, Pill, etc.).
void SERIF;
