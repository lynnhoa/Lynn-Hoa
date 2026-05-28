import { C, SERIF, SANS } from "./constants";

// ─── APP LOGO ─────────────────────────────────────────────
// The "Lynn Hoa / Studio" wordmark. Pure text, no image — exactly as before.
// Accepts optional explicit font sizes so callers can scale it on mobile
// (via the SIZE table) without changing the named presets.
export function AppLogo({
  size = "nav",
  wordmarkSize,
  studioSize,
}: {
  size?: "nav" | "auth" | "web";
  wordmarkSize?: number;
  studioSize?: number;
}) {
  const big = size === "auth";
  const web = size === "web";
  const wm = wordmarkSize ?? (big ? 26 : web ? 24 : 18);
  const st = studioSize ?? (big ? 8 : web ? 7 : 6.5);
  return (
    <div style={{ textAlign: "center", lineHeight: 1, display: "inline-block" }}>
      <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: wm, letterSpacing: "0.02em", color: C.black, display: "block" }}>
        Lynn Hoa
      </span>
      <span style={{ fontFamily: SANS, fontSize: st, letterSpacing: "0.26em", textTransform: "uppercase" as const, color: C.muted, display: "block", marginTop: big ? 4 : 2 }}>
        Studio
      </span>
    </div>
  );
}

// Note: SERIF kept in imports for later atoms that will live here (I, S, B, Pill, etc.).
void SERIF;
