import { forwardRef } from "react";
import {
  CaretRight,
  CheckCircle,
  CircleNotch,
  FloppyDiskBack,
  KeyReturn,
  XCircle,
} from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/* -------------------------------------------------------------------------- */
/* Base — FormButton                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Colour treatments for the CTA / form action buttons. Each `tone` maps to a
 * semantic intent and a fixed pair of design tokens (rest + hover):
 *
 *   - `primary` — Purple-600 → 700, white label  (Forward / Submit / Approve)
 *   - `success` — Green-200 → 300,  green-800 label (Save)
 *   - `warning` — Orange-200 → 300, orange-800 label (Return)
 *   - `neutral` — white, grey border → darker grey on hover (Reset)
 *   - `danger`  — Red-200 → 300,    red-800 label (Reject)
 *
 * Hover / focus / disabled are native pseudo-class states — you never pass
 * them as props, you just style is handled for you.
 */
export const formButtonVariants = cva(
  [
    "inline-flex h-11 w-[150px] items-center justify-center gap-1.5 px-4",
    "rounded-2xl text-base font-semibold leading-none whitespace-nowrap",
    "transition-colors select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    // Normalise any icon (Phosphor / custom SVG) to 20px and stop it shrinking.
    "[&_svg]:size-5 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      tone: {
        primary: "bg-purple-600 text-white hover:bg-purple-700",
        success: "bg-green-200 text-green-800 hover:bg-green-300",
        warning: "bg-orange-200 text-orange-800 hover:bg-orange-300",
        neutral:
          "bg-white text-grey-700 border border-surface-border-grey hover:border-grey-600",
        danger: "bg-red-200 text-red-800 hover:bg-red-300",
      },
    },
    defaultVariants: {
      tone: "primary",
    },
  },
);

export type FormButtonTone = NonNullable<
  VariantProps<typeof formButtonVariants>["tone"]
>;

export interface FormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof formButtonVariants> {
  /** Icon rendered before the label. */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: React.ReactNode;
  /** Shows a spinner in place of the left icon and disables the button. */
  loading?: boolean;
}

/**
 * `FormButton` — the shared base for every CTA / form action button.
 *
 * Use a `tone` directly when you need a one-off action, or reach for one of
 * the ready-made presets (`ForwardButton`, `SubmitButton`, `SaveButton`, …)
 * which set the tone, icon and default label for you. It spreads all native
 * `<button>` attributes (`onClick`, `type`, `disabled`, `form`, `name`, …).
 *
 * @example
 * ```jsx
 * <FormButton tone="primary" rightIcon={<CaretRight />} onClick={next}>
 *   Continue
 * </FormButton>
 * ```
 */
export const FormButton = forwardRef<HTMLButtonElement, FormButtonProps>(
  (
    {
      tone,
      className,
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      type = "button",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(formButtonVariants({ tone }), className)}
        {...props}
      >
        {loading ? <CircleNotch className="animate-spin" aria-hidden /> : leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  },
);

FormButton.displayName = "FormButton";

/* -------------------------------------------------------------------------- */
/* Presets — the named CTA buttons                                            */
/* -------------------------------------------------------------------------- */

/**
 * Props shared by every preset button. They are `FormButton` props minus the
 * pieces the preset owns (`tone`), but you can still override the label
 * (via `children`) and the icons.
 */
export type PresetButtonProps = Omit<FormButtonProps, "tone">;

/**
 * A preset is a `FormButton` wrapper that also exposes its baked-in `tone` as
 * a static property, so containers like `CtaTray` can detect which tone was
 * clicked without the consumer wiring anything up.
 */
export type PresetButton = React.ForwardRefExoticComponent<
  PresetButtonProps & React.RefAttributes<HTMLButtonElement>
> & { tone: FormButtonTone };

/**
 * Builds a named preset around `FormButton`, baking in the tone, default icon
 * placement and default label while leaving everything overridable.
 */
function createPreset(
  displayName: string,
  tone: FormButtonTone,
  defaultLabel: string,
  options: { left?: React.ReactNode; right?: React.ReactNode } = {},
): PresetButton {
  const Preset = forwardRef<HTMLButtonElement, PresetButtonProps>(
    ({ children, leftIcon, rightIcon, ...props }, ref) => (
      <FormButton
        ref={ref}
        tone={tone}
        leftIcon={leftIcon ?? options.left}
        rightIcon={rightIcon ?? options.right}
        {...props}
      >
        {children ?? defaultLabel}
      </FormButton>
    ),
  ) as PresetButton;
  Preset.displayName = displayName;
  Preset.tone = tone;
  return Preset;
}

/** Primary action that moves the flow forward. Right-aligned caret. */
export const ForwardButton = createPreset("ForwardButton", "primary", "Forward", {
  right: <CaretRight />,
});

/** Primary submit action. Leading check-circle. */
export const SubmitButton = createPreset("SubmitButton", "primary", "Submit", {
  left: <CheckCircle />,
});

/** Primary approve action. Leading check-circle. */
export const ApproveButton = createPreset("ApproveButton", "primary", "Approve", {
  left: <CheckCircle />,
});

/** Positive/save action. Green tone, leading floppy-disk. */
export const SaveButton = createPreset("SaveButton", "success", "Save", {
  left: <FloppyDiskBack />,
});

/** Go-back action. Orange tone, leading return key. */
export const ReturnButton = createPreset("ReturnButton", "warning", "Return", {
  left: <KeyReturn />,
});

/** Clear-the-form action. Outlined neutral tone, no icon by default. */
export const ResetButton = createPreset("ResetButton", "neutral", "Reset");

/** Destructive reject action. Red tone, leading x-circle. */
export const RejectButton = createPreset("RejectButton", "danger", "Reject", {
  left: <XCircle />,
});
