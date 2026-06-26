import { forwardRef, useId, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Check } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * CheckboxCard — a card-shaped selectable checkbox with a title + subtext.
 *
 * Three visual treatments straight from the IFMIS Figma spec:
 *
 *   - **unchecked**   → Surface/Grey-bg with a grey border; dark indicator
 *                       circle with a white check; heading-coloured title and
 *                       muted body subtext.
 *   - **checked**     → 105° purple gradient (#48146C → #A461D1) with a white
 *                       border; white indicator with a dark check; white title
 *                       and subtext.
 *   - **checked + hover** → the gradient deepens (#3A1056 → #8D3AC5).
 *
 * The two gradients live in theme files as `--gradient-card-checked[-hover]`,
 * so a non-purple theme can repaint them in one place.
 *
 * Built on a real, visually-hidden `<input type="checkbox">` so it works in
 * forms, with the keyboard and assistive tech for free; the card is purely
 * presentational (`aria-hidden` on the indicator) and driven by the input.
 * Works **controlled** (`checked` + `onCheckedChange`) or **uncontrolled**
 * (`defaultChecked`).
 * ========================================================================= */

/* -------------------------------------------------------------------------- */
/* Card surface                                                               */
/* -------------------------------------------------------------------------- */

export const checkboxCardVariants = cva(
  [
    "inline-flex h-15 select-none items-center justify-center gap-1.5 rounded-2xl border px-2",
    "transition-colors",
    // Focus ring is driven by the sibling input — see `peer sr-only` on the
    // input. We expose it on the card so it traces the visible surface.
    "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      checked: {
        true: "border-surface-card bg-[image:var(--gradient-card-checked)]",
        false: "border-surface-border-grey bg-surface-grey-bg",
      },
      disabled: {
        true: "cursor-not-allowed opacity-60",
        false: "cursor-pointer",
      },
    },
    compoundVariants: [
      // Hover is only meaningful on a checked, enabled card — that's the only
      // state the Figma spec assigns a hover treatment to.
      {
        checked: true,
        disabled: false,
        class: "hover:bg-[image:var(--gradient-card-checked-hover)]",
      },
    ],
    defaultVariants: { checked: false, disabled: false },
  },
);

/* -------------------------------------------------------------------------- */
/* Indicator (the circular check at the start of the card)                    */
/* -------------------------------------------------------------------------- */

const indicatorVariants = cva(
  "grid size-6 shrink-0 place-items-center rounded-full transition-colors",
  {
    variants: {
      checked: {
        true: "bg-surface-card text-heading",
        false: "bg-heading text-white",
      },
    },
    defaultVariants: { checked: false },
  },
);

/* -------------------------------------------------------------------------- */
/* Title + description                                                        */
/* -------------------------------------------------------------------------- */

const titleVariants = cva("text-h5", {
  variants: {
    checked: { true: "text-white", false: "text-heading" },
  },
  defaultVariants: { checked: false },
});

const descriptionVariants = cva("text-body-xs font-normal", {
  variants: {
    checked: { true: "text-white", false: "text-body-secondary" },
  },
  defaultVariants: { checked: false },
});

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export interface CheckboxCardProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "checked" | "defaultChecked" | "title"
  > {
  /** Controlled checked value. Pair with `onCheckedChange`. */
  checked?: boolean;
  /** Uncontrolled initial value. Defaults to `false`. */
  defaultChecked?: boolean;
  /** Fires with the next value whenever the card toggles. */
  onCheckedChange?: (checked: boolean) => void;
  /** First line — 16px / 600 (Header-16). Required. */
  title: ReactNode;
  /** Optional second line — 14px / 400 (Body Regular-14). */
  description?: ReactNode;
  /** Extra classes merged onto the visible card surface. */
  className?: string;
  /** Extra classes merged onto the circular indicator. */
  indicatorClassName?: string;
}

/**
 * `CheckboxCard` — selectable card with a title and an optional subtext.
 *
 * @example Uncontrolled
 * ```jsx
 * <CheckboxCard
 *   defaultChecked
 *   title="Premium plan"
 *   description="14-day free trial, cancel anytime"
 *   onCheckedChange={(v) => console.log(v)}
 * />
 * ```
 *
 * @example Controlled (single-select from a list)
 * ```jsx
 * const [picked, setPicked] = useState("standard");
 *
 * {plans.map((p) => (
 *   <CheckboxCard
 *     key={p.id}
 *     title={p.name}
 *     description={p.tagline}
 *     checked={picked === p.id}
 *     onCheckedChange={(on) => on && setPicked(p.id)}
 *   />
 * ))}
 * ```
 */
export const CheckboxCard = forwardRef<HTMLInputElement, CheckboxCardProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      id,
      title,
      description,
      className,
      indicatorClassName,
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      const next = event.target.checked;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    };

    return (
      <label
        htmlFor={inputId}
        data-state={isChecked ? "checked" : "unchecked"}
        className="inline-flex"
      >
        {/* Visually hidden like `sr-only`, but `relative` — see Checkbox.tsx. */}
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="peer relative h-px w-px -m-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />
        <span
          className={cn(
            checkboxCardVariants({ checked: isChecked, disabled }),
            className,
          )}
        >
          <span
            aria-hidden="true"
            className={cn(indicatorVariants({ checked: isChecked }), indicatorClassName)}
          >
            <Check weight="bold" className="size-3.5" />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className={cn(titleVariants({ checked: isChecked }))}>{title}</span>
            {description != null && (
              <span className={cn(descriptionVariants({ checked: isChecked }))}>
                {description}
              </span>
            )}
          </span>
        </span>
      </label>
    );
  },
);

CheckboxCard.displayName = "CheckboxCard";
