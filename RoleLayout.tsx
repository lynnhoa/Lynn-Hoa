import { useState, type ComponentType } from "react";
import { C, SERIF, SANS, LATO, SIZE, ROLE_LABEL, type Role, type LayoutMode } from "./constants";
import { AppLogo } from "./atoms";
import { Modal } from "./Modal";
import { ChangePassword } from "./ChangePassword";
import { useSizeMode } from "./useSizeMode";
import type { ChangeResult } from "./useAuth";

// ─── ROLE LAYOUT ──────────────────────────────────────────
// The shared frame every role page wears. It owns everything that is
// IDENTICAL across scout / manager / creator:
//
//   Row 1   avatar (+ account menu)   ·   Lynn Hoa / Studio   ·   (spacer)
//   Row 2                 centered Playfair tab row
//   ────────────────────────────────────────────────────────
//           the active tab's body
//
// It knows nothing about what's inside any tab — each role hands it a `tabs`
// list ({ id, label, Component }) and RoleLayout renders whichever is active.
// The account menu carries Change Password (in a Modal) + Log Out, the same
// for all roles. Sizing comes entirely from the SIZE table, so it's
// comfortable on phones / installed PWA and refined on desktop.

export type TabDef = {
  id: string;
  label: string;
  Component: ComponentType;
};

export function RoleLayout({
  role,
  tabs,
  mode,
  onSignOut,
  changePassword,
}: {
  role: Role;
  tabs: TabDef[];
  mode: LayoutMode;
  onSignOut: () => void;
  changePassword: (current: string, next: string) => Promise<ChangeResult>;
}) {
  const sizeMode = useSizeMode();
  const sz = SIZE[sizeMode];
  const [menuOpen, setMenuOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [activeId, setActiveId] = useState(tabs[0]?.id);

  const Active = (tabs.find((t) => t.id === activeId) ?? tabs[0])?.Component;

  const initials = (() => {
    const n = "Lynn Hoa";
    const p = n.split(/\s+/);
    return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  })();

  const menuItemStyle = {
    display: "flex", width: "100%", padding: "12px 16px",
    background: "none", border: "none", cursor: "pointer",
    textAlign: "left" as const, fontFamily: SANS,
    fontSize: sz.bodyText, letterSpacing: "0.04em", boxSizing: "border-box" as const,
  };

  return (
    <>
      {/* ── HEADER: logo row + tab row ── */}
      <div style={{ borderBottom: `1px solid ${C.rule}`, background: C.bg, flexShrink: 0, position: mode === "desktop" ? "sticky" : "relative", top: 0, zIndex: 100 }}>
        {/* Row 1 — avatar · logo · spacer */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "0 18px", height: sz.navHeight }}>
          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            {menuOpen && <div style={{ position: "fixed", inset: 0, zIndex: 199 }} onClick={() => setMenuOpen(false)} />}
            <button
              onClick={() => setMenuOpen((m) => !m)}
              title="Account"
              aria-label="Account"
              style={{ width: sz.avatar, height: sz.avatar, borderRadius: "50%", background: C.black, color: C.white, border: "none", cursor: "pointer", fontFamily: SANS, fontSize: sizeMode === "mobile" ? 11 : 9, letterSpacing: "0.04em", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 200, flexShrink: 0 }}
            >
              {initials}
            </button>
            {menuOpen && (
              <div style={{ position: "absolute", left: 0, top: "calc(100% + 13px)", background: C.bg, border: `1px solid ${C.rule}`, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", minWidth: 190, zIndex: 200 }}>
                <div style={{ padding: "10px 16px 8px", borderBottom: `1px solid ${C.rule}` }}>
                  <p style={{ fontSize: sizeMode === "mobile" ? 13 : 11, color: C.black, margin: "0 0 1px", fontFamily: SERIF }}>Lynn Hoa</p>
                  <p style={{ fontSize: 8, color: C.light, margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {ROLE_LABEL[role]} · Private
                  </p>
                </div>
                <button onClick={() => { setMenuOpen(false); setPwOpen(true); }} style={{ ...menuItemStyle, color: C.muted }}>
                  Change Password
                </button>
                <div style={{ borderTop: `1px solid ${C.rule}` }} />
                <button onClick={() => { setMenuOpen(false); onSignOut(); }} style={{ ...menuItemStyle, color: C.red }}>
                  Log Out
                </button>
              </div>
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <AppLogo size="web" wordmarkSize={sizeMode === "mobile" ? 26 : 28} studioSize={sizeMode === "mobile" ? 7.5 : 8} />
          </div>
          <div />
        </div>

        {/* Row 2 — centered Playfair tab row */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: sz.tabGap, height: sz.tabRowHeight, borderTop: `1px solid ${C.rule}`, padding: "0 16px" }}>
          {tabs.map((t) => {
            const active = t.id === activeId;
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                style={{
                  height: "100%",
                  background: "none",
                  border: "none",
                  borderBottom: active ? `2px solid ${C.black}` : "2px solid transparent",
                  color: active ? C.black : C.light,
                  cursor: "pointer",
                  fontFamily: LATO,
                  fontSize: sz.tabText,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0 2px",
                  transition: "color 0.15s ease",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT: the active tab ── */}
      <div style={{ flex: 1, overflowY: mode === "desktop" ? "auto" : "hidden", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        {Active ? <Active /> : null}
      </div>

      {/* ── Change Password (account menu) ── */}
      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Account">
        <ChangePassword changePassword={changePassword} />
      </Modal>
    </>
  );
}
