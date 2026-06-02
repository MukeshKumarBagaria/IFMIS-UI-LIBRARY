import { forwardRef, useEffect, useId, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { CheckCircle, Warning, X } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import { Button } from "../Button";
import { OtpInput } from "../OtpInput";

/* ===========================================================================
 * OtpDialog — the "E-Sign" OTP entry dialog from the IFMIS Figma.
 *
 * A purple header (info + title + close), a body (prompt, the masked contact
 * list the code was sent to, a 6-box OtpInput, and an error/success banner),
 * and a grey footer with a **resend countdown**, a **Back** button, and a
 * **Resend OTP** button.
 *
 * Builds on the shared `OtpInput` primitive. The code entry works controlled
 * (`value` + `onChange`) or uncontrolled (`defaultValue`). The resend timer is
 * managed internally from `resendDelay` (or fully controlled via
 * `secondsRemaining`); Resend is enabled only at 0.
 *
 * This is the dialog *panel* — render it inside your app's modal/overlay.
 * ========================================================================= */

export type OtpDialogState = "default" | "error" | "success";

interface BannerTokens {
  banner: string;
  text: string;
  icon: ReactNode;
}

const BANNER: Record<Exclude<OtpDialogState, "default">, BannerTokens> = {
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

/** Default header glyph: a dark disc with a white "i". */
function InfoBadge() {
  return (
    <span className="text-subheading" aria-hidden="true">
      <svg viewBox="0 0 32 32" className="size-8" role="presentation">
        <circle cx="16" cy="16" r="16" fill="currentColor" />
        <circle cx="16" cy="10.5" r="1.7" fill="white" />
        <rect x="14.3" y="14" width="3.4" height="9.5" rx="1.7" fill="white" />
      </svg>
    </span>
  );
}

export interface OtpDialogProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onChange"> {
  /** Header title. Defaults to `"E - Sign"`. */
  title?: ReactNode;
  /** Header leading icon. `null` hides it. Defaults to an info badge. */
  headerIcon?: ReactNode | null;
  /** Body heading. Defaults to `"Enter OTP"`. */
  heading?: ReactNode;
  /** Description above the contact list. Defaults to the 6-digit prompt. */
  description?: ReactNode;
  /**
   * The destinations the code was sent to, shown as a bullet list (e.g.
   * `["*******789", "ad******@gmail.com"]`). Pass `[]` / `null` to hide.
   */
  contacts?: ReactNode[] | null;

  /** Number of digit boxes. Defaults to `6`. */
  length?: number;
  /** Controlled code value. Pair with `onChange`. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Fires with the next code string on every change. */
  onChange?: (value: string) => void;
  /** Fires once when all boxes are filled. */
  onComplete?: (value: string) => void;

  /** Visual state. Defaults to `default`. */
  state?: OtpDialogState;
  /** Banner copy for `error`. Has a sensible default. */
  errorMessage?: ReactNode;
  /** Banner copy for `success`. Has a sensible default. */
  successMessage?: ReactNode;

  /* ----- resend ---------------------------------------------------------- */
  /** Initial countdown (seconds) the component manages internally. Default `30`. */
  resendDelay?: number;
  /** Controlled seconds remaining — overrides the internal timer when set. */
  secondsRemaining?: number;
  /** Fires when Resend OTP is clicked; the internal timer restarts. */
  onResend?: () => void;
  /** Resend button label. Defaults to `"Resend OTP"`. */
  resendLabel?: ReactNode;
  /** Force-disable resend (on top of the countdown). */
  resendDisabled?: boolean;
  /** Builds the footer text from the seconds remaining. */
  formatResendText?: (seconds: number) => ReactNode;

  /* ----- back / close ---------------------------------------------------- */
  /** Show the Back button. Defaults to `true`. */
  showBack?: boolean;
  /** Back button label. Defaults to `"Back"`. */
  backLabel?: ReactNode;
  /** Back handler. */
  onBack?: () => void;
  /** Close (X) handler. Omit to hide the close button. */
  onClose?: () => void;
  /** Accessible label for the close button. Defaults to `"Close"`. */
  closeLabel?: string;

  /** Disable the inputs + actions. */
  disabled?: boolean;
}

const defaultResendText = (seconds: number): ReactNode => (
  <>
    You can resend OTP in:{" "}
    <span className="text-subheading">
      {seconds} {seconds === 1 ? "second" : "seconds"}
    </span>
  </>
);

/**
 * `OtpDialog` — OTP entry dialog panel with a resend countdown.
 *
 * @example Uncontrolled with an internal 30s timer
 * ```jsx
 * <OtpDialog
 *   contacts={["*******789", "ad******@gmail.com"]}
 *   onComplete={(code) => verify(code)}
 *   onResend={() => resend()}
 *   onBack={goBack}
 *   onClose={close}
 * />
 * ```
 *
 * @example Controlled value + state
 * ```jsx
 * const [code, setCode] = useState("");
 * const [state, setState] = useState("default");
 *
 * <OtpDialog
 *   value={code}
 *   onChange={(v) => { setCode(v); setState("default"); }}
 *   state={state}
 *   onComplete={async (c) => setState((await verify(c)) ? "success" : "error")}
 *   onResend={resend}
 * />
 * ```
 */
export const OtpDialog = forwardRef<HTMLDivElement, OtpDialogProps>(
  (
    {
      title = "E - Sign",
      headerIcon,
      heading = "Enter OTP",
      description = "Please enter the 6 digit code sent to:",
      contacts = ["*******789", "ad******@gmail.com"],
      length = 6,
      value,
      defaultValue,
      onChange,
      onComplete,
      state = "default",
      errorMessage = "Incorrect OTP, please check the code and try again",
      successMessage = "E - Sign successful",
      resendDelay = 30,
      secondsRemaining,
      onResend,
      resendLabel = "Resend OTP",
      resendDisabled = false,
      formatResendText = defaultResendText,
      showBack = true,
      backLabel = "Back",
      onBack,
      onClose,
      closeLabel = "Close",
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const titleId = useId();

    // Resend countdown: controlled via `secondsRemaining`, else internal.
    const isTimerControlled = secondsRemaining !== undefined;
    const [internalSeconds, setInternalSeconds] = useState(resendDelay);
    // Bumping this restarts the interval effect (on mount and on each resend).
    const [restartNonce, setRestartNonce] = useState(0);
    const seconds = Math.max(0, isTimerControlled ? secondsRemaining : internalSeconds);

    // Reset the internal timer if the configured delay changes.
    useEffect(() => {
      if (!isTimerControlled) setInternalSeconds(resendDelay);
    }, [resendDelay, isTimerControlled]);

    // One interval ticks the countdown down to 0, then stops. Re-created when
    // the timer restarts (`restartNonce`) or the delay changes.
    useEffect(() => {
      if (isTimerControlled) return;
      const id = setInterval(() => {
        setInternalSeconds((s) => {
          if (s <= 1) {
            clearInterval(id);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    }, [isTimerControlled, restartNonce, resendDelay]);

    const handleResend = () => {
      if (!isTimerControlled) {
        setInternalSeconds(resendDelay);
        setRestartNonce((n) => n + 1);
      }
      onResend?.();
    };

    const resendBlocked = disabled || resendDisabled || seconds > 0;

    const banner =
      state === "error"
        ? { ...BANNER.error, content: errorMessage }
        : state === "success"
          ? { ...BANNER.success, content: successMessage }
          : null;

    const contactList = contacts && contacts.length > 0 ? contacts : null;

    return (
      <div
        ref={ref}
        role="dialog"
        aria-labelledby={titleId}
        data-state={state}
        className={cn(
          "flex w-full max-w-[550px] flex-col overflow-hidden rounded-3xl bg-surface-card shadow-card",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-1.5 bg-purple-50 p-2">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {headerIcon === undefined ? <InfoBadge /> : headerIcon}
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
        <div className="flex flex-col gap-8 bg-surface-card px-2 py-5">
          <div className="flex flex-col gap-4">
            <p className="text-h4 text-body-primary">{heading}</p>
            {(description != null || contactList) && (
              <div className="flex flex-col gap-3">
                {description != null && (
                  <p className="text-body-xs font-medium text-body-secondary">
                    {description}
                  </p>
                )}
                {contactList && (
                  <div className="flex w-full items-center rounded-2xl bg-neutral-50 p-2">
                    <ul className="list-disc ps-5 text-body-xs text-subheading">
                      {contactList.map((c, i) => (
                        <li key={i} className="leading-[21px]">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <OtpInput
              length={length}
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
              onComplete={onComplete}
              state={state}
              disabled={disabled}
              aria-label={typeof heading === "string" ? heading : "OTP code"}
            />
            {banner && (
              <div
                role={state === "error" ? "alert" : "status"}
                className={cn(
                  "inline-flex items-center gap-1.5 self-start rounded-xl px-2 py-1",
                  "text-body-xs font-medium",
                  banner.banner,
                  banner.text,
                )}
              >
                {banner.icon}
                <span>{banner.content}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-grey-bg px-2 py-3">
          <p className="text-body-xs font-medium text-body-secondary">
            {formatResendText(seconds)}
          </p>
          <div className="ml-auto flex items-center gap-4">
            {showBack && (
              <Button
                variant="neutral"
                className="w-20"
                onClick={onBack}
                disabled={disabled}
              >
                {backLabel}
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleResend}
              disabled={resendBlocked}
            >
              {resendLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

OtpDialog.displayName = "OtpDialog";
