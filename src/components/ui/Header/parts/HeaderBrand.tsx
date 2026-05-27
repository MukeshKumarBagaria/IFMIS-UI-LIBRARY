import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../../lib/cn";
import logoDefault from "../assets/logo.png";

export interface HeaderBrandProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Logo node — pass an `<img>`, `<svg>`, or any element you want as the
   * brand mark. When omitted, the bundled IFMIS logo is used.
   */
  logo?: ReactNode;
  /**
   * Convenience prop — sets the `src` of the default `<img>` logo.
   * Ignored when `logo` is provided.
   */
  logoSrc?: string;
  /** Accessible label for the default `<img>` logo. */
  logoAlt?: string;
  /** Diameter of the default logo, in pixels. Default `55`. */
  logoSize?: number;
  /**
   * Primary line of branding (e.g. the ministry / department name).
   * Already styled SemiBold 24/white.
   */
  title: string;
  /**
   * Secondary line (e.g. portal name or scheme).
   * Already styled SemiBold 16 / Brand-Neutral-100.
   */
  subtitle?: string;
}

/**
 * `HeaderBrand` — logo + title + subtitle block on the left of the header.
 *
 * Title and subtitle are i18n-ready: pass already-translated strings.
 * The block does not own any locale switching.
 */
export const HeaderBrand = forwardRef<HTMLDivElement, HeaderBrandProps>(
  (
    {
      logo,
      logoSrc = logoDefault,
      logoAlt = "IFMIS",
      logoSize = 55,
      title,
      subtitle,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 sm:gap-3 min-w-0", className)}
        {...props}
      >
        {logo ?? (
          <img
            src={logoSrc}
            alt={logoAlt}
            width={logoSize}
            height={logoSize}
            className="shrink-0 object-contain"
            draggable={false}
          />
        )}
        <div className="flex flex-col justify-center min-w-0">
          <span className="font-sans font-semibold text-[16px] sm:text-[20px] lg:text-[24px] leading-tight text-white truncate">
            {title}
          </span>
          {subtitle ? (
            <span className="hidden sm:block font-sans font-semibold text-[13px] sm:text-[14px] lg:text-[16px] leading-tight text-neutral-100 truncate mt-0.5">
              {subtitle}
            </span>
          ) : null}
        </div>
      </div>
    );
  },
);

HeaderBrand.displayName = "HeaderBrand";
