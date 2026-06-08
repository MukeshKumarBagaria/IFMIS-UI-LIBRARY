import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { ArrowsDownUp, CaretDown, CaretUp } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import { Scrollbar } from "../Scrollbar";

/* ===========================================================================
 * DataTable — the IFMIS financial data grid, built on a semantic <table>.
 *
 * A typed, feature-rich table sized for dense financial data, styled straight
 * from the Figma spec: Purple-50 (#F3ECFA) header cells outlined in
 * Surface/Borders-purple (#A58FBC) with Header-text (#4B3960) labels, white
 * body rows, a 12px rounded frame, and the library `Scrollbar` for horizontal
 * paging when the grid is wider than its container.
 *
 * It stays primitive — you bring `columns` + `data` (fully generic) — but
 * layers on the things a real financial grid needs:
 *
 *   - **Sorting** — per-column, controlled or uncontrolled, with a sensible
 *     numeric/locale-aware default comparator (override via `column.sortFn`).
 *   - **Alignment & formatting** — right-align money, custom `cell` renderers.
 *   - **Sticky header & sticky first column** — for tall, wide statements.
 *   - **Footer totals**, **row click**, **density**, **loading skeleton**,
 *     **empty state**, and a **toolbar** slot for the filter chips.
 *   - **Responsive** — the grid scrolls horizontally inside a rounded frame;
 *     opt into the synced `Scrollbar` with `showScrollbar`.
 *
 * Generic over the row type `T`, so cell values and accessors stay type-safe.
 * ========================================================================= */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type DataTableAlign = "left" | "center" | "right";
export type SortDirection = "asc" | "desc";

export interface DataTableSort {
  /** `id` of the sorted column. */
  columnId: string;
  direction: SortDirection;
}

export interface DataTableColumn<T> {
  /** Stable identifier — also the sort key and React key. */
  id: string;
  /** Header content. */
  header: ReactNode;
  /**
   * How to read this column's value from a row. A key of `T`, or a function.
   * Ignored when `cell` is provided for display, but still used for sorting.
   */
  accessor?: keyof T | ((row: T) => unknown);
  /** Custom cell renderer. Falls back to the resolved `accessor` value. */
  cell?: (row: T, rowIndex: number) => ReactNode;
  /** Text alignment for the header + body cells. Defaults to `"left"`. */
  align?: DataTableAlign;
  /** Fixed column width (number → px). */
  width?: number | string;
  /** Minimum column width (number → px). */
  minWidth?: number | string;
  /** Enable click-to-sort on this column. */
  sortable?: boolean;
  /**
   * Custom comparator for sorting (ascending order). Defaults to a
   * numeric/date/locale-aware compare on the resolved `accessor` value.
   */
  sortFn?: (a: T, b: T) => number;
  /** Footer cell content (renders a `<tfoot>` when any column sets it). */
  footer?: ReactNode;
  /** Pin this column to the left while scrolling horizontally. */
  sticky?: boolean;
  /** Allow the cell text to wrap (default: no wrap). */
  wrap?: boolean;
  /** Extra classes for this column's header cell. */
  headerClassName?: string;
  /** Extra classes for this column's body cells. */
  cellClassName?: string | ((row: T, rowIndex: number) => string);
}

export interface DataTableProps<T> {
  /** Column definitions, in display order. */
  columns: DataTableColumn<T>[];
  /** Row data. */
  data: T[];
  /** Stable row key. Defaults to the row index. */
  getRowId?: (row: T, index: number) => string | number;

  /** Controlled sort. Pass `null` for unsorted. Pair with `onSortChange`. */
  sort?: DataTableSort | null;
  /** Uncontrolled initial sort. */
  defaultSort?: DataTableSort | null;
  /** Fires with the next sort (or `null`) whenever a header is toggled. */
  onSortChange?: (sort: DataTableSort | null) => void;
  /** Skip internal sorting (e.g. the server already sorted). */
  manualSort?: boolean;

  /** Keep the header visible while the body scrolls. Needs `maxHeight`. */
  stickyHeader?: boolean;
  /** Cap the body height (number → px) to enable vertical scrolling. */
  maxHeight?: number | string;
  /** Render the library `Scrollbar` below the grid, synced to its scroll. */
  showScrollbar?: boolean;

  /** Row height / padding. Defaults to `"comfortable"`. */
  density?: "comfortable" | "compact";
  /** Toolbar slot (e.g. filter chips), rendered right-aligned above the grid. */
  toolbar?: ReactNode;
  /** Accessible caption rendered above the grid. */
  caption?: ReactNode;

  /** Show a skeleton placeholder instead of rows. */
  loading?: boolean;
  /** Skeleton row count while `loading`. Defaults to `5`. */
  skeletonRows?: number;
  /** Message shown when `data` is empty. Defaults to `"No data"`. */
  emptyMessage?: ReactNode;

  /** Row click handler — makes rows focusable + interactive. */
  onRowClick?: (row: T, index: number) => void;
  /** Extra classes per row. */
  rowClassName?: string | ((row: T, index: number) => string);

  /** Classes for the outer wrapper. */
  className?: string;
  /** Classes for the `<table>`. */
  tableClassName?: string;
  /** Accessible name for the grid. */
  "aria-label"?: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const ALIGN_CLASS: Record<DataTableAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const JUSTIFY_CLASS: Record<DataTableAlign, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

/** Resolve a column's raw value from a row (for sorting / default display). */
function resolveValue<T>(row: T, column: DataTableColumn<T>): unknown {
  if (typeof column.accessor === "function") return column.accessor(row);
  if (column.accessor != null) return row[column.accessor];
  return undefined;
}

/** Numeric / date / locale-aware ascending comparator with null handling. */
function defaultCompare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

/** Turn a number into a px string, pass other CSS lengths through. */
const toLength = (v: number | string | undefined): string | undefined =>
  v == null ? undefined : typeof v === "number" ? `${v}px` : v;

/* -------------------------------------------------------------------------- */
/* Synced horizontal scrollbar                                                */
/* -------------------------------------------------------------------------- */

/**
 * Track a scroll container's horizontal position as a 0–100 value and report
 * whether it actually overflows (so the custom scrollbar can disable itself).
 */
function useScrollSync(ref: React.RefObject<HTMLElement>, enabled: boolean) {
  const [value, setValue] = useState(0);
  const [overflowing, setOverflowing] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const travel = el.scrollWidth - el.clientWidth;
    setOverflowing(travel > 1);
    setValue(travel > 0 ? (el.scrollLeft / travel) * 100 : 0);
  }, [ref]);

  useLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // Observe the content (the <table>) as well. A reflow that widens it past
    // the viewport — async data, or a web-font swap after first paint — leaves
    // the scroll container's own box size unchanged, so without this the
    // scrollbar would never notice there's now something to scroll and would
    // stay disabled.
    const content = el.firstElementChild;
    if (content) ro.observe(content);

    window.addEventListener("resize", measure);
    // Fonts often load after the first paint and widen cells; re-measure then.
    document.fonts?.ready?.then(measure).catch(() => {});

    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [enabled, measure, ref]);

  const scrollTo = useCallback(
    (next: number) => {
      const el = ref.current;
      if (!el) return;
      const travel = el.scrollWidth - el.clientWidth;
      el.scrollLeft = (next / 100) * travel;
    },
    [ref],
  );

  return { value, overflowing, scrollTo, measure };
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * `DataTable` — generic, sortable financial data grid.
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={ledger}
 *   getRowId={(r) => r.code}
 *   columns={[
 *     { id: "code", header: "Code", accessor: "code", sticky: true, sortable: true },
 *     { id: "name", header: "Account", accessor: "name", sortable: true },
 *     {
 *       id: "debit",
 *       header: "Debit",
 *       align: "right",
 *       accessor: "debit",
 *       sortable: true,
 *       cell: (r) => formatCurrency(r.debit),
 *       footer: formatCurrency(total),
 *     },
 *   ]}
 * />
 * ```
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  sort,
  defaultSort = null,
  onSortChange,
  manualSort = false,
  stickyHeader = false,
  maxHeight,
  showScrollbar = false,
  density = "comfortable",
  toolbar,
  caption,
  loading = false,
  skeletonRows = 5,
  emptyMessage = "No data",
  onRowClick,
  rowClassName,
  className,
  tableClassName,
  "aria-label": ariaLabel,
}: DataTableProps<T>) {
  const isControlledSort = sort !== undefined;
  const [internalSort, setInternalSort] = useState<DataTableSort | null>(
    defaultSort,
  );
  const activeSort = isControlledSort ? sort : internalSort;

  const scrollRef = useRef<HTMLDivElement>(null);
  const { value, overflowing, scrollTo, measure } = useScrollSync(
    scrollRef,
    showScrollbar,
  );

  // Re-measure the scroll overflow whenever the data/columns change the width.
  useEffect(() => {
    if (showScrollbar) measure();
  }, [showScrollbar, measure, data, columns]);

  const handleSort = useCallback(
    (columnId: string) => {
      const next: DataTableSort | null =
        activeSort?.columnId !== columnId
          ? { columnId, direction: "asc" }
          : activeSort.direction === "asc"
            ? { columnId, direction: "desc" }
            : null;
      if (!isControlledSort) setInternalSort(next);
      onSortChange?.(next);
    },
    [activeSort, isControlledSort, onSortChange],
  );

  const sortedData = useMemo(() => {
    if (manualSort || !activeSort) return data;
    const column = columns.find((c) => c.id === activeSort.columnId);
    if (!column) return data;
    const compare =
      column.sortFn ??
      ((a: T, b: T) =>
        defaultCompare(resolveValue(a, column), resolveValue(b, column)));
    const sorted = [...data].sort(compare);
    if (activeSort.direction === "desc") sorted.reverse();
    return sorted;
  }, [data, columns, activeSort, manualSort]);

  const hasFooter = columns.some((c) => c.footer != null);
  const headerPad = density === "compact" ? "py-2" : "py-3";
  const bodyPad = density === "compact" ? "py-2.5" : "py-4";

  /* --- Cell class builders -------------------------------------------- */
  const stickyColClasses = (sticky?: boolean, header?: boolean) =>
    sticky
      ? cn("sticky left-0", header ? "z-30" : "z-10", "bg-inherit")
      : undefined;

  const headSticky = stickyHeader ? "sticky top-0 z-20" : undefined;

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      {toolbar && (
        <div className="flex flex-wrap items-center justify-end gap-4">
          {toolbar}
        </div>
      )}

      <div className="flex w-full flex-col items-center gap-4">
        {/* Rounded frame — clips the corners and hosts the scroll area. */}
        <div className="w-full overflow-hidden rounded-xl border border-surface-border-purple bg-surface-card">
          <div
            ref={scrollRef}
            className={cn("w-full overflow-x-auto", maxHeight && "overflow-y-auto")}
            style={{ maxHeight: toLength(maxHeight) }}
          >
            <table
              aria-label={ariaLabel}
              className={cn(
                "w-full border-separate border-spacing-0 text-body-xs",
                tableClassName,
              )}
            >
              {caption && (
                <caption className="px-3 py-2 text-left text-body-xs text-body-secondary">
                  {caption}
                </caption>
              )}

              <thead>
                <tr>
                  {columns.map((column) => {
                    const align = column.align ?? "left";
                    const isSorted = activeSort?.columnId === column.id;
                    const ariaSort = column.sortable
                      ? isSorted
                        ? activeSort!.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                      : undefined;
                    return (
                      <th
                        key={column.id}
                        scope="col"
                        aria-sort={ariaSort}
                        style={{
                          width: toLength(column.width),
                          minWidth: toLength(column.minWidth),
                        }}
                        className={cn(
                          "border-b border-r border-surface-border-purple bg-purple-50 px-3 align-middle",
                          "font-semibold text-heading [&:last-child]:border-r-0",
                          headerPad,
                          ALIGN_CLASS[align],
                          headSticky,
                          stickyColClasses(column.sticky, true),
                          column.sticky && "bg-purple-50",
                          column.headerClassName,
                        )}
                      >
                        {column.sortable ? (
                          <button
                            type="button"
                            onClick={() => handleSort(column.id)}
                            className={cn(
                              "inline-flex w-full items-center gap-1.5 font-semibold outline-none",
                              "focus-visible:underline",
                              JUSTIFY_CLASS[align],
                            )}
                          >
                            <span className={cn(!column.wrap && "whitespace-nowrap")}>
                              {column.header}
                            </span>
                            <SortIcon
                              active={isSorted}
                              direction={isSorted ? activeSort!.direction : undefined}
                            />
                          </button>
                        ) : (
                          <span className={cn(!column.wrap && "whitespace-nowrap")}>
                            {column.header}
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: skeletonRows }).map((_, r) => (
                    <tr key={`skeleton-${r}`} className="bg-surface-card">
                      {columns.map((column) => (
                        <td
                          key={column.id}
                          className={cn(
                            "border-b border-r border-surface-border-purple px-3 [&:last-child]:border-r-0",
                            bodyPad,
                            stickyColClasses(column.sticky),
                            column.sticky && "bg-surface-card",
                          )}
                        >
                          <span className="block h-3.5 w-full animate-pulse rounded bg-grey-200" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : sortedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-3 py-10 text-center text-body-sm text-body-secondary"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  sortedData.map((row, rowIndex) => {
                    const key = getRowId ? getRowId(row, rowIndex) : rowIndex;
                    const isLast = rowIndex === sortedData.length - 1;
                    const interactive = Boolean(onRowClick);
                    const rowCls =
                      typeof rowClassName === "function"
                        ? rowClassName(row, rowIndex)
                        : rowClassName;
                    return (
                      <tr
                        key={key}
                        onClick={
                          onRowClick ? () => onRowClick(row, rowIndex) : undefined
                        }
                        tabIndex={interactive ? 0 : undefined}
                        onKeyDown={
                          interactive
                            ? (e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  onRowClick!(row, rowIndex);
                                }
                              }
                            : undefined
                        }
                        className={cn(
                          "bg-surface-card",
                          interactive &&
                            "cursor-pointer transition-colors hover:bg-purple-25 focus-visible:bg-purple-25 focus-visible:outline-none",
                          rowCls,
                        )}
                      >
                        {columns.map((column) => {
                          const align = column.align ?? "left";
                          const content = column.cell
                            ? column.cell(row, rowIndex)
                            : (resolveValue(row, column) as ReactNode);
                          const cellCls =
                            typeof column.cellClassName === "function"
                              ? column.cellClassName(row, rowIndex)
                              : column.cellClassName;
                          return (
                            <td
                              key={column.id}
                              style={{
                                width: toLength(column.width),
                                minWidth: toLength(column.minWidth),
                              }}
                              className={cn(
                                "border-r border-surface-border-purple px-3 align-middle text-body-secondary",
                                "[&:last-child]:border-r-0",
                                !isLast && "border-b",
                                bodyPad,
                                ALIGN_CLASS[align],
                                !column.wrap && "whitespace-nowrap",
                                stickyColClasses(column.sticky),
                                column.sticky && "bg-inherit",
                                cellCls,
                              )}
                            >
                              {content}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>

              {hasFooter && !loading && sortedData.length > 0 && (
                <tfoot>
                  <tr className="bg-purple-50">
                    {columns.map((column) => {
                      const align = column.align ?? "left";
                      return (
                        <td
                          key={column.id}
                          className={cn(
                            "border-t border-r border-surface-border-purple px-3 font-semibold text-heading",
                            "[&:last-child]:border-r-0",
                            bodyPad,
                            ALIGN_CLASS[align],
                            stickyColClasses(column.sticky),
                            column.sticky && "bg-purple-50",
                          )}
                        >
                          {column.footer}
                        </td>
                      );
                    })}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {showScrollbar && (
          <Scrollbar
            aria-label="Scroll table horizontally"
            className="w-full max-w-[420px]"
            value={value}
            onValueChange={scrollTo}
            disabled={!overflowing}
          />
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sort indicator                                                             */
/* -------------------------------------------------------------------------- */

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction?: SortDirection;
}) {
  if (!active) {
    return (
      <ArrowsDownUp
        aria-hidden="true"
        weight="bold"
        className="size-3.5 shrink-0 text-heading/40"
      />
    );
  }
  const Icon = direction === "asc" ? CaretUp : CaretDown;
  return <Icon aria-hidden="true" weight="bold" className="size-3.5 shrink-0 text-heading" />;
}

DataTable.displayName = "DataTable";
