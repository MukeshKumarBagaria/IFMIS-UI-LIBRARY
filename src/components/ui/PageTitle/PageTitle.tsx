import { forwardRef, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { Heading } from "../Typography";
import { Breadcrumb } from "../Breadcrumb";
import type { BreadcrumbItem, BreadcrumbProps } from "../Breadcrumb";

/* ===========================================================================
 * PageTitle — the heading band that tops every IFMIS screen.
 *
 * A white card (purple border, 24px radius) holding the page title and an
 * optional breadcrumb trail, with the brand "DiamondsFour" motif bleeding off
 * the right edge. (The "Back" action lives in the bottom CtaTray, not here.)
 *
 * Design principles (so this stays safe to reuse across every module):
 *   1. Composition, not duplication. The title delegates to <Heading> and the
 *      trail to <Breadcrumb>.
 *      Restyle those primitives once and every PageTitle updates in lockstep.
 *   2. Tokens, not hex. Every colour is a design token (purple-700,
 *      surface-border-purple, surface-card, body-secondary…), so a theme
 *      change re-paints the band with zero code changes here.
 *   3. Fluid width, intrinsic height. The band is `w-full` (fills whatever
 *      column a module drops it into) and uses `min-h` rather than a fixed
 *      height, so long titles or wrapped breadcrumbs grow the card instead of
 *      overflowing.
 *   4. Decoration is inert. The diamonds are `aria-hidden`, non-interactive,
 *      and clipped by the card — purely cosmetic, never load-bearing.
 * ========================================================================= */

export interface PageTitleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The page heading. Rendered as an `<h1>` at the 24px heading size. */
  title: ReactNode;
  /**
   * Breadcrumb trail, root → current. Forwarded to the shared `<Breadcrumb>`
   * (the last item is styled as the current page). Omit to hide the row.
   */
  breadcrumbs?: BreadcrumbItem[];
  /**
   * Extra props forwarded to the underlying `<Breadcrumb>` — e.g. a custom
   * `separator` or `ariaLabel`. `items` is controlled by `breadcrumbs`.
   */
  breadcrumbProps?: Omit<BreadcrumbProps, "items">;
  /** Hide the decorative diamond motif (e.g. on very narrow layouts). */
  hideDecoration?: boolean;
}

/**
 * `PageTitle` — page-level heading band, reused on every screen.
 *
 * @example Title only
 *   <PageTitle title="Dashboard" />
 *
 * @example Full band — title and breadcrumbs
 *   <PageTitle
 *     title="Create Voucher"
 *     breadcrumbs={[
 *       { label: "Home", href: "/" },
 *       { label: "Vouchers", href: "/vouchers" },
 *       { label: "New" }, // last item = current page
 *     ]}
 *   />
 */
export const PageTitle = forwardRef<HTMLDivElement, PageTitleProps>(
  (
    {
      title,
      breadcrumbs,
      breadcrumbProps,
      hideDecoration = false,
      className,
      ...props
    },
    ref,
  ) => {
    const hasBreadcrumbs = !!breadcrumbs && breadcrumbs.length > 0;

    return (
      <div
        ref={ref}
        className={cn(
          // Card shell — fluid width, ≥132px tall, content vertically centred.
          "relative isolate flex min-h-[8.25rem] w-full items-center overflow-hidden",
          "rounded-3xl border border-surface-border-purple bg-surface-card px-4",
          className,
        )}
        {...props}
      >
        {/* Content column — title and breadcrumbs. Above the decoration. */}
        <div className="relative z-10 flex flex-col items-start gap-2">
          <Heading level={2} as="h1" className="text-purple-700 tracking-normal">
            {title}
          </Heading>

          {hasBreadcrumbs && <Breadcrumb items={breadcrumbs} {...breadcrumbProps} />}
        </div>

        {!hideDecoration && <DiamondsDecoration />}
      </div>
    );
  },
);

PageTitle.displayName = "PageTitle";

/* ---------------------------------------------------------------------------
 * Decorative motif — two "DiamondsFour" clusters bleeding off the top-right.
 *
 * The clusters are rendered at their natural size and positioned to overhang
 * the card edges; the card's `overflow-hidden` does the clipping (exactly like
 * the Figma frame). Coordinates come straight from the Figma node, so the crop
 * matches 1:1 yet stays correct if the card is ever resized.
 * ------------------------------------------------------------------------- */

interface DiamondGlyph {
  viewBox: string;
  /** Path data for the four-diamond cluster. */
  d: string;
  /** Linear-gradient endpoints (userSpaceOnUse), purple → peach. */
  gradient: { x1: number; y1: number; x2: number; y2: number };
}

const DIAMONDS_LG: DiamondGlyph = {
  viewBox: "0 0 252 250",
  d: "M81.0534 68.0273C80.3212 67.3018 79.7404 66.4401 79.3441 65.4917C78.9478 64.5433 78.7438 63.5267 78.7438 62.5C78.7438 61.4733 78.9478 60.4567 79.3441 59.5083C79.7404 58.5599 80.3212 57.6982 81.0534 56.9727L120.428 17.9102C121.16 17.1838 122.028 16.6075 122.984 16.2144C123.94 15.8212 124.965 15.6189 126 15.6189C127.035 15.6189 128.06 15.8212 129.016 16.2144C129.972 16.6075 130.84 17.1838 131.572 17.9102L170.947 56.9727C171.679 57.6982 172.26 58.5599 172.656 59.5083C173.052 60.4567 173.256 61.4733 173.256 62.5C173.256 63.5267 173.052 64.5433 172.656 65.4917C172.26 66.4401 171.679 67.3018 170.947 68.0273L131.572 107.09C130.84 107.816 129.972 108.392 129.016 108.786C128.06 109.179 127.035 109.381 126 109.381C124.965 109.381 123.94 109.179 122.984 108.786C122.028 108.392 121.16 107.816 120.428 107.09L81.0534 68.0273ZM131.572 142.91C130.84 142.184 129.972 141.608 129.016 141.214C128.06 140.821 127.035 140.619 126 140.619C124.965 140.619 123.94 140.821 122.984 141.214C122.028 141.608 121.16 142.184 120.428 142.91L81.0534 181.973C80.3212 182.698 79.7404 183.56 79.3441 184.508C78.9478 185.457 78.7438 186.473 78.7438 187.5C78.7438 188.527 78.9478 189.543 79.3441 190.492C79.7404 191.44 80.3212 192.302 81.0534 193.027L120.428 232.09C121.16 232.816 122.028 233.392 122.984 233.786C123.94 234.179 124.965 234.381 126 234.381C127.035 234.381 128.06 234.179 129.016 233.786C129.972 233.392 130.84 232.816 131.572 232.09L170.947 193.027C171.679 192.302 172.26 191.44 172.656 190.492C173.052 189.543 173.256 188.527 173.256 187.5C173.256 186.473 173.052 185.457 172.656 184.508C172.26 183.56 171.679 182.698 170.947 181.973L131.572 142.91ZM233.947 119.473L194.572 80.4102C193.84 79.6838 192.972 79.1075 192.016 78.7144C191.06 78.3212 190.035 78.1189 189 78.1189C187.965 78.1189 186.94 78.3212 185.984 78.7144C185.028 79.1075 184.16 79.6838 183.428 80.4102L144.053 119.473C143.321 120.198 142.74 121.06 142.344 122.008C141.948 122.957 141.744 123.973 141.744 125C141.744 126.027 141.948 127.043 142.344 127.992C142.74 128.94 143.321 129.802 144.053 130.527L183.428 169.59C184.16 170.316 185.028 170.892 185.984 171.286C186.94 171.679 187.965 171.881 189 171.881C190.035 171.881 191.06 171.679 192.016 171.286C192.972 170.892 193.84 170.316 194.572 169.59L233.947 130.527C234.679 129.802 235.26 128.94 235.656 127.992C236.052 127.043 236.256 126.027 236.256 125C236.256 123.973 236.052 122.957 235.656 122.008C235.26 121.06 234.679 120.198 233.947 119.473ZM107.947 119.473L68.5716 80.4102C67.8402 79.6838 66.9717 79.1075 66.0157 78.7144C65.0596 78.3212 64.0349 78.1189 63 78.1189C61.9651 78.1189 60.9404 78.3212 59.9843 78.7144C59.0283 79.1075 58.1598 79.6838 57.4284 80.4102L18.0534 119.473C17.3212 120.198 16.7404 121.06 16.3441 122.008C15.9478 122.957 15.7438 123.973 15.7438 125C15.7438 126.027 15.9478 127.043 16.3441 127.992C16.7404 128.94 17.3212 129.802 18.0534 130.527L57.4284 169.59C58.1598 170.316 59.0283 170.892 59.9843 171.286C60.9404 171.679 61.9651 171.881 63 171.881C64.0349 171.881 65.0596 171.679 66.0157 171.286C66.9717 170.892 67.8402 170.316 68.5716 169.59L107.947 130.527C108.679 129.802 109.26 128.94 109.656 127.992C110.052 127.043 110.256 126.027 110.256 125C110.256 123.973 110.052 122.957 109.656 122.008C109.26 121.06 108.679 120.198 107.947 119.473Z",
  gradient: { x1: 16.0002, y1: 113, x2: 219.993, y2: 116.422 },
};

const DIAMONDS_SM: DiamondGlyph = {
  viewBox: "0 0 71.5726 75.3078",
  d: "M51.9676 24.1148C52.1737 23.8942 52.4184 23.7193 52.6877 23.5999C52.9571 23.4805 53.2459 23.4191 53.5374 23.4191C53.829 23.4191 54.1178 23.4805 54.3872 23.5999C54.6565 23.7193 54.9012 23.8942 55.1073 24.1148L66.2018 35.9758C66.4081 36.1961 66.5717 36.4577 66.6834 36.7457C66.7951 37.0337 66.8525 37.3424 66.8525 37.6541C66.8525 37.9659 66.7951 38.2745 66.6834 38.5625C66.5717 38.8505 66.4081 39.1121 66.2018 39.3324L55.1073 51.1934C54.9012 51.414 54.6565 51.589 54.3872 51.7083C54.1178 51.8277 53.829 51.8892 53.5374 51.8892C53.2459 51.8892 52.9571 51.8277 52.6877 51.7083C52.4184 51.589 52.1737 51.414 51.9676 51.1934L40.8731 39.3324C40.6668 39.1121 40.5032 38.8505 40.3915 38.5625C40.2798 38.2745 40.2224 37.9659 40.2224 37.6541C40.2224 37.3424 40.2798 37.0337 40.3915 36.7457C40.5032 36.4577 40.6668 36.1961 40.8731 35.9758L51.9676 24.1148ZM30.6995 39.3324C30.9058 39.1121 31.0695 38.8505 31.1811 38.5625C31.2928 38.2745 31.3503 37.9659 31.3503 37.6541C31.3503 37.3424 31.2928 37.0337 31.1811 36.7457C31.0695 36.4577 30.9058 36.1961 30.6995 35.9758L19.605 24.1148C19.399 23.8942 19.1543 23.7193 18.8849 23.5999C18.6155 23.4805 18.3268 23.4191 18.0352 23.4191C17.7436 23.4191 17.4548 23.4805 17.1855 23.5999C16.9161 23.7193 16.6714 23.8942 16.4653 24.1148L5.37085 35.9758C5.16455 36.1961 5.00089 36.4577 4.88922 36.7457C4.77756 37.0337 4.72009 37.3424 4.72009 37.6541C4.72009 37.9659 4.77756 38.2745 4.88922 38.5625C5.00089 38.8505 5.16455 39.1121 5.37085 39.3324L16.4653 51.1934C16.6714 51.414 16.9161 51.589 17.1855 51.7083C17.4548 51.8277 17.7436 51.8892 18.0352 51.8892C18.3268 51.8892 18.6155 51.8277 18.8849 51.7083C19.1543 51.589 19.399 51.414 19.605 51.1934L30.6995 39.3324ZM37.3562 70.171L48.4506 58.31C48.6569 58.0897 48.8206 57.8281 48.9323 57.5401C49.0439 57.2521 49.1014 56.9434 49.1014 56.6317C49.1014 56.3199 49.0439 56.0113 48.9323 55.7233C48.8206 55.4353 48.6569 55.1737 48.4506 54.9534L37.3562 43.0924C37.1501 42.8718 36.9054 42.6968 36.636 42.5775C36.3666 42.4581 36.0779 42.3966 35.7863 42.3966C35.4947 42.3966 35.206 42.4581 34.9366 42.5775C34.6672 42.6968 34.4225 42.8718 34.2164 43.0924L23.122 54.9534C22.9157 55.1737 22.752 55.4353 22.6404 55.7233C22.5287 56.0113 22.4712 56.3199 22.4712 56.6317C22.4712 56.9434 22.5287 57.2521 22.6404 57.5401C22.752 57.8281 22.9157 58.0897 23.122 58.31L34.2164 70.171C34.4225 70.3916 34.6672 70.5665 34.9366 70.6859C35.206 70.8053 35.4947 70.8667 35.7863 70.8667C36.0779 70.8667 36.3666 70.8053 36.636 70.6859C36.9054 70.5665 37.1501 70.3916 37.3562 70.171ZM37.3562 32.2159L48.4506 20.3549C48.6569 20.1346 48.8206 19.8729 48.9323 19.5849C49.0439 19.297 49.1014 18.9883 49.1014 18.6765C49.1014 18.3648 49.0439 18.0561 48.9323 17.7681C48.8206 17.4801 48.6569 17.2185 48.4506 16.9982L37.3562 5.13722C37.1501 4.91666 36.9054 4.74169 36.636 4.62231C36.3666 4.50293 36.0779 4.44148 35.7863 4.44148C35.4947 4.44148 35.206 4.50293 34.9366 4.62231C34.6672 4.74169 34.4225 4.91666 34.2164 5.13722L23.122 16.9982C22.9157 17.2185 22.752 17.4801 22.6404 17.7681C22.5287 18.0561 22.4712 18.3648 22.4712 18.6765C22.4712 18.9883 22.5287 19.297 22.6404 19.5849C22.752 19.8729 22.9157 20.1346 23.122 20.3549L34.2164 32.2159C34.4225 32.4364 34.6672 32.6114 34.9366 32.7308C35.206 32.8501 35.4947 32.9116 35.7863 32.9116C36.0779 32.9116 36.3666 32.8501 36.636 32.7308C36.9054 32.6114 37.1501 32.4364 37.3562 32.2159Z",
  gradient: { x1: 54.171, y1: 21.2467, x2: 18.8462, y2: 54.4155 },
};

function DiamondsDecoration() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    >
      {/* Large cluster — overhangs the top-right corner. */}
      <DiamondsFour
        glyph={DIAMONDS_LG}
        className="absolute right-[-51px] top-[-13px] h-[15.625rem] w-[15.75rem]"
      />
      {/* Small cluster — rotated, tucked up-and-left of the large one. */}
      <DiamondsFour
        glyph={DIAMONDS_SM}
        className="absolute right-[119px] top-[-31px] h-[4.70675rem] w-[4.47331rem] -rotate-90"
      />
    </div>
  );
}

/**
 * A single "DiamondsFour" glyph — four rounded diamonds in a plus, filled with
 * the purple→peach brand gradient at 30% opacity. The gradient id is scoped
 * per-instance (`useId`) so multiple copies never collide.
 */
function DiamondsFour({
  glyph,
  className,
}: {
  glyph: DiamondGlyph;
  className?: string;
}) {
  const gradientId = useId();
  return (
    <svg
      viewBox={glyph.viewBox}
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={glyph.d} fill={`url(#${gradientId})`} fillOpacity="0.3" />
      <defs>
        <linearGradient
          id={gradientId}
          x1={glyph.gradient.x1}
          y1={glyph.gradient.y1}
          x2={glyph.gradient.x2}
          y2={glyph.gradient.y2}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B375F0" />
          <stop offset="1" stopColor="#F6B7A2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
