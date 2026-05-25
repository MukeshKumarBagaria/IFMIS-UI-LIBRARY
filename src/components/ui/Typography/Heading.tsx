import { forwardRef, createElement } from "react";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/**
 * Heading — H1 through H6.
 *
 * Levels match the IFMIS Figma typography scale (SemiBold, line-height 100%).
 * Use `level` to control the visual style and `as` to control the rendered tag
 * (decouple semantics from appearance).
 *
 * @example
 *   <Heading level={1}>Dashboard</Heading>
 *   <Heading level={3} as="h2">Visually H3, semantically H2</Heading>
 */
const headingVariants = cva("font-sans text-heading tracking-tight", {
  variants: {
    level: {
      1: "text-h1",
      2: "text-h2",
      3: "text-h3",
      4: "text-h4",
      5: "text-h5",
      6: "text-h6",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    level: 1,
    align: "left",
  },
});

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps
  extends Omit<ComponentPropsWithoutRef<"h1">, "color">,
    VariantProps<typeof headingVariants> {
  /** Rendered HTML tag. Defaults to the matching `h{level}` tag. */
  as?: ElementType;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, align, as, className, children, ...props }, ref) => {
    const Tag = (as ?? (`h${level}` as ElementType));
    return createElement(
      Tag,
      {
        ref,
        className: cn(headingVariants({ level: level as HeadingLevel, align }), className),
        ...props,
      },
      children,
    );
  },
);

Heading.displayName = "Heading";

export { headingVariants };
