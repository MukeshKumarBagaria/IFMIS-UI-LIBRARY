import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { ArrowsOutSimple, Printer, X } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * PreviewWindow — the IFMIS file/format preview shell, straight from the
 * Figma spec (node 13209:28430).
 *
 * A rounded grey window with a header row (file name on the left; a Print
 * chip + expand + close action cluster on the right) and a large content
 * area below. The content area is a **slot**: pass `children` to render the
 * actual preview (a PDF canvas, an iframe, an image…). When omitted it shows
 * the Figma placeholder ("Replace your format with this frame").
 *
 *   - window   → Surface/Grey-bg (#F7F7F7), 24px radius, soft 30px card
 *                shadow, hairline grey border.
 *   - header   → file name in Header-20 (primary); the action cluster sits in
 *                a pill-shaped grey track holding a bordered "Print" chip and
 *                two round icon buttons (expand / close).
 *   - body     → Grey-200 (#E5E5E5) frame, 16px radius; the placeholder is
 *                centred Header-32 + Header-14 (secondary, upper-case).
 * ========================================================================= */

export interface PreviewWindowProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** File name shown at the top-left (e.g. `"invoice_inv_860"`). */
  title: ReactNode;
  /**
   * The preview content. Omit to render the Figma placeholder frame
   * ("Replace your format with this frame").
   */
  children?: ReactNode;

  /** Label on the print chip. Defaults to `"Print"`. */
  printLabel?: ReactNode;

  /** Print handler. Omit to hide the print chip. */
  onPrint?: () => void;
  /** Expand / full-screen handler. Omit to hide the expand button. */
  onExpand?: () => void;
  /** Close handler. Omit to hide the close button. */
  onClose?: () => void;

  /** Accessible label for the expand button. Defaults to `"Expand preview"`. */
  expandLabel?: string;
  /** Accessible label for the close button. Defaults to `"Close preview"`. */
  closeLabel?: string;

  /** Classes for the grey content frame. */
  bodyClassName?: string;
}

/** Round 32px icon button used by the expand / close actions. */
function HeaderIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full text-body-primary",
        "transition-colors hover:bg-grey-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
      )}
    >
      {children}
    </button>
  );
}

/**
 * `PreviewWindow` — file preview chrome with a print/expand/close header and
 * a content slot.
 *
 * @example Placeholder (default)
 * ```jsx
 * <PreviewWindow title="invoice_inv_860" onPrint={print} onExpand={zoom} onClose={close} />
 * ```
 *
 * @example With real content
 * ```jsx
 * <PreviewWindow title="invoice_inv_860.pdf" onClose={close}>
 *   <iframe src={pdfUrl} title="Invoice" className="size-full rounded-2xl" />
 * </PreviewWindow>
 * ```
 */
export const PreviewWindow = forwardRef<HTMLDivElement, PreviewWindowProps>(
  (
    {
      title,
      children,
      printLabel = "Print",
      onPrint,
      onExpand,
      onClose,
      expandLabel = "Expand preview",
      closeLabel = "Close preview",
      className,
      bodyClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-col gap-5 rounded-3xl border border-surface-border-grey/40 bg-surface-grey-bg p-5",
          "shadow-[0_0_30px_0_rgba(38,38,38,0.10)]",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-h3 text-body-primary">{title}</p>

          {(onPrint || onExpand || onClose) && (
            <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-100/70 p-1">
              {onPrint && (
                <button
                  type="button"
                  onClick={onPrint}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-full border border-surface-border-grey bg-surface-card px-3",
                    "text-h6 text-body-primary transition-colors hover:bg-neutral-100",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  )}
                >
                  <span className="leading-none">{printLabel}</span>
                  <Printer weight="regular" className="size-4 shrink-0" aria-hidden="true" />
                </button>
              )}
              {onExpand && (
                <HeaderIconButton label={expandLabel} onClick={onExpand}>
                  <ArrowsOutSimple weight="bold" className="size-5" aria-hidden="true" />
                </HeaderIconButton>
              )}
              {onClose && (
                <HeaderIconButton label={closeLabel} onClick={onClose}>
                  <X weight="bold" className="size-5" aria-hidden="true" />
                </HeaderIconButton>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <div
          className={cn(
            "flex min-h-[480px] flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl bg-grey-200 text-center",
            bodyClassName,
          )}
        >
          {children ?? (
            <div className="flex flex-col items-center gap-2 px-6">
              <p className="text-h1 text-body-primary">REPLACE YOUR FORMAT WITH THIS FRAME</p>
              <p className="text-h6 uppercase tracking-wide text-body-secondary">
                Feel free to resize the container
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
);

PreviewWindow.displayName = "PreviewWindow";
