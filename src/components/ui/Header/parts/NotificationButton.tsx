import { forwardRef } from "react";
import { Bell } from "@phosphor-icons/react";
import { cn } from "../../../../lib/cn";
import { GlassButton } from "./GlassPill";

export interface NotificationButtonProps {
  /** Unread count. `0` (default) hides the badge. */
  count?: number;
  /** Hard cap on the badge — anything above shows as `${max}+`. Default `99`. */
  max?: number;
  /** Visible-tooltip / accessible label. Default `"Notifications"`. */
  ariaLabel?: string;
  onClick?: () => void;
  /** When `true`, the button shows `aria-expanded`. */
  open?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * `NotificationButton` — bell icon in a glass circle with an unread badge.
 *
 * Trigger only. The popover / panel that lists notifications is owned by
 * the host so each product can decide whether it's a dropdown, a side
 * panel, or a full-page route.
 *
 * @example
 *   <NotificationButton count={unread} onClick={openPanel} />
 */
export const NotificationButton = forwardRef<HTMLButtonElement, NotificationButtonProps>(
  ({ count = 0, max = 99, ariaLabel = "Notifications", open, onClick, disabled, className }, ref) => {
    const display = count > max ? `${max}+` : String(count);
    const showBadge = count > 0;
    const accessibleLabel = showBadge ? `${ariaLabel}, ${count} unread` : ariaLabel;

    return (
      <GlassButton
        ref={ref}
        shape="pill"
        aria-label={accessibleLabel}
        aria-expanded={open ?? undefined}
        aria-haspopup="dialog"
        disabled={disabled}
        onClick={onClick}
        className={cn("relative h-[50px] w-[50px] justify-center", className)}
      >
        <Bell size={24} weight="regular" aria-hidden />
        {showBadge ? (
          <span
            aria-hidden
            className={cn(
              "absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5",
              "flex items-center justify-center rounded-full",
              "bg-red-500 text-white",
              "font-sans font-semibold text-[11px] leading-none",
              "ring-2 ring-purple-900/40",
            )}
          >
            {display}
          </span>
        ) : null}
      </GlassButton>
    );
  },
);

NotificationButton.displayName = "NotificationButton";
