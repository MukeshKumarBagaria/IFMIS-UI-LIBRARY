import { useRef, useState } from "react";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * OtpInput — an accessible row of single-digit boxes for OTP / PIN / code
 * entry (the "last 4 digits", "6-digit OTP", etc.).
 *
 * Sequential model (the standard OTP UX): digits fill left-to-right with no
 * gaps, so the value is always a clean prefix string. Typing advances focus,
 * Backspace removes the last digit and steps back, arrows move, and paste
 * distributes digits across the boxes. Only digits are accepted.
 *
 * Works **controlled** (`value` + `onChange`) or **uncontrolled**
 * (`defaultValue`), and fires `onComplete` once all boxes are filled.
 * ========================================================================= */

export type OtpInputState = "default" | "error" | "success";

const BOX_STATE: Record<OtpInputState, string> = {
  default: "border-surface-border-grey",
  error: "border-red-600",
  success: "border-green-600",
};

export interface OtpInputProps {
  /** Number of digit boxes. Defaults to `6`. */
  length?: number;
  /** Controlled value. Pair with `onChange`. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Fires with the next digit string on every change. */
  onChange?: (next: string) => void;
  /** Fires once, when the last empty box is filled. */
  onComplete?: (value: string) => void;
  /** Visual state. Defaults to `default`. */
  state?: OtpInputState;
  /** Disable all boxes. */
  disabled?: boolean;
  /** Focus the first box on mount. */
  autoFocus?: boolean;
  /** Accessible group name. Defaults to `"Verification code"`. */
  "aria-label"?: string;
  /** id applied to the first box (so an external `<label htmlFor>` can target it). */
  id?: string;
  /** Extra classes on the group wrapper. */
  className?: string;
}

export function OtpInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  state = "default",
  disabled = false,
  autoFocus = false,
  id,
  className,
  "aria-label": ariaLabel = "Verification code",
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(() =>
    defaultValue.replace(/\D/g, "").slice(0, length),
  );
  const digits = (isControlled ? value : internal)
    .replace(/\D/g, "")
    .slice(0, length);

  // Latest value, synced synchronously so rapid multi-key entry and the
  // focus-advance don't race a not-yet-flushed render (stale-closure fix).
  const valueRef = useRef(digits);
  valueRef.current = digits;

  const activeIndex = () => Math.min(valueRef.current.length, length - 1);

  const focusIndex = (i: number) => {
    const clamped = Math.max(0, Math.min(i, length - 1));
    const el = refs.current[clamped];
    el?.focus();
    el?.select();
  };

  const setValue = (next: string) => {
    const cleaned = next.replace(/\D/g, "").slice(0, length);
    const prev = valueRef.current;
    valueRef.current = cleaned;
    if (!isControlled) setInternal(cleaned);
    onChange?.(cleaned);
    if (cleaned.length === length && prev.length < length) onComplete?.(cleaned);
    return cleaned;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typed = e.target.value.replace(/\D/g, "");
    if (!typed) return; // deletions are handled in keydown
    const next = setValue(valueRef.current + typed);
    focusIndex(next.length);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Backspace": {
        e.preventDefault();
        if (valueRef.current.length === 0) return;
        const next = setValue(valueRef.current.slice(0, -1));
        focusIndex(next.length);
        break;
      }
      case "ArrowLeft":
        e.preventDefault();
        focusIndex(i - 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        focusIndex(i + 1);
        break;
      default:
        break;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const next = setValue(valueRef.current + pasted);
    focusIndex(next.length);
  };

  // Keep the caret on the first empty box so sequential entry stays intuitive.
  const handleFocus = (i: number) => {
    const active = activeIndex();
    if (i !== active) focusIndex(active);
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap items-center gap-3 sm:gap-6", className)}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          id={i === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && i === 0}
          maxLength={1}
          disabled={disabled}
          value={digits[i] ?? ""}
          placeholder="-"
          aria-label={`${ariaLabel}, digit ${i + 1} of ${length}`}
          onChange={handleChange}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(i)}
          className={cn(
            "size-11 shrink-0 rounded-xl border bg-surface-card text-center",
            "text-h4 font-semibold text-body-secondary placeholder:text-body-secondary",
            "outline-none transition-colors",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-60",
            BOX_STATE[state],
          )}
        />
      ))}
    </div>
  );
}
