import type { Icon } from "@phosphor-icons/react";
import {
  CheckCircle,
  KeyReturn,
  Spinner,
  XCircle,
} from "@phosphor-icons/react";

/* ===========================================================================
 * Progress status tokens — shared single source of truth.
 *
 * Used by `ProgressCard` (card, badge, avatar, name, remarks) and by
 * `ProgressStepper` (dot rail, dashed connector). Centralising here means a
 * palette change in Figma lands in one place and propagates everywhere.
 * ========================================================================= */

/** The four step statuses supported by the IFMIS workflow tracker. */
export type ProgressCardStatus =
  | "success"
  | "pending"
  | "rejected"
  | "returned";

/** All the visual tokens a single status decides. */
export interface ProgressStatusTokens {
  /** Card surface (border + fill). */
  card: string;
  /** Title (label) text colour. */
  title: string;
  /** Outer dot ring (rendered in the stepper rail). */
  dotOuter: string;
  /** Inner dot fill (rendered in the stepper rail). */
  dotInner: string;
  /** Dashed connector below the dot, pointing to the next step. */
  connector: string;
  /** Avatar circle (background, border, text). */
  avatar: string;
  /** Name line colour. */
  name: string;
  /** Remarks block (background + left band). */
  remarks: string;
  /** Remarks heading colour. */
  remarksHeading: string;
  /** Inline badge: surface, border, and text colour. */
  badge: string;
  /** Inline badge: icon colour. */
  badgeIcon: string;
  /** Default text inside the badge. */
  badgeLabel: string;
  /** Default glyph inside the badge. */
  badgeGlyph: Icon;
}

export const PROGRESS_STATUS_TOKENS: Record<
  ProgressCardStatus,
  ProgressStatusTokens
> = {
  success: {
    card: "border-green-200 bg-green-25",
    title: "text-green-700",
    dotOuter: "bg-green-200",
    dotInner: "bg-green-600",
    connector: "border-green-300",
    avatar: "bg-green-100 border-green-200 text-green-800",
    name: "text-green-800",
    remarks: "bg-green-100 border-l-green-400",
    remarksHeading: "text-green-800",
    badge: "bg-green-100 border-green-400 text-green-800",
    badgeIcon: "text-green-600",
    badgeLabel: "Submitted",
    badgeGlyph: CheckCircle,
  },
  pending: {
    card: "border-yellow-200 bg-yellow-25",
    title: "text-yellow-700",
    dotOuter: "bg-yellow-200",
    dotInner: "bg-yellow-600",
    connector: "border-yellow-300",
    avatar: "bg-yellow-100 border-yellow-200 text-yellow-800",
    name: "text-yellow-800",
    remarks: "bg-yellow-100 border-l-yellow-400",
    remarksHeading: "text-yellow-800",
    badge: "bg-yellow-100 border-yellow-400 text-yellow-800",
    badgeIcon: "text-orange-600",
    badgeLabel: "Pending",
    badgeGlyph: Spinner,
  },
  rejected: {
    card: "border-red-200 bg-red-25",
    title: "text-red-700",
    dotOuter: "bg-red-200",
    dotInner: "bg-red-600",
    connector: "border-red-300",
    avatar: "bg-red-100 border-red-200 text-red-800",
    name: "text-red-800",
    remarks: "bg-red-100 border-l-red-400",
    remarksHeading: "text-red-800",
    badge: "bg-red-100 border-red-400 text-red-800",
    badgeIcon: "text-red-600",
    badgeLabel: "Rejected",
    badgeGlyph: XCircle,
  },
  returned: {
    card: "border-orange-200 bg-orange-25",
    title: "text-orange-700",
    dotOuter: "bg-orange-200",
    dotInner: "bg-orange-600",
    connector: "border-orange-300",
    avatar: "bg-orange-100 border-orange-200 text-orange-800",
    name: "text-orange-800",
    remarks: "bg-orange-100 border-l-orange-400",
    remarksHeading: "text-orange-800",
    badge: "bg-orange-100 border-orange-400 text-orange-800",
    badgeIcon: "text-orange-600",
    badgeLabel: "Returned",
    badgeGlyph: KeyReturn,
  },
};
