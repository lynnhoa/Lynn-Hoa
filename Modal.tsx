import type { ReactNode } from "react";
import { C, SERIF, SANS } from "./constants";

// ─── MODAL ────────────────────────────────────────────────
// In iOS-PWA mode the page can't scroll, so anything that doesn't fit on the
// fixed screen opens here instead. The modal itself is allowed to scroll
// internally. Works identically in desktop mode (centered dialog), so screens
// can use it everywhere without branching.
//
// Closes on backdrop click and on the ✕. The panel respects the bottom
// safe-area inset so a phone's home indicator never covers the close button.
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(26,26,26,0.32)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "calc(env(safe-area-inset-top) + 16px) 16px calc(env(safe-area-inset-bottom) + 16px)",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.bg,
          border: `1px solid ${C.rule}`,
          borderRadius: 4,
          width: "100%",
          maxWidth: 440,
          maxHeight: "100%",
          overflowY: "auto",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: `1px solid ${C.rule}`,
            position: "sticky",
            top: 0,
            background: C.bg,
          }}
        >
          <span style={{ fontFamily: SERIF, fontSize: 15, color: C.black }}>
            {title || ""}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.muted,
              fontSize: 14,
              fontFamily: SANS,
              padding: 4,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: "18px" }}>{children}</div>
      </div>
    </div>
  );
}
