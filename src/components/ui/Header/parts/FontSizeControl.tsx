import { forwardRef } from "react";
import { TextAa } from "@phosphor-icons/react";
import { cn } from "../../../../lib/cn";

export type FontSizeStep = "sm" | "md" | "lg";

export interface FontSizeControlProps {
  /** Currently selected step. */
  value: FontSizeStep;
  /** Fired when the user clicks a step. */
  onChange: (value: FontSizeStep) => void;
  /** Visible / accessible labels — i18n-ready. */
  labels?: {
    /** Label for the small step. Default `"Decrease text size"`. */
    sm?: string;
    /** Label for the medium step. Default `"Normal text size"`. */
    md?: string;
    /** Label for the large step. Default `"Increase text size"`. */
    lg?: string;
    /** ARIA label of the surrounding group. Default `"Font size"`. */
    group?: string;
  };
  className?: string;
}

const ORDER: FontSizeStep[] = ["sm", "md", "lg"];

const ICON_SIZE: Record<FontSizeStep, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

const DEFAULT_LABELS: Required<NonNullable<FontSizeControlProps["labels"]>> = {
  sm: "Decrease text size",
  md: "Normal text size",
  lg: "Increase text size",
  group: "Font size",
};

/**
 * `FontSizeControl` — three buttons (A · A · A) that change the document
 * font-size scale.
 *
 * Each step is a real `<button>` with a `Aa` Phosphor glyph sized to
 * communicate the scale visually. The selected step gets a white fill
 * with the Figma "Dept shadow" elevation; the rest stay at 50% white.
 *
 * The component is **fully controlled**. The host is expected to apply
 * the chosen scale globally (e.g. by toggling a class on `<html>` or by
 * setting a CSS variable). See the storybook docs for an example wiring.
 *
 * @example
 *   <FontSizeControl value={size} onChange={setSize} />
 */
export const FontSizeControl = forwardRef<HTMLDivElement, FontSizeControlProps>(
  ({ value, onChange, labels, className }, ref) => {
    const resolved = { ...DEFAULT_LABELS, ...labels };
    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={resolved.group}
        className={cn("flex items-center gap-4 self-stretch", className)}
      >
        {ORDER.map((step) => {
          const selected = step === value;
          return (
            <button
              key={step}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={resolved[step]}
              onClick={() => {
                if (!selected) onChange(step);
              }}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                "transition-colors focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-white/70",
                selected
                  ? "bg-white text-subheading shadow-[0_1px_2px_0_rgba(20,49,107,0.50)]"
                  : "bg-white/50 text-subheading backdrop-blur-[1px] hover:bg-white/70",
              )}
            >
              <TextAa size={ICON_SIZE[step]} weight="regular" aria-hidden />
            </button>
          );
        })}
      </div>
    );
  },
);

FontSizeControl.displayName = "FontSizeControl";
