import { useState } from "react";
import { C, SERIF, SANS, type Role, type LayoutMode } from "./constants";
import { AppLogo } from "./atoms";
import { Modal } from "./Modal";
import { ChangePassword } from "./ChangePassword";
import type { ChangeResult } from "./useAuth";

// ─── ROLE LANDING STUB ────────────────────────────────────
// One stub used for all three roles (scout / manager / creator). Real
// dashboards replace the body in later slices. What's real now:
//   • The nav bar with the wordmark and an account menu.
//   • Change Password works — opens in a Modal (so it behaves the same in
//     fixed iOS-PWA mode, where the page can't scroll, as on desktop).
//   • Log Out works.
// The body is a placeholder that names the role.

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  const initials = (() => {
    const n = "Lynn Hoa";
    const p = n.split(/\s+/);
    return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  })();

  return (
    <>
      {/* NAV — sticky on desktop, fixed top in PWA (Shell already pins it) */}
      <div style={{ borderBottom: `1px solid ${C.rule}`, background: C.bg, flexShrink: 0, position: mode === "desktop" ? "sticky" : "relative", top: 0, zIndex: 100 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "0 20px", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            {menuOpen && <div style={{ position: "fixed", inset: 0, zIndex: 199 }} onClick={() => setMenuOpen(false)} />}
            <button
              onClick={() => setMenuOpen((m) => !m)}
              title="Account"
              style={{ width: 30, height: 30, borderRadius: "50%", background: C.black, color: C.white, border: "none", cursor: "pointer", fontFamily: SANS, fontSize: 9, letterSpacing: "0.04em", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 200, flexShrink: 0 }}
            >
              {initials}
            </button>
            {menuOpen && (
              <div style={{ position: "absolute", left: 0, top: "calc(100% + 13px)", background: C.bg, border: `1px solid ${C.rule}`, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", minWidth: 180, zIndex: 200 }}>
                <div style={{ padding: "10px 14px 8px", borderBottom: `1px solid ${C.rule}` }}>
                  <p style={{ fontSize: 11, color: C.black, margin: "0 0 1px", fontFamily: SERIF }}>Lynn Hoa</p>
                  <p style={{ fontSize: 7.5, color: C.light, margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {ROLE_LABEL[role]} · Private
                  </p>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); setPwOpen(true); }}
                  style={{ display: "flex", width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: SANS, fontSize: 10, color: C.muted, letterSpacing: "0.04em", boxSizing: "border-box" }}
                >
                  Change Password
                </button>
                <div style={{ borderTop: `1px solid ${C.rule}` }} />
                <button
                  onClick={() => { setMenuOpen(false); onSignOut(); }}
                  style={{ display: "flex", width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: SANS, fontSize: 10, color: C.red, letterSpacing: "0.04em", boxSizing: "border-box" }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
          <div style={{ textAlign: "center" }}><AppLogo size="web" /></div>
          <div />
        </div>
      </div>

      {/* BODY — fills remaining space. Scrolls on desktop; fixed/centered in PWA. */}
      <div style={{ flex: 1, overflowY: mode === "desktop" ? "auto" : "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: SERIF, fontSize: 28, fontWeight: "normal", color: C.black, margin: "0 0 14px" }}>
            {ROLE_LABEL[role]} View
          </p>
          <p style={{ fontSize: 11, color: C.muted, letterSpacing: "0.03em", lineHeight: 1.7 }}>
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
