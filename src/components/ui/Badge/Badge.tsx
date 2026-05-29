import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { CheckCircle, Info, Spinner, Warning } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * Badge — a small, pill-shaped status indicator (icon + label).
 *
 * Four semantic variants mapped 1:1 to the IFMIS brand scales. Each variant
 * pairs a tinted surface + border + label colour with a default icon in its
 * own accent colour (note: `pending` deliberately uses an orange icon on a
 * yellow chip, per the design system):
 *
 *   - success → green-100 / green-400 / green-800,  CheckCircle (green-600)
 *   - danger  → red-100   / red-400   / red-800,    Warning     (red-600)
 *   - pending → yellow-100/ yellow-400/ yellow-800, Spinner     (orange-600)
 *   - info    → grey-100  / grey-400  / grey-800,   Info        (grey-600)
 *
 * The icon is fully dynamic: omit it for the variant default, pass any node to
 * override, or pass `null` for a text-only badge. Whatever icon is rendered
 * inherits the variant's icon colour (so custom glyphs stay on-palette) and is
 * auto-sized to 16px.
 * ========================================================================= */

export const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 rounded-2xl border px-3 py-1",
    "text-sm font-semibold leading-none whitespace-nowrap",
    // Any icon inside is auto-sized; its colour is set per-variant below.
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        success: "border-green-400 bg-green-100 text-green-800 [&_svg]:text-green-600",
        danger: "border-red-400 bg-red-100 text-red-800 [&_svg]:text-red-600",
        pending: "border-yellow-400 bg-yellow-100 text-yellow-800 [&_svg]:text-orange-600",
        info: "border-grey-400 bg-grey-100 text-grey-800 [&_svg]:text-grey-600",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

/**
 * Default glyph per variant. Marked `aria-hidden` because the label text
 * already carries the meaning. Override via the `icon` prop.
 */
const DEFAULT_ICON: Record<BadgeVariant, ReactNode> = {
  success: <CheckCircle weight="fill" aria-hidden="true" />,
  danger: <Warning weight="fill" aria-hidden="true" />,
  pending: <Spinner weight="bold" aria-hidden="true" />,
  info: <Info weight="fill" aria-hidden="true" />,
};

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Leading icon. Three behaviours:
   *   - **omitted** — the variant's default icon is rendered.
   *   - **`null`** — no icon (text-only badge).
   *   - **custom node** — your own glyph; it inherits the variant icon colour.
   */
  icon?: ReactNode | null;
}

/**
 * `Badge` — status pill used across the app (section status, list flags,
 * counts…). Composable anywhere; the `Accordion` header uses it for section
 * completion status.
 *
 * @example
 *   <Badge variant="success">Complete</Badge>
 *   <Badge variant="danger">3 errors</Badge>
 *   <Badge variant="info" icon={null}>Draft</Badge>
 *   <Badge variant="pending" icon={<Clock />}>Awaiting</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "info", icon, className, children, ...props }, ref) => {
    const resolvedVariant: BadgeVariant = variant ?? "info";
    const resolvedIcon = icon === undefined ? DEFAULT_ICON[resolvedVariant] : icon;
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant: resolvedVariant }), className)}
        {...props}
      >
        {resolvedIcon}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
