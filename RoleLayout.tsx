import { useState, type ComponentType } from "react";
import { C, SERIF, SANS, LATO, SIZE, ROLE_LABEL, ROLES, type Role, type LayoutMode } from "./constants";
import { AppLogo } from "./atoms";
import { Modal } from "./Modal";
import { ChangePassword } from "./ChangePassword";
import { useSizeMode } from "./useSizeMode";
import type { ChangeResult } from "./useAuth";

type SwitchResult = { ok: boolean; needsPassword?: boolean; message?: string };

// Optional account-menu items that open in a Modal. Used by Manager for
// Creator Profile and Service Catalog; other roles pass nothing.
export type MenuExtra = {
  label: string;
  Component: ComponentType;
};

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
  switchRole,
  menuExtras = [],
}: {
  role: Role;
  tabs: TabDef[];
  mode: LayoutMode;
  onSignOut: () => void;
  changePassword: (current: string, next: string) => Promise<ChangeResult>;
  switchRole: (target: Role, password?: string) => Promise<SwitchResult>;
  menuExtras?: MenuExtra[];
}) {
  const sizeMode = useSizeMode();
  const sz = SIZE[sizeMode];
  const [menuOpen, setMenuOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  // Mode-switch state: when a switch needs the password (e.g. after a reload
  // cleared the in-memory cache), we open a tiny prompt for the target role.
  const [switchTarget, setSwitchTarget] = useState<Role | null>(null);
  const [switchPw, setSwitchPw] = useState("");
  const [switchErr, setSwitchErr] = useState(false);
  const [switching, setSwitching] = useState(false);
  // Which menu-extra is showing as a full overlay screen (Creator Profile /
  // Service Catalog), by index. null = showing the normal tabs.
  const [overlayIndex, setOverlayIndex] = useState<number | null>(null);

  const doSwitch = async (target: Role, password?: string) => {
    setSwitching(true);
    setSwitchErr(false);
    const res = await switchRole(target, password);
    if (res.ok) {
      // onAuthStateChange re-renders the app into the new mode; just close UI.
      setSwitchTarget(null);
      setSwitchPw("");
      setMenuOpen(false);
    } else if (res.needsPassword) {
      setSwitchTarget(target);   // open the prompt
    } else {
      setSwitchErr(true);
    }
    setSwitching(false);
  };

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
                <div style={{ padding: "8px 16px 3px" }}>
                  <p style={{ fontSize: 8, color: C.light, margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Switch mode</p>
                </div>
                {ROLES.map((r) => {
                  const isCurrent = r === role;
                  return (
                    <button
                      key={r}
                      disabled={isCurrent || switching}
                      onClick={() => { if (!isCurrent) doSwitch(r); }}
                      style={{ ...menuItemStyle, padding: "7px 16px", color: isCurrent ? C.light : C.black, cursor: isCurrent ? "default" : "pointer", justifyContent: "space-between" }}
                    >
                      <span>{ROLE_LABEL[r]}</span>
                      {isCurrent && <span style={{ fontSize: 8, color: C.light, letterSpacing: "0.08em", textTransform: "uppercase" }}>current</span>}
                    </button>
                  );
                })}
                <div style={{ borderTop: `1px solid ${C.rule}`, marginTop: 5 }} />
                {menuExtras.map((ex, i) => (
                  <button
                    key={ex.label}
                    onClick={() => { setMenuOpen(false); setOverlayIndex(i); }}
                    style={{ ...menuItemStyle, color: C.muted }}
                  >
                    {ex.label}
                  </button>
                ))}
                {menuExtras.length > 0 && <div style={{ borderTop: `1px solid ${C.rule}` }} />}
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

        {/* Row 2 — either the tab bar, or (in overlay mode) a back arrow +
            centered screen title. Row 1 (logo) is unchanged either way. */}
        {overlayIndex !== null ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", height: sz.tabRowHeight, borderTop: `1px solid ${C.rule}`, padding: "0 18px", boxSizing: "border-box" }}>
            <button
              onClick={() => setOverlayIndex(null)}
              aria-label="Back"
              style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontFamily: LATO, fontSize: sz.tabText, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, padding: 0, justifySelf: "start" }}
            >
              <span style={{ fontSize: 18, lineHeight: 1, marginTop: -2 }}>‹</span>
              {sizeMode === "mobile" ? "" : "Back"}
            </button>
            <span style={{ fontFamily: LATO, fontSize: sz.tabText, letterSpacing: "0.12em", textTransform: "uppercase", color: C.black, whiteSpace: "nowrap" }}>
              {menuExtras[overlayIndex]?.label}
            </span>
            <div />
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: sizeMode === "mobile" ? "space-between" : "center", alignItems: "center", gap: sz.tabGap, height: sz.tabRowHeight, borderTop: `1px solid ${C.rule}`, padding: "0 18px", boxSizing: "border-box" }}>
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
                    letterSpacing: sizeMode === "mobile" ? "0.07em" : "0.12em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    padding: 0,
                    transition: "color 0.15s ease",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── CONTENT: overlay screen if active, else the active tab ── */}
      <div style={{ flex: 1, overflowY: mode === "desktop" ? "auto" : "hidden", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        {overlayIndex !== null
          ? (() => { const Ov = menuExtras[overlayIndex].Component; return <Ov />; })()
          : (Active ? <Active /> : null)}
      </div>

      {/* ── Change Password (account menu) ── */}
      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Account">
        <ChangePassword changePassword={changePassword} />
      </Modal>

      {/* ── Switch-mode password prompt (only when cache was cleared) ── */}
      <Modal open={switchTarget !== null} onClose={() => { setSwitchTarget(null); setSwitchPw(""); setSwitchErr(false); }} title={`Switch to ${switchTarget ? ROLE_LABEL[switchTarget] : ""}`}>
        <p style={{ fontFamily: SANS, fontSize: sz.bodyText, color: C.muted, margin: "0 0 12px", lineHeight: 1.5 }}>
          Enter the password to switch mode.
        </p>
        <input
          type="password"
          placeholder="Password"
          value={switchPw}
          autoFocus
          onChange={(e) => { setSwitchPw(e.target.value); setSwitchErr(false); }}
          onKeyDown={(e) => e.key === "Enter" && switchTarget && switchPw && doSwitch(switchTarget, switchPw)}
          style={{ width: "100%", height: sz.tapTarget, padding: sz.inputPad, border: `1px solid ${switchErr ? C.red : C.rule}`, background: C.bg, fontFamily: SANS, fontSize: sz.inputText, color: C.black, borderRadius: 2, outline: "none", boxSizing: "border-box", marginBottom: 8 }}
        />
        {switchErr && <p style={{ fontFamily: SANS, fontSize: sz.bodyText, color: C.red, margin: "0 0 8px" }}>Incorrect password</p>}
        <button
          onClick={() => switchTarget && switchPw && doSwitch(switchTarget, switchPw)}
          disabled={switching || !switchPw}
          style={{ width: "100%", height: sz.tapTarget, background: switching || !switchPw ? C.rule : C.black, color: switching || !switchPw ? C.muted : C.white, border: "none", borderRadius: 2, cursor: switching || !switchPw ? "default" : "pointer", fontFamily: SANS, fontSize: sz.primaryText, letterSpacing: "0.14em", textTransform: "uppercase" }}
        >
          {switching ? "…" : "Switch"}
        </button>
      </Modal>
    </>
  );
}
