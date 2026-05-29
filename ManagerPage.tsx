import { RoleLayout, type TabDef, type MenuExtra } from "./RoleLayout";
import type { LayoutMode, Role } from "./constants";
import type { ChangeResult } from "./useAuth";
import { ManagerDashboard } from "./ManagerDashboard";
import { ManagerClients } from "./ManagerClients";
import { ManagerProjects } from "./ManagerProjects";
import { ManagerCalculator } from "./ManagerCalculator";
import { ManagerProfile } from "./ManagerProfile";
import { ManagerServiceCatalog } from "./ManagerServiceCatalog";

// Manager's tabs.
const TABS: TabDef[] = [
  { id: "dashboard", label: "Dashboard", Component: ManagerDashboard },
  { id: "clients", label: "Clients", Component: ManagerClients },
  { id: "projects", label: "Projects", Component: ManagerProjects },
  { id: "calculator", label: "Calculator", Component: ManagerCalculator },
];

// Manager-only account-menu items (open in a Modal). Scout/Creator have none.
const MENU_EXTRAS: MenuExtra[] = [
  { label: "Creator Profile", Component: ManagerProfile },
  { label: "Service Catalog", Component: ManagerServiceCatalog },
];

export function ManagerPage(props: {
  mode: LayoutMode;
  onSignOut: () => void;
  changePassword: (current: string, next: string) => Promise<ChangeResult>;
  switchRole: (target: Role, password?: string) => Promise<{ ok: boolean; needsPassword?: boolean; message?: string }>;
}) {
  return <RoleLayout role="manager" tabs={TABS} menuExtras={MENU_EXTRAS} {...props} />;
}
