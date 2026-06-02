import { forwardRef } from "react";
import { cn } from "../../../../lib/cn";
import { GlassSurface } from "./GlassPill";

export interface LanguageOption<T extends string = string> {
  /** Language code, e.g. `"en"`, `"hi"`. */
  value: T;
  /** Visible label, e.g. `"English"`, `"हिन्दी"`. */
  label: string;
  /** Optional accessible name (defaults to `label`). */
  ariaLabel?: string;
}

export interface LanguageToggleProps<T extends string = string> {
  /** Currently selected language code. */
  value: T;
  /** Available languages, rendered in order. Default: English + Hindi. */
  options?: LanguageOption<T>[];
  /** Called with the new code when the user selects a different option. */
  onChange: (value: T) => void;
  /** Optional aria-label for the radiogroup. Default: `"Select language"`. */
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_OPTIONS: LanguageOption[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
];

/**
 * `LanguageToggle` — segmented control for language selection.
 *
 * Renders one rounded pill per option. The selected option flips to a
 * white background with subtle shadow (matches the "Dept shadow" Figma
 * token). All options are real `<button>` elements grouped as a
 * `role="radiogroup"` for keyboard + screen-reader support.
 *
 * The component is fully controlled — the host owns the active code so
 * it can persist + sync with the i18n library of its choice (`react-i18next`,
 * `next-intl`, …).
 *
 * @example
 *   <LanguageToggle
 *     value={lang}
 *     onChange={setLang}
 *     options={[
 *       { value: "en", label: "English" },
 *       { value: "hi", label: "हिन्दी" },
 *     ]}
 *   />
 */
function LanguageToggleInner<T extends string = string>(
  {
    value,
    options = DEFAULT_OPTIONS as LanguageOption<T>[],
    onChange,
    ariaLabel = "Select language",
    className,
  }: LanguageToggleProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <GlassSurface
      ref={ref}
      shape="pill"
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("hidden sm:flex h-[50px] px-3 gap-3", className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.ariaLabel ?? option.label}
            onClick={() => {
              if (!selected) onChange(option.value);
            }}
            className={cn(
              "flex w-20 items-center justify-center px-2 py-2 rounded-[100px]",
              "font-sans font-semibold text-[14px] leading-none",
              "transition-colors focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-white/70",
              selected
                ? "bg-white text-subheading shadow-[0_1px_2px_0_rgba(20,49,107,0.50)]"
                : "text-white hover:bg-white/10",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </GlassSurface>
  );
}

// React derives the devtools name from the render function; give it the
// public component name so it shows as "LanguageToggle" rather than the
// internal "LanguageToggleInner".
LanguageToggleInner.displayName = "LanguageToggle";

export const LanguageToggle = forwardRef(LanguageToggleInner) as <
  T extends string = string,
>(
  props: LanguageToggleProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof LanguageToggleInner>;
