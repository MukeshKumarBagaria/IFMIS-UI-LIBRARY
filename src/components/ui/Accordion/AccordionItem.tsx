import { forwardRef, useId, useMemo } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { AccordionItemContext, useAccordionContext } from "./contexts";

/* ---------------------------------------------------------------------------
 * AccordionItem — one section's outer shell.
 *
 * Owns the card chrome (purple border, 24px radius, white surface) and clips
 * its children so the trigger's top corners and the panel's bottom corners
 * round correctly in both open and closed states. Provides item context
 * (open state + aria ids) to the Trigger and Panel.
 * ------------------------------------------------------------------------- */

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique identifier for this section within its Accordion. */
  value: string;
  /** Disable just this section. */
  disabled?: boolean;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, className, children, ...props }, ref) => {
    const accordion = useAccordionContext();
    const reactId = useId();
    const open = accordion.isOpen(value);
    const itemDisabled = disabled || accordion.disabled;

    const ctx = useMemo(
      () => ({
        value,
        open,
        disabled: itemDisabled,
        triggerId: `accordion-trigger-${reactId}`,
        panelId: `accordion-panel-${reactId}`,
      }),
      [value, open, itemDisabled, reactId],
    );

    return (
      <AccordionItemContext.Provider value={ctx}>
        <div
          ref={ref}
          data-state={open ? "open" : "closed"}
          data-disabled={itemDisabled || undefined}
          className={cn(
            "overflow-hidden rounded-3xl border border-surface-border-purple bg-surface-card",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);

AccordionItem.displayName = "AccordionItem";
