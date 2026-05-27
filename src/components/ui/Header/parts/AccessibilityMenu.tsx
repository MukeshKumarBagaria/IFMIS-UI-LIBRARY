import { forwardRef } from "react";
import { CaretDown, PersonArmsSpread } from "@phosphor-icons/react";
import { cn } from "../../../../lib/cn";
import { GlassButton } from "./GlassPill";

export interface AccessibilityMenuProps {
  /** Visible label — i18n-ready. Default: `"Accessibility"`. */
  label?: string;
  /** Optional accessible name when no visible label is shown. */
  ariaLabel?: string;
  /** Fired when the trigger is clicked. The host owns popover state. */
  onClick?: () => void;
  /** When `true`, the caret rotates to indicate the menu is open. */
  open?: boolean;
  /** Disables the trigger. */
  disabled?: boolean;
  className?: string;
}

/**
 * `AccessibilityMenu` — header pill that opens an accessibility settings
 * popover.
 *
 * This component renders **only the trigger** (icon + label + caret).
 * Popover content is owned by the host so it can plug in any panel
 * component the product already uses.
 *
 * @example
 *   <AccessibilityMenu open={open} onClick={() => setOpen(o => !o)} />
 */
export const AccessibilityMenu = forwardRef<HTMLButtonElement, AccessibilityMenuProps>(
  ({ label = "Accessibility", ariaLabel, open, onClick, disabled, className }, ref) => {
    return (
      <GlassButton
        ref={ref}
        shape="rounded"
        aria-label={ariaLabel ?? label}
        aria-expanded={open ?? undefined}
        aria-haspopup="menu"
        disabled={disabled}
        onClick={onClick}
        className={cn("hidden md:flex h-[50px] px-3 gap-2 lg:gap-[18px]", className)}
      >
        <PersonArmsSpread size={24} weight="regular" aria-hidden />
        <span className="hidden lg:inline font-sans font-semibold text-[14px] leading-none">
          {label}
        </span>
        <CaretDown
          size={16}
          weight="bold"
          aria-hidden
          className={cn("transition-transform", open && "rotate-180")}
        />
      </GlassButton>
    );
  },
);

AccessibilityMenu.displayName = "AccessibilityMenu";
