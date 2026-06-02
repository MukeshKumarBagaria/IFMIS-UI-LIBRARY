import { forwardRef, useId, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { CheckCircle, PencilSimpleLine, Warning, X } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import { Button } from "../Button";
import { OtpInput } from "../OtpInput";
import { AadhaarCardPreview } from "./AadhaarCardPreview";

/* ===========================================================================
 * AadhaarESign — the "Aadhaar E-Sign" dialog panel from the IFMIS Figma.
 *
 * A purple-tinted header (pen + title + close), a white body (prompt, a
 * masked-number label, a functional segmented digit input, and an Aadhaar
 * card preview), and a grey footer with a "Send OTP" action.
 *
 * Three states drive the input border + an inline message banner:
 *   - `default` — grey boxes, no message.
 *   - `error`   — red boxes + a red "Incorrect number!" banner.
 *   - `success` — green boxes + a green confirmation banner.
 *
 * The digit entry works **controlled** (`value` + `onChange`) or
 * **uncontrolled** (`defaultValue`). This component is the dialog *panel* —
 * render it inside your app's modal/overlay; it exposes `role="dialog"` and is
 * labelled by its header.
 * ========================================================================= */

export type AadhaarESignState = "default" | "error" | "success";

interface MessageTokens {
  banner: string;
  text: string;
  icon: ReactNode;
}

const MESSAGE: Record<Exclude<AadhaarESignState, "default">, MessageTokens> = {
  error: {
    banner: "bg-red-100",
    text: "text-red-800",
    icon: <Warning weight="fill" className="size-5 shrink-0 text-red-600" aria-hidden="true" />,
  },
  success: {
    banner: "bg-green-100",
    text: "text-green-800",
    icon: (
      <CheckCircle weight="fill" className="size-5 shrink-0 text-green-600" aria-hidden="true" />
    ),
  },
};

const DEFAULT_ERROR_MESSAGE: ReactNode = (
  <>
    <span className="font-semibold">Incorrect number!</span>
    <br />
    please check the number and try again
  </>
);

const DEFAULT_SUCCESS_MESSAGE: ReactNode = (
  <span className="font-semibold">Verified successfully</span>
);

export interface AadhaarESignProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onChange" | "onSubmit"> {
  /** Header title. Defaults to `"Aadhaar E - Sign"`. */
  title?: ReactNode;
  /** Header leading icon. `null` hides it. Defaults to a pen glyph. */
  headerIcon?: ReactNode | null;
  /** Body prompt. Defaults to `"Enter the last 4 digits of your Aadhaar ID"`. */
  prompt?: ReactNode;
  /** Label above the boxes. Defaults to `"Aadhaar ID number **** **** ****"`. */
  label?: ReactNode;

  /** Number of digit boxes. Defaults to `4`. */
  length?: number;
  /** Controlled digit value. Pair with `onChange`. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Fires with the next digit string on every change. */
  onChange?: (value: string) => void;

  /** Visual state. Defaults to `default`. */
  state?: AadhaarESignState;
  /** Message shown in the `error` banner. Has a sensible default. */
  errorMessage?: ReactNode;
  /** Message shown in the `success` banner. Has a sensible default. */
  successMessage?: ReactNode;

  /** Submit (Send OTP) handler — receives the current digits. */
  onSubmit?: (value: string) => void;
  /** Submit button label. Defaults to `"Send OTP"`. */
  submitLabel?: ReactNode;
  /** Shows a spinner on the submit button and disables it. */
  submitting?: boolean;
  /** Disable submit until all boxes are filled. Defaults to `false`. */
  requireComplete?: boolean;

  /** Close (X) handler. Omit to hide the close button. */
  onClose?: () => void;
  /** Accessible label for the close button. Defaults to `"Close"`. */
  closeLabel?: string;

  /** `<img>` src for the Aadhaar card preview. */
  cardImageSrc?: string;
  /** Full override of the card slot. `null` hides it. Wins over `cardImageSrc`. */
  cardPreview?: ReactNode;
  /** Digits highlighted on the built-in card preview. Defaults to `"8888"`. */
  cardLastFour?: string;

  /** Disables the whole control (inputs + submit). */
  disabled?: boolean;
}

/**
 * `AadhaarESign` — Aadhaar e-sign / OTP-request dialog panel.
 *
 * @example Uncontrolled
 * ```jsx
 * <AadhaarESign onClose={close} onSubmit={(digits) => sendOtp(digits)} />
 * ```
 *
 * @example Controlled with validation
 * ```jsx
 * const [digits, setDigits] = useState("");
 * const [state, setState] = useState("default");
 *
 * <AadhaarESign
 *   value={digits}
 *   onChange={setDigits}
 *   state={state}
 *   requireComplete
 *   onClose={close}
 *   onSubmit={async (d) => {
 *     const ok = await verifyLastFour(d);
 *     setState(ok ? "success" : "error");
 *   }}
 * />
 * ```
 */
export const AadhaarESign = forwardRef<HTMLDivElement, AadhaarESignProps>(
  (
    {
      title = "Aadhaar E - Sign",
      headerIcon,
      prompt = "Enter the last 4 digits of your Aadhaar ID",
      label = "Aadhaar ID number **** **** ****",
      length = 4,
      value,
      defaultValue = "",
      onChange,
      state = "default",
      errorMessage = DEFAULT_ERROR_MESSAGE,
      successMessage = DEFAULT_SUCCESS_MESSAGE,
      onSubmit,
      submitLabel = "Send OTP",
      submitting = false,
      requireComplete = false,
      onClose,
      closeLabel = "Close",
      cardImageSrc,
      cardPreview,
      cardLastFour,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState(() =>
      defaultValue.replace(/\D/g, "").slice(0, length),
    );
    const digits = (isControlled ? value : internal)
      .replace(/\D/g, "")
      .slice(0, length);

    const titleId = useId();
    const labelId = useId();
    const inputId = useId();

    const setValue = (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const message =
      state === "error"
        ? { ...MESSAGE.error, content: errorMessage }
        : state === "success"
          ? { ...MESSAGE.success, content: successMessage }
          : null;

    const card =
      cardPreview !== undefined ? (
        cardPreview
      ) : cardImageSrc ? (
        <img
          src={cardImageSrc}
          alt="Aadhaar card preview"
          className="h-[78px] w-[130px] shrink-0 rounded-sm border border-grey-300 object-cover"
        />
      ) : (
        <AadhaarCardPreview lastFour={cardLastFour} />
      );

    const submitBlocked =
      disabled || submitting || (requireComplete && digits.length < length);

    return (
      <div
        ref={ref}
        role="dialog"
        aria-labelledby={titleId}
        data-state={state}
        className={cn(
          "flex w-full max-w-[500px] flex-col overflow-hidden rounded-3xl bg-surface-card shadow-card",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-1.5 bg-purple-50 p-2">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {headerIcon === undefined ? (
              <PencilSimpleLine className="size-7 shrink-0 text-heading" aria-hidden="true" />
            ) : (
              headerIcon
            )}
            <p id={titleId} className="text-h3 truncate text-heading">
              {title}
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded text-heading",
                "transition-opacity hover:opacity-70",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              )}
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-10 bg-surface-card px-2 py-5">
          <p className="text-h4 text-body-primary">{prompt}</p>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              <label
                id={labelId}
                htmlFor={inputId}
                className="text-body-xs font-medium text-body-secondary"
              >
                {label}
              </label>

              <OtpInput
                id={inputId}
                length={length}
                value={digits}
                onChange={setValue}
                state={state}
                disabled={disabled}
                aria-label={typeof label === "string" ? label : "Aadhaar ID number"}
              />

              {message && (
                <div
                  role={state === "error" ? "alert" : "status"}
                  className={cn(
                    "flex items-start gap-1.5 self-stretch rounded-xl px-2 py-1",
                    "text-body-xs leading-[21px]",
                    message.banner,
                    message.text,
                  )}
                >
                  {message.icon}
                  <span className="min-w-0">{message.content}</span>
                </div>
              )}
            </div>

            {card}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end bg-surface-grey-bg px-2 py-3">
          <Button
            variant="primary"
            onClick={() => onSubmit?.(digits)}
            disabled={submitBlocked}
            loading={submitting}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    );
  },
);

AadhaarESign.displayName = "AadhaarESign";
