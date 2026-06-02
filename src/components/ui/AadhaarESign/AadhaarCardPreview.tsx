import { cn } from "../../../lib/cn";

/* ---------------------------------------------------------------------------
 * AadhaarCardPreview — a self-contained, stylised masked Aadhaar card.
 *
 * Drawn purely with tokens (no bundled image, nothing to expire), it mirrors
 * the generic masked card in the Figma frame: a header strip, a photo block,
 * masked detail lines, and a footer with the masked number + a highlighted
 * last-four. Consumers who want a real card image pass `cardImageSrc` /
 * `cardPreview` to `<AadhaarESign>` instead.
 * ------------------------------------------------------------------------- */

export interface AadhaarCardPreviewProps {
  /** Digits highlighted in the bottom-right circle. Defaults to `8888`. */
  lastFour?: string;
  className?: string;
}

export function AadhaarCardPreview({
  lastFour = "8888",
  className,
}: AadhaarCardPreviewProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "w-[130px] shrink-0 select-none overflow-hidden rounded-sm border border-grey-300 bg-white p-1.5",
        "text-[6px] leading-tight text-grey-600",
        className,
      )}
    >
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-grey-200 pb-0.5">
        <span className="size-2 shrink-0 rounded-full bg-grey-300" />
        <span className="font-semibold tracking-tight text-grey-500">
          GOVERNMENT OF INDIA
        </span>
        <span className="size-2 shrink-0 rounded-full bg-grey-300" />
      </div>

      {/* Photo + details + QR */}
      <div className="flex gap-1 py-1">
        <div className="h-8 w-6 shrink-0 rounded-[1px] bg-grey-200" />
        <div className="flex flex-1 flex-col justify-center gap-0.5">
          <span>NAME : XXXX</span>
          <span>DOB : XXXX</span>
          <span>GENDER : XXXX</span>
        </div>
        <div className="size-6 shrink-0 rounded-[1px] bg-grey-200" />
      </div>

      {/* Masked number + highlighted last-four */}
      <div className="flex items-center justify-center gap-1 border-t border-grey-200 pt-0.5">
        <span className="tracking-widest">**** **** ****</span>
        <span className="rounded-full border border-purple-300 px-1 font-semibold text-purple-700">
          {lastFour}
        </span>
      </div>
    </div>
  );
}
