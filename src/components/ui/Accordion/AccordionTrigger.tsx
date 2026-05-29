import { forwardRef } from "react";
import type { ButtonHTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { ArrowDown, ArrowUp } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import { useAccordionContext, useAccordionItemContext } from "./contexts";

/* ---------------------------------------------------------------------------
 * AccordionTrigger — the standardized section header.
 *
 * This is the part that's identical across all 18 modules: a 48px purple bar
 * with an optional number chip, the section title, an optional badge cluster,
 * and the open/close arrow. Consumers only feed it `title` / `number` /
 * `badges` — the structure, spacing and a11y are fixed here.
 *
 * Accessibility: follows the WAI-ARIA Accordion pattern — a heading wraps a
 * single button (`aria-expanded` + `aria-controls`). Arrow keys / Home / End
 * move focus between section headers.
 * ------------------------------------------------------------------------- */

type HeadingTag = "h2" | "h3" | "h4" | "h5" | "h6";

export interface AccordionTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  /** Section title. */
  title: ReactNode;
  /** Optional ordinal shown in the leading white circle (e.g. `"01"`). */
  number?: ReactNode;
  /**
   * Status badges, rendered in the trailing purple pill. Compose `<Badge>`s
   * here — pass one for a single status, or several.
   */
  badges?: ReactNode;
  /** Heading tag wrapping the trigger. Match your page outline. Default `"h3"`. */
  as?: HeadingTag;
  /** Hide the open/close arrow (e.g. for a non-collapsible display header). */
  hideChevron?: boolean;
}

const NAV_KEYS = ["ArrowDown", "ArrowUp", "Home", "End"];

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (
    {
      title,
      number,
      badges,
      as: Tag = "h3",
      hideChevron = false,
      className,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const accordion = useAccordionContext();
    const item = useAccordionItemContext();
    const Arrow = item.open ? ArrowUp : ArrowDown;

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !NAV_KEYS.includes(event.key)) return;
      const root = event.currentTarget.closest("[data-accordion-root]");
      if (!root) return;
      const triggers = Array.from(
        root.querySelectorAll<HTMLButtonElement>(
          "[data-accordion-trigger]:not([disabled])",
        ),
      );
      const index = triggers.indexOf(event.currentTarget);
      if (index === -1) return;
      event.preventDefault();
      const last = triggers.length - 1;
      const target =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? last
            : event.key === "ArrowDown"
              ? (index + 1) % triggers.length
              : (index - 1 + triggers.length) % triggers.length;
      triggers[target]?.focus();
    };

    return (
      <Tag>
        <button
          ref={ref}
          type="button"
          id={item.triggerId}
          data-accordion-trigger=""
          aria-expanded={item.open}
          aria-controls={item.panelId}
          disabled={item.disabled}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) accordion.toggle(item.value);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex h-12 w-full items-center justify-between gap-3 bg-purple-50 px-4 text-left",
            "transition-colors hover:bg-purple-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400",
            "disabled:cursor-not-allowed disabled:opacity-60",
            className,
          )}
          {...props}
        >
          {/* Leading — number chip + title. */}
          <span className="flex min-w-0 items-center gap-1.5">
            {number != null && (
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-card font-sans text-h3 text-heading"
              >
                {number}
              </span>
            )}
            <span className="truncate font-sans text-h3 text-heading">{title}</span>
          </span>

          {/* Trailing — badges + arrow. */}
          <span className="flex shrink-0 items-center gap-6">
            {badges != null && (
              <span className="flex items-center gap-3 rounded-2xl bg-purple-200 p-1">
                {badges}
              </span>
            )}
            {!hideChevron && (
              <span
                aria-hidden="true"
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-card text-heading"
              >
                <Arrow weight="bold" className="size-4" />
              </span>
            )}
          </span>
        </button>
      </Tag>
    );
  },
);

AccordionTrigger.displayName = "AccordionTrigger";
