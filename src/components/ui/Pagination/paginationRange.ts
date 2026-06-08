/* ===========================================================================
 * paginationRange — build the list of page items for a pager.
 *
 * Returns an ordered array of page numbers interleaved with ellipsis markers,
 * collapsing long ranges around the current page. Mirrors the well-known
 * MUI `usePagination` algorithm:
 *
 *   boundaryCount — how many pages to always show at each end (default 1).
 *   siblingCount  — how many pages to show on each side of the current page
 *                   (default 1).
 *
 * e.g. count=10, page=5 → [1, "ellipsis", 4, 5, 6, "ellipsis", 10]
 * ========================================================================= */

export type PaginationItem = number | "start-ellipsis" | "end-ellipsis";

/** Inclusive integer range `[start, end]`; empty when `end < start`. */
function range(start: number, end: number): number[] {
  const length = end - start + 1;
  return length > 0 ? Array.from({ length }, (_, i) => start + i) : [];
}

export function paginationRange({
  count,
  page,
  siblingCount = 1,
  boundaryCount = 1,
}: {
  count: number;
  page: number;
  siblingCount?: number;
  boundaryCount?: number;
}): PaginationItem[] {
  if (count <= 0) return [];

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count,
  );

  // First/last page index of the sibling window, clamped within the boundaries.
  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0]! - 2 : count - 1,
  );

  return [
    ...startPages,

    // Left gap: an ellipsis, or the single page that the gap would have hidden.
    ...(siblingsStart > boundaryCount + 2
      ? (["start-ellipsis"] as PaginationItem[])
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),

    ...range(siblingsStart, siblingsEnd),

    // Right gap: an ellipsis, or the single page that the gap would have hidden.
    ...(siblingsEnd < count - boundaryCount - 1
      ? (["end-ellipsis"] as PaginationItem[])
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),

    ...endPages,
  ];
}
