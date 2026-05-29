import { createContext, useContext } from "react";

/* ---------------------------------------------------------------------------
 * Shared contexts for the Accordion compound component.
 *
 * Kept in their own module so the root and every part can import them without
 * creating import cycles (root → parts → root).
 * ------------------------------------------------------------------------- */

/** `single` = one section open at a time; `multiple` = any number open. */
export type AccordionType = "single" | "multiple";

export interface AccordionContextValue {
  type: AccordionType;
  /** Is the item with this value currently open? */
  isOpen: (value: string) => boolean;
  /** Toggle the item with this value (respects type + collapsible). */
  toggle: (value: string) => void;
  /** When true, collapsed panels are removed from the DOM (lose state). */
  unmountOnCollapse: boolean;
  /** When true, every item is disabled. */
  disabled: boolean;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error(
      "Accordion parts (Item/Trigger/Panel/Section) must be rendered inside <Accordion>.",
    );
  }
  return ctx;
}

export interface AccordionItemContextValue {
  value: string;
  open: boolean;
  disabled: boolean;
  /** id of the trigger button — used for aria wiring. */
  triggerId: string;
  /** id of the panel region — used for aria wiring. */
  panelId: string;
}

export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export function useAccordionItemContext(): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error(
      "AccordionTrigger and AccordionPanel must be rendered inside <AccordionItem>.",
    );
  }
  return ctx;
}
