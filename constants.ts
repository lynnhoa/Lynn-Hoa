// ─── THEME — single source of truth ──────────────────────
// Copied verbatim from the live app so the login page matches exactly.
// Later slices will extend this file (RC0, AO, STATUS, etc.).
export const C = {
  bg: "#faf9f7", black: "#1a1a1a", muted: "#888", light: "#b8b3ad",
  rule: "#e8e4df", white: "#fff", amber: "#c0956a", amberBg: "#fdf5ee",
  amberBorder: "#e8d8c8", red: "#c0857a", redBg: "#fdf0ee",
  redBorder: "#e8d8d5", green: "#6a9a6a", greenBg: "#f0f5f0", greenBorder: "#b8d4b8",
};

export const SERIF = "'Georgia','Times New Roman',serif";
export const SANS = "'Helvetica Neue',Arial,sans-serif";

// The three roles. Login is shared (single password); the role is just the
// view you land on. This is intentional — it's a two-person studio tool.
export const ROLES = ["scout", "manager", "creator"] as const;
export type Role = (typeof ROLES)[number];

// ─── LAYOUT MODE ──────────────────────────────────────────
// The app runs in two layout modes:
//
//   "ios-pwa"  — installed on an iPhone home screen. Fixed full-screen,
//                NO page scroll. The shell fills 100dvh, respects the
//                safe-area insets, and anything that doesn't fit on screen
//                opens in a modal rather than scrolling the page.
//
//   "desktop"  — normal browser (desktop or mobile Safari tab). Natural
//                scrolling, optimized for the wider screen.
//
// Everything in the app reads ONE flag (via useLayoutMode) and branches on
// it. This keeps a single codebase instead of two parallel layouts.

export type LayoutMode = "ios-pwa" | "desktop";

// Detection: are we an installed standalone PWA on iOS?
// - display-mode: standalone  → launched from the home screen
// - navigator.standalone      → the iOS-specific signal (older but reliable)
// - iOS user-agent            → confirms it's actually iPhone/iPad, not a
//                               standalone PWA on desktop Chrome
export function detectLayoutMode(): LayoutMode {
  if (typeof window === "undefined") return "desktop";
  const nav = window.navigator as any;
  const standalone =
    window.matchMedia?.("(display-mode: standalone)").matches ||
    nav.standalone === true;
  const iOS = /iPad|iPhone|iPod/.test(nav.userAgent || "");
  return standalone && iOS ? "ios-pwa" : "desktop";
}

// Layout tokens — read these instead of hardcoding, so the fixed/scroll
// behavior is defined in one place.
export const LAYOUT = {
  // Outer shell for each mode.
  shell: {
    "ios-pwa": {
      height: "100dvh",
      overflow: "hidden" as const,
      // iPhone notch / home-indicator safe areas.
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "env(safe-area-inset-bottom)",
      paddingLeft: "env(safe-area-inset-left)",
      paddingRight: "env(safe-area-inset-right)",
    },
    desktop: {
      minHeight: "100vh",
      overflow: "visible" as const,
    },
  },
  // In ios-pwa mode, overflow goes to modals; in desktop it can scroll.
  contentScroll: {
    "ios-pwa": "hidden" as const,
    desktop: "auto" as const,
  },
} as const;
