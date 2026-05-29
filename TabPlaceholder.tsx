import { C, PLAYFAIR, SANS, SIZE } from "./constants";
import { useSizeMode } from "./useSizeMode";

// ─── TAB PLACEHOLDER ──────────────────────────────────────
// Every tab body starts as this until it gets real content. Keeping it in one
// place means the 11 tab files stay one-liners and all share the same look —
// a centered Playfair title with a quiet "being built" line beneath. Sizing
// comes from the SIZE table, so it reads comfortably on phone / PWA and
// refined on desktop.
export function TabPlaceholder({ title }: { title: string }) {
  const sz = SIZE[useSizeMode()];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: sz.contentPad, boxSizing: "border-box" }}>
      <p style={{ fontFamily: PLAYFAIR, fontSize: sz.pageTitle, fontWeight: "normal", color: C.black, margin: "0 0 14px" }}>
        {title}
      </p>
      <p style={{ fontFamily: SANS, fontSize: sz.bodyText, color: C.muted, letterSpacing: "0.03em", lineHeight: 1.7 }}>
        This space is being built.
      </p>
    </div>
  );
}
