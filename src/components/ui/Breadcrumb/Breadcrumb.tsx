import { forwardRef, Fragment } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A single breadcrumb entry.
 *
 * Render behaviour is inferred from what you pass:
 *   - `href`    → renders an `<a>` (use with your router's link as `as` too).
 *   - `onClick` → renders a `<button>`.
 *   - neither   → renders a non-interactive `<span>`.
 *
 * The **current** (active) crumb is the last item by default, or any item you
 * mark with `current: true`. It's always non-interactive.
 */
export interface BreadcrumbItem {
  /** Visible text (or any node). */
  label: React.ReactNode;
  /** Link target — renders an anchor. */
  href?: string;
  /** Click handler — renders a button (ignored when `href` is set). */
  onClick?: () => void;
  /** Optional leading icon inside the chip. */
  icon?: React.ReactNode;
  /** Force this item to be the active/current crumb. */
  current?: boolean;
  /** Per-item class override. */
  className?: string;
  /** Stable key; falls back to the index. */
  key?: React.Key;
}

export interface BreadcrumbProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** The trail, in order from root → current. Supports any number of items. */
  items: BreadcrumbItem[];
  /** Separator between crumbs. Defaults to a caret-right glyph. */
  separator?: React.ReactNode;
  /** Accessible label for the nav landmark. Default `"Breadcrumb"`. */
  ariaLabel?: string;
}

/* -------------------------------------------------------------------------- */
/* Crumb                                                                      */
/* -------------------------------------------------------------------------- */

const CHIP_BASE =
  "inline-flex items-center justify-center gap-2.5 rounded-2xl px-2 py-1 text-sm font-semibold leading-none transition-colors";

function Crumb({ item, isCurrent }: { item: BreadcrumbItem; isCurrent: boolean }) {
  const className = cn(
    CHIP_BASE,
    isCurrent
      ? "bg-neutral-100 text-purple-800"
      : "bg-surface-grey-bg text-body-secondary",
    !isCurrent && (item.href || item.onClick) && "hover:bg-grey-100",
    "[&_svg]:size-4 [&_svg]:shrink-0",
    item.className,
  );

  const content = (
    <>
      {item.icon}
      {item.label}
    </>
  );

  if (isCurrent) {
    return (
      <span className={className} aria-current="page">
        {content}
      </span>
    );
  }

  if (item.href) {
    return (
      <a href={item.href} className={className}>
        {content}
      </a>
    );
  }

  if (item.onClick) {
    return (
      <button
        type="button"
        onClick={item.onClick}
        className={cn(
          className,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
        )}
      >
        {content}
      </button>
    );
  }

  return <span className={className}>{content}</span>;
}

/* -------------------------------------------------------------------------- */
/* Breadcrumb                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * **Breadcrumb** — the page-trail navigation chips.
 *
 * Pass an `items` array; the last one is styled as the active/current page
 * (purple on neutral-100) and the rest as muted grey chips, with a caret
 * between each. Handles any number of items and figures out whether each
 * crumb is a link, a button, or plain text from its props.
 *
 * @example Links
 * ```jsx
 * <Breadcrumb
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Vouchers", href: "/vouchers" },
 *     { label: "VCH-2026-0042" }, // last = current page
 *   ]}
 * />
 * ```
 *
 * @example Router buttons + custom separator
 * ```jsx
 * <Breadcrumb
 *   separator={<SlashIcon />}
 *   items={[
 *     { label: "Dashboard", onClick: () => navigate("/") },
 *     { label: "HRMS", onClick: () => navigate("/hrms") },
 *     { label: "Leave" },
 *   ]}
 * />
 * ```
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      separator,
      ariaLabel = "Breadcrumb",
      className,
      ...props
    },
    ref,
  ) => {
    const hasExplicitCurrent = items.some((i) => i.current);
    const lastIndex = items.length - 1;
    const sep = separator ?? (
      <CaretRight size={16} weight="bold" className="text-grey-600" />
    );

    return (
      <nav ref={ref} aria-label={ariaLabel} className={className} {...props}>
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => {
            const isCurrent = hasExplicitCurrent
              ? !!item.current
              : index === lastIndex;
            return (
              <Fragment key={item.key ?? index}>
                <li className="flex items-center">
                  <Crumb item={item} isCurrent={isCurrent} />
                </li>
                {index < lastIndex && (
                  <li aria-hidden="true" className="flex items-center">
                    {sep}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";
