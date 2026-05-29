import { RoleLayout, type TabDef } from "./RoleLayout";
import type { LayoutMode } from "./constants";
import type { ChangeResult } from "./useAuth";
import { ScoutDiscover } from "./ScoutDiscover";
import { ScoutBrand } from "./ScoutBrand";
import { ScoutOutreach } from "./ScoutOutreach";

// Scout's tabs. Add/reorder here — the frame and routing are RoleLayout's job.
const TABS: TabDef[] = [
  { id: "discover", label: "Discover", Component: ScoutDiscover },
  { id: "brand", label: "Brand", Component: ScoutBrand },
  { id: "outreach", label: "Outreach", Component: ScoutOutreach },
];

export function ScoutPage(props: {
  mode: LayoutMode;
  onSignOut: () => void;
  changePassword: (current: string, next: string) => Promise<ChangeResult>;
}) {
  return <RoleLayout role="scout" tabs={TABS} {...props} />;
}
