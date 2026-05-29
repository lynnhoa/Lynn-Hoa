import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ─── PROFILE HOOK ─────────────────────────────────────────
// Loads the single shared business-identity row from Supabase and saves it
// back on demand. The profile feeds invoices and PDFs. Nothing auto-saves —
// the screen calls save() only when the user taps Save.

export type Profile = {
  logo_url: string;
  name: string;
  company: string;
  phone: string;
  street: string;
  plz: string;
  city: string;
  country: string;
  email: string;
  website: string;
  bank_name: string;
  iban: string;
  bic: string;
  paypal_email: string;
  kleinunternehmer: boolean;
  steuernummer: string;
  ust_id_nr: string;
  vat_rate: string;
  tax_note: string;
};

export const EMPTY_PROFILE: Profile = {
  logo_url: "", name: "", company: "", phone: "",
  street: "", plz: "", city: "", country: "Deutschland",
  email: "", website: "",
  bank_name: "", iban: "", bic: "", paypal_email: "",
  kleinunternehmer: true, steuernummer: "", ust_id_nr: "", vat_rate: "19",
  tax_note: "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.",
};

const COLS = Object.keys(EMPTY_PROFILE).join(",");

export type SaveResult = { ok: boolean; message: string };

export function useProfile() {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);

  useEffect(() => {
    let active = true;
    supabase
      .from("profile")
      .select(COLS)
      .eq("id", 1)
      .single()
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) {
          // Merge over EMPTY so any missing column falls back to a default.
          setProfile({ ...EMPTY_PROFILE, ...(data as Partial<Profile>) });
        }
        setLoaded(true);
      });
    return () => { active = false; };
  }, []);

  const save = useCallback(async (next: Profile): Promise<SaveResult> => {
    const { error } = await supabase
      .from("profile")
      .update({ ...next, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) {
      return { ok: false, message: "Could not save. Check your connection and try again." };
    }
    setProfile(next);
    return { ok: true, message: "Profile saved." };
  }, []);

  return { loaded, profile, save };
}
