import { forwardRef } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "../../../../lib/cn";

/**
 * Shared glassmorphism surface used by every action in the header:
 *   - `rgba(36, 4, 61, 0.25)` translucent purple fill
 *   - 1px `--surface-border-purple` border
 *   - `backdrop-filter: blur(1px)` ("Glass button fill" in Figma)
 *
 * Two shapes:
 *   - `shape="pill"`     → fully-rounded (`100px`) — language toggle, profile, font-size group
 *   - `shape="rounded"`  → 24px radius — accessibility menu trigger
 *
 * Use the `as` prop to render as `<div>` (default) or `<button>`. When
 * rendered as a button, focus + hover affordances are added automatically.
 */
export const GLASS_BG = "rgba(36, 4, 61, 0.25)";

const SHAPE: Record<"pill" | "rounded", string> = {
  pill: "rounded-[100px]",
  rounded: "rounded-[24px]",
};

interface SharedProps {
  shape?: "pill" | "rounded";
}

export interface GlassSurfaceProps
  extends HTMLAttributes<HTMLDivElement>,
    SharedProps {}

export const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ shape = "pill", className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center border border-surface-border-purple text-white",
        "backdrop-blur-[1px]",
        SHAPE[shape],
        className,
      )}
      style={{ backgroundColor: GLASS_BG }}
      {...props}
    >
      {children}
    </div>
  ),
);

GlassSurface.displayName = "GlassSurface";

export interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    SharedProps {}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ shape = "pill", className, type = "button", children, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "flex items-center border border-surface-border-purple text-white",
        "backdrop-blur-[1px] transition-colors",
        "hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-white/70 focus-visible:ring-offset-0",
        "disabled:opacity-50 disabled:pointer-events-none",
        SHAPE[shape],
        className,
      )}
      style={{ backgroundColor: GLASS_BG }}
      {...props}
    >
      {children}
    </button>
  ),
);

GlassButton.displayName = "GlassButton";
