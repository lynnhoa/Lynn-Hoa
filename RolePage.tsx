import { useState } from "react";
import { C, SERIF, SANS, SIZE, type Role, type LayoutMode } from "./constants";
import { AppLogo } from "./atoms";
import { Modal } from "./Modal";
import { ChangePassword } from "./ChangePassword";
import { useSizeMode } from "./useSizeMode";
import type { ChangeResult } from "./useAuth";

// ─── ROLE LANDING STUB ────────────────────────────────────
// One stub for all three roles. Nav + account menu + Change Password (in a
// Modal) + Log Out are real; the body is a placeholder. Now responsive — all
// sizing comes from the SIZE table, so it's comfortable on phones and refined
// on desktop, and every future screen inherits the same scale.

const ROLE_LABEL: Record<Role, string> = {
  scout: "Scout",
  manager: "Manager",
  creator: "Creator",
};

export function RolePage({
  role,
  mode,
  onSignOut,
  changePassword,
}: {
  role: Role;
  mode: LayoutMode;
  onSignOut: () => void;
  changePassword: (current: string, next: string) => Promise<ChangeResult>;
}) {
  const sizeMode = useSizeMode();
  const sz = SIZE[sizeMode];
  const [menuOpen, setMenuOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

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
      <div style={{ borderBottom: `1px solid ${C.rule}`, background: C.bg, flexShrink: 0, position: mode === "desktop" ? "sticky" : "relative", top: 0, zIndex: 100 }}>
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
            <AppLogo size="web" wordmarkSize={sizeMode === "mobile" ? 22 : 24} studioSize={sizeMode === "mobile" ? 7 : 7} />
          </div>
          <div />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: mode === "desktop" ? "auto" : "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: sz.contentPad, boxSizing: "border-box" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: SERIF, fontSize: sz.pageTitle, fontWeight: "normal", color: C.black, margin: "0 0 14px" }}>
            {ROLE_LABEL[role]} View
          </p>
          <p style={{ fontSize: sz.bodyText, color: C.muted, letterSpacing: "0.03em", lineHeight: 1.7 }}>
            Signed in securely.<br />This space is being built.
          </p>
        </div>
      </div>

      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Account">
        <ChangePassword changePassword={changePassword} />
      </Modal>
    </>
  );
}
