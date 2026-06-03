import { useEffect, useRef, useState } from "react";
import { CaretRight, X } from "@phosphor-icons/react";
import { cn } from "../../../../lib/cn";
import { HoverPillTip } from "../../HoverPill";
import { MODULES, type ModuleDef, type ModuleId } from "../modules";

/* -------------------------------------------------------------------------- */
/* Active (large) module card                                                 */
/* -------------------------------------------------------------------------- */

interface ModuleCardProps {
  module: ModuleDef;
  onClick?: () => void;
}

/**
 * Circular white-50% pill that wraps the icon in every module card —
 * identical in active and inactive states per the Figma spec. The `sm`
 * variant fills the 24px slot inside an inactive 40×40 card; the
 * default sits inside the active card at 40px.
 */
function ModuleIconBadge({
  Icon,
  size = "md",
}: {
  Icon: ModuleDef["Icon"];
  size?: "sm" | "md";
}) {
  const isSm = size === "sm";
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full shrink-0",
        isSm ? "w-6 h-6" : "w-10 h-10",
      )}
      style={{ background: "rgba(255, 255, 255, 0.50)" }}
    >
      <Icon size={isSm ? 14 : 22} weight="duotone" />
    </span>
  );
}

export function ActiveModuleCard({ module, onClick }: ModuleCardProps) {
  const { Icon, label, gradient, textColor = "#4B3960" } = module;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-[8.125rem] h-[5.75rem] p-4 flex-col justify-center items-center gap-1",
        "rounded-xl shadow-sm",
        "transition-transform hover:scale-[1.02] focus:outline-none",
        "focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
      )}
      style={{ background: gradient, color: textColor }}
      aria-pressed="true"
      aria-label={`${label} (active module)`}
    >
      <ModuleIconBadge Icon={Icon} />
      <span className="text-sm font-semibold leading-none">{label}</span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Inactive (small) module card                                               */
/* -------------------------------------------------------------------------- */

export function InactiveModuleCard({ module, onClick }: ModuleCardProps) {
  const { Icon, label, gradient, textColor = "#4B3960" } = module;
  return (
    // Show the module name in a hover pill (above the icon). `decorative`
    // keeps it from being announced twice — the button already carries the
    // label via `aria-label`.
    <HoverPillTip label={label} placement="top" decorative>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-10 h-10 p-2 flex-col items-center justify-center shrink-0",
          "rounded-xl",
          "transition-transform hover:scale-110 focus:outline-none",
          "focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
        )}
        style={{ background: gradient, color: textColor }}
        aria-label={label}
      >
        <ModuleIconBadge Icon={Icon} size="sm" />
      </button>
    </HoverPillTip>
  );
}

/* -------------------------------------------------------------------------- */
/* Overflow popover — shown when more than 4 modules are assigned             */
/* -------------------------------------------------------------------------- */

interface OverflowPopoverProps {
  modules: ModuleDef[];
  activeId: ModuleId;
  onSelect: (id: ModuleId) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}

function OverflowPopover({
  modules,
  activeId,
  onSelect,
  onClose,
  anchorRef,
}: OverflowPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [anchorRef, onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="All assigned modules"
      className={cn(
        // 12px gap to the rail's outer edge. The popover anchor (the
        // chevron) sits inside the body card's 16px right padding plus
        // the modules section's own 8px padding, so we offset by 36px
        // (1.75rem + 0.5rem) to land 12px outside the rail.
        "absolute left-full top-0 z-50",
        "flex w-[17.4375rem] p-4 flex-col items-stretch gap-3",
        "rounded-3xl border border-surface-border-purple bg-white",
      )}
      style={{
        // Body card has 16px (1rem) right padding; the wrapper this
        // popover anchors to sits inside that padding. 16 + 12 = 28px
        // (1.75rem) takes us 12px past the rail's outer border.
        marginLeft: "1.75rem",
        boxShadow: "0 0 50px 0 rgba(0, 0, 0, 0.10)",
      }}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-heading text-base font-semibold">
          Assigned Modules
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="text-heading hover:bg-grey-100 rounded-full p-1"
          aria-label="Close"
        >
          <X size={16} weight="bold" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {modules.map((m) => {
          const isActive = m.id === activeId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onSelect(m.id);
                onClose();
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-3 rounded-xl h-[5.75rem]",
                "transition-transform hover:scale-[1.02]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
                isActive && "ring-2 ring-purple-700 ring-offset-2",
              )}
              style={{ background: m.gradient, color: m.textColor ?? "#4B3960" }}
            >
              <ModuleIconBadge Icon={m.Icon} />
              <span className="text-sm font-semibold leading-none">
                {m.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* AssignedModules — title + active + (up to 3) inactive + overflow chevron   */
/* -------------------------------------------------------------------------- */

export interface AssignedModulesProps {
  /**
   * Ordered list of module ids the user is assigned to. Usually fetched
   * from your backend at sign-in. The Sidebar handles any length — 0
   * modules hides the section, 4 fills the 2×2 grid, more than that
   * triggers the right-side overflow popover.
   */
  assigned: ModuleId[];
  /** Currently active module id. */
  activeId: ModuleId;
  /** Fires when the user clicks a different module — switch your app. */
  onChange?: (id: ModuleId) => void;
  /**
   * Maximum inactive thumbnails shown inline before overflowing into the
   * popover. Default `3` — the 4th slot in the 2×2 grid is reserved for
   * the overflow chevron when there are more assigned modules. Set this
   * to `4` (and accept no overflow chevron) to fill the grid when you
   * know the user has at most 4 modules.
   */
  maxInlineInactive?: number;
}

export function AssignedModules({
  assigned,
  activeId,
  onChange,
  maxInlineInactive = 3,
}: AssignedModulesProps) {
  const [open, setOpen] = useState(false);
  const overflowRef = useRef<HTMLButtonElement>(null);

  const inactive = assigned.filter((id) => id !== activeId).map((id) => MODULES[id]);
  // Per Figma: inactive thumbnails sit in a 2-column grid (up to 4 visible).
  // Anything beyond that lives in the overflow popover triggered by the
  // separate circular chevron button.
  const inline = inactive.slice(0, maxInlineInactive);
  const hasOverflow = inactive.length > maxInlineInactive;

  const active = MODULES[activeId];

  return (
    <div className="relative flex flex-col gap-2 self-stretch">
      <h3 className="text-heading text-base font-semibold leading-tight">
        Assigned Modules
      </h3>

      <div className="flex p-2 justify-between items-center gap-3 self-stretch rounded-2xl bg-purple-50">
        <ActiveModuleCard module={active} />

        {/* 2×2 grid: up to 3 inactive thumbnails + (when applicable) the
            circular overflow chevron in the 4th slot. */}
        <div className="grid grid-cols-2 gap-1.5">
          {inline.map((m) => (
            <InactiveModuleCard
              key={m.id}
              module={m}
              onClick={() => onChange?.(m.id)}
            />
          ))}

          {hasOverflow && (
            <button
              ref={overflowRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "flex w-10 h-10 items-center justify-center shrink-0",
                "rounded-full border border-grey-400 bg-white text-heading",
                "transition-colors hover:bg-grey-100",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
              )}
              aria-label={`Show ${inactive.length - maxInlineInactive} more modules`}
              aria-expanded={open}
            >
              <CaretRight size={16} weight="bold" />
            </button>
          )}
        </div>
      </div>

      {open && (
        <OverflowPopover
          modules={assigned.map((id) => MODULES[id])}
          activeId={activeId}
          onSelect={(id) => onChange?.(id)}
          onClose={() => setOpen(false)}
          anchorRef={overflowRef}
        />
      )}
    </div>
  );
}
