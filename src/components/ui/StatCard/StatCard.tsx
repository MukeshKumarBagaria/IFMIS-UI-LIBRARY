import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Files } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * StatCard — a tonal dashboard metric card: title, a value / total counter,
 * a ringed icon, and a gradient progress bar. Five tones map 1:1 to the IFMIS
 * Figma:
 *
 *   purple · green · red · yellow · blue
 *
 * Each tone repaints the surface, the border, the title + value text, the
 * icon ring, and the progress track + fill gradient together. The pale
 * surface / border / track / fill tints live as shared tokens in
 * `_brand.css` (`--statcard-<tone>-*`); the text and icon colours reuse the
 * regular palette steps (`text-purple-800`, `bg-purple-200`, …).
 *
 * Fully responsive — the card fills its container (Figma reference width is
 * 358px). The header row keeps the title + counter on the left and the icon
 * on the right, and the progress bar spans the full width below.
 * ========================================================================= */

export type StatCardTone = "purple" | "green" | "red" | "yellow" | "blue";

interface ToneTokens {
  /** Surface + border on the card container. */
  card: string;
  /** Title + value text colour, and the icon glyph colour. */
  text: string;
  /** Icon ring: 6px outer border + inner fill. */
  iconRing: string;
  /** Progress track background. */
  track: string;
  /** Progress fill gradient. */
  fill: string;
}

const TONE: Record<StatCardTone, ToneTokens> = {
  purple: {
    card: "border-[color:var(--statcard-purple-border)] bg-[var(--statcard-purple-surface)]",
    text: "text-purple-800",
    iconRing: "border-purple-100 bg-purple-200",
    track: "bg-[var(--statcard-purple-track)]",
    fill: "bg-[image:var(--statcard-purple-fill)]",
  },
  green: {
    card: "border-[color:var(--statcard-green-border)] bg-[var(--statcard-green-surface)]",
    text: "text-green-800",
    iconRing: "border-green-100 bg-green-200",
    track: "bg-[var(--statcard-green-track)]",
    fill: "bg-[image:var(--statcard-green-fill)]",
  },
  red: {
    card: "border-[color:var(--statcard-red-border)] bg-[var(--statcard-red-surface)]",
    text: "text-red-800",
    iconRing: "border-red-100 bg-red-200",
    track: "bg-[var(--statcard-red-track)]",
    fill: "bg-[image:var(--statcard-red-fill)]",
  },
  yellow: {
    card: "border-[color:var(--statcard-yellow-border)] bg-[var(--statcard-yellow-surface)]",
    text: "text-yellow-800",
    // Yellow uses the 300 step for the icon fill (per Figma), not 200.
    iconRing: "border-yellow-100 bg-yellow-300",
    track: "bg-[var(--statcard-yellow-track)]",
    fill: "bg-[image:var(--statcard-yellow-fill)]",
  },
  blue: {
    card: "border-[color:var(--statcard-blue-border)] bg-[var(--statcard-blue-surface)]",
    text: "text-blue-800",
    iconRing: "border-blue-100 bg-blue-200",
    track: "bg-[var(--statcard-blue-track)]",
    fill: "bg-[image:var(--statcard-blue-fill)]",
  },
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export interface StatCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Colour tone. Defaults to `purple`. */
  tone?: StatCardTone;
  /** Card heading, e.g. "All Grievance". */
  title: ReactNode;
  /** The current/primary number (rendered large). */
  value: ReactNode;
  /** The total, rendered as `/ {total}`. Omit to show the value alone. */
  total?: ReactNode;
  /**
   * Leading icon. Three behaviours:
   *   - **omitted** — a default Files glyph in the tone colour.
   *   - **`null`** — no icon (and no icon ring).
   *   - **custom node** — your glyph; it inherits the tone colour + is sized.
   */
  icon?: ReactNode | null;
  /**
   * Progress 0–100. When omitted, it's derived from `value / total` if both
   * are numbers; otherwise the bar reads 0.
   */
  progress?: number;
  /** Hide the progress bar entirely. Defaults to `false`. */
  hideProgress?: boolean;
  /** Accessible label for the progress bar. Defaults to `"{value} of {total}"`. */
  progressLabel?: string;
  /** Extra classes for the progress track. */
  progressClassName?: string;
}

/**
 * `StatCard` — tonal dashboard metric card.
 *
 * @example Basic
 * ```jsx
 * <StatCard tone="purple" title="All Grievance" value={13} total={13} />
 * ```
 *
 * @example Explicit progress + custom icon
 * ```jsx
 * <StatCard
 *   tone="green"
 *   title="Resolved"
 *   value={8}
 *   total={20}
 *   progress={40}
 *   icon={<CheckCircle weight="fill" />}
 * />
 * ```
 *
 * @example A responsive grid of stats
 * ```jsx
 * <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
 *   {stats.map((s) => (
 *     <StatCard key={s.id} tone={s.tone} title={s.title} value={s.value} total={s.total} />
 *   ))}
 * </div>
 * ```
 */
export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      tone = "purple",
      title,
      value,
      total,
      icon,
      progress,
      hideProgress = false,
      progressLabel,
      progressClassName,
      className,
      ...props
    },
    ref,
  ) => {
    const t = TONE[tone];

    const derived =
      typeof value === "number" && typeof total === "number" && total > 0
        ? (value / total) * 100
        : 0;
    const pct = clamp(progress ?? derived, 0, 100);
    const pctRounded = Math.round(pct);

    const resolvedIcon =
      icon === undefined ? <Files weight="fill" aria-hidden="true" /> : icon;

    const label =
      progressLabel ?? `${value}${total != null ? ` of ${total}` : ""}`;

    return (
      <div
        ref={ref}
        data-tone={tone}
        className={cn(
          "flex w-full flex-col items-start gap-4 rounded-3xl border p-6",
          t.card,
          className,
        )}
        {...props}
      >
        {/* Header row: title + counter on the left, icon on the right */}
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <h3 className={cn("text-h3 truncate", t.text)}>{title}</h3>
            <p className="flex items-baseline gap-1.5">
              <span className={cn("text-h1 font-semibold", t.text)}>{value}</span>
              {total != null && (
                <span className="text-h4 font-normal text-body-secondary">
                  / {total}
                </span>
              )}
            </p>
          </div>

          {resolvedIcon !== null && (
            <span
              className={cn(
                "flex size-[60px] shrink-0 items-center justify-center rounded-[28px] border-[6px] p-2.5",
                t.iconRing,
                t.text,
                "[&_svg]:size-6 [&_svg]:shrink-0",
              )}
            >
              {resolvedIcon}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {!hideProgress && (
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pctRounded}
            aria-label={label}
            className={cn(
              "h-4 w-full overflow-hidden rounded-2xl",
              t.track,
              progressClassName,
            )}
          >
            <span
              className={cn("block h-full rounded-2xl", t.fill)}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
    );
  },
);

StatCard.displayName = "StatCard";
