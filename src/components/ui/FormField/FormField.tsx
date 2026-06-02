import { forwardRef, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Info } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * FormField — the shared shell for every IFMIS form control: an optional
 * label (with icon + required marker), a control slot, and an optional
 * subtext (a neutral helper line, or a red error banner with an info icon).
 *
 * It owns the id + ARIA wiring: pass a render function as `children` and it
 * hands you the `id` to put on your control and the `describedBy` id of the
 * subtext, plus an `invalid` flag — so labels, errors and the control are
 * correctly associated for assistive tech.
 *
 * `TextField` and `Textarea` are built on this; use `FormField` directly to
 * wrap any custom control (a `Select`, a date picker, …) with consistent
 * label/error chrome.
 * ========================================================================= */

/* -------------------------------------------------------------------------- */
/* Shared field-control state styling (consumed by TextField / Textarea / …)  */
/* -------------------------------------------------------------------------- */

export type FieldState = "default" | "error" | "disabled" | "fetched";

/**
 * Border + background per state, including hover and focus-within treatments.
 * Apply to the control's bordered box; map 1:1 to the Figma input states:
 *   default  → grey border, white; hover neutral-100; focus 1.5px purple.
 *   error    → red-600 border.
 *   disabled → grey-200 border, grey-bg.
 *   fetched  → grey border, neutral-200 fill (read-only fetched value).
 */
export const fieldStateClasses: Record<FieldState, string> = {
  default: cn(
    "border-surface-border-grey bg-surface-card",
    "hover:bg-neutral-100",
    "focus-within:border-purple-500 focus-within:bg-surface-card",
    "focus-within:ring-1 focus-within:ring-purple-500",
  ),
  error: cn(
    "border-red-600 bg-surface-card",
    "focus-within:ring-1 focus-within:ring-red-600",
  ),
  disabled: "cursor-not-allowed border-grey-200 bg-surface-grey-bg",
  fetched: cn(
    "border-surface-border-grey bg-neutral-200",
    "focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500",
  ),
};

/* -------------------------------------------------------------------------- */
/* Boxed trailing affix — the grey "calendar / caret" container from Figma.   */
/* -------------------------------------------------------------------------- */

export type FieldIconBoxProps = HTMLAttributes<HTMLSpanElement>;

/**
 * The small boxed affix shown at the end of a field (e.g. a date field's
 * calendar + caret). Auto-sizes any icons inside to 16px and tints them.
 *
 * @example
 *   <TextField endContent={<FieldIconBox><CalendarDots /><CaretDown /></FieldIconBox>} />
 */
export const FieldIconBox = forwardRef<HTMLSpanElement, FieldIconBoxProps>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-lg border border-grey-200 bg-surface-grey-bg px-1.5 py-1",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-body-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  ),
);
FieldIconBox.displayName = "FieldIconBox";

/* -------------------------------------------------------------------------- */
/* FormField                                                                  */
/* -------------------------------------------------------------------------- */

export interface FormFieldRenderProps {
  /** id to place on the control; ties it to the label. */
  id: string;
  /** id of the subtext, for the control's `aria-describedby` (when present). */
  describedBy?: string;
  /** `true` when an `error` is set — wire to the control's `aria-invalid`. */
  invalid: boolean;
}

export interface FormFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Field label. */
  label?: ReactNode;
  /** Icon shown before the label (auto-sized to 20px). */
  labelIcon?: ReactNode;
  /** Appends a red asterisk and sets `aria-required` semantics on the control. */
  required?: boolean;
  /** Error subtext — renders the red banner and flips the control to invalid. */
  error?: ReactNode;
  /** Neutral helper subtext (shown only when there's no `error`). */
  helperText?: ReactNode;
  /** Explicit control id (otherwise auto-generated). */
  htmlFor?: string;
  /** The control. Either a node, or a render function receiving ARIA wiring. */
  children: ReactNode | ((field: FormFieldRenderProps) => ReactNode);
}

/**
 * `FormField` — label + control + subtext shell.
 *
 * @example With a custom control
 * ```jsx
 * <FormField label="Country" required error={err}>
 *   {({ id, describedBy, invalid }) => (
 *     <MySelect id={id} aria-describedby={describedBy} aria-invalid={invalid} />
 *   )}
 * </FormField>
 * ```
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { label, labelIcon, required, error, helperText, htmlFor, className, children, ...props },
    ref,
  ) => {
    const autoId = useId();
    const fieldId = htmlFor ?? autoId;
    const subtextId = useId();
    const hasError = error != null && error !== false;
    const hasHelper = !hasError && helperText != null && helperText !== false;
    const describedBy = hasError || hasHelper ? subtextId : undefined;

    const control =
      typeof children === "function"
        ? children({ id: fieldId, describedBy, invalid: hasError })
        : children;

    return (
      <div ref={ref} className={cn("flex w-full flex-col gap-3", className)} {...props}>
        {label != null && (
          <label
            htmlFor={fieldId}
            className="flex w-fit items-center gap-1.5 text-body-sm font-medium text-body-secondary [&_svg]:size-5 [&_svg]:shrink-0"
          >
            {labelIcon}
            <span>{label}</span>
            {required && (
              <span className="text-destructive" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="flex w-full flex-col gap-2">
          {control}

          {hasError ? (
            <div
              id={subtextId}
              role="alert"
              className="flex items-center gap-1.5 rounded-2xl bg-red-50 px-3 py-1 text-body-xs text-red-800"
            >
              <Info weight="fill" className="size-5 shrink-0 text-red-600" aria-hidden="true" />
              <span>{error}</span>
            </div>
          ) : hasHelper ? (
            <p id={subtextId} className="px-3 text-body-xs text-body-secondary">
              {helperText}
            </p>
          ) : null}
        </div>
      </div>
    );
  },
);

FormField.displayName = "FormField";
