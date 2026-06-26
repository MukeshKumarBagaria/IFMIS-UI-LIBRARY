import type { Icon } from "@phosphor-icons/react";
import {
  CheckCircle,
  Clock,
  KeyReturn,
  SpinnerGap,
} from "@phosphor-icons/react";

/* ===========================================================================
 * ProgressTracker tokens — the colour maps shared by the stage bar, the
 * stage-timeline rail and the activity-log badges. Kept in one place so a
 * status's colour stays in lock-step everywhere it appears.
 * ========================================================================= */

/** Workflow stage state — drives the top pill bar + timeline rail. */
export type ProgressTrackerStageStatus = "done" | "active" | "pending";

interface StageTokens {
  /** Pill background (gradient image utility). */
  pill: string;
  /** Pill label + caret colour. */
  pillText: string;
  /** Icon-chip background behind the stage glyph. */
  pillIconChip: string;
  /** Icon glyph colour. */
  pillIconColor: string;
  /** Connector-bar colour for the segment leading into this stage. */
  connector: string;
  /** Default glyph for the stage. */
  glyph: Icon;
  /** Timeline dot background. */
  dot: string;
  /** Timeline dot glyph colour. */
  dotIcon: string;
}

export const STAGE_TOKENS: Record<ProgressTrackerStageStatus, StageTokens> = {
  done: {
    pill: "bg-[linear-gradient(90deg,#47EB95_0%,#75F0AF_100%)]",
    pillText: "text-white",
    pillIconChip: "bg-white/85",
    pillIconColor: "text-green-600",
    connector: "#75F0AF",
    glyph: CheckCircle,
    dot: "bg-green-600",
    dotIcon: "text-white",
  },
  active: {
    pill: "bg-[linear-gradient(90deg,#EBC247_0%,#F0D175_100%)]",
    pillText: "text-white",
    pillIconChip: "bg-white/85",
    pillIconColor: "text-yellow-600",
    connector: "#EBC247",
    glyph: Clock,
    dot: "bg-yellow-600",
    dotIcon: "text-white",
  },
  pending: {
    pill: "bg-grey-200",
    pillText: "text-grey-700",
    pillIconChip: "bg-transparent",
    pillIconColor: "text-grey-600",
    connector: "#D4D4D4",
    glyph: Clock,
    dot: "bg-grey-200",
    dotIcon: "text-grey-500",
  },
};

/* -------------------------------------------------------------------------- */
/* Role badge tones (Creator / Verifier / Approver) — outline pills           */
/* -------------------------------------------------------------------------- */

export type ActivityRoleTone = "creator" | "verifier" | "approver" | "neutral";

export const ROLE_BADGE_TOKENS: Record<ActivityRoleTone, string> = {
  creator: "border-blue-200 bg-blue-50 text-blue-800",
  verifier: "border-yellow-200 bg-yellow-50 text-yellow-800",
  approver: "border-orange-200 bg-orange-50 text-orange-800",
  neutral: "border-grey-300 bg-grey-50 text-body-secondary",
};

/* -------------------------------------------------------------------------- */
/* Status badges — Submitted / Pending / Return                               */
/* -------------------------------------------------------------------------- */

export type ActivityStatusTone =
  | "submitted"
  | "pending"
  | "return"
  | "rejected";

interface StatusTokens {
  /** Solid (filled) badge — used in the Stage Timeline. */
  solid: string;
  /** Outline badge — used in the Activity Log card headers. */
  outline: string;
  /** Tinted card surface + border for a remarks card. */
  card: string;
  glyph: Icon;
}

export const STATUS_TOKENS: Record<ActivityStatusTone, StatusTokens> = {
  submitted: {
    solid: "bg-green-100 text-green-700",
    outline: "border-green-300 bg-white text-green-700",
    card: "border-green-200 bg-[linear-gradient(180deg,#E8FCF2_0%,#FFFFFF_55%)]",
    glyph: CheckCircle,
  },
  pending: {
    solid: "bg-yellow-100 text-yellow-700",
    outline: "border-yellow-300 bg-white text-yellow-700",
    card: "border-yellow-200 bg-[linear-gradient(180deg,#FCF7E8_0%,#FFFFFF_55%)]",
    glyph: SpinnerGap,
  },
  return: {
    solid: "bg-orange-100 text-orange-700",
    outline: "border-orange-300 bg-white text-orange-600",
    card: "border-orange-200 bg-[linear-gradient(180deg,#FCF0E8_0%,#FFFFFF_55%)]",
    glyph: KeyReturn,
  },
  rejected: {
    solid: "bg-red-100 text-red-700",
    outline: "border-red-300 bg-white text-red-600",
    card: "border-red-200 bg-[linear-gradient(180deg,#FCE8E8_0%,#FFFFFF_55%)]",
    glyph: KeyReturn,
  },
};
