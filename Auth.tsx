import { useState } from "react";
import { C, SANS, ROLES, type Role, type LayoutMode } from "./constants";
import { AppLogo } from "./atoms";

// ─── AUTH / LOGIN PAGE ────────────────────────────────────
// Layout copied faithfully from the old app: cream background, centred
// wordmark, "Private Access", three role buttons, password field, Enter.
// The password check is an async call to Supabase (server-side), so the
// password never lives in the browser bundle.
//
// Works in both layout modes. The login screen is already a centered, fits-
// on-one-screen card, so there's nothing to scroll — it just fills the fixed
// iOS-PWA shell the same way it centers in a desktop window.

const ROLE_LABEL: Record<Role, string> = {
  scout: "Scout",
  manager: "Manager",
  creator: "Creator",
};

export function Auth({
  signIn,
  mode,
}: {
  signIn: (role: Role, password: string) => Promise<{ ok: boolean; message?: string }>;
  mode: LayoutMode;
}) {
  const [role, setRole] = useState<Role>("manager");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const go = async () => {
    if (busy || !pw) return;
    setBusy(true);
    setErr(false);
    const res = await signIn(role, pw);
    if (!res.ok) {
      setErr(true);
      setBusy(false);
    }
    // On success the app re-renders into the role view; no further action.
  };

  return (
    <div
      style={{
        // Fill whatever the Shell gives us and center the card. In ios-pwa
        // the Shell is already a fixed 100dvh box; flex:1 makes us fill it.
        flex: 1,
        minHeight: mode === "desktop" ? "100vh" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
      }}
    >
      <div style={{ width: 300, textAlign: "center", padding: "0 16px" }}>
        <div style={{ marginBottom: 6 }}>
          <AppLogo size="auth" />
        </div>
        <p style={{ fontSize: 9, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 28px" }}>
          Private Access
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {ROLES.map((r) => {
            const sel = role === r;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{ flex: 1, padding: "9px 0", border: `1px solid ${sel ? C.black : C.rule}`, background: sel ? C.black : C.bg, color: sel ? C.white : C.muted, cursor: "pointer", fontFamily: SANS, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2 }}
              >
                {ROLE_LABEL[r]}
              </button>
            );
          })}
        </div>

        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setErr(false); }}
          onKeyDown={(e) => e.key === "Enter" && go()}
          style={{ width: "100%", padding: "10px 14px", border: `1px solid ${err ? C.red : C.rule}`, background: C.bg, fontFamily: SANS, fontSize: 12, color: C.black, borderRadius: 2, outline: "none", boxSizing: "border-box", marginBottom: 8 }}
        />

        {err && <p style={{ fontSize: 10, color: C.red, margin: "0 0 8px" }}>Incorrect password</p>}

        <button
          onClick={go}
          disabled={busy || !pw}
          style={{ width: "100%", padding: 10, background: busy || !pw ? C.rule : C.black, color: busy || !pw ? C.muted : C.white, border: "none", borderRadius: 2, cursor: busy || !pw ? "default" : "pointer", fontFamily: SANS, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}
        >
          {busy ? "…" : "Enter"}
        </button>
      </div>
    </div>
  );
}
