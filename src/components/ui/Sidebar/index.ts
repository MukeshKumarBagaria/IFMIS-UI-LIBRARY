/**
 * `Sidebar` barrel.
 *
 * Public surface:
 *   - `Sidebar`               — the 279px navigation rail (top card + bottom sections).
 *   - `SidebarSearch`         — pill search input.
 *   - `SidebarCollapseButton` — circular collapse trigger.
 *   - `WorklistButton`        — orange worklist pill.
 *   - `AssignedModules`       — active card + inactive thumbnails + overflow popover.
 *   - `SidebarMenu`           — recursive sub-modules list.
 *   - `MODULES`, `MODULE_LIST` — the canonical module catalogue.
 */
export {
  Sidebar,
  SidebarSearch,
  SidebarCollapseButton,
  WorklistButton,
  AdminButton,
  SidebarHelpLinks,
} from "./Sidebar";
export type {
  SidebarProps,
  SidebarSearchProps,
  SidebarCollapseButtonProps,
  WorklistButtonProps,
  AdminButtonProps,
  SidebarHelpProps,
  SidebarHelpItem,
  MenuNode,
} from "./Sidebar";

export {
  AssignedModules,
  ActiveModuleCard,
  InactiveModuleCard,
} from "./parts/AssignedModules";
export type { AssignedModulesProps } from "./parts/AssignedModules";

export { SidebarMenu } from "./parts/SidebarMenu";
export type { SidebarMenuProps } from "./parts/SidebarMenu";

export { searchMenuTree } from "./parts/searchMenu";
export type { MenuSearchResult } from "./parts/searchMenu";

export { MODULES, MODULE_LIST } from "./modules";
export type { ModuleId, ModuleDef } from "./modules";
