import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../../lib/cn";

/**
 * Roles recognised out of the box. Each role has its own colour pair
 * (border / background) from the IFMIS brand palette.
 *
 * Need a new role? Add an entry to `ROLE_STYLES` below — keep the keys
 * lowercase and short (they show up in product code).
 */
export type RoleVariant = "creator" | "verifier" | "approver";

const ROLE_STYLES: Record<RoleVariant, string> = {
  creator: "border-blue-400 bg-blue-200 text-blue-900",
  verifier: "border-yellow-200 bg-yellow-25 text-yellow-900",
  approver: "border-green-200 bg-green-25 text-green-900",
};

const DEFAULT_LABELS: Record<RoleVariant, string> = {
  creator: "Creator",
  verifier: "Verifier",
  approver: "Approver",
};

export interface RoleBadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant: RoleVariant;
  /** Visible label. Defaults to the English label for the variant. */
  label?: string;
  /**
   * Optional trailing icon. When provided the layout switches from
   * centred to space-between so the icon hugs the right edge.
   * Hidden by default (matches the dropdown design in Figma).
   */
  icon?: ReactNode;
  /**
   * Width behaviour.
   *  - `"auto"` (default) — hugs content / participates in flex layout.
   *  - `"fixed"` — locks the badge to 110px (the original profile-card spec).
   */
  width?: "auto" | "fixed";
}

/**
 * `RoleBadge` — pill that names a role the user holds (Creator, Verifier,
 * Approver). Colour-coded so a single glance tells the user what they
 * can do.
 *
 * The label is i18n-ready via `label`. Variants drive only the colour;
 * the text comes from the host.
 *
 * @example Default (centred, no icon)
 *   <RoleBadge variant="creator" />
 *
 * @example With trailing icon
 *   <RoleBadge variant="approver" icon={<CheckCircle size={16} weight="fill" />} />
 */
export const RoleBadge = forwardRef<HTMLDivElement, RoleBadgeProps>(
  ({ variant, label, icon, width = "auto", className, ...props }, ref) => {
    const resolvedLabel = label ?? DEFAULT_LABELS[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center self-stretch",
          icon ? "justify-between" : "justify-center",
          width === "fixed" ? "w-[110px]" : "w-auto",
          "rounded-2xl border px-3 py-1",
          "font-sans font-semibold text-[14px] leading-none",
          "shadow-[0_1px_2px_0_rgba(20,49,107,0.50)]",
          ROLE_STYLES[variant],
          className,
        )}
        {...props}
      >
        <span>{resolvedLabel}</span>
        {icon}
      </div>
    );
  },
);

RoleBadge.displayName = "RoleBadge";
