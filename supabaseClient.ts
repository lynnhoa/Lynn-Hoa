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
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
