import { useState } from "react";
import { C, SERIF, SANS } from "./constants";
import type { ChangeResult } from "./useAuth";

// ─── CHANGE PASSWORD ──────────────────────────────────────
// Current + new + confirm. On submit, calls useAuth.changePassword, which
// updates the shared password for all three logins server-side via Supabase
// updateUser. Layout-agnostic: it's a compact form, so it works inside a
// modal (iOS-PWA mode) or inline on a settings page (desktop) without change.
export function ChangePassword({
  changePassword,
}: {
  changePassword: (current: string, next: string) => Promise<ChangeResult>;
}) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [conf, setConf] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const submit = async () => {
    if (busy) return;
    if (next.length < 6) { setMsg({ text: "New password must be at least 6 characters.", ok: false }); return; }
    if (next !== conf) { setMsg({ text: "Passwords do not match.", ok: false }); return; }
    setBusy(true);
    setMsg(null);
    const res = await changePassword(cur, next);
    setMsg({ text: res.message, ok: res.ok });
    if (res.ok) { setCur(""); setNext(""); setConf(""); }
    setBusy(false);
  };

  const field = {
    width: "100%", padding: "10px 14px", border: `1px solid ${C.rule}`,
    background: C.bg, fontFamily: SANS, fontSize: 12, color: C.black,
    borderRadius: 2, outline: "none", boxSizing: "border-box" as const, marginBottom: 9,
  };
  const label = {
    fontSize: 10, color: C.muted, letterSpacing: "0.08em",
    textTransform: "uppercase" as const, margin: "0 0 5px", display: "block",
  };

  return (
    <div style={{ maxWidth: 380 }}>
      <h2 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: "normal", margin: "0 0 4px" }}>
        Change Password
      </h2>
      <p style={{ fontSize: 10, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 16px" }}>
        Updates access for all roles
      </p>

      <label style={label}>Current Password</label>
      <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} placeholder="Current password" style={field} />

      <label style={label}>New Password</label>
      <input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="Min. 6 characters" style={field} />

      <label style={label}>Confirm New Password</label>
      <input
        type="password"
        value={conf}
        onChange={(e) => setConf(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Repeat"
        style={{ ...field, marginBottom: 12 }}
      />

      <button
        onClick={submit}
        disabled={busy}
        style={{ padding: "9px 16px", border: `1px solid ${C.rule}`, background: "transparent", color: C.muted, borderRadius: 2, cursor: busy ? "default" : "pointer", fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase" }}
      >
        {busy ? "Updating…" : "Change Password"}
      </button>

      {msg && (
        <p style={{ fontSize: 10.5, color: msg.ok ? C.green : C.red, margin: "12px 0 0", lineHeight: 1.5 }}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
