import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * ReferenceIdSuccessCard — the IFMIS "Submitted Successfully" confirmation
 * card, straight from the Figma spec.
 *
 * A green-gradient card that confirms a request was registered and surfaces
 * its reference id in a big dashed pill, with a one-click "Copy" affordance:
 *
 *   ┌──────────────────────────────────────────────┐
 *   │                    ✓ (success icon)            │
 *   │            Grievance Submitted Successfully!   │  ← title (Header-16)
 *   │   ┌────────────────────────────────────────┐  │
 *   │   ┊        SR - BM-BPL - 0001 - 000234      ┊  │  ← id (Header-32, dashed)
 *   │   └────────────────────────────────────────┘  │
 *   │   Your Request has been Registered in the …    │  ← subtext (Medium-14)
 *   │              [ ▢ Copy Grievance ID ]           │  ← copy button (Header-14)
 *   └──────────────────────────────────────────────┘
 *
 * Every piece of text is a prop, so the card is reusable for any "success +
 * reference id" moment (grievance, payment, registration…). The copy button
 * writes `copyValue` (defaults to `referenceId`) to the clipboard, flips to a
 * "Copied!" state for `copiedDuration` ms, and fires `onCopy`.
 *
 * Colours are design tokens (`green-800`, `green-100`, `--brand-gradient-green`)
 * so theming "just works". Built on a plain `<div>` and forwards a ref + any
 * extra `<div>` attributes.
 * ========================================================================= */

export interface ReferenceIdSuccessCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onCopy"> {
  /** The reference id shown large in the dashed pill (e.g. `"SR - BM-BPL - 0001 - 000234"`). */
  referenceId: ReactNode;
  /** Success message title. Defaults to `"Grievance Submitted Successfully!"`. */
  title?: ReactNode;
  /** Supporting line under the id. Defaults to the IFMIS registration message. */
  description?: ReactNode;

  /**
   * Success glyph above the title. Three behaviours:
   *   - **omitted** — the default green check badge.
   *   - **`null`** — no icon.
   *   - **custom node** — your own glyph/badge.
   */
  icon?: ReactNode | null;

  /** Show the copy button. Defaults to `true`. */
  showCopyButton?: boolean;
  /** Copy button label (resting). Defaults to `"Copy Grievance ID"`. */
  copyLabel?: ReactNode;
  /** Copy button label while in the copied state. Defaults to `"Copied!"`. */
  copiedLabel?: ReactNode;
  /**
   * The string written to the clipboard. Defaults to `referenceId` when it's a
   * string; set this explicitly when `referenceId` is a node.
   */
  copyValue?: string;
  /** How long (ms) the button stays in its "Copied!" state. Defaults to `2000`. */
  copiedDuration?: number;
  /** Fires with the copied value after a successful copy. */
  onCopy?: (value: string) => void;

  /** Classes for the dashed id pill. */
  idClassName?: string;
  /** Classes for the copy button. */
  copyButtonClassName?: string;
}

/* -------------------------------------------------------------------------- */
/* Default success badge — green disc + white check                           */
/* -------------------------------------------------------------------------- */

function SuccessBadge() {
  return (
    <span
      aria-hidden="true"
      className="grid size-14 shrink-0 place-items-center rounded-full bg-green-600 text-white"
    >
      <Check weight="bold" className="size-7" />
    </span>
  );
}

/**
 * `ReferenceIdSuccessCard` — green success confirmation card with a copyable
 * reference id. Every label is a prop.
 *
 * @example Basic
 * ```jsx
 * <ReferenceIdSuccessCard referenceId="SR - BM-BPL - 0001 - 000234" />
 * ```
 *
 * @example Fully customised
 * ```jsx
 * <ReferenceIdSuccessCard
 *   title="Payment Successful!"
 *   referenceId="TXN-2026-000912"
 *   description="Your payment has been recorded in the IFMIS-Next Gen System"
 *   copyLabel="Copy Transaction ID"
 *   onCopy={(id) => toast(`Copied ${id}`)}
 * />
 * ```
 */
export const ReferenceIdSuccessCard = forwardRef<
  HTMLDivElement,
  ReferenceIdSuccessCardProps
>(
  (
    {
      referenceId,
      title = "Grievance Submitted Successfully!",
      description = "Your Request has been Registered in the IFMIS-Next Gen System",
      icon,
      showCopyButton = true,
      copyLabel = "Copy Grievance ID",
      copiedLabel = "Copied!",
      copyValue,
      copiedDuration = 2000,
      onCopy,
      idClassName,
      copyButtonClassName,
      className,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Clear any pending reset timer on unmount.
    useEffect(
      () => () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      },
      [],
    );

    const resolvedCopyValue =
      copyValue ?? (typeof referenceId === "string" ? referenceId : "");

    const handleCopy = useCallback(async () => {
      try {
        await navigator.clipboard?.writeText(resolvedCopyValue);
      } catch {
        // Clipboard can reject (permissions / insecure context). We still flag
        // the copied state and fire onCopy so callers can provide a fallback.
      }
      onCopy?.(resolvedCopyValue);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), copiedDuration);
    }, [resolvedCopyValue, onCopy, copiedDuration]);

    const resolvedIcon = icon === undefined ? <SuccessBadge /> : icon;

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full max-w-[657px] flex-col items-center justify-center gap-6 rounded-3xl p-4 text-center",
          "bg-[image:var(--brand-gradient-green)]",
          className,
        )}
        {...props}
      >
        {/* Success header: icon + title */}
        {(resolvedIcon !== null || title) && (
          <div className="flex flex-col items-center gap-2">
            {resolvedIcon}
            {title && (
              <p className="text-h5 font-semibold text-green-800">{title}</p>
            )}
          </div>
        )}

        {/* Reference id — dashed pill */}
        <div
          className={cn(
            "flex w-full items-center justify-center gap-2.5 self-stretch rounded-2xl border border-dashed border-green-800 bg-green-100 p-4",
            idClassName,
          )}
        >
          <span className="text-h1 font-semibold break-words text-green-800">
            {referenceId}
          </span>
        </div>

        {/* Supporting line */}
        {description && (
          <p className="text-body-xs font-medium text-green-800">
            {description}
          </p>
        )}

        {/* Copy button */}
        {showCopyButton && (
          <button
            type="button"
            onClick={handleCopy}
            aria-live="polite"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full border border-green-800 px-5 py-2.5 text-h6 text-green-800 outline-none transition-colors",
              "hover:bg-green-100 focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
              copyButtonClassName,
            )}
          >
            {copied ? (
              <Check weight="bold" aria-hidden="true" className="size-4 shrink-0" />
            ) : (
              <Copy weight="regular" aria-hidden="true" className="size-4 shrink-0" />
            )}
            {copied ? copiedLabel : copyLabel}
          </button>
        )}
      </div>
    );
  },
);

ReferenceIdSuccessCard.displayName = "ReferenceIdSuccessCard";
