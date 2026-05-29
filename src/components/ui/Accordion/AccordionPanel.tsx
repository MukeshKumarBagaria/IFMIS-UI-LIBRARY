import { forwardRef, useEffect, useRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { useAccordionContext, useAccordionItemContext } from "./contexts";

/* ---------------------------------------------------------------------------
 * AccordionPanel — the collapsible body. Drop any content here.
 *
 * Behaviour:
 *   - Smooth height animation via the CSS grid `0fr ↔ 1fr` technique (no JS
 *     measuring; respects `prefers-reduced-motion`).
 *   - Stays mounted when collapsed (so form state survives) unless the
 *     Accordion sets `unmountOnCollapse`.
 *   - Collapsed content is made `inert` — removed from the tab order and the
 *     accessibility tree — so hidden fields can't be focused.
 * ------------------------------------------------------------------------- */

export type AccordionPanelProps = HTMLAttributes<HTMLDivElement>;

export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  ({ className, children, ...props }, ref) => {
    const accordion = useAccordionContext();
    const item = useAccordionItemContext();
    const regionRef = useRef<HTMLDivElement>(null);

    // `inert` isn't reliably typed across React versions, so toggle it on the
    // DOM node directly. Keeps collapsed (but mounted) content out of reach.
    useEffect(() => {
      const node = regionRef.current;
      if (!node) return;
      if (item.open) node.removeAttribute("inert");
      else node.setAttribute("inert", "");
    }, [item.open]);

    if (accordion.unmountOnCollapse && !item.open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          item.open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div
            ref={regionRef}
            id={item.panelId}
            role="region"
            aria-labelledby={item.triggerId}
            className={cn(
              "border-t border-surface-border-purple bg-surface-card p-4",
              className,
            )}
            {...props}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

AccordionPanel.displayName = "AccordionPanel";
