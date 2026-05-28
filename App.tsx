import { C, SANS } from "./constants";
import { useAuth } from "./useAuth";
import { useLayoutMode } from "./useLayoutMode";
import { Shell } from "./Shell";
import { Auth } from "./Auth";
import { RolePage } from "./RolePage";

// ─── ROOT ─────────────────────────────────────────────────
// Wraps the whole app in Shell (which applies fixed-no-scroll for iOS PWA, or
// natural scroll for desktop), then routes:
//   not ready  → loading flash
//   no session → login page
//   has role   → that role's page (stub for now)
//
// Change Password lives in the role page's account menu and runs through
// Supabase, so it's real and persists.

function Loading() {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS }}>
      <p style={{ fontSize: 9, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase" }}>Loading…</p>
    </div>
  );
}

export default function App() {
  const { ready, role, signIn, signOut, changePassword } = useAuth();
  const mode = useLayoutMode();

  return (
    <Shell>
      {!ready ? (
        <Loading />
      ) : !role ? (
        <Auth signIn={signIn} mode={mode} />
      ) : (
        <RolePage role={role} mode={mode} onSignOut={signOut} changePassword={changePassword} />
      )}
    </Shell>
  );
}
