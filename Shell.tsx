import type { ReactNode } from "react";
import { C, SANS, LAYOUT } from "./constants";
import { useLayoutMode } from "./useLayoutMode";

// ─── SHELL ────────────────────────────────────────────────
// The single outer wrapper for the whole app. It reads the layout mode and
// applies the right container:
//
//   ios-pwa → fixed 100dvh, overflow hidden, safe-area insets. The app fills
//             the screen and never scrolls the page. Overflow content is the
//             individual screen's job to put in a modal.
//   desktop → natural min-height + scroll, as a normal web page.
//
// Wrapping everything here means no screen has to think about which mode it's
// in for the outer frame — they just fill the space Shell gives them.
export function Shell({ children }: { children: ReactNode }) {
  const mode = useLayoutMode();
  const shell = LAYOUT.shell[mode];

  return (
    <div
      style={{
        background: C.bg,
        color: C.black,
        fontFamily: SANS,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        ...shell,
      }}
    >
      {children}
    </div>
  );
}
