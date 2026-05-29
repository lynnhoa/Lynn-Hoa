import { RoleLayout, type TabDef } from "./RoleLayout";
import type { LayoutMode, Role } from "./constants";
import type { ChangeResult } from "./useAuth";
import { ManagerDashboard } from "./ManagerDashboard";
import { ManagerClients } from "./ManagerClients";
import { ManagerProjects } from "./ManagerProjects";
import { ManagerCalculator } from "./ManagerCalculator";

// Manager's tabs. (Service Catalog / Rate Card / Creator Profile are
// intentionally left out for now — to be decided later.)
const TABS: TabDef[] = [
  { id: "dashboard", label: "Dashboard", Component: ManagerDashboard },
  { id: "clients", label: "Clients", Component: ManagerClients },
  { id: "projects", label: "Projects", Component: ManagerProjects },
  { id: "calculator", label: "Calculator", Component: ManagerCalculator },
];

export function ManagerPage(props: {
  mode: LayoutMode;
  onSignOut: () => void;
  changePassword: (current: string, next: string) => Promise<ChangeResult>;
  switchRole: (target: Role, password?: string) => Promise<{ ok: boolean; needsPassword?: boolean; message?: string }>;
}) {
  return <RoleLayout role="manager" tabs={TABS} {...props} />;
}
