import {
  createContext,
  forwardRef,
  useContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { CaretRight, CheckCircle } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * ActionCard — a status-tinted card with a gradient header, a body, and a
 * footer of small actions. Three tones map 1:1 to the IFMIS Figma:
 *
 *   - `pending` (default) → Brand/OrangeGradient + Orange-600 actions.
 *   - `success`           → Brand/GreenGradient  + Green-600 actions.
 *   - `danger`            → Brand/RedGradient    + Red-600 actions.
 *
 * Two usage shapes are supported, share the same paint:
 *
 *   1. **Prop-driven** — pass `title`, `heading`, `description`, `badge`,
 *      `counter`, `onCancel` / `onOpen`. Best for the common case.
 *   2. **Compound**    — pass `<ActionCard.Header>`, `<ActionCard.Body>`,
 *      `<ActionCard.Footer>` (and `.Badge` / `.Button`) as children when you
 *      need to break out of the standard layout. Sub-parts read the tone from
 *      context so they stay in sync.
 *
 * Fully responsive — the card stretches to fill its container, and the body
 * header and footer rows wrap to a second line on narrow widths.
 * ========================================================================= */

/* -------------------------------------------------------------------------- */
/* Tone                                                                       */
/* -------------------------------------------------------------------------- */

export type ActionCardTone = "pending" | "success" | "danger";

interface ToneTokens {
  /** Gradient background-image utility for the header strip. */
  headerBg: string;
  /** Header title colour. */
  title: string;
  /** Counter ("20 of 30") colour in the footer. */
  counter: string;
  /** Inline SVG fill colour for the default Info icon's outer circle. */
  iconFill: string;
}

const TONE: Record<ActionCardTone, ToneTokens> = {
  pending: {
    headerBg: "bg-[image:var(--brand-gradient-orange)]",
    title: "text-orange-900",
    counter: "text-orange-800",
    iconFill: "var(--brand-orange-900)",
  },
  success: {
    headerBg: "bg-[image:var(--brand-gradient-green)]",
    title: "text-green-900",
    counter: "text-green-800",
    iconFill: "var(--brand-green-900)",
  },
  danger: {
    headerBg: "bg-[image:var(--brand-gradient-red)]",
    title: "text-red-900",
    counter: "text-red-800",
    iconFill: "var(--brand-red-900)",
  },
};

const ActionCardContext = createContext<ActionCardTone>("pending");

/** Read the tone the nearest `<ActionCard>` is using. */
export function useActionCardTone(): ActionCardTone {
  return useContext(ActionCardContext);
}

/* -------------------------------------------------------------------------- */
/* Default Info icon — dark tone-900 circle with a white "i" inside.          */
/* -------------------------------------------------------------------------- */

function DefaultInfoIcon({ tone }: { tone: ActionCardTone }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      className="size-10 shrink-0"
    >
      <circle cx="20" cy="20" r="20" fill={TONE[tone].iconFill} />
      <circle cx="20" cy="13" r="1.75" fill="white" />
      <rect x="18.25" y="17" width="3.5" height="11.5" rx="1.75" fill="white" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export interface ActionCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Leading icon. Three behaviours:
   *   - **omitted** — the default tone-specific Info icon.
   *   - **`null`**  — no icon.
   *   - **custom node** — your glyph (size it yourself).
   */
  icon?: ReactNode | null;
}

/** Gradient header strip. Reads tone from `<ActionCard>` context. */
export const ActionCardHeader = forwardRef<HTMLDivElement, ActionCardHeaderProps>(
  ({ icon, children, className, ...props }, ref) => {
    const tone = useActionCardTone();
    const resolvedIcon = icon === undefined ? <DefaultInfoIcon tone={tone} /> : icon;
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full items-center gap-1.5 self-stretch rounded-t-3xl p-2",
          TONE[tone].headerBg,
          className,
        )}
        {...props}
      >
        {resolvedIcon}
        {children != null && (
          <p
            className={cn(
              "min-w-0 text-h3 [word-break:break-word]",
              TONE[tone].title,
            )}
          >
            {children}
          </p>
        )}
      </div>
    );
  },
);
ActionCardHeader.displayName = "ActionCard.Header";

/* -------------------------------------------------------------------------- */
/* Body                                                                       */
/* -------------------------------------------------------------------------- */

export interface ActionCardBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Bold title on the first row (left). 18px Header. */
  heading?: ReactNode;
  /** Multi-line description below the heading. 14px Body. */
  description?: ReactNode;
  /** Right-aligned badge node on the heading row (typically `<ActionCard.Badge>`). */
  badge?: ReactNode;
}

/** White body block. */
export const ActionCardBody = forwardRef<HTMLDivElement, ActionCardBodyProps>(
  ({ heading, description, badge, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-col items-start gap-2 self-stretch",
          "bg-surface-card px-2 py-5",
          className,
        )}
        {...props}
      >
        {(heading != null || badge != null) && (
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            {heading != null && (
              <p className="text-h4 text-body-primary [word-break:break-word]">
                {heading}
              </p>
            )}
            {badge}
          </div>
        )}
        {description != null && (
          <div className="w-full text-body-xs font-medium text-body-secondary">
            {description}
          </div>
        )}
        {children}
      </div>
    );
  },
);
ActionCardBody.displayName = "ActionCard.Body";

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export interface ActionCardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Left-aligned counter/stat. Inherits a tone-tinted colour. */
  counter?: ReactNode;
}

/** Grey footer tray. Counter on the left, buttons on the right. */
export const ActionCardFooter = forwardRef<HTMLDivElement, ActionCardFooterProps>(
  ({ counter, children, className, ...props }, ref) => {
    const tone = useActionCardTone();
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 self-stretch",
          "rounded-b-3xl bg-surface-grey-bg px-2 py-3",
          className,
        )}
        {...props}
      >
        {counter != null && (
          <span className={cn("text-h3 whitespace-nowrap", TONE[tone].counter)}>
            {counter}
          </span>
        )}
        {children != null && (
          <div className="ml-auto flex flex-wrap items-center gap-3">{children}</div>
        )}
      </div>
    );
  },
);
ActionCardFooter.displayName = "ActionCard.Footer";

/* -------------------------------------------------------------------------- */
/* Badge — neutral grey pill, sits in the body header row.                    */
/* -------------------------------------------------------------------------- */

export interface ActionCardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Leading icon. Defaults to a filled CheckCircle in `grey-800`. Pass `null`
   * to hide.
   */
  icon?: ReactNode | null;
}

const DEFAULT_BADGE_ICON = (
  <CheckCircle weight="fill" className="size-5 text-grey-800" aria-hidden="true" />
);

export const ActionCardBadge = forwardRef<HTMLSpanElement, ActionCardBadgeProps>(
  ({ icon, className, children, ...props }, ref) => {
    const resolvedIcon = icon === undefined ? DEFAULT_BADGE_ICON : icon;
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-2xl border px-3 py-1",
          "border-grey-400 bg-grey-100 text-sm font-semibold text-grey-800 whitespace-nowrap",
          className,
        )}
        {...props}
      >
        {resolvedIcon}
        {children}
      </span>
    );
  },
);
ActionCardBadge.displayName = "ActionCard.Badge";

/* -------------------------------------------------------------------------- */
/* Button — mini 32px button used in the footer; tone-aware.                  */
/* -------------------------------------------------------------------------- */

export const actionCardButtonVariants = cva(
  [
    "inline-flex h-8 items-center justify-center gap-1.5 rounded-2xl px-3",
    "text-sm font-semibold leading-none whitespace-nowrap select-none",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-5 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      tone: { pending: "", success: "", danger: "" },
      kind: { primary: "", outline: "border bg-transparent" },
    },
    compoundVariants: [
      /* pending --------------------------------------------------------- */
      { tone: "pending", kind: "primary", class: "bg-orange-600 text-white hover:bg-orange-700" },
      { tone: "pending", kind: "outline", class: "border-orange-600 text-orange-600 hover:bg-orange-50" },
      /* success --------------------------------------------------------- */
      { tone: "success", kind: "primary", class: "bg-green-600 text-green-950 hover:bg-green-700" },
      { tone: "success", kind: "outline", class: "border-green-950 text-green-950 hover:bg-green-50" },
      /* danger ---------------------------------------------------------- */
      { tone: "danger",  kind: "primary", class: "bg-red-600 text-white hover:bg-red-700" },
      { tone: "danger",  kind: "outline", class: "border-red-600 text-red-600 hover:bg-red-50" },
    ],
    defaultVariants: { tone: "pending", kind: "primary" },
  },
);

export interface ActionCardButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    Pick<VariantProps<typeof actionCardButtonVariants>, "kind"> {
  /** Tone override. Defaults to the surrounding ActionCard's tone. */
  tone?: ActionCardTone;
  /** Trailing icon. Defaults to `CaretRight` on `kind="primary"`; `null` to hide. */
  rightIcon?: ReactNode | null;
}

export const ActionCardButton = forwardRef<HTMLButtonElement, ActionCardButtonProps>(
  (
    { kind = "primary", tone, rightIcon, className, children, ...props },
    ref,
  ) => {
    const inherited = useActionCardTone();
    const resolvedTone = tone ?? inherited;
    const defaultRight =
      kind === "primary" ? <CaretRight weight="light" aria-hidden="true" /> : null;
    const resolvedRight = rightIcon === undefined ? defaultRight : rightIcon;
    return (
      <button
        ref={ref}
        type="button"
        className={cn(actionCardButtonVariants({ tone: resolvedTone, kind }), className)}
        {...props}
      >
        {children}
        {resolvedRight}
      </button>
    );
  },
);
ActionCardButton.displayName = "ActionCard.Button";

/* -------------------------------------------------------------------------- */
/* Root                                                                       */
/* -------------------------------------------------------------------------- */

export interface ActionCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Colour tone. Defaults to `pending`. */
  tone?: ActionCardTone;

  /* ----- prop-driven header --------------------------------------------- */
  /**
   * Header leading icon — `null` to hide, a node to override, omitted for the
   * default Info icon.
   */
  icon?: ReactNode | null;
  /** Header title. */
  title?: ReactNode;

  /* ----- prop-driven body ----------------------------------------------- */
  /** Bold body heading. */
  heading?: ReactNode;
  /** Body description (multi-line allowed). */
  description?: ReactNode;
  /**
   * Body badge:
   *   - `true` → render the default badge labelled `badgeLabel`
   *   - a node → render that node as the badge slot
   *   - `false` / omitted → no badge
   */
  badge?: ReactNode | boolean;
  /** Override the icon on the default badge. */
  badgeIcon?: ReactNode | null;
  /** Label for the default badge. Defaults to `"Badge"`. */
  badgeLabel?: ReactNode;

  /* ----- prop-driven footer --------------------------------------------- */
  /** Left-side counter, e.g. `"20 of 30"`. */
  counter?: ReactNode;
  /** Label on the outline (cancel) button. Defaults to `"Cancel"`. */
  cancelLabel?: ReactNode;
  /** Label on the primary (open) button. Defaults to `"Open"`. */
  openLabel?: ReactNode;
  /** Cancel handler. Omit to hide the cancel button. */
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
  /** Open handler. Omit to hide the open button. */
  onOpen?: React.MouseEventHandler<HTMLButtonElement>;
  /** Hide the footer entirely (overrides counter / handlers). */
  hideFooter?: boolean;

  /**
   * When provided, replaces the prop-driven layout — you compose the card
   * yourself with `<ActionCard.Header>`, `.Body`, `.Footer`, etc.
   */
  children?: ReactNode;
}

interface ActionCardCompound
  extends React.ForwardRefExoticComponent<
    ActionCardProps & React.RefAttributes<HTMLDivElement>
  > {
  Header: typeof ActionCardHeader;
  Body: typeof ActionCardBody;
  Footer: typeof ActionCardFooter;
  Badge: typeof ActionCardBadge;
  Button: typeof ActionCardButton;
}

const ActionCardImpl = forwardRef<HTMLDivElement, ActionCardProps>(
  (
    {
      tone = "pending",
      icon,
      title,
      heading,
      description,
      badge,
      badgeIcon,
      badgeLabel = "Badge",
      counter,
      cancelLabel = "Cancel",
      openLabel = "Open",
      onCancel,
      onOpen,
      hideFooter = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const showFooter = !hideFooter && (counter != null || onCancel || onOpen);

    const renderBadge = (): ReactNode => {
      if (badge == null || badge === false) return null;
      if (badge === true) {
        return <ActionCardBadge icon={badgeIcon}>{badgeLabel}</ActionCardBadge>;
      }
      return badge;
    };

    return (
      <ActionCardContext.Provider value={tone}>
        <div
          ref={ref}
          data-tone={tone}
          className={cn(
            "flex w-full flex-col items-start overflow-hidden rounded-3xl shadow-card",
            className,
          )}
          {...props}
        >
          {children ?? (
            <>
              <ActionCardHeader icon={icon}>{title}</ActionCardHeader>
              <ActionCardBody
                heading={heading}
                description={description}
                badge={renderBadge()}
              />
              {showFooter && (
                <ActionCardFooter counter={counter}>
                  {onCancel && (
                    <ActionCardButton kind="outline" onClick={onCancel}>
                      {cancelLabel}
                    </ActionCardButton>
                  )}
                  {onOpen && (
                    <ActionCardButton kind="primary" onClick={onOpen}>
                      {openLabel}
                    </ActionCardButton>
                  )}
                </ActionCardFooter>
              )}
            </>
          )}
        </div>
      </ActionCardContext.Provider>
    );
  },
);
ActionCardImpl.displayName = "ActionCard";

/**
 * `ActionCard` — status-tinted card with a gradient header, a body, and a
 * footer of small actions. Compose as a single prop-driven block, or break
 * out via the `ActionCard.*` sub-parts.
 *
 * @example Prop-driven (the common case)
 * ```jsx
 * <ActionCard
 *   tone="pending"
 *   title="Pending"
 *   heading="Header"
 *   description="This is a description for this card, feel free to replace the content."
 *   badge
 *   counter="20 of 30"
 *   onCancel={() => ...}
 *   onOpen={() => ...}
 * />
 * ```
 *
 * @example Compound (full control)
 * ```jsx
 * <ActionCard tone="success">
 *   <ActionCard.Header icon={<MyGlyph />}>Submitted</ActionCard.Header>
 *   <ActionCard.Body
 *     heading="Quarterly report"
 *     description="All reviewers approved on 24 May 2026."
 *     badge={<ActionCard.Badge>3 approvers</ActionCard.Badge>}
 *   />
 *   <ActionCard.Footer counter="20 of 30">
 *     <ActionCard.Button kind="outline">Cancel</ActionCard.Button>
 *     <ActionCard.Button>Open</ActionCard.Button>
 *   </ActionCard.Footer>
 * </ActionCard>
 * ```
 */
export const ActionCard = ActionCardImpl as ActionCardCompound;
ActionCard.Header = ActionCardHeader;
ActionCard.Body = ActionCardBody;
ActionCard.Footer = ActionCardFooter;
ActionCard.Badge = ActionCardBadge;
ActionCard.Button = ActionCardButton;
