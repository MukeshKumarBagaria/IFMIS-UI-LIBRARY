import { forwardRef, Fragment, useCallback, useId, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import {
  ArrowCircleUpRight,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import { Button } from "../Button";
import {
  ProgressCard,
  type ProgressCardProps,
  type ProgressCardStatus,
  type ProgressCardUser,
} from "../ProgressCard";
import { PROGRESS_STATUS_TOKENS } from "../ProgressCard/tokens";

/* ===========================================================================
 * ProgressStepper — collapsible vertical workflow tracker.
 *
 * The **organism** of the progress system: a purple header bar with a
 * collapse toggle + title, and a body containing a left **dot rail** + dashed
 * connectors and a stack of `ProgressCard` atoms, with an optional **View
 * Details** footer button.
 *
 * The card rendering lives in `ProgressCard` (status colours, badge, avatar,
 * remarks). This component handles only:
 *   - the panel shell (header + body + collapse),
 *   - the rail (coloured dots + dashed connectors), and
 *   - the footer action.
 *
 * Status colour tokens come from the shared `PROGRESS_STATUS_TOKENS` map so
 * the rail dot/connector stays in sync with the card it sits next to.
 * ========================================================================= */

/** Re-export so consumers can type their step lists from this entrypoint. */
export type { ProgressCardStatus, ProgressCardUser };
/** @deprecated Renamed to {@link ProgressCardStatus}. */
export type ProgressStepStatus = ProgressCardStatus;
/** @deprecated Renamed to {@link ProgressCardUser}. */
export type ProgressStepUser = ProgressCardUser;

/**
 * A single row in the stepper — the `ProgressCard` props plus a stable `id`
 * used as the React key.
 */
export interface ProgressStep extends ProgressCardProps {
  /** Stable identifier — used as React key when present. */
  id?: string;
}

export interface ProgressStepperProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The workflow steps, in order. */
  steps: ProgressStep[];
  /** Header title. Defaults to `"Progress"`. */
  title?: ReactNode;

  /* ----- collapse ---------------------------------------------------- */
  /** Allow the user to collapse the body. Defaults to `true`. */
  collapsible?: boolean;
  /** Uncontrolled initial collapsed state. Defaults to `false`. */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state. Pair with `onCollapsedChange`. */
  collapsed?: boolean;
  /** Fires whenever the user toggles the collapse button. */
  onCollapsedChange?: (next: boolean) => void;
  /** Accessible label for the collapse button. Defaults match the state. */
  collapseLabel?: string;

  /* ----- footer ------------------------------------------------------ */
  /** Show the "View Details" footer button. Defaults to `false`. */
  showViewDetails?: boolean;
  /** Label for the footer button. Defaults to `"View Details"`. */
  viewDetailsLabel?: ReactNode;
  /**
   * Icon rendered after the footer button label. Defaults to
   * `<ArrowCircleUpRight />`. Pass `null` for a label-only button.
   */
  viewDetailsIcon?: ReactNode | null;
  /** Click handler for the footer button. */
  onViewDetails?: () => void;
}

/** The coloured dot rendered in the rail next to each step. */
function StepDot({ status }: { status: ProgressCardStatus }) {
  const tokens = PROGRESS_STATUS_TOKENS[status];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full",
        tokens.dotOuter,
      )}
    >
      <span className={cn("size-2.5 rounded-full", tokens.dotInner)} />
    </span>
  );
}

/**
 * `ProgressStepper` — collapsible workflow status tracker.
 *
 * @example Minimal
 * ```jsx
 * <ProgressStepper
 *   steps={[
 *     { id: "creator",  label: "Creator",  status: "success",
 *       timestamp: "Submitted on 05 May 2026",
 *       user: { name: "Amit Mohan", role: "Employee" } },
 *     { id: "verifier", label: "Verifier", status: "pending",
 *       timestamp: "Received on 05 May 2026",
 *       user: { name: "Amit Mohan", role: "Employee" },
 *       remarks: "Need clarification on annexure B" },
 *     { id: "approver", label: "Approver", status: "rejected",
 *       timestamp: "Received on 05 May 2026",
 *       user: { name: "Amit Mohan", role: "Employee" },
 *       remarks: "Application doesn't meet eligibility" },
 *   ]}
 *   showViewDetails
 *   onViewDetails={() => router.push("/applications/123")}
 * />
 * ```
 *
 * @example Controlled collapse
 * ```jsx
 * const [collapsed, setCollapsed] = useState(false);
 *
 * <ProgressStepper
 *   steps={steps}
 *   collapsed={collapsed}
 *   onCollapsedChange={setCollapsed}
 * />
 * ```
 */
export const ProgressStepper = forwardRef<HTMLDivElement, ProgressStepperProps>(
  (
    {
      steps,
      title = "Progress",
      collapsible = true,
      defaultCollapsed = false,
      collapsed: collapsedProp,
      onCollapsedChange,
      collapseLabel,
      showViewDetails = false,
      viewDetailsLabel = "View Details",
      viewDetailsIcon,
      onViewDetails,
      className,
      ...props
    },
    ref,
  ) => {
    const bodyId = useId();
    const isCollapsedControlled = collapsedProp !== undefined;
    const [internalCollapsed, setInternalCollapsed] =
      useState(defaultCollapsed);
    const collapsed = isCollapsedControlled
      ? !!collapsedProp
      : internalCollapsed;

    const toggleCollapsed = useCallback(() => {
      const next = !collapsed;
      if (!isCollapsedControlled) setInternalCollapsed(next);
      onCollapsedChange?.(next);
    }, [collapsed, isCollapsedControlled, onCollapsedChange]);

    const resolvedCollapseLabel =
      collapseLabel ??
      (collapsed ? "Expand progress" : "Collapse progress");

    const CaretIcon = collapsed ? CaretLeft : CaretRight;

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-2xl shadow-card",
          className,
        )}
        {...props}
      >
        {/* Header — always visible. */}
        <div className="flex items-center gap-1.5 bg-purple-700 p-3">
          {collapsible && (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={resolvedCollapseLabel}
              aria-expanded={!collapsed}
              aria-controls={bodyId}
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                "border border-solid border-purple-300 bg-purple-50",
                "text-purple-700 transition-colors",
                "hover:bg-purple-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-purple-700",
              )}
            >
              <CaretIcon className="size-6" aria-hidden="true" />
            </button>
          )}
          <p className="text-base font-semibold leading-tight text-white">
            {title}
          </p>
        </div>

        {/* Body — hidden when collapsed. */}
        <div
          id={bodyId}
          hidden={collapsed}
          className={cn(
            "bg-surface-card px-2 py-3",
            collapsed && "hidden",
          )}
        >
          <div className="grid grid-cols-[20px_1fr] gap-x-2 gap-y-4">
            {steps.map((step, index) => {
              const { id, ...cardProps } = step;
              return (
                <Fragment key={id ?? index}>
                  {/* Dot column — dot + connector to the next row. */}
                  <div className="flex flex-col items-center">
                    <StepDot status={step.status} />
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "mt-1 -mb-4 w-0 flex-1 border-l-2 border-dashed",
                          PROGRESS_STATUS_TOKENS[steps[index + 1]!.status]
                            .connector,
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <ProgressCard {...cardProps} />
                </Fragment>
              );
            })}
          </div>

          {showViewDetails && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="secondary"
                size="small"
                onClick={onViewDetails}
                rightIcon={
                  viewDetailsIcon === null
                    ? undefined
                    : viewDetailsIcon !== undefined
                      ? viewDetailsIcon
                      : <ArrowCircleUpRight aria-hidden="true" />
                }
              >
                {viewDetailsLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  },
);

ProgressStepper.displayName = "ProgressStepper";
