import { useState, useEffect } from "react";
import { C, SANS, SIZE } from "./constants";
import { useSizeMode } from "./useSizeMode";
import { useProfile, EMPTY_PROFILE, type Profile } from "./useProfile";

// ─── CREATOR PROFILE ──────────────────────────────────────
// The studio's business identity — feeds invoices & PDFs. Lives as a full
// overlay screen reached from the Manager account menu (RoleLayout draws the
// Back + title header above this). This component is the scrolling body plus a
// pinned Save bar.
//
// Nothing auto-saves. Edits mark the form "dirty"; only tapping Save writes to
// Supabase. Placeholders are generic Mustermann-style examples — never real
// data; real values come only from what's typed and saved.

export function ManagerProfile() {
  const sz = SIZE[useSizeMode()];
  const { loaded, profile, save } = useProfile();

  const [form, setForm] = useState<Profile>(EMPTY_PROFILE);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (loaded && !dirty) setForm(profile);
  }, [loaded, profile]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: keyof Profile, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
    setMsg(null);
  };

  const setKU = (v: boolean) => {
    setForm((f) => ({
      ...f,
      kleinunternehmer: v,
      tax_note: v ? "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet." : "",
    }));
    setDirty(true);
    setMsg(null);
  };

  const onSave = async () => {
    if (saving) return;
    setSaving(true);
    setMsg(null);
    const res = await save(form);
    setMsg({ text: res.message, ok: res.ok });
    if (res.ok) setDirty(false);
    setSaving(false);
  };

  const field = {
    width: "100%", height: sz.tapTarget, padding: sz.inputPad,
    border: `1px solid ${C.rule}`, background: C.bg, fontFamily: SANS,
    fontSize: sz.inputText, color: C.black, borderRadius: 2, outline: "none",
    boxSizing: "border-box" as const,
  };
  const labelStyle = {
    fontSize: 10, color: C.muted, letterSpacing: "0.06em",
    textTransform: "uppercase" as const, margin: "0 0 5px", display: "block",
  };
  const F = ({ label, k, placeholder, type = "text" }: { label: string; k: keyof Profile; placeholder: string; type?: string }) => (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={form[k] as string} placeholder={placeholder}
        onChange={(e) => set(k, e.target.value)} style={field} />
    </div>
  );
  const Sec = ({ title }: { title: string }) => (
    <p style={{ fontSize: 10, color: C.light, letterSpacing: "0.1em", textTransform: "uppercase", margin: "24px 0 12px", paddingBottom: 6, borderBottom: `1px solid ${C.rule}` }}>{title}</p>
  );

  const ku = form.kleinunternehmer;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          <Sec title="Brand" />
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, border: `1px dashed ${C.rule}`, borderRadius: 6 }}>
            <div style={{ width: 50, height: 50, borderRadius: 6, background: C.white, border: `1px solid ${C.rule}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',Georgia,serif", fontSize: 16, color: C.black }}>
              {(form.company || form.name) ? (form.company || form.name).slice(0, 2).toUpperCase() : "—"}
            </div>
            <div>
              <button disabled style={{ fontSize: 11, color: C.muted, border: `1px solid ${C.rule}`, borderRadius: 6, padding: "7px 13px", background: "transparent", cursor: "not-allowed" }}>Upload logo</button>
              <p style={{ fontSize: 10.5, color: C.light, margin: "6px 0 0", lineHeight: 1.5 }}>Shown on invoices &amp; PDFs. Optional. (Coming soon.)</p>
            </div>
          </div>

          <Sec title="Identity" />
          <F label="Full name" k="name" placeholder="Max Mustermann" />
          <F label="Business / brand name" k="company" placeholder="Musterstudio" />
          <F label="Phone · optional" k="phone" placeholder="+49 …" />

          <Sec title="Address" />
          <F label="Street & number" k="street" placeholder="Musterstraße 1" />
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 9 }}>
            <F label="PLZ" k="plz" placeholder="10115" />
            <F label="City" k="city" placeholder="Musterstadt" />
          </div>
          <F label="Country" k="country" placeholder="Deutschland" />

          <Sec title="Online" />
          <F label="Email" k="email" placeholder="hello@musterstudio.com" type="email" />
          <F label="Website" k="website" placeholder="musterstudio.com" />

          <Sec title="Banking" />
          <F label="Bank" k="bank_name" placeholder="Musterbank" />
          <F label="IBAN" k="iban" placeholder="DE00 0000 0000 0000 0000 00" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            <F label="BIC" k="bic" placeholder="ABCDDEFFXXX" />
            <F label="PayPal · optional" k="paypal_email" placeholder="pay@musterstudio.com" />
          </div>

          <Sec title="Tax" />
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Kleinunternehmer · §19 UStG</label>
            <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
              {([["Yes", true], ["No", false]] as [string, boolean][]).map(([lbl, val]) => {
                const on = ku === val;
                return (
                  <button key={lbl} onClick={() => setKU(val)}
                    style={{ padding: "8px 18px", border: `1px solid ${on ? C.black : C.rule}`, background: on ? C.black : C.bg, color: on ? C.white : C.muted, cursor: "pointer", fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2 }}>
                    {lbl}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 10.5, color: C.muted, margin: "7px 0 0", lineHeight: 1.5 }}>
              {ku ? "No VAT charged on invoices." : "VAT is charged on invoices."}
            </p>
          </div>

          <F label="Tax number · Steuernummer" k="steuernummer" placeholder="12/345/67890" />

          {!ku && (
            <>
              <F label="VAT ID · USt-IdNr." k="ust_id_nr" placeholder="DE123456789" />
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>VAT rate</label>
                <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                  {["19", "7"].map((r) => {
                    const on = form.vat_rate === r;
                    return (
                      <button key={r} onClick={() => set("vat_rate", r)}
                        style={{ padding: "8px 18px", border: `1px solid ${on ? C.black : C.rule}`, background: on ? C.black : C.bg, color: on ? C.white : C.muted, cursor: "pointer", fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2 }}>
                        {r === "19" ? "19 % (standard)" : "7 % (reduced)"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Invoice tax note</label>
            <textarea value={form.tax_note} placeholder={ku ? "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet." : "zzgl. 19 % MwSt"}
              onChange={(e) => set("tax_note", e.target.value)}
              rows={2}
              style={{ ...field, height: "auto", padding: "10px 12px", lineHeight: 1.5, resize: "vertical" as const, fontFamily: SANS }} />
            <p style={{ fontSize: 10, color: C.light, margin: "5px 0 0" }}>Appears on every invoice PDF.</p>
          </div>

        </div>
      </div>

      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 18px", borderTop: `1px solid ${C.rule}`, background: "rgba(0,0,0,0.015)" }}>
        <span style={{ fontSize: 10.5, display: "flex", alignItems: "center", gap: 6, color: msg ? (msg.ok ? C.green : C.red) : dirty ? C.amber : C.light }}>
          {msg ? msg.text : dirty ? "Unsaved changes" : loaded ? "All changes saved" : "Loading…"}
        </span>
        <button onClick={onSave} disabled={saving || !dirty}
          style={{ background: saving || !dirty ? C.rule : C.black, color: saving || !dirty ? C.muted : C.white, border: "none", borderRadius: 2, padding: "10px 24px", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", cursor: saving || !dirty ? "default" : "pointer", fontFamily: SANS, whiteSpace: "nowrap" }}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
