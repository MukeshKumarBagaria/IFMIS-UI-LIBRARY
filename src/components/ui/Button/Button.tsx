import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/**
 * IFMIS Button — design-system primitive.
 *
 * Mirrors the Figma "Buttons" component 1:1. Three visual `variant`s
 * (primary / secondary / tertiary) across two `size`s (standard / small).
 * The Figma "states" (Default / Hover / Pressed / Focused / Disabled) are
 * not props — they map to native interaction pseudo-classes so the button
 * behaves correctly without the consumer wiring anything up:
 *
 *   - Hover    → `:hover`
 *   - Pressed  → `:active`
 *   - Focused  → `:focus-visible` (keyboard focus ring per Figma)
 *   - Disabled → `:disabled` — also swaps the cursor from `pointer` back to
 *     the platform `default` arrow (no `not-allowed` glyph).
 *
 * Geometry & colour come straight from the Figma tokens:
 *   radius 16px, Purple-600/700/800, Purple-50/100, Blue-400, grey/disabled.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 rounded-2xl box-border",
    "font-semibold leading-none whitespace-nowrap transition-colors select-none",
    "focus-visible:outline-none cursor-pointer",
    "disabled:pointer-events-none disabled:cursor-default",
    // Icons inherit the button's text colour; size is set per-size below.
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary — solid purple, white label. Transparent 2px border in
        // the base keeps geometry identical when the focus ring appears.
        primary: [
          "border-2 border-transparent text-white",
          "bg-purple-600",
          "hover:bg-purple-700",
          "active:bg-purple-800",
          "focus-visible:bg-purple-700 focus-visible:border-blue-400",
          "disabled:bg-body-disabled disabled:text-grey-100 disabled:border-transparent",
        ].join(" "),
        // Secondary — outlined, purple label, tinted fills on hover/press.
        secondary: [
          "bg-transparent text-purple-600 border-purple-600",
          "hover:bg-purple-50 hover:border-purple-700 hover:text-purple-700",
          "active:bg-purple-100 active:border-purple-800 active:text-purple-800",
          "focus-visible:bg-transparent focus-visible:border-blue-400",
          "disabled:bg-body-disabled disabled:text-grey-100 disabled:border-transparent",
        ].join(" "),
        // Tertiary — text-only, no fill; focus shows a 2px underline.
        tertiary: [
          "bg-transparent text-purple-600 border-b-2 border-transparent",
          "hover:text-purple-700",
          "active:text-purple-800",
          "focus-visible:text-purple-700 focus-visible:border-blue-400 focus-visible:rounded-none",
          "disabled:text-body-disabled",
        ].join(" "),
        // Neutral — outlined in the muted grey body colour. Same geometry as
        // secondary, but the palette is neutral rather than brand purple, for
        // low-emphasis controls like "Back" that shouldn't compete with the
        // page's primary purple actions.
        neutral: [
          "bg-transparent text-body-secondary border-body-secondary",
          "hover:bg-surface-grey-bg",
          "active:bg-grey-100",
          "focus-visible:bg-transparent focus-visible:border-blue-400",
          "disabled:bg-body-disabled disabled:text-grey-100 disabled:border-transparent",
        ].join(" "),
      },
      size: {
        standard: "h-11 px-3 text-base [&_svg]:size-6",
        small: "h-8 px-2 text-sm [&_svg]:size-5",
      },
    },
    compoundVariants: [
      // Secondary border widths differ by size (Figma: 1.5px standard, 1px
      // small) and the focus ring thickens to 2px on standard only.
      {
        variant: "secondary",
        size: "standard",
        class: "border-[1.5px] focus-visible:border-2",
      },
      {
        variant: "secondary",
        size: "small",
        class: "border disabled:border-grey-100",
      },
      // Neutral matches secondary's border widths (1.5px standard, 1px small).
      {
        variant: "neutral",
        size: "standard",
        class: "border-[1.5px] focus-visible:border-2",
      },
      {
        variant: "neutral",
        size: "small",
        class: "border disabled:border-grey-100",
      },
      // Tertiary only exists at Standard in Figma: 32px tall, 12px padding,
      // 16px label, 20px icons. Map both sizes onto those metrics.
      {
        variant: "tertiary",
        size: "standard",
        class: "h-8 px-3 text-base [&_svg]:size-5",
      },
      { variant: "tertiary", size: "small", class: "[&_svg]:size-5" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "standard",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element (Radix Slot) instead of a `<button>`. */
  asChild?: boolean;
  /** Shows a spinner (in the left slot) and disables the button. */
  loading?: boolean;
  /** Icon rendered before the label. Ignored when `asChild`. */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label. Ignored when `asChild`. */
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading ? <Spinner /> : leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";

function Spinner() {
  return (
    <svg
      className="animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { buttonVariants };
