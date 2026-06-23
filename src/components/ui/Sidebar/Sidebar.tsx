import { forwardRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import {
  MagnifyingGlass,
  SidebarSimple,
  RowsPlusTop,
  CaretRight,
  CaretDown,
  List,
  Headset,
  QuestionMark,
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
/* Admin button                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Decorative overlapping "petals" tucked into the button's bottom-left
 * corner. Purely cosmetic — `aria-hidden` and `pointer-events-none`.
 *
 * Per the Figma spec the 73.5×72.5 leaf is rotated 15° about its own
 * centre, with that centre placed at (20.48, 37.67) inside the 247×48
 * pill. That makes the leaf bleed ~24px off the left edge and ~34px below
 * the bottom edge; the button's `overflow-hidden` clips those parts so
 * only the corner cluster shows. The offsets are anchored to the left/top
 * (not width-derived) so the leaf stays put at any button width.
 *
 * In the collapsed rail the pill is much narrower and shares space with the
 * label, so `collapsed` nudges the leaf further down-left (more of it clipped)
 * to keep it a subtle accent rather than a distraction.
 */
function AdminButtonLeaves({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        left: collapsed ? "-30px" : "-16.29px",
        top: collapsed ? "14px" : "1.4px",
        width: "73.532px",
        height: "72.539px",
        transform: "rotate(15deg)",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="73.532"
        height="72.539"
        viewBox="-9 4 73.532 72.539"
        fill="none"
        className="h-full w-full"
      >
        <path
          d="M59.5435 33.9209C52.3965 60.5942 24.9796 76.4234 -1.6937 69.2763C5.45339 42.603 32.8702 26.7738 59.5435 33.9209Z"
          fill="white"
          fillOpacity="0.5"
        />
        <path
          d="M64.4734 15.522C57.3263 42.1953 29.9095 58.0244 3.23617 50.8773C10.3833 24.204 37.8001 8.37492 64.4734 15.522Z"
          fill="white"
          fillOpacity="0.55"
        />
        <path
          d="M41.0012 5.61816C41.0012 33.2324 18.6155 55.6182 -8.99878 55.6182C-8.99878 28.0039 13.387 5.61816 41.0012 5.61816Z"
          fill="white"
          fillOpacity="0.55"
        />
      </svg>
    </span>
  );
}

/** The admin glyph (user with sync arrows) shown to the left of the label. */
function AdminIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20.236"
      height="19.485"
      viewBox="0 0 21 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M5.4043 1.0752C7.24155 0.155647 9.32354 -0.156099 11.3496 0.18457C11.5313 0.216704 11.6933 0.319016 11.7998 0.469727C11.9063 0.620444 11.9494 0.80726 11.9189 0.989258C11.8885 1.17108 11.7872 1.33357 11.6377 1.44141C11.5254 1.5223 11.3922 1.56784 11.2559 1.57324L11.1191 1.56543C9.9291 1.36529 8.70973 1.42615 7.5459 1.74512C6.38201 2.06411 5.30162 2.63315 4.37988 3.41211C3.45811 4.19115 2.71656 5.16233 2.20801 6.25684C1.69962 7.3512 1.43553 8.54331 1.43457 9.75C1.43279 11.7816 2.17981 13.7427 3.53223 15.2588L3.5752 15.3066L3.61133 15.2539C4.15291 14.4685 4.8411 13.7945 5.6377 13.2695C5.69701 13.2303 5.76789 13.2121 5.83887 13.2168C5.89215 13.2204 5.94334 13.2368 5.98828 13.2646L6.03125 13.2959C7.05916 14.1853 8.37312 14.6748 9.73242 14.6748C11.0067 14.6748 12.2411 14.2447 13.2373 13.458L13.4336 13.2959C13.4872 13.2491 13.5549 13.2215 13.626 13.2168C13.697 13.2121 13.7679 13.2302 13.8271 13.2695C14.6246 13.7946 15.3137 14.4683 15.8564 15.2539L15.8926 15.3066L15.9346 15.2588C17.2881 13.7431 18.0362 11.7821 18.0352 9.75L18.0273 9.40234C18.0129 9.05495 17.9774 8.70838 17.9199 8.36523L17.9092 8.22754C17.9102 8.18165 17.9157 8.13584 17.9258 8.09082C17.946 8.00058 17.9838 7.9144 18.0371 7.83887C18.0904 7.76339 18.159 7.69954 18.2373 7.65039C18.3155 7.60131 18.403 7.56797 18.4941 7.55273C18.5852 7.53756 18.6787 7.54054 18.7686 7.56152C18.8585 7.58255 18.9436 7.62083 19.0186 7.6748C19.0935 7.72876 19.1567 7.79739 19.2051 7.87598C19.2535 7.95467 19.2864 8.04253 19.3008 8.13379V8.13477C19.6416 10.161 19.3298 12.2436 18.4102 14.0811C17.4905 15.9183 16.0107 17.4158 14.1846 18.3574C12.3582 19.299 10.2793 19.6359 8.24902 19.3193C6.21883 19.0027 4.34159 18.0486 2.88867 16.5957C1.43589 15.1428 0.482567 13.2655 0.166016 11.2354C-0.150454 9.20522 0.186368 7.127 1.12793 5.30078C2.06953 3.47458 3.56694 1.99484 5.4043 1.0752ZM9.73535 4.9248C10.5411 4.92487 11.329 5.16369 11.999 5.61133C12.6691 6.05908 13.1916 6.69585 13.5 7.44043C13.8084 8.18503 13.8887 9.00446 13.7314 9.79492C13.5742 10.5854 13.1861 11.3119 12.6162 11.8818C12.0464 12.4515 11.3205 12.8398 10.5303 12.9971C9.73984 13.1543 8.92036 13.073 8.17578 12.7646C7.43117 12.4562 6.79445 11.9338 6.34668 11.2637C5.89902 10.5936 5.66016 9.80586 5.66016 9C5.66016 7.91925 6.08931 6.88237 6.85352 6.11816C7.61771 5.35406 8.65468 4.92481 9.73535 4.9248ZM19.4854 0.799805C19.5772 0.799849 19.6681 0.817411 19.7529 0.852539C19.8379 0.887766 19.9155 0.939799 19.9805 1.00488C20.0455 1.06986 20.0966 1.14751 20.1318 1.23242C20.167 1.31732 20.1855 1.40811 20.1855 1.5C20.1855 1.59199 20.1671 1.68358 20.1318 1.76855C20.0966 1.85325 20.0453 1.93028 19.9805 1.99512L16.9805 4.99512C16.9155 5.0602 16.8379 5.11223 16.7529 5.14746C16.6681 5.18259 16.5772 5.20015 16.4854 5.2002C16.3934 5.2002 16.3018 5.18269 16.2168 5.14746C16.1319 5.11226 16.0552 5.06012 15.9902 4.99512H15.9893L14.4893 3.49512C14.4244 3.43014 14.373 3.35242 14.3379 3.26758C14.3028 3.18272 14.2842 3.09183 14.2842 3C14.2842 2.90816 14.3028 2.81729 14.3379 2.73242C14.373 2.64758 14.4244 2.56986 14.4893 2.50488C14.5543 2.43985 14.6318 2.38774 14.7168 2.35254C14.8018 2.31734 14.8934 2.2998 14.9854 2.2998C15.0771 2.29985 15.1681 2.31745 15.2529 2.35254C15.3379 2.38774 15.4154 2.43984 15.4805 2.50488L16.4492 3.47461L16.4854 3.51074L16.5205 3.47461L18.9893 1.00488H18.9902C19.0552 0.939885 19.1319 0.887738 19.2168 0.852539C19.3018 0.817312 19.3934 0.799805 19.4854 0.799805Z"
        fill="#FFF"
        stroke="#1D7AC8"
        strokeWidth="0.1"
      />
    </svg>
  );
}

export interface AdminButtonProps {
  /** Override the visible label. Default: `"Admin"`. */
  label?: string;
  /** Fires when the button is pressed — open your admin console here. */
  onClick?: () => void;
}

/**
 * The blue gradient "Admin" button that sits at the top of the Sidebar body.
 *
 * A 247×48 pill with a 16px radius and the Figma sign-in gradient
 * (`114deg, #3981E0 → #1FB9E4`). Decorative white "petals" bleed off the
 * left edge (clipped by the pill), and the user-with-sync-arrows glyph
 * precedes the centred label.
 *
 * Usually you don't render this directly — pass `admin` to `<Sidebar>` and
 * it places this at the top of the body card. Use the standalone export
 * only for bespoke layouts.
 *
 * @example
 *   <Sidebar admin={{ onClick: openAdminConsole }} ... />
 */
export function AdminButton({ label = "Admin", onClick }: AdminButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "relative flex h-12 w-[247px] max-w-full items-center justify-center gap-2 self-stretch shrink-0",
        "overflow-hidden rounded-2xl text-white",
        "transition-[filter] hover:brightness-105",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
      )}
      style={{
        background: "linear-gradient(114deg, #3981E0 23.67%, #1FB9E4 87.38%)",
        boxShadow: "0 1px 2px 0 #365463",
      }}
    >
      <AdminButtonLeaves />
      <span className="relative flex items-center gap-2">
        <AdminIcon />
        <span className="text-lg font-semibold leading-normal">{label}</span>
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Help links                                                                 */
/* -------------------------------------------------------------------------- */

export interface SidebarHelpItem {
  /** Override the visible label. */
  label?: string;
  /** Fires when the link is clicked — open your help desk / help center here. */
  onClick?: () => void;
}

export interface SidebarHelpProps {
  /** "Help Desk" link config. Omit to hide the row. */
  helpDesk?: SidebarHelpItem;
  /** "Help" link config. Omit to hide the row. */
  help?: SidebarHelpItem;
}

/** A single expanded help row — coloured icon circle + label. */
function HelpLinkRow({
  Icon,
  label,
  onClick,
  tone,
}: {
  Icon: typeof Headset;
  label: string;
  onClick?: () => void;
  tone: "purple" | "blue";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg text-left transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
      )}
    >
      <span
        className={cn(
          "flex w-7 h-7 p-1 items-center justify-center shrink-0 rounded-full border",
          tone === "purple"
            ? "border-purple-300 bg-purple-50 text-purple-300"
            : "border-blue-300 bg-blue-50 text-blue-300",
        )}
      >
        <Icon size={20} />
      </span>
      <span className="text-sm font-medium text-body-secondary">{label}</span>
    </button>
  );
}

/**
 * The "Help Desk" / "Help" links that sit at the bottom of the Sidebar.
 *
 * Each link is a coloured icon circle (purple headset / blue question mark)
 * followed by its label. Both are optional — omit one to hide it.
 *
 * Usually you don't render this directly — pass `help` to `<Sidebar>` and it
 * places this at the bottom of the body card (and renders icon-only circles
 * in the collapsed rail). Use the standalone export only for bespoke layouts.
 *
 * @example
 *   <Sidebar help={{ helpDesk: { onClick: openDesk }, help: { onClick: openHelp } }} />
 */
export function SidebarHelpLinks({ helpDesk, help }: SidebarHelpProps) {
  return (
    <div className="flex w-full items-center gap-4">
      {helpDesk && (
        <HelpLinkRow
          Icon={Headset}
          label={helpDesk.label ?? "Help Desk"}
          onClick={helpDesk.onClick}
          tone="purple"
        />
      )}
      {help && (
        <HelpLinkRow
          Icon={QuestionMark}
          label={help.label ?? "Help"}
          onClick={help.onClick}
          tone="blue"
        />
      )}
    </div>
  );
}

/** Icon-only help links for the collapsed rail. */
function CollapsedHelpLinks({ helpDesk, help }: SidebarHelpProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {helpDesk && (
        <button
          type="button"
          onClick={helpDesk.onClick}
          aria-label={helpDesk.label ?? "Help Desk"}
          className={cn(
            "flex w-10 h-10 items-center justify-center shrink-0 rounded-full border",
            "border-purple-300 bg-purple-50 text-purple-300",
            "transition-colors hover:bg-purple-100",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
          )}
        >
          <Headset size={24} />
        </button>
      )}
      {help && (
        <button
          type="button"
          onClick={help.onClick}
          aria-label={help.label ?? "Help"}
          className={cn(
            "flex w-10 h-10 items-center justify-center shrink-0 rounded-full border",
            "border-blue-300 bg-blue-50 text-blue-300",
            "transition-colors hover:bg-blue-100",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
          )}
        >
          <QuestionMark size={24} />
        </button>
      )}
    </div>
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
   * Admin button pinned to the top of the body card — the blue gradient
   * "Admin" pill. Pass `onClick` (and optional `label`). Omit the whole
   * prop to hide it.
   */
  admin?: AdminButtonProps;
  /**
   * Help links pinned to the bottom of the body card — "Help Desk" and
   * "Help". Pass `helpDesk` / `help` with an `onClick` (and optional
   * `label`). Omit a link to hide it; omit the whole prop to hide both.
   * In the collapsed rail these render as icon-only circles.
   */
  help?: SidebarHelpProps;
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
      admin,
      help,
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
          admin={admin}
          help={help}
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
        {(admin || modules || menu || help) && (
          <div
            className={cn(
              "flex w-[17.4375rem] p-4 flex-col items-center gap-4 self-stretch",
              "rounded-3xl border border-surface-border-purple bg-white",
            )}
          >
            {admin && (
              <div className="w-full">
                <AdminButton {...admin} />
              </div>
            )}
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
            {help && (help.helpDesk || help.help) && (
              // `mt-auto` pins the help links to the bottom of the body card
              // (matching Figma), while still sitting below the menu when the
              // card is content-sized.
              <div className="w-full mt-auto pt-2">
                <SidebarHelpLinks {...help} />
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
  admin?: AdminButtonProps;
  help?: SidebarHelpProps;
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
    { onExpand, modules, worklist, search: _search, menu, admin, help, className, ...props },
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

        {/* Body card — modules + sub-modules toggle + help icons.
            8px padding (per Figma collapsed spec) keeps the inner content
            wide enough for the 40px module thumbnail + expand chevron. */}
        {(admin || modules || menu || help) && (
          <div
            className={cn(
              "flex p-2 flex-col items-stretch gap-3 self-stretch",
              "rounded-3xl border border-surface-border-purple bg-white",
            )}
          >
            {admin && (
              <button
                type="button"
                onClick={onExpand}
                aria-label={admin.label ?? "Admin"}
                className={cn(
                  "relative flex h-12 items-center justify-center self-stretch shrink-0",
                  "overflow-hidden rounded-2xl text-white",
                  "transition-[filter] hover:brightness-105",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
                )}
                style={{
                  background: "linear-gradient(114deg, #3981E0 23.67%, #1FB9E4 87.38%)",
                  boxShadow: "0 1px 2px 0 #365463",
                }}
              >
                <AdminButtonLeaves collapsed />
                <span className="relative flex items-center gap-2">
                  <AdminIcon />
                  <span className="text-lg font-semibold leading-normal">
                    {admin.label ?? "Admin"}
                  </span>
                </span>
              </button>
            )}

            {modules && (
              <>
                <h3 className="text-heading text-sm font-semibold leading-tight">
                  Assigned
                  <br />
                  Modules
                </h3>
                <div className="flex p-2 justify-between items-center rounded-2xl border border-purple-100 bg-purple-25">
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

            {help && (help.helpDesk || help.help) && (
              <CollapsedHelpLinks {...help} />
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
  moduleId: ModuleId | null;
  onClick?: () => void;
}) {
  // No module selected → a dashed placeholder square that expands the rail.
  if (moduleId == null) {
    return (
      <button
        type="button"
        onClick={onClick}
        title="Select module"
        aria-label="Select a module"
        className={cn(
          "flex w-10 h-10 items-center justify-center shrink-0",
          "rounded-xl border border-dashed border-purple-300 bg-white text-purple-700",
          "transition-colors hover:bg-purple-50",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
        )}
      >
        <RowsPlusTop size={16} weight="bold" />
      </button>
    );
  }

  const { Icon, label, gradient, shadow } = MODULES[moduleId];
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
        style={{ background: "rgba(255, 255, 255, 0.50)", boxShadow: shadow }}
      >
        <Icon size={14} weight="duotone" />
      </span>
    </button>
  );
}

export type { MenuNode };
