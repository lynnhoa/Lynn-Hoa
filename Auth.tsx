import { useState } from "react";
import { C, SANS, ROLES, SIZE, ROLE_LABEL, type Role, type LayoutMode } from "./constants";
import { AppLogo } from "./atoms";
import { useSizeMode } from "./useSizeMode";

// ─── AUTH / LOGIN PAGE ────────────────────────────────────
// Same layout and aesthetic as before; now responsive. All dimensions come
// from the SIZE table (desktop = refined/compact, mobile = comfortable with
// big tap targets and 16px inputs). Desktop is unchanged from the original.


export function Auth({
  signIn,
  mode,
}: {
  signIn: (role: Role, password: string) => Promise<{ ok: boolean; message?: string }>;
  mode: LayoutMode;
}) {
  const sizeMode = useSizeMode();
  const sz = SIZE[sizeMode];

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
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: mode === "desktop" ? "100vh" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
      }}
    >
      <div style={{ width: sz.cardWidth ?? "100%", maxWidth: sz.cardWidth ?? 420, textAlign: "center", padding: `0 ${sz.cardGutter}px`, boxSizing: "border-box" }}>
        <div style={{ marginBottom: 6 }}>
          <AppLogo size="auth" wordmarkSize={sz.logoWordmark} studioSize={sz.logoStudio} />
        </div>
        <p style={{ fontSize: sz.accessLabel, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 28px" }}>
          Private Access
        </p>

        <div style={{ display: "flex", gap: sz.gap, marginBottom: 20 }}>
          {ROLES.map((r) => {
            const sel = role === r;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{ flex: 1, height: sz.tapTarget, border: `1px solid ${sel ? C.black : C.rule}`, background: sel ? C.black : C.bg, color: sel ? C.white : C.muted, cursor: "pointer", fontFamily: SANS, fontSize: sz.btnText, letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: 2 }}
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
          style={{ width: "100%", height: sz.tapTarget, padding: sz.inputPad, border: `1px solid ${err ? C.red : C.rule}`, background: C.bg, fontFamily: SANS, fontSize: sz.inputText, color: C.black, borderRadius: 2, outline: "none", boxSizing: "border-box", marginBottom: 8 }}
        />

        {err && <p style={{ fontSize: sz.bodyText, color: C.red, margin: "0 0 8px" }}>Incorrect password</p>}

        <button
          onClick={go}
          disabled={busy || !pw}
          style={{ width: "100%", height: sz.tapTarget, background: busy || !pw ? C.rule : C.black, color: busy || !pw ? C.muted : C.white, border: "none", borderRadius: 2, cursor: busy || !pw ? "default" : "pointer", fontFamily: SANS, fontSize: sz.primaryText, letterSpacing: "0.14em", textTransform: "uppercase" }}
        >
          {busy ? "…" : "Enter"}
        </button>
      </div>
    </div>
  );
}
