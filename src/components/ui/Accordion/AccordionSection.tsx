import { forwardRef } from "react";
import type { ReactNode } from "react";
import { AccordionItem, type AccordionItemProps } from "./AccordionItem";
import { AccordionTrigger, type AccordionTriggerProps } from "./AccordionTrigger";
import { AccordionPanel } from "./AccordionPanel";

/* ---------------------------------------------------------------------------
 * AccordionSection — the 90%-case convenience wrapper.
 *
 * Bundles Item + Trigger + Panel so a full section is one call. Reach for the
 * primitives directly only when you need a non-standard header.
 * ------------------------------------------------------------------------- */

export interface AccordionSectionProps
  extends Omit<AccordionItemProps, "children" | "title"> {
  /** Section title (Trigger). */
  title: AccordionTriggerProps["title"];
  /** Optional ordinal chip (Trigger). */
  number?: AccordionTriggerProps["number"];
  /** Status badges (Trigger). */
  badges?: ReactNode;
  /** Heading tag for the title. Default `"h3"`. */
  as?: AccordionTriggerProps["as"];
  /** Hide the open/close arrow. */
  hideChevron?: boolean;
  /** Panel body. */
  children: ReactNode;
  /** Class override for the trigger header. */
  triggerClassName?: string;
  /** Class override for the panel body. */
  panelClassName?: string;
}

/**
 * `AccordionSection` — Item + Trigger + Panel in one.
 *
 * @example
 *   <AccordionSection
 *     value="beneficiary"
 *     number="01"
 *     title="Beneficiary details"
 *     badges={<Badge variant="success">Complete</Badge>}
 *   >
 *     <BeneficiaryForm />
 *   </AccordionSection>
 */
export const AccordionSection = forwardRef<HTMLDivElement, AccordionSectionProps>(
  (
    {
      value,
      disabled,
      title,
      number,
      badges,
      as,
      hideChevron,
      children,
      className,
      triggerClassName,
      panelClassName,
      ...props
    },
    ref,
  ) => (
    <AccordionItem
      ref={ref}
      value={value}
      disabled={disabled}
      className={className}
      {...props}
    >
      <AccordionTrigger
        title={title}
        number={number}
        badges={badges}
        as={as}
        hideChevron={hideChevron}
        className={triggerClassName}
      />
      <AccordionPanel className={panelClassName}>{children}</AccordionPanel>
    </AccordionItem>
  ),
);

AccordionSection.displayName = "AccordionSection";
