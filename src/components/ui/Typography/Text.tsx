import { forwardRef, createElement } from "react";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/**
 * Text — body copy in 4 sizes × 2 weights × 2 colors.
 *
 * Sizes match the IFMIS Figma scale 1:1:
 *   xs = 14px / 21px line-height
 *   sm = 16px / 24px
 *   md = 18px / 27px
 *   lg = 20px / 30px
 *
 * Weight `medium` (500) matches Figma "Body Medium" (B1–B4).
 * Weight `regular` (400) matches Figma "Body Regular" (b1–b4).
 *
 * @example
 *   <Text>Default body sm + regular + primary</Text>
 *   <Text size="md" weight="medium">Label</Text>
 *   <Text color="secondary">Helper text</Text>
 */
const textVariants = cva("font-sans", {
  variants: {
    size: {
      xs: "text-body-xs",
      sm: "text-body-sm",
      md: "text-body-md",
      lg: "text-body-lg",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
    color: {
      primary: "text-body-primary",
      secondary: "text-body-secondary",
      muted: "text-muted-foreground",
      inherit: "",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    truncate: {
      true: "truncate",
    },
  },
  defaultVariants: {
    size: "sm",
    weight: "regular",
    color: "primary",
    align: "left",
  },
});

export interface TextProps
  extends Omit<ComponentPropsWithoutRef<"p">, "color">,
    VariantProps<typeof textVariants> {
  /** Rendered HTML tag. Defaults to `<p>`. Use `"span"` for inline. */
  as?: ElementType;
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ as = "p", size, weight, color, align, truncate, className, children, ...props }, ref) => {
    return createElement(
      as,
      {
        ref,
        className: cn(textVariants({ size, weight, color, align, truncate }), className),
        ...props,
      },
      children,
    );
  },
);

Text.displayName = "Text";

export { textVariants };
