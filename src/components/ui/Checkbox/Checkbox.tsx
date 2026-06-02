import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Check, Minus } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * Checkbox — an icon + label form control, straight from the IFMIS Figma spec.
 *
 * Three visual states (× checked / unchecked / indeterminate):
 *   - default    → rounded square outlined in Header colour, label in Header.
 *   - checked    → Purple-500 filled square + white tick, label in Header.
 *   - disabled   → square + label both in Text/Body/Disabled (#CCC), no input.
 *
 * Built on a real, visually-hidden `<input type="checkbox">` so it participates
 * in forms, keyboard and assistive tech for free; the coloured box is purely
 * presentational (`aria-hidden`) and driven by the input. Works **controlled**
 * (`checked` + `onCheckedChange`) or **uncontrolled** (`defaultChecked`), and
 * supports the `indeterminate` ("some selected") state.
 * ========================================================================= */

/* -------------------------------------------------------------------------- */
/* The coloured box                                                           */
/* -------------------------------------------------------------------------- */

const boxVariants = cva(
  [
    "grid shrink-0 place-items-center border-2 transition-colors",
    // Focus ring is driven by the sibling input (see `peer` on the input).
    "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-5 rounded",
        md: "size-6 rounded-md",
        lg: "size-7 rounded-lg",
      },
      tone: {
        /** Unchecked + enabled. */
        idle: "border-heading bg-transparent text-transparent peer-hover:border-purple-500",
        /** Checked or indeterminate + enabled. */
        active: "border-purple-500 bg-purple-500 text-white",
        /** Any state, disabled. */
        disabled: "border-body-disabled bg-transparent text-transparent",
        /** Checked/indeterminate + disabled. */
        disabledActive: "border-body-disabled bg-body-disabled text-white",
      },
    },
    defaultVariants: { size: "md", tone: "idle" },
  },
);

const glyphVariants = cva("", {
  variants: {
    size: { sm: "size-3", md: "size-4", lg: "size-5" },
  },
  defaultVariants: { size: "md" },
});

const labelVariants = cva("font-normal", {
  variants: {
    size: {
      sm: "text-body-xs",
      md: "text-body-sm",
      lg: "text-body-md",
    },
    disabled: {
      true: "text-body-disabled",
      false: "text-heading",
    },
  },
  defaultVariants: { size: "md", disabled: false },
});

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

type CheckboxSize = NonNullable<VariantProps<typeof boxVariants>["size"]>;

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "checked" | "defaultChecked"
  > {
  /** Controlled checked value. Pair with `onCheckedChange`. */
  checked?: boolean;
  /** Uncontrolled initial value. Defaults to `false`. */
  defaultChecked?: boolean;
  /** Fires with the next value whenever the box flips. */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * "Some, but not all" — renders a dash and sets the native
   * `indeterminate` flag. Visually takes precedence over `checked`.
   */
  indeterminate?: boolean;
  /** Visual size. Defaults to `md` (24px box, the Figma frame size). */
  size?: CheckboxSize;
  /** Label content. Omit for a bare box (then pass `aria-label`). */
  children?: ReactNode;
  /** Extra classes for the outer `<label>` wrapper. */
  className?: string;
  /** Extra classes for the coloured box. */
  boxClassName?: string;
}

/**
 * `Checkbox` — icon + label form control.
 *
 * @example Uncontrolled
 * ```jsx
 * <Checkbox defaultChecked onCheckedChange={(v) => console.log(v)}>
 *   I accept the terms
 * </Checkbox>
 * ```
 *
 * @example Controlled
 * ```jsx
 * const [on, setOn] = useState(false);
 * <Checkbox checked={on} onCheckedChange={setOn}>Subscribe</Checkbox>
 * ```
 *
 * @example Indeterminate "select all"
 * ```jsx
 * <Checkbox
 *   checked={allChecked}
 *   indeterminate={someChecked && !allChecked}
 *   onCheckedChange={toggleAll}
 * >
 *   Select all
 * </Checkbox>
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      indeterminate = false,
      size = "md",
      disabled = false,
      id,
      className,
      boxClassName,
      children,
      onChange,
      ...props
    },
    ref,
  ) => {
    const isControlled = checked !== undefined;
    const [internal, setInternal] = useState(defaultChecked);
    const isChecked = isControlled ? checked : internal;

    const generatedId = useId();
    const inputId = id ?? generatedId;

    // Keep our own ref so we can drive the native `indeterminate` flag, while
    // still honouring a forwarded ref.
    const innerRef = useRef<HTMLInputElement | null>(null);
    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      const next = event.target.checked;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    };

    // Resolve the box look from (checked|indeterminate) × disabled.
    const showActive = isChecked || indeterminate;
    const tone = disabled
      ? showActive
        ? "disabledActive"
        : "disabled"
      : showActive
        ? "active"
        : "idle";

    const glyph = indeterminate ? (
      <Minus weight="bold" className={cn(glyphVariants({ size }))} aria-hidden="true" />
    ) : isChecked ? (
      <Check weight="bold" className={cn(glyphVariants({ size }))} aria-hidden="true" />
    ) : null;

    return (
      <label
        htmlFor={inputId}
        data-state={indeterminate ? "indeterminate" : isChecked ? "checked" : "unchecked"}
        className={cn(
          "inline-flex items-center gap-3",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className,
        )}
      >
        <input
          ref={setRefs}
          id={inputId}
          type="checkbox"
          className="peer sr-only"
          checked={isChecked}
          disabled={disabled}
          aria-checked={indeterminate ? "mixed" : isChecked}
          onChange={handleChange}
          {...props}
        />
        <span aria-hidden="true" className={cn(boxVariants({ size, tone }), boxClassName)}>
          {glyph}
        </span>
        {children != null && (
          <span className={cn(labelVariants({ size, disabled }))}>{children}</span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
