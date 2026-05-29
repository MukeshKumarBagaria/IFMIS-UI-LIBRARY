import { forwardRef, useCallback, useMemo, useState } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { AccordionContext, type AccordionType } from "./contexts";

/* ===========================================================================
 * Accordion — the core sectioning container used across every IFMIS module.
 *
 * A compound component: this root owns open/close state and the layout of the
 * stack; the look of each section lives in <AccordionItem> / <AccordionTrigger>
 * / <AccordionPanel>, with <AccordionSection> as a one-call convenience.
 *
 * State model:
 *   - `type="single"` (default) — one section open at a time.
 *   - `type="multiple"` — any number open (the "open all at once" mode).
 *   - Works **controlled** (`value` + `onValueChange`) or **uncontrolled**
 *     (`defaultValue`).
 *   - For long forms, panels stay **mounted** when collapsed by default so
 *     field state and validation survive; opt into `unmountOnCollapse` only
 *     for non-form content.
 * ========================================================================= */

function toArray(value?: string | string[]): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Open behaviour. `single` (default) or `multiple`. */
  type?: AccordionType;
  /**
   * Controlled open value(s). Pass a string for `single`, a string[] for
   * `multiple`. Pair with `onValueChange`.
   */
  value?: string | string[];
  /** Uncontrolled initial open value(s). */
  defaultValue?: string | string[];
  /** Fires on open/close. Receives a string (`single`) or string[] (`multiple`). */
  onValueChange?: (value: string | string[]) => void;
  /**
   * `single` only — allow closing the open section by clicking it again.
   * Defaults to `true`. Set `false` to force one section always open.
   */
  collapsible?: boolean;
  /** Remove collapsed panels from the DOM. Defaults to `false` (keep mounted). */
  unmountOnCollapse?: boolean;
  /** Disable every section. */
  disabled?: boolean;
}

/**
 * `Accordion` — root container.
 *
 * @example Uncontrolled, single (default)
 *   <Accordion defaultValue="s1">
 *     <AccordionSection value="s1" number="01" title="Details">…</AccordionSection>
 *     <AccordionSection value="s2" number="02" title="Documents">…</AccordionSection>
 *   </Accordion>
 *
 * @example Multiple open
 *   <Accordion type="multiple" defaultValue={["s1", "s2"]}>…</Accordion>
 *
 * @example Controlled (e.g. auto-advance on completion)
 *   const [open, setOpen] = useState("s1");
 *   <Accordion value={open} onValueChange={setOpen}>…</Accordion>
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = "single",
      value,
      defaultValue,
      onValueChange,
      collapsible = true,
      unmountOnCollapse = false,
      disabled = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState<string[]>(() => toArray(defaultValue));
    const openValues = isControlled ? toArray(value) : internal;

    const commit = useCallback(
      (next: string[]) => {
        if (!isControlled) setInternal(next);
        onValueChange?.(type === "multiple" ? next : (next[0] ?? ""));
      },
      [isControlled, onValueChange, type],
    );

    const isOpen = useCallback(
      (v: string) => openValues.includes(v),
      [openValues],
    );

    const toggle = useCallback(
      (v: string) => {
        const openNow = openValues.includes(v);
        if (type === "multiple") {
          commit(openNow ? openValues.filter((x) => x !== v) : [...openValues, v]);
        } else if (openNow) {
          commit(collapsible ? [] : [v]);
        } else {
          commit([v]);
        }
      },
      [openValues, type, collapsible, commit],
    );

    const ctx = useMemo(
      () => ({ type, isOpen, toggle, unmountOnCollapse, disabled }),
      [type, isOpen, toggle, unmountOnCollapse, disabled],
    );

    return (
      <AccordionContext.Provider value={ctx}>
        <div
          ref={ref}
          data-accordion-root=""
          className={cn("flex flex-col gap-3", className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);

Accordion.displayName = "Accordion";
