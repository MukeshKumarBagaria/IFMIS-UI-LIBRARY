import { forwardRef, useMemo } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import {
  CheckCircle,
  Info,
  WarningCircle,
  X,
  type Icon,
} from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/* ---------------------------------------------------------------------------
 * Banner — an inline notification surface for in-page status messages.
 *
 * Three semantic variants mapped 1:1 to the IFMIS brand scales:
 *   - `danger`  → red-100 surface,   red-200 border,   red-800 text + icon
 *   - `success` → green-100 surface, green-200 border, green-800 text + icon
 *   - `info`    → blue-100 surface,  blue-200 border,  blue-800 text + icon
 *
 * Banner is a *compound component* — the container handles colour, padding,
 * radius and icon placement; nested `BannerTitle` and `BannerDescription`
 * elements let consumers compose multi-line messages without restyling.
 *
 * Banners differ from toasts: they are *persistent*, in-flow, and tied to a
 * specific page section. Use a toast for transient feedback that should
 * float on top of the UI.
 * ------------------------------------------------------------------------- */

/**
 * CVA-driven class generator for the Banner container.
 *
 * Exported so consumers building custom layouts (e.g. a multi-line banner
 * inside a form field) can reach the same colour treatment without re-
 * implementing the variant logic — `<div className={bannerVariants({ variant: "danger" })} />`.
 */
export const bannerVariants = cva(
  // Layout + shape — shared across all variants.
  //
  // `w-full` makes the banner fill its container by default — banners are
  // page-level status messages, so full-bleed is the right default for the
  // varied layouts product teams drop them into (forms, flex rows, grids).
  // Constrain the width from the outside (`className="max-w-md"`) when needed.
  [
    "flex w-full items-start gap-1.5 rounded-xl border p-2",
    "text-body-xs font-medium leading-[21px]",
  ],
  {
    variants: {
      variant: {
        danger: "border-red-200 bg-red-100 text-red-800",
        success: "border-green-200 bg-green-100 text-green-800",
        info: "border-blue-200 bg-blue-100 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

export type BannerVariant = NonNullable<
  VariantProps<typeof bannerVariants>["variant"]
>;

/**
 * Default Phosphor icon paired with each variant.
 *
 * Variants ship with semantically meaningful glyphs (warning for danger,
 * check for success, info for info) so screen-reader users get an extra
 * affordance via the visible icon's accessible name when one is provided.
 * Override per-instance with the `icon` prop, or hide entirely with
 * `icon={null}`.
 */
const DEFAULT_ICON_BY_VARIANT: Record<BannerVariant, Icon> = {
  danger: WarningCircle,
  success: CheckCircle,
  info: Info,
};

export interface BannerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof bannerVariants> {
  /**
   * Leading icon. Three behaviours:
   *   - **omitted** — the default icon for the variant is rendered.
   *   - **`null`** — no icon is rendered (text-only banner).
   *   - **custom node** — your own element (any size; the container reserves
   *     20×20 to stay aligned with the default).
   */
  icon?: ReactNode;
  /**
   * Optional close handler. When provided, a trailing dismiss button is
   * rendered. Omit to make the banner non-dismissible.
   */
  onDismiss?: () => void;
  /**
   * Accessible label for the dismiss button. Defaults to `"Dismiss"`.
   * Localise for non-English consumers.
   */
  dismissLabel?: string;
}

/**
 * `Banner` — primary container.
 *
 * @example Simple
 *   <Banner variant="danger">Unable to save your changes.</Banner>
 *
 * @example Title + description
 *   <Banner variant="success">
 *     <BannerTitle>Payment recorded</BannerTitle>
 *     <BannerDescription>Receipt #12345 sent to beneficiary.</BannerDescription>
 *   </Banner>
 *
 * @example Dismissible
 *   <Banner variant="info" onDismiss={() => setVisible(false)}>
 *     New approval workflow is now live.
 *   </Banner>
 *
 * @example No icon / custom icon
 *   <Banner variant="info" icon={null}>Text-only banner.</Banner>
 *   <Banner variant="success" icon={<Trophy weight="fill" />}>You did it!</Banner>
 *
 * Accessibility:
 *   - `danger` uses `role="alert"` so assistive tech interrupts immediately.
 *   - `success` and `info` use `role="status"` (polite live region).
 *   - Both can be overridden via the `role` prop for special cases.
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      variant = "info",
      icon,
      onDismiss,
      dismissLabel = "Dismiss",
      className,
      children,
      role,
      ...props
    },
    ref,
  ) => {
    const resolvedVariant: BannerVariant = variant ?? "info";

    // Resolve which icon to render. `icon === null` is an explicit opt-out;
    // `icon === undefined` falls back to the variant default.
    const renderedIcon = useMemo<ReactNode>(() => {
      if (icon === null) return null;
      if (icon !== undefined) return icon;
      const DefaultIcon = DEFAULT_ICON_BY_VARIANT[resolvedVariant];
      return <DefaultIcon size={20} weight="fill" aria-hidden="true" />;
    }, [icon, resolvedVariant]);

    const resolvedRole = role ?? (resolvedVariant === "danger" ? "alert" : "status");

    return (
      <div
        ref={ref}
        role={resolvedRole}
        className={cn(bannerVariants({ variant: resolvedVariant }), className)}
        {...props}
      >
        {renderedIcon !== null ? (
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center"
            // The icon's colour is inherited from the container's text
            // colour, so danger banners get red-800 icons, success get
            // green-800, etc. — matching the Figma 1:1.
          >
            {renderedIcon}
          </span>
        ) : null}

        <div className="min-w-0 flex-1">{children}</div>

        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={dismissLabel}
            className={cn(
              "ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded",
              "text-current opacity-70 transition-opacity hover:opacity-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
            )}
          >
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    );
  },
);

Banner.displayName = "Banner";

/* ---------------------------------------------------------------------------
 * Sub-parts — optional, opt-in. Single-line banners can ignore these and
 * pass a plain string as children; multi-line banners use the title /
 * description split to get correct typographic hierarchy.
 * ------------------------------------------------------------------------- */

export type BannerTitleProps = HTMLAttributes<HTMLParagraphElement>;

/**
 * Bold lead line for a multi-line banner.
 *
 * Inherits the container's variant colour. Use exactly one per Banner;
 * additional emphasis belongs in the description with inline elements.
 */
export const BannerTitle = forwardRef<HTMLParagraphElement, BannerTitleProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-body-xs font-semibold leading-[21px]", className)}
      {...props}
    />
  ),
);

BannerTitle.displayName = "BannerTitle";

export type BannerDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

/**
 * Body copy for a Banner — matches Figma `Text/Body/Medium-14`.
 *
 * Renders as a `<p>` so screen readers treat it as a block. Wrap multiple
 * lines or interactive content in additional `<BannerDescription>` blocks
 * rather than nesting block elements inside one.
 */
export const BannerDescription = forwardRef<
  HTMLParagraphElement,
  BannerDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-body-xs font-medium leading-[21px]", className)}
    {...props}
  />
));

BannerDescription.displayName = "BannerDescription";
