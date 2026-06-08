import { forwardRef, useCallback, useState } from "react";
import type { HTMLAttributes } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import { paginationRange } from "./paginationRange";

/* ===========================================================================
 * Pagination — the IFMIS page navigator, straight from the Figma spec.
 *
 * A pill-shaped bar holding prev/next caret steppers around a row of page
 * numbers. State drives the look exactly per the design:
 *
 *   - the bar — Surface/Grey-bg fill, Surface/Borders-grey outline, fully
 *     rounded (24px), 8px padding.
 *   - the carets — round 32px chips, disabled (and non-interactive) at the
 *     first / last page.
 *   - the active page — a Purple-500 (#8B39C2) circle with white semibold
 *     text; the rest are plain secondary-grey labels that tint on hover.
 *
 * Long ranges collapse around the current page with ellipses
 * (`siblingCount` / `boundaryCount`, like the rest of the ecosystem).
 *
 * Works **controlled** (`page` + `onPageChange`) or **uncontrolled**
 * (`defaultPage`), mirroring the rest of the library (see `Toggle`).
 * ========================================================================= */

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Total number of pages. */
  count: number;
  /** Controlled current page (1-based). Pair with `onPageChange`. */
  page?: number;
  /** Uncontrolled initial page (1-based). Defaults to `1`. */
  defaultPage?: number;
  /** Fires with the next page (1-based) whenever it changes. */
  onPageChange?: (page: number) => void;
  /** Pages shown on each side of the current page. Defaults to `1`. */
  siblingCount?: number;
  /** Pages always shown at the very start/end. Defaults to `1`. */
  boundaryCount?: number;
  /** Hide the prev/next caret buttons. Defaults to `false`. */
  hideControls?: boolean;
  /** Disable the whole pager. */
  disabled?: boolean;
  /** Accessible name for the navigation landmark. Defaults to `"Pagination"`. */
  "aria-label"?: string;
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/** Round 32px caret chip — used for both prev and next. */
function CaretButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? CaretLeft : CaretRight;
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous page" : "Next page"}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full",
        "border border-surface-border-grey bg-surface-grey-bg transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        disabled
          ? "cursor-not-allowed text-body-disabled"
          : "text-body-secondary hover:bg-neutral-100",
      )}
    >
      <Icon weight="bold" className="size-6" aria-hidden="true" />
    </button>
  );
}

/**
 * `Pagination` — page navigator with caret steppers and ellipsis truncation.
 *
 * @example Uncontrolled
 * ```jsx
 * <Pagination count={10} defaultPage={1} onPageChange={(p) => console.log(p)} />
 * ```
 *
 * @example Controlled
 * ```jsx
 * const [page, setPage] = useState(1);
 * <Pagination count={42} page={page} onPageChange={setPage} />
 * ```
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      count,
      page,
      defaultPage = 1,
      onPageChange,
      siblingCount = 1,
      boundaryCount = 1,
      hideControls = false,
      disabled = false,
      className,
      "aria-label": ariaLabel = "Pagination",
      ...props
    },
    ref,
  ) => {
    const isControlled = page !== undefined;
    const [internal, setInternal] = useState(() =>
      clamp(defaultPage, 1, Math.max(count, 1)),
    );
    const current = clamp(isControlled ? page : internal, 1, Math.max(count, 1));

    const goTo = useCallback(
      (next: number) => {
        const clamped = clamp(next, 1, Math.max(count, 1));
        if (clamped === current) return;
        if (!isControlled) setInternal(clamped);
        onPageChange?.(clamped);
      },
      [count, current, isControlled, onPageChange],
    );

    const items = paginationRange({ count, page: current, siblingCount, boundaryCount });
    const atStart = disabled || current <= 1;
    const atEnd = disabled || current >= count;

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center justify-center gap-6 rounded-3xl p-2",
          "border border-surface-border-grey bg-surface-grey-bg",
          disabled && "opacity-60",
          className,
        )}
        {...props}
      >
        {!hideControls && (
          <CaretButton
            direction="prev"
            disabled={atStart}
            onClick={() => goTo(current - 1)}
          />
        )}

        <ul className="flex list-none items-center gap-4">
          {items.map((item, index) => {
            if (item === "start-ellipsis" || item === "end-ellipsis") {
              return (
                <li
                  key={`${item}-${index}`}
                  aria-hidden="true"
                  className="flex size-8 select-none items-center justify-center text-body-sm text-body-secondary"
                >
                  …
                </li>
              );
            }
            const isActive = item === current;
            return (
              <li key={item}>
                <button
                  type="button"
                  aria-label={`Go to page ${item}`}
                  aria-current={isActive ? "page" : undefined}
                  disabled={disabled}
                  onClick={() => goTo(item)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full px-3 text-body-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    disabled && "cursor-not-allowed",
                    isActive
                      ? "bg-purple-500 font-semibold text-white"
                      : "font-normal text-body-secondary hover:bg-neutral-100",
                  )}
                >
                  {item}
                </button>
              </li>
            );
          })}
        </ul>

        {!hideControls && (
          <CaretButton
            direction="next"
            disabled={atEnd}
            onClick={() => goTo(current + 1)}
          />
        )}
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";
