import {
  ShieldCheck,
  UserList,
  UserCircle,
  HandArrowDown,
  Coins,
  Dresser,
  HandDeposit,
  Receipt,
  Storefront,
  UserSound,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

/**
 * Catalogue of every IFMIS module a user can be assigned to.
 *
 * Each entry owns:
 *   - `id`       — stable key used for selection / routing
 *   - `label`    — visible name in the active card
 *   - `Icon`     — Phosphor icon component
 *   - `gradient` — the linear-gradient background used by both the
 *                  active (large) and inactive (small) card variants.
 *
 * Note: only the gradient differs between modules; the active and
 * inactive cards share it, so we store it once here.
 */
/**
 * Stable identifier for every IFMIS module. Use this everywhere the
 * Sidebar (and your router/store) need to reference a module.
 */
export type ModuleId =
  | "e-sanction"
  | "e-accounts"
  | "hrms"
  | "deposit"
  | "budget"
  | "strong-room"
  | "pension"
  | "receipt"
  | "vendor"
  | "bsg";

export interface ModuleDef {
  id: ModuleId;
  label: string;
  Icon: Icon;
  gradient: string;
}

/**
 * The single source of truth for module metadata — icon, gradient,
 * visible label. Read from this in product code whenever you need the
 * same visuals outside the Sidebar (page headers, breadcrumbs, module
 * pickers on the landing screen, etc.).
 *
 * @example
 *   const { Icon, label, gradient } = MODULES[activeModule];
 *   <h1 style={{ background: gradient }}>
 *     <Icon size={32} /> {label}
 *   </h1>
 */
export const MODULES: Record<ModuleId, ModuleDef> = {
  "e-sanction": {
    id: "e-sanction",
    label: "E-Sanction",
    Icon: ShieldCheck,
    gradient: "linear-gradient(90deg, #F4BEC7 0%, #F0A8A8 100%)",
  },
  "e-accounts": {
    id: "e-accounts",
    label: "E-Accounts",
    Icon: UserList,
    gradient: "linear-gradient(90deg, #F4EBBE 0%, #C0F0A8 100%)",
  },
  hrms: {
    id: "hrms",
    label: "HRMS",
    Icon: UserCircle,
    gradient: "linear-gradient(90deg, #BED0F4 0%, #D1A8F0 100%)",
  },
  deposit: {
    id: "deposit",
    label: "Deposit",
    Icon: HandArrowDown,
    gradient: "linear-gradient(90deg, #F4BEBE 0%, #F0D8A8 100%)",
  },
  budget: {
    id: "budget",
    label: "Budget",
    Icon: Coins,
    gradient: "linear-gradient(90deg, #D0F4BE 0%, #A8F0F0 100%)",
  },
  "strong-room": {
    id: "strong-room",
    label: "Strong Room",
    Icon: Dresser,
    gradient: "linear-gradient(90deg, #F4D9BE 0%, #F0F0A8 100%)",
  },
  pension: {
    id: "pension",
    label: "Pension",
    Icon: HandDeposit,
    gradient: "linear-gradient(90deg, #BEF4F4 0%, #A8B4F0 100%)",
  },
  receipt: {
    id: "receipt",
    label: "Receipt",
    Icon: Receipt,
    gradient: "linear-gradient(90deg, #E2BEF4 0%, #F0A8F0 100%)",
  },
  vendor: {
    id: "vendor",
    label: "Vendor",
    Icon: Storefront,
    gradient: "linear-gradient(90deg, #BEF4F4 0%, #A8D8F0 100%)",
  },
  bsg: {
    id: "bsg",
    label: "BSG",
    Icon: UserSound,
    gradient: "linear-gradient(90deg, #F4BEBE 0%, #B4A8F0 100%)",
  },
};

/**
 * Convenience array of every `ModuleDef` in `MODULES`. Use this to
 * iterate (e.g. render a grid of all modules on the landing page).
 */
export const MODULE_LIST: ModuleDef[] = Object.values(MODULES);
