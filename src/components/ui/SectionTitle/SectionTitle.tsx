import { forwardRef } from "react";
import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { DotsThree } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import { Heading } from "../Typography";

/* ===========================================================================
 * SectionTitle — the labelled bar that heads a section within a page.
 *
 * A neutral-tinted strip with a purple accent rail down the left edge, a
 * section heading on the left, and an optional action area on the right
 * (custom content, or a default "more" overflow button).
 *
 * Design principles (so it's safe to reuse on every screen):
 *   1. Composition — the heading delegates to <Heading> (visual size locked to
 *      18px / Header-18) so typography stays consistent library-wide.
 *   2. Tokens, not hex — `neutral-100`, `purple-500`, `text-heading`,
 *      `body-secondary`; a theme swap repaints the bar with no code change.
 *   3. Fluid width — `w-full` fills whatever column it's dropped into.
 *   4. Decoupled semantics — `as` sets the heading tag (h2…h6) so the bar
 *      slots into any document outline without changing its look.
 * ========================================================================= */

export interface SectionTitleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The section heading. Rendered at the 18px Header-18 size. */
  title: ReactNode;
  /**
   * Heading tag for the title, decoupled from its visual size. Pick the level
   * that fits the page outline (a section under a `PageTitle` h1 is usually an
   * `h2`). Defaults to `"h2"`.
   */
  as?: ElementType;
  /**
   * Right-aligned content — buttons, a menu, a status pill, etc. Takes
   * precedence over the default "more" button when provided.
   */
  action?: ReactNode;
  /**
   * Convenience handler: when set (and no `action` is given), a default
   * "more" (overflow) icon button is rendered and wired to this callback.
   */
  onMore?: () => void;
  /** Accessible label for the default "more" button. Defaults to `"More options"`. */
  moreLabel?: string;
}

/**
 * `SectionTitle` — section-level heading bar.
 *
 * @example Plain
 *   <SectionTitle title="Beneficiary details" />
 *
 * @example With an overflow menu
 *   <SectionTitle title="Line items" onMore={() => openMenu()} />
 *
 * @example With custom actions
 *   <SectionTitle
 *     title="Attachments"
 *     action={<Button size="small" variant="tertiary">Add file</Button>}
 *   />
 */
export const SectionTitle = forwardRef<HTMLDivElement, SectionTitleProps>(
  (
    {
      title,
      as = "h2",
      action,
      onMore,
      moreLabel = "More options",
      className,
      ...props
    },
    ref,
  ) => {
    const right =
      action ??
      (onMore ? (
        <button
          type="button"
          onClick={onMore}
          aria-label={moreLabel}
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-body-secondary",
            "transition-colors hover:bg-neutral-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
          )}
        >
          <DotsThree size={24} weight="bold" aria-hidden="true" />
        </button>
      ) : null);

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full items-center justify-between gap-3 px-3 py-2",
          // Asymmetric corners (4px top, 2px bottom) + purple accent rail.
          "rounded-t-[4px] rounded-b-[2px] border-l-4 border-purple-500 bg-neutral-100",
          className,
        )}
        {...props}
      >
        <Heading
          level={4}
          as={as}
          className="min-w-0 text-heading tracking-normal"
        >
          {title}
        </Heading>
        {right}
      </div>
    );
  },
);

SectionTitle.displayName = "SectionTitle";
