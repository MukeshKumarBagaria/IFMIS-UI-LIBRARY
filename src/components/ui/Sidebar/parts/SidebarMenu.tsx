import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { cn } from "../../../../lib/cn";
import { searchMenuTree } from "./searchMenu";
import type { MenuSearchResult } from "./searchMenu";

/**
 * A node in the sub-modules tree.
 *
 * The shape is deliberately minimal — keep your config flat and let the
 * Sidebar handle the visuals.
 *
 *   - `id`       — stable identifier, typically the **route path**.
 *                  Used by `activeId` for highlighting and by
 *                  `onSelect(id)` when the user clicks a leaf.
 *   - `label`    — what the user reads.
 *   - `badge`    — optional counter shown on the right of the row.
 *   - `children` — nested items. Presence of this array makes the row
 *                  expandable: clicking it opens a floating right-side
 *                  card. Children may themselves have children — cards
 *                  cascade to unlimited depth.
 *
 * @example
 *   const MENU: MenuNode[] = [
 *     { id: "/dashboard", label: "Dashboard" },
 *     { id: "hrms", label: "HRMS", children: [
 *       { id: "/hrms/exit",  label: "Exit Management" },
 *       { id: "/hrms/leave", label: "Leave Management" },
 *     ]},
 *   ];
 */
export interface MenuNode {
  id: string;
  label: string;
  /** Optional badge text (e.g. counts) shown on the right. */
  badge?: string | number;
  /** Nested children — presence of this array opens a floating card. */
  children?: MenuNode[];
}

export interface SidebarMenuProps {
  /** Section title shown above the list. Default: `"Sub-Modules"`. */
  title?: string;
  /** The menu tree to render. */
  items: MenuNode[];
  /** Currently selected leaf id. Pass your current route here. */
  activeId?: string;
  /** Fires when the user clicks a leaf (an item with no children). */
  onSelect?: (id: string) => void;
  /**
   * Optional search query. When non-empty, the menu switches to a
   * flat **search-results** view that shows every matching leaf in
   * the **active module's** tree (scoped by what you passed in
   * `items` — the library never searches across modules). Each row
   * shows a breadcrumb of the parent path and highlights the matched
   * substring inside the label.
   *
   * Wire this to your `SidebarSearch` value. The `<Sidebar>` parent
   * does this automatically when you pass both `search` and `menu`.
   */
  searchValue?: string;
  /**
   * Title shown above the search-results list. Default:
   * `"Search results"`.
   */
  searchResultsTitle?: string;
  /**
   * Title shown when the search produces no matches. Default:
   * `"No matches"`.
   */
  searchEmptyTitle?: string;
}

/**
 * Recursive sub-modules menu.
 *
 * Top level renders as a vertical stack of "pill" rows inside the
 * sidebar. Any row that owns `children` opens a floating card to its
 * right on click. Cards cascade for nested children.
 *
 * Selection state is owned by the consumer via `activeId` / `onSelect`.
 *
 * @example
 *   <SidebarMenu
 *     items={MENU}
 *     activeId={pathname}
 *     onSelect={(id) => navigate(id)}
 *   />
 */

export function SidebarMenu({
  title = "Sub-Modules",
  items,
  activeId,
  onSelect,
  searchValue,
  searchResultsTitle = "Search results",
  searchEmptyTitle = "No matches",
}: SidebarMenuProps) {
  const query = searchValue?.trim() ?? "";
  const inSearchMode = query.length > 0;

  // Memoise so each keystroke doesn't re-walk the tree on unrelated
  // re-renders. The active-module tree is small, but consumers may
  // re-render the parent on every router change.
  const results = useMemo(
    () => (inSearchMode ? searchMenuTree(items, query) : []),
    [items, query, inSearchMode],
  );

  if (inSearchMode) {
    return (
      <div className="flex flex-col gap-2 self-stretch">
        <h3 className="text-heading text-sm font-semibold leading-tight">
          {results.length === 0 ? searchEmptyTitle : searchResultsTitle}
        </h3>
        {results.length === 0 ? (
          <EmptySearchState query={query} />
        ) : (
          <ul className="flex flex-col gap-[1.12rem] self-stretch list-none m-0 p-0">
            {results.map((result) => (
              <SearchResultRow
                key={[...result.idPath, result.node.id].join(">")}
                result={result}
                query={query}
                isActive={result.node.id === activeId}
                onSelect={() => onSelect?.(result.node.id)}
              />
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 self-stretch">
      {title && (
        <h3 className="text-heading text-sm font-semibold leading-tight">
          {title}
        </h3>
      )}
      {/* Vertical 1.12rem gap between rows, with a 1px connector line
          running through the gap (left-indented, same grey as the pill
          borders) — Figma "tree" treatment. */}
      <ul className="flex flex-col gap-[1.12rem] self-stretch list-none m-0 p-0">
        {items.map((node) => (
          <TopLevelItem
            key={node.id}
            node={node}
            activeId={activeId}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Search results                                                             */
/* -------------------------------------------------------------------------- */

interface SearchResultRowProps {
  result: MenuSearchResult;
  query: string;
  isActive: boolean;
  onSelect: () => void;
}

function SearchResultRow({
  result,
  query,
  isActive,
  onSelect,
}: SearchResultRowProps) {
  const { node, path } = result;
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group flex w-full px-3 py-2 items-center justify-between gap-2",
          "rounded-2xl border transition-colors text-left",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
          isActive
            ? "bg-purple-700 text-white border-surface-border-purple"
            : "bg-white text-body-secondary border-grey-400 hover:bg-grey-100",
        )}
      >
        <span className="flex flex-col min-w-0 gap-0.5">
          {path.length > 0 && (
            <span
              className={cn(
                "truncate text-xs font-medium leading-tight",
                isActive ? "text-white/75" : "text-body-secondary/70",
              )}
            >
              {path.join(" / ")}
            </span>
          )}
          <span className="truncate text-base font-medium leading-tight">
            <HighlightedText text={node.label} query={query} active={isActive} />
          </span>
        </span>
        <CaretRight size={14} weight="bold" className="shrink-0 opacity-60" />
      </button>
    </li>
  );
}

function EmptySearchState({ query }: { query: string }) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-1 self-stretch",
        "rounded-2xl border border-dashed border-grey-400 bg-white",
        "px-3 py-6 text-center",
      )}
    >
      <span className="text-sm font-medium text-body-secondary">
        No menu items match
      </span>
      <span className="text-xs text-body-secondary/70 truncate max-w-full">
        “{query}”
      </span>
    </div>
  );
}

/**
 * Inline highlighter — wraps every case-insensitive occurrence of
 * `query` inside `text` in a `<mark>`. Returns the original text
 * unchanged when `query` is empty or doesn't match.
 *
 * The highlight tint switches based on whether the row is the active
 * (purple-bg) one, so contrast stays AA in both states.
 */
function HighlightedText({
  text,
  query,
  active = false,
}: {
  text: string;
  query: string;
  active?: boolean;
}): JSX.Element {
  if (!query) return <>{text}</>;
  const lower = text.toLowerCase();
  const needle = query.toLowerCase();
  const parts: ReactNode[] = [];

  let cursor = 0;
  let idx = lower.indexOf(needle, cursor);
  while (idx >= 0) {
    if (idx > cursor) parts.push(text.slice(cursor, idx));
    parts.push(
      <mark
        key={idx}
        className={cn(
          "rounded-sm px-0.5",
          active
            ? "bg-white/25 text-white"
            : "bg-purple-100 text-purple-700",
        )}
      >
        {text.slice(idx, idx + needle.length)}
      </mark>,
    );
    cursor = idx + needle.length;
    idx = lower.indexOf(needle, cursor);
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

/* -------------------------------------------------------------------------- */
/* Top-level menu item — the Figma "pill" row living inside the sidebar       */
/* -------------------------------------------------------------------------- */

interface TopLevelItemProps {
  node: MenuNode;
  activeId?: string;
  onSelect?: (id: string) => void;
}

function TopLevelItem({ node, activeId, onSelect }: TopLevelItemProps) {
  const hasChildren = !!node.children?.length;
  const ref = useRef<HTMLLIElement>(null);
  const [open, setOpen] = useState(false);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // A row is "active" (purple) when it is the currently selected one
  // — either because its id literally matches `activeId`, or because
  // its popover is currently open (the user is exploring its
  // sub-modules). Clicking a row with children sets it as the active
  // row *and* opens its popover; clicking a leaf inside the popover
  // promotes that leaf to active, which deactivates the parent.
  // Result: still only one purple row in the rail at any moment.
  const isActive = activeId === node.id || open;

  const handleClick = () => {
    onSelect?.(node.id);
    if (hasChildren) setOpen((v) => !v);
  };

  return (
    <li
      ref={ref}
      className={cn(
        "relative",
        // Connector line through the 1.12rem gap above this row —
        // hidden on the first row. Indented to align with the pill's
        // inner content. Matches the pill border color (grey-400).
        "before:content-[''] before:absolute before:left-6 before:w-px",
        "before:-top-[1.12rem] before:h-[1.12rem] before:bg-grey-400",
        "first:before:hidden",
      )}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-expanded={hasChildren ? open : undefined}
        aria-haspopup={hasChildren ? "menu" : undefined}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group flex w-full h-11 px-3 items-center justify-between gap-1.5",
          // Figma "Text/Body/Medium-16" — 1rem / 500
          "rounded-2xl border text-base font-medium transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
          isActive
            ? "bg-purple-700 text-white border-surface-border-purple"
            : cn(
                "bg-white text-body-secondary border-grey-400 hover:bg-grey-100",
                // Subtle non-selected highlight while the popover is open
                // so the user still knows which row triggered the card.
                open && "bg-grey-100",
              ),
        )}
      >
        <span className="truncate">{node.label}</span>
        <span className="flex items-center gap-1.5 shrink-0">
          {node.badge !== undefined && (
            <Badge active={isActive}>{node.badge}</Badge>
          )}
          {hasChildren && <CaretRight size={14} weight="bold" />}
        </span>
      </button>

      {hasChildren && open && (
        <SubmenuCard
          items={node.children!}
          activeId={activeId}
          onSelect={onSelect}
          onLeafSelect={() => setOpen(false)}
        />
      )}
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* SubmenuCard — floating right-side card with rows; cascades for nesting     */
/* -------------------------------------------------------------------------- */

interface SubmenuCardProps {
  items: MenuNode[];
  activeId?: string;
  onSelect?: (id: string) => void;
  /**
   * Fired when the user clicks a **leaf** anywhere in this card's
   * subtree. Each ancestor uses this to close itself, so a deep leaf
   * click collapses the whole popover chain in one go.
   */
  onLeafSelect?: () => void;
  /** Visual offset from the anchor — defaults to the sidebar rail (positions
   *  the card just outside the 279px sidebar). Nested cards override this to
   *  sit immediately to the right of their parent row. */
  anchor?: "sidebar" | "row";
}

function SubmenuCard({
  items,
  activeId,
  onSelect,
  onLeafSelect,
  anchor = "sidebar",
}: SubmenuCardProps) {
  return (
    <div
      role="menu"
      className={cn(
        "absolute top-0 z-50",
        // Width = 17.4375rem; padding 0.5rem; gap 0.75rem; rounded-3xl;
        // border + the soft Figma card shadow.
        "flex w-[17.4375rem] p-2 flex-col items-start gap-3",
        "rounded-3xl border border-grey-400 bg-white",
      )}
      style={{
        boxShadow: "0 0 50px 0 rgba(0, 0, 0, 0.10)",
        // Both top-level and nested submenu cards float **12px outside**
        // their anchor. The top-level offset adds the body card's 16px
        // right padding (16 + 12 = 28px = 1.75rem) so the gap is measured
        // from the rail's outer edge — matching the Figma reference.
        // Nested cards anchor directly to the parent row, so the row's
        // 8px right padding plus the 12px gap nets the same 12px visual
        // gap from the parent card's right edge.
        left:
          anchor === "sidebar" ? "calc(100% + 1.75rem)" : "calc(100% + 1.25rem)",
      }}
    >
      {items.map((child) => (
        <SubmenuRow
          key={child.id}
          node={child}
          activeId={activeId}
          onSelect={onSelect}
          onLeafSelect={onLeafSelect}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SubmenuRow — a row inside a SubmenuCard. Recurses for nested children.     */
/* -------------------------------------------------------------------------- */

interface SubmenuRowProps {
  node: MenuNode;
  activeId?: string;
  onSelect?: (id: string) => void;
  /** Bubbled up to ancestors when a leaf is clicked, so each level can
   *  close its own popover. */
  onLeafSelect?: () => void;
}

function SubmenuRow({ node, activeId, onSelect, onLeafSelect }: SubmenuRowProps) {
  const hasChildren = !!node.children?.length;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Same rule as the top-level rail: a row is "active" (purple) when it
  // is the currently selected one — either id-matched or its nested
  // popover is open. Keeps a single purple row at any depth.
  const isActive = activeId === node.id || open;

  const handleClick = () => {
    onSelect?.(node.id);
    if (hasChildren) {
      setOpen((v) => !v);
    } else {
      // Leaf click — collapse every ancestor popover up the chain.
      onLeafSelect?.();
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        role="menuitem"
        onClick={handleClick}
        aria-expanded={hasChildren ? open : undefined}
        aria-haspopup={hasChildren ? "menu" : undefined}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex w-full h-10 px-3 items-center justify-between gap-2",
          // Figma "Text/Body/Medium-16" — 1rem / 500
          "rounded-2xl text-base font-medium transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
          isActive
            ? "bg-purple-700 text-white"
            : "text-body-secondary hover:bg-grey-100",
        )}
      >
        <span className="truncate text-left">{node.label}</span>
        <span
          className={cn(
            "flex items-center gap-1.5 shrink-0",
            isActive ? "text-white" : "text-heading",
          )}
        >
          {node.badge !== undefined && (
            <Badge active={isActive}>{node.badge}</Badge>
          )}
          {hasChildren && <CaretRight size={14} weight="bold" />}
        </span>
      </button>

      {hasChildren && open && (
        <SubmenuCard
          items={node.children!}
          activeId={activeId}
          onSelect={onSelect}
          onLeafSelect={() => {
            // A leaf deep in our subtree was selected — close our
            // popover *and* bubble the close request to our ancestors.
            setOpen(false);
            onLeafSelect?.();
          }}
          anchor="row"
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Badge({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-5 h-5 px-1.5 items-center justify-center",
        "rounded-full text-[11px] font-semibold",
        active ? "bg-white text-purple-700" : "bg-purple-100 text-purple-700",
      )}
    >
      {children}
    </span>
  );
}
