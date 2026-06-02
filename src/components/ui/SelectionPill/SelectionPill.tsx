import { forwardRef, useCallback, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * SelectionPill — a toggleable chip for picking options (filters, tags,
 * single/multi-select sets).
 *
 * Two states straight from the IFMIS Figma spec:
 *   - selected   → Purple-600 surface, white label + check icon.
 *   - unselected → Surface/Grey-bg, muted grey label + check icon.
 *
 * It is a *toggle button* (`aria-pressed`) and works **controlled**
 * (`selected` + `onSelectedChange`) or **uncontrolled** (`defaultSelected`),
 * mirroring the rest of the library. A leading check icon is shown by default
 * in both states (override it, or pass `null` to drop it).
 * ========================================================================= */

export const selectionPillVariants = cva(
  [
    "inline-flex select-none items-center justify-center rounded-2xl",
    "font-semibold leading-none whitespace-nowrap",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    // Any icon inside is auto-sized and inherits the label colour.
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      selected: {
        true: "bg-purple-600 text-white hover:bg-purple-700",
        false: "bg-surface-grey-bg text-grey-400 hover:bg-grey-100",
      },
      size: {
        sm: "gap-1 px-2.5 py-1 text-xs [&_svg]:size-3.5",
        md: "gap-1.5 px-3 py-1.5 text-sm [&_svg]:size-4",
      },
    },
    defaultVariants: { selected: false, size: "md" },
  },
);

type SelectionPillSize = NonNullable<
  VariantProps<typeof selectionPillVariants>["size"]
>;

export interface SelectionPillProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "value"> {
  /** Controlled selected value. Pair with `onSelectedChange`. */
  selected?: boolean;
  /** Uncontrolled initial value. Defaults to `false`. */
  defaultSelected?: boolean;
  /** Fires with the next value whenever selection flips. */
  onSelectedChange?: (selected: boolean) => void;
  /** Visual size. Defaults to `md` (the Figma frame size). */
  size?: SelectionPillSize;
  /**
   * Leading icon. Three behaviours:
   *   - **omitted** — a check icon (shown in both states).
   *   - **`null`** — no icon (label only).
   *   - **custom node** — your glyph; it inherits the label colour + size.
   */
  icon?: ReactNode | null;
  /** The pill label. */
  children?: ReactNode;
}

const DEFAULT_ICON = <Check weight="bold" aria-hidden="true" />;

/**
 * `SelectionPill` — a toggleable selection chip.
 *
 * @example Uncontrolled
 * ```jsx
 * <SelectionPill defaultSelected onSelectedChange={(v) => console.log(v)}>
 *   Selected
 * </SelectionPill>
 * ```
 *
 * @example Controlled multi-select
 * ```jsx
 * const [picked, setPicked] = useState(new Set());
 * const toggle = (id) => (on) =>
 *   setPicked((s) => {
 *     const next = new Set(s);
 *     on ? next.add(id) : next.delete(id);
 *     return next;
 *   });
 *
 * {options.map((o) => (
 *   <SelectionPill
 *     key={o.id}
 *     selected={picked.has(o.id)}
 *     onSelectedChange={toggle(o.id)}
 *   >
 *     {o.label}
 *   </SelectionPill>
 * ))}
 * ```
 */
export const SelectionPill = forwardRef<HTMLButtonElement, SelectionPillProps>(
  (
    {
      selected,
      defaultSelected = false,
      onSelectedChange,
      size = "md",
      icon,
      disabled = false,
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isControlled = selected !== undefined;
    const [internal, setInternal] = useState(defaultSelected);
    const isSelected = isControlled ? selected : internal;

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const next = !isSelected;
        if (!isControlled) setInternal(next);
        onSelectedChange?.(next);
      },
      [isControlled, isSelected, onClick, onSelectedChange],
    );

    const resolvedIcon = icon === undefined ? DEFAULT_ICON : icon;

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isSelected}
        disabled={disabled}
        data-state={isSelected ? "selected" : "unselected"}
        onClick={handleClick}
        className={cn(selectionPillVariants({ selected: isSelected, size }), className)}
        {...props}
      >
        {resolvedIcon}
        {children}
      </button>
    );
  },
);

SelectionPill.displayName = "SelectionPill";
