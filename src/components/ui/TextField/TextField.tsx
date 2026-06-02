import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { FormField, fieldStateClasses, type FieldState } from "../FormField";

/* ===========================================================================
 * TextField — the IFMIS labelled text input.
 *
 * Composes `FormField` (label + subtext + ARIA) with a bordered control box
 * that holds an optional leading icon, the `<input>`, and optional trailing
 * content (e.g. a boxed calendar/caret affix via `FieldIconBox`).
 *
 * States map 1:1 to the Figma spec and are driven by props, never hand-styled:
 *   default · hover (neutral-100) · active/focus (1.5px purple-500) ·
 *   disabled (grey-200 / grey-bg) · fetched (neutral-200, read-only value).
 * Passing `error` reddens the border and shows the red subtext banner.
 *
 * Works controlled or uncontrolled — it's a thin layer over a native input,
 * so `value`, `onChange`, `name`, `type`, `placeholder`, etc. flow through.
 * ========================================================================= */

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Field label. */
  label?: ReactNode;
  /** Icon before the label (20px). */
  labelIcon?: ReactNode;
  /** Append a required asterisk. */
  required?: boolean;
  /** Error message — reddens the field and shows the red subtext banner. */
  error?: ReactNode;
  /** Neutral helper text (hidden when `error` is set). */
  helperText?: ReactNode;
  /**
   * Visual state. `default` (the norm), or `fetched` for a read-only value
   * pulled from a backend. `error`/`disabled` are inferred from the `error`
   * prop and the native `disabled` attribute, but can be forced here.
   */
  state?: FieldState;
  /** Inline leading icon inside the box (auto-sized to 20px, muted). */
  startIcon?: ReactNode;
  /** Trailing content inside the box (e.g. `<FieldIconBox>`, a clear button). */
  endContent?: ReactNode;
  /** Classes for the bordered box. */
  boxClassName?: string;
  /** Classes for the `<input>` itself. */
  inputClassName?: string;
  /** Classes for the outer FormField wrapper. */
  className?: string;
}

/**
 * `TextField` — labelled text input with states + affixes.
 *
 * @example
 * ```jsx
 * <TextField label="Full name" labelIcon={<User />} placeholder="Enter name" required />
 *
 * <TextField label="Email" error="Enter a valid email" defaultValue="bad" />
 *
 * <TextField
 *   label="Date of birth"
 *   placeholder="DD/MM/YYYY"
 *   endContent={<FieldIconBox><CalendarDots /><CaretDown /></FieldIconBox>}
 * />
 *
 * <TextField label="GRN (auto-filled)" state="fetched" value="GRN-2026-0042" readOnly />
 * ```
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      labelIcon,
      required,
      error,
      helperText,
      state,
      startIcon,
      endContent,
      boxClassName,
      inputClassName,
      className,
      disabled,
      ...inputProps
    },
    ref,
  ) => {
    // Resolve the visual state: error wins, then disabled, then explicit/default.
    const resolvedState: FieldState =
      error != null && error !== false
        ? "error"
        : disabled
          ? "disabled"
          : (state ?? "default");
    const isDisabled = disabled || resolvedState === "disabled";

    return (
      <FormField
        label={label}
        labelIcon={labelIcon}
        required={required}
        error={error}
        helperText={helperText}
        className={className}
      >
        {({ id, describedBy, invalid }) => (
          <div
            className={cn(
              "flex h-11 w-full items-center gap-2 rounded-2xl border px-3 transition-colors",
              fieldStateClasses[resolvedState],
              boxClassName,
            )}
          >
            {startIcon != null && (
              <span className="flex shrink-0 items-center text-body-secondary [&_svg]:size-5 [&_svg]:shrink-0">
                {startIcon}
              </span>
            )}
            <input
              ref={ref}
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              aria-required={required || undefined}
              disabled={isDisabled}
              className={cn(
                "min-w-0 flex-1 bg-transparent text-body-sm font-medium text-body-primary outline-none",
                "placeholder:font-medium placeholder:text-body-secondary",
                "disabled:cursor-not-allowed",
                inputClassName,
              )}
              {...inputProps}
            />
            {endContent}
          </div>
        )}
      </FormField>
    );
  },
);

TextField.displayName = "TextField";
