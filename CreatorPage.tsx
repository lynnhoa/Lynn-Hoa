import { RoleLayout, type TabDef } from "./RoleLayout";
import type { LayoutMode, Role } from "./constants";
import type { ChangeResult } from "./useAuth";
import { CreatorDashboard } from "./CreatorDashboard";
import { CreatorClients } from "./CreatorClients";
import { CreatorProjects } from "./CreatorProjects";
import { CreatorWorkspace } from "./CreatorWorkspace";

// Creator's tabs.
const TABS: TabDef[] = [
  { id: "dashboard", label: "Dashboard", Component: CreatorDashboard },
  { id: "clients", label: "Clients", Component: CreatorClients },
  { id: "projects", label: "Projects", Component: CreatorProjects },
  { id: "workspace", label: "Workspace", Component: CreatorWorkspace },
];

export function CreatorPage(props: {
  mode: LayoutMode;
  onSignOut: () => void;
  changePassword: (current: string, next: string) => Promise<ChangeResult>;
  switchRole: (target: Role, password?: string) => Promise<{ ok: boolean; needsPassword?: boolean; message?: string }>;
}) {
  return <RoleLayout role="creator" tabs={TABS} {...props} />;
}
