import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  useState,
} from "react";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * HoverPill — the small grey "on hover" pill from the IFMIS Figma spec.
 *
 * A rounded grey pill (Header-14, secondary text) with a solid grey arrow
 * that protrudes from one edge. Six Figma arrow positions are supported
 * (the pill's side relative to its anchor, plus start/end alignment):
 *
 *   top-start · top-end       → pill above, arrow points down (left / right)
 *   bottom-start · bottom-end → pill below, arrow points up   (left / right)
 *   left · right              → pill beside, arrow points sideways (centred)
 *
 * Two convenience centred placements (`top`, `bottom`) are added for tooltips
 * that should point at the middle of their anchor.
 *
 * `HoverPill` is the **presentational** pill (used standalone or in a layout).
 * `HoverPillTip` wraps a trigger and shows the pill on hover/focus — that's
 * what powers the Sidebar's "module name on hover".
 * ========================================================================= */

export type HoverPillPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "right";

/* The pointer is a single CSS-border triangle, solid-filled with the border
 * grey (`#A6A6A6`) per the Figma polygon spec. `*-full` lands the triangle's
 * base exactly on the pill's border edge — flush, so the arrow reads as part
 * of the pill (no gap, and no nub poking back inside it). */
const ARROW: Record<HoverPillPlacement, string> = {
  // Pill above → arrow on the bottom edge pointing down.
  top: "top-full left-1/2 -translate-x-1/2 border-x-[7px] border-x-transparent border-t-[7px] border-t-surface-border-grey",
  "top-start":
    "top-full left-3 border-x-[7px] border-x-transparent border-t-[7px] border-t-surface-border-grey",
  "top-end":
    "top-full right-3 border-x-[7px] border-x-transparent border-t-[7px] border-t-surface-border-grey",
  // Pill below → arrow on the top edge pointing up.
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-x-[7px] border-x-transparent border-b-[7px] border-b-surface-border-grey",
  "bottom-start":
    "bottom-full left-3 border-x-[7px] border-x-transparent border-b-[7px] border-b-surface-border-grey",
  "bottom-end":
    "bottom-full right-3 border-x-[7px] border-x-transparent border-b-[7px] border-b-surface-border-grey",
  // Pill on the left → arrow on the right edge pointing right.
  left: "left-full top-1/2 -translate-y-1/2 border-y-[7px] border-y-transparent border-l-[7px] border-l-surface-border-grey",
  // Pill on the right → arrow on the left edge pointing left.
  right:
    "right-full top-1/2 -translate-y-1/2 border-y-[7px] border-y-transparent border-r-[7px] border-r-surface-border-grey",
};

/** The solid grey triangle pointer, fused to the pill edge. */
function PillArrow({ placement }: { placement: HoverPillPlacement }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute block h-0 w-0 border-solid",
        ARROW[placement],
      )}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* HoverPill — presentational                                                 */
/* -------------------------------------------------------------------------- */

export interface HoverPillProps extends HTMLAttributes<HTMLDivElement> {
  /** Pill text. */
  children: ReactNode;
  /** Which edge the arrow sits on + its alignment. Default `top-start`. */
  placement?: HoverPillPlacement;
}

/**
 * `HoverPill` — the standalone grey pill with a directional arrow.
 *
 * @example
 * ```jsx
 * <HoverPill placement="top-start">Deposit</HoverPill>
 * ```
 */
export const HoverPill = forwardRef<HTMLDivElement, HoverPillProps>(
  ({ children, placement = "top-start", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative inline-flex h-[34px] items-center justify-center whitespace-nowrap",
        "rounded-2xl border border-surface-border-grey bg-surface-grey-bg px-3",
        "text-body-xs font-semibold leading-none text-body-secondary",
        className,
      )}
      {...props}
    >
      {children}
      <PillArrow placement={placement} />
    </div>
  ),
);

HoverPill.displayName = "HoverPill";

/* -------------------------------------------------------------------------- */
/* HoverPillTip — behavioural tooltip wrapper                                 */
/* -------------------------------------------------------------------------- */

/** Position of the floating pill relative to the wrapped trigger. */
const FLOAT: Record<HoverPillPlacement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  "top-start": "bottom-full left-0 mb-2",
  "top-end": "bottom-full right-0 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  "bottom-start": "top-full left-0 mt-2",
  "bottom-end": "top-full right-0 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export interface HoverPillTipProps {
  /** The pill text shown on hover/focus. */
  label: ReactNode;
  /** The element the tip is attached to (a single focusable child). */
  children: ReactElement;
  /** Arrow placement (which side the pill appears on). Default `top`. */
  placement?: HoverPillPlacement;
  /** Controlled visibility. Omit to let hover/focus drive it. */
  open?: boolean;
  /** Initial visibility when uncontrolled. Default `false`. */
  defaultOpen?: boolean;
  /** Never show the tip. */
  disabled?: boolean;
  /**
   * Treat the pill as purely decorative (`aria-hidden`, no `aria-describedby`).
   * Use when the trigger already carries the same accessible name (e.g. an icon
   * button with `aria-label`), to avoid screen readers announcing it twice.
   */
  decorative?: boolean;
  /** Classes for the inline wrapper. */
  className?: string;
  /** Classes for the floating pill. */
  pillClassName?: string;
}

/**
 * `HoverPillTip` — shows a `HoverPill` when the wrapped trigger is hovered or
 * focused. Purely CSS-positioned (no portal), so the trigger's container must
 * not clip overflow.
 *
 * @example Icon button with a label on hover
 * ```jsx
 * <HoverPillTip label="Deposit" placement="top" decorative>
 *   <button aria-label="Deposit"><Coins /></button>
 * </HoverPillTip>
 * ```
 */
export function HoverPillTip({
  label,
  children,
  placement = "top",
  open,
  defaultOpen = false,
  disabled = false,
  decorative = false,
  className,
  pillClassName,
}: HoverPillTipProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const show = !disabled && (isControlled ? open : internalOpen);

  const tipId = useId();

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
  };

  const trigger =
    isValidElement(children) && !decorative
      ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
          "aria-describedby": show
            ? cn(
                (children.props as { "aria-describedby"?: string })[
                  "aria-describedby"
                ],
                tipId,
              )
            : (children.props as { "aria-describedby"?: string })[
                "aria-describedby"
              ],
        })
      : children;

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {trigger}
      {show && (
        <span className={cn("absolute z-50", FLOAT[placement])}>
          <HoverPill
            id={decorative ? undefined : tipId}
            role={decorative ? undefined : "tooltip"}
            aria-hidden={decorative || undefined}
            placement={placement}
            className={pillClassName}
          >
            {label}
          </HoverPill>
        </span>
      )}
    </span>
  );
}
