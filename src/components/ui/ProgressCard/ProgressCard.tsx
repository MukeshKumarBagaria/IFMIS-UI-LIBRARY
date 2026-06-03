import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Clock } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import {
  PROGRESS_STATUS_TOKENS,
  type ProgressCardStatus,
} from "./tokens";

/* ===========================================================================
 * ProgressCard — a single workflow-step card.
 *
 * The status-tinted card from the IFMIS "Progress Cards" Figma frame. One of
 * four statuses (`success` / `pending` / `rejected` / `returned`) drives the
 * card colour, the title colour, the inline badge, the avatar chip, and the
 * remarks side band — every visible part stays in lock-step via the shared
 * `PROGRESS_STATUS_TOKENS` map.
 *
 * Designed as the **atom** of the progress system: usable standalone in any
 * page (a notification banner, a record summary, an audit row…) and composed
 * into `ProgressStepper` for the full workflow visualisation.
 *
 * Per the IFMIS workflow convention, the Creator step should never be
 * `rejected`. The card doesn't enforce this — it's a business rule for the
 * caller.
 * ========================================================================= */

export interface ProgressCardUser {
  /** Full name; rendered as the primary line. */
  name: string;
  /** Role/department; rendered as the secondary line. */
  role?: ReactNode;
  /**
   * Two-letter initials inside the avatar circle. If omitted, derived from
   * the first letters of `name` (up to two words).
   */
  initials?: string;
  /** Optional avatar image URL. If set, the image replaces the initials. */
  avatarSrc?: string;
  /** Alt text for `avatarSrc`. Defaults to `name`. */
  avatarAlt?: string;
}

export interface ProgressCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Visual status — drives card tint, badge, name colour, remarks. */
  status: ProgressCardStatus;
  /** Section title, e.g. `"Creator"`. */
  label: ReactNode;

  /**
   * Badge label. Defaults per status: `Submitted` / `Pending` / `Rejected`
   * / `Returned`. Pass `null` to hide the badge entirely.
   */
  badgeLabel?: ReactNode | null;
  /**
   * Badge glyph. Defaults per status (CheckCircle / Spinner / XCircle /
   * KeyReturn). Pass `null` for a text-only badge.
   */
  badgeIcon?: ReactNode | null;

  /**
   * Timestamp line (rendered with a clock icon). Hidden if omitted.
   * E.g. `"Submitted on 05 May 2026"`.
   */
  timestamp?: ReactNode;

  /** The person attached to this step. */
  user?: ProgressCardUser;

  /**
   * Remarks block — rendered as a tinted side-banded card. Anything truthy
   * shows the block; omit / `null` hides it.
   */
  remarks?: ReactNode;
  /** Heading inside the remarks block. Defaults to `"Remarks"`. */
  remarksTitle?: ReactNode;
}

/** Build initials from a name when the caller didn't supply them. */
export function initialsFromName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]!.charAt(0);
  const second = parts.length > 1 ? parts[parts.length - 1]!.charAt(0) : "";
  return (first + second).toUpperCase();
}

/**
 * `ProgressCard` — a colour-tinted workflow-step card.
 *
 * @example Minimal
 * ```jsx
 * <ProgressCard
 *   status="success"
 *   label="Creator"
 *   timestamp="Submitted on 05 May 2026"
 *   user={{ name: "Amit Mohan", role: "Employee" }}
 * />
 * ```
 *
 * @example Rejected with remarks
 * ```jsx
 * <ProgressCard
 *   status="rejected"
 *   label="Approver"
 *   timestamp="Received on 05 May 2026"
 *   user={{ name: "Amit Mohan", role: "Employee" }}
 *   remarks="Application doesn't meet eligibility under Section 4."
 * />
 * ```
 *
 * @example Custom badge copy
 * ```jsx
 * <ProgressCard
 *   status="pending"
 *   label="Under review"
 *   badgeLabel="In queue"
 *   timestamp="Since 03 Jan 2026"
 * />
 * ```
 *
 * @example Hide the badge
 * ```jsx
 * <ProgressCard status="success" label="Creator" badgeLabel={null} />
 * ```
 */
export const ProgressCard = forwardRef<HTMLDivElement, ProgressCardProps>(
  (
    {
      status,
      label,
      badgeLabel,
      badgeIcon,
      timestamp,
      user,
      remarks,
      remarksTitle = "Remarks",
      className,
      ...props
    },
    ref,
  ) => {
    const tokens = PROGRESS_STATUS_TOKENS[status];

    // Resolve badge content with the status defaults, allowing per-card
    // overrides — including `null` to hide.
    const resolvedBadgeLabel =
      badgeLabel === null
        ? null
        : badgeLabel === undefined
          ? tokens.badgeLabel
          : badgeLabel;

    const DefaultBadgeIcon = tokens.badgeGlyph;
    const resolvedBadgeIcon =
      badgeIcon === null
        ? null
        : badgeIcon === undefined
          ? (
            <DefaultBadgeIcon
              weight={status === "pending" ? "bold" : "fill"}
              aria-hidden="true"
            />
          )
          : badgeIcon;

    const userInitials = user
      ? user.initials || initialsFromName(user.name)
      : null;

    return (
      <div
        ref={ref}
        data-status={status}
        className={cn(
          "flex w-full flex-col gap-4 rounded-2xl border border-solid px-3 py-2",
          tokens.card,
          className,
        )}
        {...props}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                "text-base font-semibold leading-tight",
                tokens.title,
              )}
            >
              {label}
            </p>
            {resolvedBadgeLabel !== null && (
              <span
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-2xl border border-solid px-2 py-0.5",
                  "text-sm font-semibold leading-none whitespace-nowrap",
                  "[&_svg]:size-5 [&_svg]:shrink-0",
                  tokens.badge,
                )}
              >
                {resolvedBadgeIcon !== null && (
                  <span className={cn("inline-flex", tokens.badgeIcon)}>
                    {resolvedBadgeIcon}
                  </span>
                )}
                {resolvedBadgeLabel}
              </span>
            )}
          </div>

          {timestamp != null && (
            <div className="flex items-end gap-1.5">
              <Clock
                className="size-5 shrink-0 text-body-secondary"
                aria-hidden="true"
              />
              <p className="text-sm font-medium leading-[21px] text-body-secondary">
                {timestamp}
              </p>
            </div>
          )}
        </div>

        {(user || remarks) && (
          <div className="flex flex-col gap-3">
            {user && (
              <div className="flex items-start gap-1.5">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-solid",
                    tokens.avatar,
                  )}
                >
                  {user.avatarSrc ? (
                    <img
                      src={user.avatarSrc}
                      alt={user.avatarAlt ?? user.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold leading-none">
                      {userInitials}
                    </span>
                  )}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <p
                    className={cn(
                      "text-sm font-semibold leading-tight",
                      tokens.name,
                    )}
                  >
                    {user.name}
                  </p>
                  {user.role != null && (
                    <p className="text-sm font-medium leading-[21px] text-body-secondary">
                      {user.role}
                    </p>
                  )}
                </div>
              </div>
            )}

            {remarks != null && remarks !== false && (
              <div
                className={cn(
                  "flex w-full flex-col items-start gap-2 rounded-xl border-l-4 border-solid p-3",
                  tokens.remarks,
                )}
              >
                <p
                  className={cn(
                    "text-sm font-semibold leading-tight",
                    tokens.remarksHeading,
                  )}
                >
                  {remarksTitle}
                </p>
                <div className="text-sm font-medium leading-[21px] text-body-secondary">
                  {remarks}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

ProgressCard.displayName = "ProgressCard";
