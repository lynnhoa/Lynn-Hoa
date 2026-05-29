import { C, SANS, type Role, type LayoutMode } from "./constants";
import { useAuth } from "./useAuth";
import { useLayoutMode } from "./useLayoutMode";
import { Shell } from "./Shell";
import { Auth } from "./Auth";
import { ScoutPage } from "./ScoutPage";
import { ManagerPage } from "./ManagerPage";
import { CreatorPage } from "./CreatorPage";
import type { ChangeResult } from "./useAuth";

// ─── ROOT ─────────────────────────────────────────────────
// Wraps the whole app in Shell (which applies fixed-no-scroll for iOS PWA, or
// natural scroll for desktop), then routes:
//   not ready  → loading flash
//   no session → login page
//   has role   → that role's page (Scout / Manager / Creator)
//
// Each role page is thin: it declares its own tabs and hands them to the
// shared RoleLayout. Change Password lives in the account menu and runs
// through Supabase, so it's real and persists.

type PageProps = {
  mode: LayoutMode;
  onSignOut: () => void;
  changePassword: (current: string, next: string) => Promise<ChangeResult>;
};

const PAGES: Record<Role, (props: PageProps) => JSX.Element> = {
  scout: ScoutPage,
  manager: ManagerPage,
  creator: CreatorPage,
};

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

  let body: JSX.Element;
  if (!ready) {
    body = <Loading />;
  } else if (!role) {
    body = <Auth signIn={signIn} mode={mode} />;
  } else {
    const Page = PAGES[role];
    body = <Page mode={mode} onSignOut={signOut} changePassword={changePassword} />;
  }

  return <Shell>{body}</Shell>;
}
