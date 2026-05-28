import {
  Children,
  cloneElement,
  Fragment,
  forwardRef,
  isValidElement,
  useState,
} from "react";
import { cn } from "../../../lib/cn";
import type { FormButtonTone } from "../FormButton";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The tone that drives the inner pill's background. Mirrors `FormButtonTone`
 * so the tray can recolour itself from whichever button was clicked.
 */
export type CtaTrayTone = FormButtonTone;

/** Horizontal placement of the button pill inside the white card. */
export type CtaTrayAlign = "start" | "center" | "end" | "between";

export interface CtaTrayProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** The action buttons — usually `FormButton` presets, in display order. */
  children: React.ReactNode;
  /**
   * Controlled active tone (colours the pill). Omit to let the tray track it
   * automatically from the last-clicked button.
   */
  tone?: CtaTrayTone;
  /** Initial tone when uncontrolled. Default `"neutral"` (grey). */
  defaultTone?: CtaTrayTone;
  /** Fires whenever a button is clicked, with that button's tone. */
  onToneChange?: (tone: CtaTrayTone) => void;
  /**
   * When `false`, the pill stays neutral grey no matter what's clicked.
   * Default `true`.
   */
  highlight?: boolean;
  /** Where the pill sits in the card. Default `"end"` (right-aligned). */
  align?: CtaTrayAlign;
  /** Accessible label for the button group. Default `"Form actions"`. */
  ariaLabel?: string;
}

/* -------------------------------------------------------------------------- */
/* Tokens                                                                     */
/* -------------------------------------------------------------------------- */

/** Pill background per tone — matches the Figma highlight states 1:1. */
const PILL_BG: Record<CtaTrayTone, string> = {
  neutral: "bg-surface-grey-bg", // #F7F7F7
  primary: "bg-[#F4E9FB]", // light purple (no exact token)
  success: "bg-green-50", // #E8FCF2
  warning: "bg-orange-50", // #FCF0E8
  danger: "bg-red-50", // #FCE8E8
};

const ALIGN: Record<CtaTrayAlign, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

/**
 * Reads a child's tone — first from an explicit `tone` prop (a bare
 * `FormButton`), then from the preset's static `tone` (e.g. `SaveButton`).
 */
function getChildTone(child: React.ReactNode): CtaTrayTone | undefined {
  if (!isValidElement(child)) return undefined;
  const fromProp = (child.props as { tone?: CtaTrayTone }).tone;
  if (fromProp) return fromProp;
  const fromStatic = (child.type as { tone?: CtaTrayTone })?.tone;
  return fromStatic;
}

/**
 * Expands React fragments so buttons grouped in a `<>…</>` are still seen as
 * direct children. (Custom wrapper *components* can't be inspected — pass
 * buttons directly or inside a fragment.)
 */
function flattenChildren(children: React.ReactNode): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Fragment) {
      out.push(
        ...flattenChildren(
          (child.props as { children?: React.ReactNode }).children,
        ),
      );
    } else {
      out.push(child);
    }
  });
  return out;
}

/* -------------------------------------------------------------------------- */
/* CtaTray                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * **CtaTray** — the sticky action bar that sits at the bottom of a form.
 *
 * A white, rounded card holds a rounded "pill" of action buttons. The pill's
 * background tints to match the **last button the user clicked** (purple for
 * Forward, green for Save, orange for Return, red for Reject, grey for Reset)
 * — handled automatically, no wiring required. Just drop `FormButton` presets
 * inside in the order you want.
 *
 * @example Standard tray (auto-highlight)
 * ```jsx
 * import {
 *   CtaTray, ResetButton, RejectButton, ReturnButton, SaveButton, ForwardButton,
 * } from "@ifmis/ui";
 *
 * <CtaTray>
 *   <ResetButton type="reset" />
 *   <RejectButton onClick={reject} />
 *   <ReturnButton onClick={goBack} />
 *   <SaveButton onClick={save} />
 *   <ForwardButton onClick={next} />
 * </CtaTray>
 * ```
 *
 * @example Controlled highlight
 * ```jsx
 * <CtaTray tone={activeTone} onToneChange={setActiveTone}>
 *   ...buttons
 * </CtaTray>
 * ```
 */
export const CtaTray = forwardRef<HTMLDivElement, CtaTrayProps>(
  (
    {
      children,
      tone: controlledTone,
      defaultTone = "neutral",
      onToneChange,
      highlight = true,
      align = "end",
      ariaLabel = "Form actions",
      className,
      ...props
    },
    ref,
  ) => {
    const [internalTone, setInternalTone] = useState<CtaTrayTone>(defaultTone);
    const isControlled = controlledTone !== undefined;
    const activeTone = highlight ? (controlledTone ?? internalTone) : "neutral";

    const handleSelect = (childTone: CtaTrayTone | undefined) => {
      if (!childTone) return;
      if (!isControlled) setInternalTone(childTone);
      onToneChange?.(childTone);
    };

    // Wrap each button's onClick so the pill recolours, while preserving the
    // consumer's own handler. Non-button children pass through untouched.
    const enhanced = flattenChildren(children).map((child, index) => {
      const childTone = getChildTone(child);
      if (!isValidElement(child)) return child;
      const key = child.key ?? index;
      if (!childTone) return cloneElement(child, { key });
      const original = (
        child.props as { onClick?: React.MouseEventHandler<HTMLButtonElement> }
      ).onClick;
      return cloneElement(
        child as React.ReactElement<{
          onClick?: React.MouseEventHandler<HTMLButtonElement>;
          key?: React.Key;
        }>,
        {
          key,
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            handleSelect(childTone);
            original?.(e);
          },
        },
      );
    });

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full items-center rounded-3xl bg-white p-5",
          "shadow-[0_0_50px_0_rgba(0,0,0,0.10)]",
          ALIGN[align],
          className,
        )}
        {...props}
      >
        <div
          role="group"
          aria-label={ariaLabel}
          className={cn(
            "flex items-center gap-6 rounded-[20px] px-3 py-2 transition-colors",
            PILL_BG[activeTone],
          )}
        >
          {enhanced}
        </div>
      </div>
    );
  },
);

CtaTray.displayName = "CtaTray";
