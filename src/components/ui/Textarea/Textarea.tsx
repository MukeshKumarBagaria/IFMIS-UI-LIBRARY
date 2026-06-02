import { forwardRef, useState } from "react";
import type { TextareaHTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { FormField, fieldStateClasses, type FieldState } from "../FormField";

/* ===========================================================================
 * Textarea — the multi-line counterpart to `TextField`.
 *
 * Same `FormField` shell and state styling; the control is a `<textarea>` that
 * grows vertically (`resize-y`) with a sensible min-height. Optionally shows a
 * live character counter when `maxLength` (or `showCount`) is set.
 * ========================================================================= */

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  /** Visual state. `error`/`disabled` are inferred but can be forced. */
  state?: FieldState;
  /** Number of visible text rows. Defaults to `4`. */
  rows?: number;
  /** Show a character counter (auto-on when `maxLength` is set). */
  showCount?: boolean;
  /** Classes for the bordered box. */
  boxClassName?: string;
  /** Classes for the `<textarea>` itself. */
  textareaClassName?: string;
  /** Classes for the outer FormField wrapper. */
  className?: string;
}

/**
 * `Textarea` — labelled multi-line text input.
 *
 * @example
 * ```jsx
 * <Textarea label="Remarks" placeholder="Add a note…" rows={5} />
 * <Textarea label="Reason" maxLength={250} showCount required />
 * <Textarea label="Comment" error="This field is required" />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      labelIcon,
      required,
      error,
      helperText,
      state,
      rows = 4,
      showCount,
      boxClassName,
      textareaClassName,
      className,
      disabled,
      maxLength,
      value,
      defaultValue,
      onChange,
      ...textareaProps
    },
    ref,
  ) => {
    const resolvedState: FieldState =
      error != null && error !== false
        ? "error"
        : disabled
          ? "disabled"
          : (state ?? "default");
    const isDisabled = disabled || resolvedState === "disabled";

    const counterOn = showCount ?? maxLength != null;
    // Track length live: controlled reads from `value`, uncontrolled from
    // internal state seeded by `defaultValue`.
    const [internalCount, setInternalCount] = useState(
      typeof defaultValue === "string" ? defaultValue.length : 0,
    );
    const currentLength =
      typeof value === "string" ? value.length : internalCount;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) setInternalCount(e.target.value.length);
      onChange?.(e);
    };

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
              "flex w-full flex-col gap-1 rounded-2xl border px-3 py-2 transition-colors",
              fieldStateClasses[resolvedState],
              boxClassName,
            )}
          >
            <textarea
              ref={ref}
              id={id}
              rows={rows}
              maxLength={maxLength}
              value={value}
              defaultValue={defaultValue}
              onChange={handleChange}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              aria-required={required || undefined}
              disabled={isDisabled}
              className={cn(
                "w-full resize-y bg-transparent text-body-sm font-medium text-body-primary outline-none",
                "placeholder:font-medium placeholder:text-body-secondary",
                "disabled:cursor-not-allowed",
                textareaClassName,
              )}
              {...textareaProps}
            />
            {counterOn && (
              <span className="self-end text-body-xs text-body-secondary tabular-nums">
                {currentLength}
                {maxLength != null && `/${maxLength}`}
              </span>
            )}
          </div>
        )}
      </FormField>
    );
  },
);

Textarea.displayName = "Textarea";
