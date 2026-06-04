import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { RefObject } from "react";

export interface AnchorCoords {
  /** Viewport `top` for the floating element when placed **below** the anchor. */
  top: number;
  /**
   * Viewport `bottom` offset for the floating element when placed **above** the
   * anchor (i.e. `innerHeight - anchorTop + gap`). Use this with a
   * `position: fixed; bottom` style so the popover pins its bottom edge just
   * above the trigger — no height measurement needed.
   */
  bottom: number;
  /** Viewport `left`, aligned to the anchor's left edge. */
  left: number;
  /** The anchor's width, so the popover can match it. */
  width: number;
  /** Which side the popover should render on. `"bottom"` unless flipped. */
  placement: "bottom" | "top";
  /** Available vertical space (px) on the chosen side — cap the popover to it. */
  maxHeight: number;
}

export interface AnchoredPositionOptions {
  /** Vertical gap between the anchor and the popover (px). Default `8`. */
  gap?: number;
  /**
   * Flip the popover **above** the anchor when there isn't enough room below
   * it and there's more room above. Default `false` (always below).
   */
  flip?: boolean;
  /**
   * Preferred popover height (px) used to decide whether to flip. When the
   * space below is smaller than this and the space above is larger, the
   * popover flips up. Default `288` (matches `max-h-72`).
   */
  preferredHeight?: number;
}

/**
 * Computes `position: fixed` coordinates for a popover anchored to a trigger.
 *
 * Returns `null` while closed (so the caller renders nothing). While open, it
 * measures the anchor with `getBoundingClientRect()` and keeps the coordinates
 * in sync on scroll/resize — letting the popover live in a **portal** so it's
 * never clipped by an ancestor's `overflow` (a scroll container, a table, or
 * Storybook's docs preview).
 *
 * With `flip: true` it also reports a `placement` (`"bottom"` | `"top"`) and a
 * `maxHeight`, so a popover near the bottom of the viewport opens **upward**
 * instead of being clipped. `top` / `left` / `width` are always present, so
 * callers that only place below keep working unchanged.
 *
 * @param anchorRef ref to the trigger element
 * @param open      whether the popover is open
 * @param options   `{ gap, flip, preferredHeight }`
 */
export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  open: boolean,
  options: AnchoredPositionOptions = {},
): AnchorCoords | null {
  const { gap = 8, flip = false, preferredHeight = 288 } = options;
  const [coords, setCoords] = useState<AnchorCoords | null>(null);

  const update = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const spaceBelow = vh - r.bottom - gap;
    const spaceAbove = r.top - gap;

    const placement: "bottom" | "top" =
      flip && spaceBelow < preferredHeight && spaceAbove > spaceBelow
        ? "top"
        : "bottom";

    const maxHeight = Math.max(
      0,
      placement === "top" ? spaceAbove : spaceBelow,
    );

    setCoords({
      top: r.bottom + gap,
      bottom: vh - r.top + gap,
      left: r.left,
      width: r.width,
      placement,
      maxHeight,
    });
  }, [anchorRef, gap, flip, preferredHeight]);

  // Measure synchronously before paint so the popover never flashes unpositioned.
  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    update();
  }, [open, update]);

  // Track scroll (capture, to catch any scrollable ancestor) + resize.
  useEffect(() => {
    if (!open) return;
    const onChange = () => update();
    window.addEventListener("scroll", onChange, true);
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange, true);
      window.removeEventListener("resize", onChange);
    };
  }, [open, update]);

  return coords;
}
