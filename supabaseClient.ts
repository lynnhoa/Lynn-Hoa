import { createClient } from "@supabase/supabase-js";

// These two values are public by design (anon/publishable key). The real
// protection is server-side: Supabase verifies the password and Row Level
// Security guards the data. Hiding these would add nothing.
const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  // Surfaces a clear message during dev if .env is missing, instead of a
  // cryptic network error later.
  console.error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env."
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    // Stay logged in across app/browser closes. The session is written to
    // localStorage and silently refreshed before its token expires, so the
    // user only ever logs out by tapping Log Out.
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    storageKey: "lynnhoa-auth",
    detectSessionInUrl: false,
  },
});
