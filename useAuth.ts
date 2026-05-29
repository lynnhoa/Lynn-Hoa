import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";
import { ROLES, type Role } from "./constants";

// ─── AUTH HOOK ────────────────────────────────────────────
// Wraps Supabase session state. The whole app asks this one hook
// "are we in, and as which role?" — nothing else touches auth.
//
// Design (matches the two-person studio reality):
//   • ONE shared password, set once in Supabase.
//   • Three fixed internal logins — scout@ / manager@ / creator@ — that all
//     use that same password. The button on the login page picks which one.
//   • The role is read back from the signed-in user, so the app always knows
//     which view to show, even after a refresh.
//
// Why this is hacker-safe from the outside world: the password is verified by
// Supabase on the server, never compared in the browser, so it never ships in
// the bundle. Business data (later slices) sits behind Row Level Security and
// is only returned to a request carrying a valid session.

// Internal address book. Not real inboxes — just stable identifiers Supabase
// uses to tell the three logins apart. The domain is a placeholder you never
// send mail to.
const ROLE_EMAIL: Record<Role, string> = {
  scout: "scout@lynnhoa.studio",
  manager: "manager@lynnhoa.studio",
  creator: "creator@lynnhoa.studio",
};

function roleFromEmail(email: string | undefined): Role | null {
  if (!email) return null;
  const found = (Object.keys(ROLE_EMAIL) as Role[]).find(
    (r) => ROLE_EMAIL[r] === email
  );
  return found ?? null;
}

export type ChangeResult = { ok: boolean; message: string };

export type AuthState = {
  ready: boolean;            // initial session check finished
  role: Role | null;         // current signed-in role, or null
  signIn: (role: Role, password: string) => Promise<{ ok: boolean; message?: string }>;
  signOut: () => Promise<void>;
  // Changes the shared password for ALL THREE logins at once, then leaves you
  // signed in as the role you started from.
  changePassword: (currentPassword: string, newPassword: string) => Promise<ChangeResult>;
  // Switch to another mode without logging out. Seamless if the password is
  // cached from this session's login; otherwise asks for it once.
  switchRole: (target: Role, password?: string) => Promise<{ ok: boolean; needsPassword?: boolean; message?: string }>;
};

// In-memory only (never localStorage) cache of the shared password, set when
// the user logs in or switches with a password this session. Lets mode
// switching be seamless. Cleared on sign-out and lost on full reload — after a
// reload the first switch asks for the password once, then it's cached again.
let pwCache: string | null = null;

export function useAuth(): AuthState {
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    let active = true;

    // Read any existing session once on load.
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setRole(roleFromEmail(data.session?.user?.email));
      setReady(true);
    });

    // Then keep in sync with every sign-in / sign-out / token refresh.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setRole(roleFromEmail(session?.user?.email));
      setReady(true);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (r: Role, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: ROLE_EMAIL[r],
        password,
      });
      if (error) {
        return { ok: false, message: "Incorrect password" };
      }
      // Cache the shared password in memory for seamless mode switching.
      pwCache = password;
      // onAuthStateChange will set the role; no need to set it here.
      return { ok: true };
    },
    []
  );

  const signOut = useCallback(async () => {
    pwCache = null;
    await supabase.auth.signOut();
    setRole(null);
  }, []);

  // ── Switch mode without logging out ──
  // All three roles share one password. To land in another mode we sign into
  // that role's login. If the password is cached from this session it's
  // seamless; otherwise we report needsPassword so the UI can ask once.
  const switchRole = useCallback(
    async (target: Role, password?: string) => {
      const pw = password ?? pwCache;
      if (!pw) {
        return { ok: false, needsPassword: true };
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: ROLE_EMAIL[target],
        password: pw,
      });
      if (error) {
        return { ok: false, message: "Incorrect password" };
      }
      pwCache = pw;
      // onAuthStateChange updates role → app re-renders into the new mode.
      return { ok: true };
    },
    []
  );

  // ── Change the shared password across all three logins ──
  // Because the three roles are three separate Supabase users that happen to
  // share a password, "change the password" means updating each of them.
  // Supabase only lets you update the password of the user you're signed in
  // as, so we sign in as each role in turn, update it, then return to the
  // role we started from.
  //
  // Steps:
  //   1. Verify the current password by signing in as the active role.
  //   2. For each role: sign in with the CURRENT password, updateUser to the
  //      NEW password. If any sign-in fails partway, report which roles were
  //      already changed so the user isn't left guessing.
  //   3. Sign back in as the starting role with the NEW password.
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<ChangeResult> => {
      if (newPassword.length < 6) {
        return { ok: false, message: "New password must be at least 6 characters." };
      }

      const startRole: Role = role ?? "manager";

      // 1. Verify current password.
      const verify = await supabase.auth.signInWithPassword({
        email: ROLE_EMAIL[startRole],
        password: currentPassword,
      });
      if (verify.error) {
        return { ok: false, message: "Current password is incorrect." };
      }

      // 2. Update each role in turn.
      const changed: Role[] = [];
      for (const r of ROLES) {
        // Sign in as this role using the CURRENT password (the active session
        // is whatever we last signed into; be explicit each iteration).
        const inErr = await supabase.auth.signInWithPassword({
          email: ROLE_EMAIL[r],
          password: currentPassword,
        });
        if (inErr.error) {
          return {
            ok: false,
            message:
              changed.length === 0
                ? `Could not sign in as ${r}. No passwords were changed.`
                : `Changed ${changed.join(", ")}, then failed on ${r}. ` +
                  `Passwords are now out of sync — set them equal again to fix.`,
          };
        }
        const upd = await supabase.auth.updateUser({ password: newPassword });
        if (upd.error) {
          return {
            ok: false,
            message:
              changed.length === 0
                ? `Could not update ${r}. No passwords were changed.`
                : `Changed ${changed.join(", ")}, then failed on ${r}. ` +
                  `Passwords are now out of sync — set them equal again to fix.`,
          };
        }
        changed.push(r);
      }

      // 3. Return to the role we started from, now using the new password.
      await supabase.auth.signInWithPassword({
        email: ROLE_EMAIL[startRole],
        password: newPassword,
      });
      pwCache = newPassword;

      return { ok: true, message: "Password updated for all roles." };
    },
    [role]
  );

  return { ready, role, signIn, signOut, changePassword, switchRole };
}
