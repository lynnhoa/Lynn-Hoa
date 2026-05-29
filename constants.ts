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
// Display face for the wordmark — loaded in index.html.
export const PLAYFAIR = "'Playfair Display',Georgia,serif";
// Tab labels — loaded in index.html.
export const LATO = "'Lato','Helvetica Neue',Arial,sans-serif";

// The three roles. Login is shared (single password); the role is just the
// view you land on. This is intentional — it's a two-person studio tool.
export const ROLES = ["scout", "manager", "creator"] as const;
export type Role = (typeof ROLES)[number];

// Display label for each role. Single source of truth — imported wherever a
// role needs to be shown (login buttons, account menu, etc.) so the mapping
// is never copy-pasted.
export const ROLE_LABEL: Record<Role, string> = {
  scout: "Scout",
  manager: "Manager",
  creator: "Creator",
};

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

// ─── RESPONSIVE SIZING ────────────────────────────────────
// IMPORTANT: this is a SEPARATE question from layout mode above.
//   • layout mode  = "is this a fixed iOS-PWA screen?" (scroll behavior)
//   • size mode    = "is this a small screen?"          (how big to draw things)
// A phone in a normal Safari tab is layout "desktop" but size "mobile" — it
// still needs big touch targets. So sizing keys off viewport WIDTH, not the
// PWA flag.

export type SizeMode = "mobile" | "desktop";

// Phones and small screens get the comfortable, tappable sizing.
export const MOBILE_BREAKPOINT = 700;

export function detectSizeMode(): SizeMode {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < MOBILE_BREAKPOINT ? "mobile" : "desktop";
}

// One sizing table the whole app reads. Desktop values are the original,
// refined look — unchanged. Mobile values are "comfortable": bigger type,
// ≥44px touch targets (Apple's minimum), 16px inputs (which also stops iOS
// from auto-zooming when a field is focused), and fuller width.
//
// Usage in a component:
//   const sz = SIZE[sizeMode];
//   <button style={{ height: sz.tapTarget, fontSize: sz.btnText }}>
//
// Add new tokens here as screens need them — every screen stays consistent
// because they all read from this one place.
export const SIZE = {
  desktop: {
    // Auth / login
    cardWidth: 300,          // login card width
    cardGutter: 16,
    logoWordmark: 26,        // "Lynn Hoa"
    logoStudio: 8,           // "Studio"
    accessLabel: 9,          // "Private Access"
    // Controls
    tapTarget: 38,           // button / input height
    btnText: 9,              // role button label
    inputText: 12,           // text field
    inputPad: "10px 14px",
    primaryText: 10,         // Enter / primary button label
    // Body / headings
    h2: 20,
    pageTitle: 28,           // "Manager View"
    bodyText: 11,
    gap: 8,                  // gap between role buttons
    // Nav
    navHeight: 64,
    avatar: 30,
    contentPad: "40px 20px",
    // Tab row (the centered second level beneath the logo). Uppercase Lato.
    tabText: 10,
    tabRowHeight: 50,
    tabGap: 30,
  },
  mobile: {
    // Auth / login — the card fills the screen width (with side gutters) so
    // it feels native, not like a narrow shrunk-down desktop column.
    cardWidth: null,         // null = full width minus gutters (see Auth)
    cardGutter: 20,          // breathing room on each side
    logoWordmark: 30,        // refined, not oversized
    logoStudio: 8,
    accessLabel: 10,
    // Controls — tappable but elegantly proportioned (44px, not chunky).
    tapTarget: 44,           // Apple minimum, no more — keeps it sleek
    btnText: 11,
    inputText: 16,           // 16px = no iOS focus-zoom
    inputPad: "12px 16px",
    primaryText: 11.5,
    // Body / headings
    h2: 22,
    pageTitle: 29,
    bodyText: 13,
    gap: 9,
    // Nav
    navHeight: 61,
    avatar: 36,
    contentPad: "32px 20px",
    // Tab row — distributed full-width within side padding on phones / PWA.
    tabText: 11,
    tabRowHeight: 52,
    tabGap: 8,
  },
} as const;

// ─── TYPE SCALE ───────────────────────────────────────────
// Named typography levels for content screens (forms, detail views). This is
// the single source of truth for text sizing inside pages — read TYPE[mode].x
// instead of hardcoding numbers, so every screen stays consistent and a tweak
// here updates the whole app.
//
// Desktop values are the "in-between" scale chosen from the Creator Profile
// mockup — comfortably readable without losing the refined look. Mobile keeps
// input at 16px (prevents iOS focus-zoom) and is otherwise tuned for phones.
//
// Levels:
//   title    — screen / page title (Playfair)
//   heading  — sub-section header (uppercase)
//   label    — field label (uppercase)
//   input    — field text / values
//   body     — hints, helper text
//   button   — buttons, tabs, back
//   micro    — badges, captions, "current"
//   fieldH   — input box height (paired with `input` so text has room)
export const TYPE = {
  desktop: {
    title:   29,
    heading: 11,
    label:   11,
    input:   13.5,
    body:    11.5,
    button:  10.5,
    micro:   9,
    fieldH:  40,
    inputPad: "0 13px",
    areaPad:  "10px 13px",
  },
  mobile: {
    title:   27,
    heading: 11,
    label:   11,
    input:   16,        // 16px = no iOS focus-zoom
    body:    12,
    button:  11,
    micro:   9,
    fieldH:  46,        // taller for comfortable tapping
    inputPad: "0 14px",
    areaPad:  "12px 14px",
  },
} as const;
