import { useState, useEffect } from "react";
import { detectLayoutMode, type LayoutMode } from "./constants";

// ─── LAYOUT MODE HOOK ─────────────────────────────────────
// Single source of truth for "are we a fixed-screen iOS PWA, or a normal
// scrolling browser?". Every component that needs to branch layout reads
// this — never re-detects on its own.
//
// It also re-checks on display-mode changes (e.g. the rare case of an app
// being added to / launched from the home screen mid-session) so the layout
// stays correct without a manual refresh.
export function useLayoutMode(): LayoutMode {
  const [mode, setMode] = useState<LayoutMode>(() => detectLayoutMode());

  useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)");
    const recheck = () => setMode(detectLayoutMode());
    // Safari uses addListener on older versions; guard for both.
    mq.addEventListener?.("change", recheck);
    return () => mq.removeEventListener?.("change", recheck);
  }, []);

  return mode;
}
