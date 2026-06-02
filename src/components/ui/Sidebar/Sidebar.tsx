import { forwardRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import {
  MagnifyingGlass,
  SidebarSimple,
  RowsPlusTop,
  CaretRight,
  CaretDown,
  List,
} from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import { AssignedModules } from "./parts/AssignedModules";
import type { AssignedModulesProps } from "./parts/AssignedModules";
import { SidebarMenu } from "./parts/SidebarMenu";
import type { MenuNode, SidebarMenuProps } from "./parts/SidebarMenu";
import { MODULES, type ModuleId } from "./modules";

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

export interface SidebarSearchProps {
  /** Controlled value of the search input. */
  value?: string;
  /** Fires on every keystroke with the new value. */
  onChange?: (value: string) => void;
  /** Placeholder text shown when empty. Default: `"Search menu..."`. */
  placeholder?: string;
}

/**
 * Pill-shaped search input that lives inside the Sidebar's top card.
 *
 * It owns no state — pass `value` + `onChange` from the consumer. Wire it
 * to a fuzzy search over your menu tree or to a global search modal.
 *
 * @example
 *   const [q, setQ] = useState("");
 *   <Sidebar search={{ value: q, onChange: setQ }} ... />
 */
export function SidebarSearch({
  value,
  onChange,
  placeholder = "Search menu...",
}: SidebarSearchProps) {
  return (
    <div
      className={cn(
        "flex w-[12.4375rem] h-10 px-3 py-2.5 items-center gap-2",
        "rounded-3xl border border-grey-400 bg-white",
        "focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-300/40",
        "transition-colors",
      )}
    >
      <MagnifyingGlass size={18} weight="bold" className="text-grey-600 shrink-0" />
      <input
        type="search"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex-1 min-w-0 bg-transparent outline-none border-0",
          // Figma "Text/Body/Medium-16" — 1rem / 500 / 1.5rem line-height
          "text-base font-medium leading-6",
          "text-body-secondary placeholder:text-body-secondary/70",
        )}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Collapse button                                                            */
/* -------------------------------------------------------------------------- */

export interface SidebarCollapseButtonProps {
  /** True when the sidebar is collapsed. Drives the `aria-pressed` state
   *  and the label read by screen readers. */
  collapsed?: boolean;
  /** Fires when the user toggles the rail. */
  onClick?: () => void;
}

/**
 * The 40×40 purple-tinted circle that sits next to the search bar.
 *
 * Usually you don't render this directly — `<Sidebar>` does it for you
 * and manages the toggle. Use the standalone export only if you're
 * composing a bespoke header for a screen that doesn't host a full
 * Sidebar.
 */

export function SidebarCollapseButton({
  collapsed = false,
  onClick,
}: SidebarCollapseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-pressed={collapsed}
      className={cn(
        "flex w-10 h-10 items-center justify-center shrink-0",
        "rounded-full border border-purple-300 bg-purple-100",
        "text-purple-700 transition-colors",
        "hover:bg-purple-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
      )}
    >
      <SidebarSimple size={20} weight="bold" />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Worklist button                                                            */
/* -------------------------------------------------------------------------- */

export interface WorklistButtonProps {
  /** Number of pending worklist items. Omit to hide the badge. */
  count?: number;
  /** Fires when the pill is clicked — open your worklist drawer here. */
  onClick?: () => void;
  /** Override the visible label. Default: `"Worklist"`. */
  label?: string;
}

/**
 * The orange "Worklist" pill that lives below the search row.
 *
 * @example
 *   <Sidebar worklist={{ count: pendingCount, onClick: openWorklist }} />
 */

export function WorklistButton({
  count,
  onClick,
  label = "Worklist",
}: WorklistButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-[15.4375rem] h-11 px-2 justify-between items-center self-stretch",
        "rounded-2xl border border-orange-200 bg-orange-100",
        "text-heading transition-colors hover:bg-orange-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
      )}
    >
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "flex w-8 h-8 p-1 items-center justify-center rounded-full",
            "text-orange-700",
          )}
          style={{ background: "#F5C1A3" }}
        >
          <RowsPlusTop size={18} weight="bold" />
        </span>
        <span className="text-sm font-semibold">{label}</span>
      </span>
      <span className="flex items-center gap-1">
        {count !== undefined && (
          <span
            className={cn(
              "inline-flex min-w-5 h-5 px-1.5 items-center justify-center",
              "rounded-full bg-orange-300 text-[11px] font-semibold text-orange-900",
            )}
          >
            {count}
          </span>
        )}
        <CaretRight size={14} weight="bold" />
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* -------------------------------------------------------------------------- */

export interface SidebarProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /**
   * Assigned-modules configuration. Pass `assigned` (the array of
   * `ModuleId`s the user can access), `activeId` (the currently-selected
   * one), and `onChange` to switch modules. Omit the whole prop to hide
   * the section.
   */
  modules?: AssignedModulesProps;
  /**
   * Sub-modules menu. Pass `items` (your `MenuNode[]` tree) plus
   * `activeId` + `onSelect` to wire selection to your router. Children
   * are unlimited depth — anything beyond the first level renders as a
   * right-side card. Omit the whole prop to hide the section.
   */
  menu?: SidebarMenuProps;
  /** Search input config. Omit to hide the input. */
  search?: SidebarSearchProps;
  /** Worklist button config. Omit to hide the pill. */
  worklist?: WorklistButtonProps;
  /**
   * Collapse state — controlled. When omitted the Sidebar manages its
   * own collapse state internally; pass this only if you want to
   * persist the choice (e.g. localStorage).
   */
  collapsed?: boolean;
  /** Fires when the collapse circle is clicked. Pair with `collapsed`. */
  onCollapseToggle?: () => void;
  /** Optional extra content rendered at the bottom of the sidebar. */
  footer?: ReactNode;
}

/**
 * `Sidebar` — the IFMIS navigation rail.
 *
 * Two stacked containers (24px gap) inside a 279px-wide column:
 *   1. **Top card** — search input, collapse button, worklist pill.
 *   2. **Body**     — `AssignedModules` (active card + 2×2 inactive
 *                     grid + overflow popover) and `SidebarMenu`
 *                     (top-level pills + cascading right-side cards).
 *
 * The component is **purely presentational**. Every interactive state
 * — search value, active module, active menu leaf, collapsed flag — is
 * controlled via props you own. Wire those to your router, your user
 * store, and a global search hook. The Sidebar does not call the
 * router, does not persist anything, and does not own selection.
 *
 * @example Minimum (menu only)
 *   <Sidebar menu={{ items, activeId, onSelect }} />
 *
 * @example Full integration
 *   <Sidebar
 *     search={{ value: q, onChange: setQ }}
 *     worklist={{ count: 12, onClick: openWorklist }}
 *     modules={{ assigned, activeId: module, onChange: setModule }}
 *     menu={{ items: MENUS[module], activeId: route, onSelect: navigate }}
 *   />
 *
 * See `Sidebar.mdx` for the complete wiring guide.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      modules,
      menu,
      search,
      worklist,
      collapsed: controlledCollapsed,
      onCollapseToggle,
      footer,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const collapsed = controlledCollapsed ?? internalCollapsed;
    const handleCollapse = () => {
      onCollapseToggle?.();
      if (controlledCollapsed === undefined) setInternalCollapsed((v) => !v);
    };

    if (collapsed) {
      return (
        <CollapsedSidebar
          ref={ref}
          className={className}
          onExpand={handleCollapse}
          modules={modules}
          worklist={worklist}
          search={search}
          menu={menu}
          {...props}
        />
      );
    }

    return (
      <aside
        ref={ref}
        className={cn(
          "flex w-[279px] flex-col items-start gap-6",
          "text-heading",
          className,
        )}
        aria-label="Primary navigation"
        {...props}
      >
        {/* Top card */}
        <div
          className={cn(
            "flex p-4 flex-col justify-center items-end gap-4 self-stretch",
            "rounded-3xl border border-surface-border-purple bg-white",
          )}
        >
          <div className="flex w-full items-center gap-2">
            <SidebarSearch {...search} />
            <SidebarCollapseButton
              collapsed={collapsed}
              onClick={handleCollapse}
            />
          </div>
          {worklist && <WorklistButton {...worklist} />}
        </div>

        {/* Body card — wraps the assigned-modules section and the
            sub-modules menu in a single 279px-wide purple-bordered card
            (per Figma). `align-items: center` keeps the section content
            visually centred while children themselves stretch full-width. */}
        {(modules || menu) && (
          <div
            className={cn(
              "flex w-[17.4375rem] p-4 flex-col items-center gap-4 self-stretch",
              "rounded-3xl border border-surface-border-purple bg-white",
            )}
          >
            {modules && (
              <div className="w-full">
                <AssignedModules {...modules} />
              </div>
            )}
            {menu && (
              <div className="w-full">
                {/* Wire the search input's current value into the menu so it
                    can switch to the search-results view automatically.
                    Consumers can still override per-instance by setting
                    `menu.searchValue` explicitly. */}
                <SidebarMenu
                  searchValue={search?.value}
                  {...menu}
                />
              </div>
            )}
          </div>
        )}

        {footer}
      </aside>
    );
  },
);

Sidebar.displayName = "Sidebar";

/* -------------------------------------------------------------------------- */
/* Collapsed variant — narrow rail mirroring the expanded layout              */
/* -------------------------------------------------------------------------- */

interface CollapsedSidebarProps extends HTMLAttributes<HTMLElement> {
  onExpand: () => void;
  modules?: AssignedModulesProps;
  worklist?: WorklistButtonProps;
  search?: SidebarSearchProps;
  menu?: SidebarMenuProps;
}

/**
 * The collapsed rail. Visually mirrors the expanded layout (two stacked
 * purple-bordered cards), but every interactive region is reduced to a
 * single icon-sized button:
 *
 *   - Top card  → search icon + expand-toggle + compact worklist pill
 *   - Body card → "Assigned Modules" title + active module thumbnail +
 *                 expand-modules chevron + sub-modules toggle row
 *
 * Clicking the expand-toggle / expand-modules chevron / sub-modules
 * toggle all open the full sidebar via `onExpand`. This keeps the
 * collapsed rail a navigation surface, not a full menu host — depth
 * lives in the expanded state.
 */
const CollapsedSidebar = forwardRef<HTMLElement, CollapsedSidebarProps>(
  (
    { onExpand, modules, worklist, search: _search, menu, className, ...props },
    ref,
  ) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "flex flex-col items-stretch gap-6 w-[7.5rem]",
          "text-heading",
          className,
        )}
        aria-label="Primary navigation (collapsed)"
        {...props}
      >
        {/* Top card — search icon + expand-toggle, then compact worklist */}
        <div
          className={cn(
            "flex p-4 flex-col items-center gap-4 self-stretch",
            "rounded-3xl border border-surface-border-purple bg-white",
          )}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onExpand();
                // Defer focus so the search input exists when we focus it.
                setTimeout(() => {
                  document
                    .querySelector<HTMLInputElement>('input[type="search"]')
                    ?.focus();
                }, 0);
              }}
              aria-label="Open search"
              className={cn(
                "flex w-10 h-10 items-center justify-center shrink-0",
                "rounded-full border border-grey-400 bg-white text-heading",
                "transition-colors hover:bg-grey-100",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
              )}
            >
              <MagnifyingGlass size={18} weight="bold" />
            </button>
            <SidebarCollapseButton collapsed onClick={onExpand} />
          </div>

          {worklist && <CompactWorklistButton {...worklist} />}
        </div>

        {/* Body card — modules + sub-modules toggle */}
        {(modules || menu) && (
          <div
            className={cn(
              "flex p-4 flex-col items-stretch gap-3 self-stretch",
              "rounded-3xl border border-surface-border-purple bg-white",
            )}
          >
            {modules && (
              <>
                <h3 className="text-heading text-sm font-semibold leading-tight">
                  Assigned
                  <br />
                  Modules
                </h3>
                <div className="flex p-2 justify-between items-center gap-2 rounded-2xl bg-purple-50">
                  <CollapsedActiveModuleCard
                    moduleId={modules.activeId}
                    onClick={onExpand}
                  />
                  <button
                    type="button"
                    onClick={onExpand}
                    aria-label="Expand modules"
                    className={cn(
                      "flex w-10 h-10 items-center justify-center shrink-0",
                      "rounded-full border border-grey-400 bg-white text-heading",
                      "transition-colors hover:bg-grey-100",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
                    )}
                  >
                    <CaretRight size={16} weight="bold" />
                  </button>
                </div>
              </>
            )}

            {menu && (
              <button
                type="button"
                onClick={onExpand}
                aria-label="Open sub-modules menu"
                className={cn(
                  "flex h-10 px-3 items-center justify-between self-stretch",
                  "rounded-2xl bg-grey-100 text-heading",
                  "transition-colors hover:bg-grey-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
                )}
              >
                <List size={18} weight="bold" />
                <CaretDown size={14} weight="bold" />
              </button>
            )}
          </div>
        )}
      </aside>
    );
  },
);

CollapsedSidebar.displayName = "CollapsedSidebar";

/* -------------------------------------------------------------------------- */
/* Pieces used only by the collapsed rail                                     */
/* -------------------------------------------------------------------------- */

function CompactWorklistButton({ count, onClick, label = "Worklist" }: WorklistButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count !== undefined ? `${label} (${count} items)` : label}
      className={cn(
        "flex h-10 px-2 items-center justify-between gap-2 self-stretch",
        "rounded-2xl border border-orange-200 bg-orange-100",
        "transition-colors hover:bg-orange-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
      )}
    >
      <span
        className="flex w-8 h-8 p-1 items-center justify-center rounded-full text-orange-700"
        style={{ background: "#F5C1A3" }}
      >
        <RowsPlusTop size={18} weight="bold" />
      </span>
      {count !== undefined && (
        <span className="text-sm font-bold text-orange-700">{count}</span>
      )}
    </button>
  );
}

/**
 * Mini gradient square for the collapsed rail — uses the active
 * module's gradient + icon but at the inactive-card size (40×40),
 * mirroring the Figma reference.
 */
function CollapsedActiveModuleCard({
  moduleId,
  onClick,
}: {
  moduleId: ModuleId;
  onClick?: () => void;
}) {
  const { Icon, label, gradient } = MODULES[moduleId];
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={`${label} (active module)`}
      className={cn(
        "flex w-10 h-10 p-2 items-center justify-center shrink-0",
        "rounded-xl text-heading transition-transform hover:scale-105",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
      )}
      style={{ background: gradient }}
    >
      <span
        className="flex w-6 h-6 items-center justify-center rounded-full"
        style={{ background: "rgba(255, 255, 255, 0.50)" }}
      >
        <Icon size={14} weight="duotone" />
      </span>
    </button>
  );
}

export type { MenuNode };
