import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { HTMLAttributes, PointerEvent as ReactPointerEvent } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * Scrollbar — a horizontal, draggable scroll control (caret + track + thumb).
 *
 * Built straight from the IFMIS Figma spec. Three pieces, all driven by the
 * current value:
 *
 *   - the caret buttons — a round 32px pill on each end. The end you can still
 *     move toward stays *active* (white surface, dark caret); the end you've
 *     bottomed out against goes *disabled* (Grey-200 surface, muted caret).
 *   - the track — a Grey-300 rounded bar with evenly-spaced ruler ticks.
 *   - the thumb — a white rounded pill (Surface/Borders-grey outline) that you
 *     drag, or nudge with the carets / arrow keys.
 *
 * It follows the ARIA *slider* pattern (`role="slider"` + `aria-valuenow`) and
 * works **controlled** (`value` + `onValueChange`) or **uncontrolled**
 * (`defaultValue`), mirroring the rest of the library (see `Toggle`).
 * ========================================================================= */

/** Clamp `n` into the inclusive `[min, max]` range. */
function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export interface ScrollbarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Controlled position. Pair with `onValueChange`. */
  value?: number;
  /** Uncontrolled initial position. Defaults to `min`. */
  defaultValue?: number;
  /** Fires with the next position whenever the thumb moves. */
  onValueChange?: (value: number) => void;
  /** Lower bound of the range. Defaults to `0`. */
  min?: number;
  /** Upper bound of the range. Defaults to `100`. */
  max?: number;
  /** Amount a caret click / arrow key moves the thumb. Defaults to `10`. */
  step?: number;
  /** Width of the draggable thumb in pixels. Defaults to `64`. */
  thumbWidth?: number;
  /** Render ruler tick marks on the track. Defaults to `true`. */
  showTicks?: boolean;
  /** Fully disables the control (both carets + dragging). */
  disabled?: boolean;
  /** Accessible name for the slider. */
  "aria-label"?: string;
}

const caretButtonClasses = (active: boolean) =>
  cn(
    "flex size-8 shrink-0 items-center justify-center rounded-full p-1.5",
    "shadow-[0_1px_2px_0_rgba(20,49,107,0.5)] transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed",
    active
      ? "bg-white text-grey-900 hover:bg-grey-50"
      : "bg-grey-200 text-grey-400",
  );

/**
 * `Scrollbar` — horizontal scroll control with caret steppers and a draggable
 * thumb.
 *
 * @example Uncontrolled
 * ```jsx
 * <Scrollbar defaultValue={0} onValueChange={(v) => console.log(v)} />
 * ```
 *
 * @example Controlled
 * ```jsx
 * const [pos, setPos] = useState(0);
 * <Scrollbar value={pos} onValueChange={setPos} max={500} step={25} />
 * ```
 */
export const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 10,
      thumbWidth = 64,
      showTicks = true,
      disabled = false,
      className,
      "aria-label": ariaLabel = "Scroll",
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState(() =>
      clamp(defaultValue ?? min, min, max),
    );
    const current = clamp(isControlled ? value : internal, min, max);

    const range = max - min || 1;
    const fraction = (current - min) / range;
    const atMin = current <= min;
    const atMax = current >= max;

    const trackRef = useRef<HTMLDivElement>(null);

    const commit = useCallback(
      (next: number) => {
        const clamped = clamp(next, min, max);
        if (clamped === current) return;
        if (!isControlled) setInternal(clamped);
        onValueChange?.(clamped);
      },
      [current, isControlled, max, min, onValueChange],
    );

    /* --- Dragging ------------------------------------------------------- */
    const dragging = useRef(false);

    const valueFromPointer = useCallback(
      (clientX: number) => {
        const track = trackRef.current;
        if (!track) return current;
        const rect = track.getBoundingClientRect();
        const travel = rect.width - thumbWidth;
        if (travel <= 0) return min;
        // Centre the thumb under the cursor, then map left-offset → value.
        const left = clamp(clientX - rect.left - thumbWidth / 2, 0, travel);
        return min + (left / travel) * range;
      },
      [current, min, range, thumbWidth],
    );

    const handlePointerDown = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragging.current = true;
        commit(valueFromPointer(event.clientX));
      },
      [commit, disabled, valueFromPointer],
    );

    const handlePointerMove = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        commit(valueFromPointer(event.clientX));
      },
      [commit, valueFromPointer],
    );

    const handlePointerUp = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        dragging.current = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      },
      [],
    );

    /* --- Keyboard ------------------------------------------------------- */
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        switch (event.key) {
          case "ArrowLeft":
          case "ArrowDown":
            event.preventDefault();
            commit(current - step);
            break;
          case "ArrowRight":
          case "ArrowUp":
            event.preventDefault();
            commit(current + step);
            break;
          case "Home":
            event.preventDefault();
            commit(min);
            break;
          case "End":
            event.preventDefault();
            commit(max);
            break;
        }
      },
      [commit, current, disabled, max, min, step],
    );

    // Guard against a value prop that drifts outside the range while controlled.
    useEffect(() => {
      if (!isControlled && internal !== clamp(internal, min, max)) {
        setInternal(clamp(internal, min, max));
      }
    }, [internal, isControlled, max, min]);

    const leftActive = !disabled && !atMin;
    const rightActive = !disabled && !atMax;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3",
          disabled && "opacity-60",
          className,
        )}
        {...props}
      >
        <button
          type="button"
          aria-label="Scroll left"
          disabled={!leftActive}
          onClick={() => commit(current - step)}
          className={caretButtonClasses(leftActive)}
        >
          <CaretLeft weight="bold" className="size-5" aria-hidden="true" />
        </button>

        <div
          ref={trackRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel}
          aria-orientation="horizontal"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={Math.round(current)}
          aria-disabled={disabled || undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          className={cn(
            "relative h-2 min-w-[200px] flex-1 rounded-full bg-grey-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            disabled ? "cursor-not-allowed" : "cursor-pointer touch-none",
          )}
        >
          {showTicks && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-3 top-1/2 h-1 -translate-y-1/2"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, var(--color-grey-500) 0 1px, transparent 1px 16px)",
              }}
            />
          )}
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-1/2 h-6 -translate-y-1/2 rounded-full",
              "border-[0.5px] border-surface-border-grey bg-white",
              "shadow-[0_0_2px_0_rgba(64,64,64,0.5)]",
              !disabled && "cursor-grab active:cursor-grabbing",
            )}
            style={{
              width: thumbWidth,
              left: `calc(${fraction} * (100% - ${thumbWidth}px))`,
            }}
          />
        </div>

        <button
          type="button"
          aria-label="Scroll right"
          disabled={!rightActive}
          onClick={() => commit(current + step)}
          className={caretButtonClasses(rightActive)}
        >
          <CaretRight weight="bold" className="size-5" aria-hidden="true" />
        </button>
      </div>
    );
  },
);

Scrollbar.displayName = "Scrollbar";
