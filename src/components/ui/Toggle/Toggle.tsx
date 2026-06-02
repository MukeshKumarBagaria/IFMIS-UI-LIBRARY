import { forwardRef, useCallback, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * Toggle — an accessible, labelled on/off switch rendered as a tinted pill.
 *
 * The whole pill is the control: clicking anywhere (or pressing Space/Enter
 * with it focused) flips the switch. State drives three things in lock-step,
 * straight from the IFMIS Figma spec:
 *
 *   - the pill surface — on → Purple-50 (#F3ECFA), off → Surface/Grey-bg
 *     (#F7F7F7);
 *   - the switch track — on → Purple-600, off → Grey-300;
 *   - the label colour — on → Header text, off → secondary/muted body text.
 *
 * It follows the ARIA *switch* pattern (`role="switch"` + `aria-checked`) and
 * works **controlled** (`checked` + `onCheckedChange`) or **uncontrolled**
 * (`defaultChecked`), mirroring the rest of the library (see `Accordion`).
 * ========================================================================= */

/* -------------------------------------------------------------------------- */
/* Pill surface                                                               */
/* -------------------------------------------------------------------------- */

export const toggleVariants = cva(
  [
    "group inline-flex select-none items-center rounded-2xl",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-60",
  ].join(" "),
  {
    variants: {
      /** Drives the pill surface + (via descendants) the track and label. */
      state: {
        on: "bg-purple-50",
        off: "bg-surface-grey-bg",
      },
      size: {
        sm: "gap-1.5 px-2.5 py-1.5",
        md: "gap-1.5 px-3 py-2",
      },
    },
    defaultVariants: { state: "off", size: "md" },
  },
);

/* -------------------------------------------------------------------------- */
/* Track + thumb                                                              */
/* -------------------------------------------------------------------------- */

const trackVariants = cva(
  "relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors",
  {
    variants: {
      state: { on: "bg-purple-600", off: "bg-grey-300" },
      size: { sm: "h-[18px] w-[30px]", md: "h-5 w-9" },
    },
    defaultVariants: { state: "off", size: "md" },
  },
);

const thumbVariants = cva(
  [
    "pointer-events-none block rounded-full bg-white shadow-sm ring-1 ring-black/5",
    "transition-transform duration-200 ease-out",
  ].join(" "),
  {
    variants: {
      size: { sm: "size-3.5", md: "size-4" },
      state: { on: "", off: "" },
    },
    compoundVariants: [
      { state: "on", size: "sm", class: "translate-x-3" },
      { state: "on", size: "md", class: "translate-x-4" },
    ],
    defaultVariants: { size: "md", state: "off" },
  },
);

/* -------------------------------------------------------------------------- */
/* Label                                                                      */
/* -------------------------------------------------------------------------- */

const labelVariants = cva("font-medium leading-none", {
  variants: {
    state: { on: "text-heading", off: "text-body-secondary" },
    size: { sm: "text-body-xs", md: "text-body-sm" },
  },
  defaultVariants: { state: "off", size: "md" },
});

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

type ToggleSize = NonNullable<VariantProps<typeof toggleVariants>["size"]>;

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "type" | "value"> {
  /** Controlled on/off value. Pair with `onCheckedChange`. */
  checked?: boolean;
  /** Uncontrolled initial value. Defaults to `false`. */
  defaultChecked?: boolean;
  /** Fires with the next value whenever the switch flips. */
  onCheckedChange?: (checked: boolean) => void;
  /** Visual size of the switch + label. Defaults to `md`. */
  size?: ToggleSize;
  /** Label content. Omit for a bare switch (then pass `aria-label`). */
  children?: ReactNode;
  /** Where the label sits relative to the switch. Defaults to `end`. */
  labelPosition?: "start" | "end";
}

/**
 * `Toggle` — labelled on/off switch.
 *
 * @example Uncontrolled
 * ```jsx
 * <Toggle defaultChecked onCheckedChange={(v) => console.log(v)}>
 *   Email alerts
 * </Toggle>
 * ```
 *
 * @example Controlled
 * ```jsx
 * const [on, setOn] = useState(false);
 * <Toggle checked={on} onCheckedChange={setOn}>Auto-save</Toggle>
 * ```
 *
 * @example Bare switch (no visible label)
 * ```jsx
 * <Toggle aria-label="Dark mode" checked={dark} onCheckedChange={setDark} />
 * ```
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      size = "md",
      labelPosition = "end",
      disabled = false,
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isControlled = checked !== undefined;
    const [internal, setInternal] = useState(defaultChecked);
    const isOn = isControlled ? checked : internal;
    const state = isOn ? "on" : "off";

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const next = !isOn;
        if (!isControlled) setInternal(next);
        onCheckedChange?.(next);
      },
      [isControlled, isOn, onClick, onCheckedChange],
    );

    const label =
      children == null ? null : (
        <span className={cn(labelVariants({ state, size }))}>{children}</span>
      );

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={disabled}
        data-state={state}
        onClick={handleClick}
        className={cn(toggleVariants({ state, size }), className)}
        {...props}
      >
        {labelPosition === "start" && label}
        <span className={cn(trackVariants({ state, size }))}>
          <span className={cn(thumbVariants({ state, size }))} />
        </span>
        {labelPosition === "end" && label}
      </button>
    );
  },
);

Toggle.displayName = "Toggle";
