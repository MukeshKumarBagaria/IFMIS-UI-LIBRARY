import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { RefObject } from "react";

export interface AnchorCoords {
  /** Viewport `top` for the floating element (just below the anchor). */
  top: number;
  /** Viewport `left`, aligned to the anchor's left edge. */
  left: number;
  /** The anchor's width, so the popover can match it. */
  width: number;
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
 * @param anchorRef ref to the trigger element
 * @param open      whether the popover is open
 * @param gap       vertical gap between the anchor and the popover (px, default 8)
 */
export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  open: boolean,
  gap = 8,
): AnchorCoords | null {
  const [coords, setCoords] = useState<AnchorCoords | null>(null);

  const update = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCoords({ top: r.bottom + gap, left: r.left, width: r.width });
  }, [anchorRef, gap]);

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
