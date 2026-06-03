import { forwardRef, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Info, type Icon } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";

/* ===========================================================================
 * ConfirmationPopup — the IFMIS "Are you sure?" confirmation panel.
 *
 * A 400px-wide column with a soft orange→white gradient background, a
 * circular brand icon, a short prompt, and a paired *cancel / confirm*
 * action row (outlined "No" + solid "Yes" by default).
 *
 * Everything user-visible is overridable: the icon glyph and its colour,
 * the title text, both button labels, both button styles, and the handlers.
 * The defaults match the Figma frame exactly so the bare component is
 * drop-in.
 *
 * This is the popup *panel* — render it inside your app's modal/overlay.
 * It exposes `role="alertdialog"` and is labelled by its title.
 * ========================================================================= */

export interface ConfirmationPopupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Body prompt. Defaults to `"Are you sure of this action?"`. */
  title?: ReactNode;

  /**
   * Leading glyph. Three behaviours:
   *   - **omitted** — renders the default Info icon (filled, 60×60).
   *   - **`null`** — no icon is rendered.
   *   - **custom node** — your own element; sized by the caller.
   */
  icon?: ReactNode;
  /**
   * Tailwind text-colour class applied to the default icon (icon glyph
   * inherits `currentColor`). Defaults to `"text-orange-600"`. Ignored when
   * a custom `icon` node is supplied — colour that yourself.
   */
  iconColorClassName?: string;

  /** Confirm button label. Defaults to `"Yes"`. */
  confirmLabel?: ReactNode;
  /** Cancel button label. Defaults to `"No"`. */
  cancelLabel?: ReactNode;

  /** Confirm handler. */
  onConfirm?: () => void;
  /** Cancel handler. */
  onCancel?: () => void;

  /**
   * Merged onto the confirm button. Pass to override the default solid
   * orange treatment (background, text colour, radius, size…).
   */
  confirmButtonClassName?: string;
  /**
   * Merged onto the cancel button. Pass to override the default outlined
   * orange treatment.
   */
  cancelButtonClassName?: string;

  /** Disable both action buttons. */
  disabled?: boolean;
}

/**
 * `ConfirmationPopup` — confirm/cancel panel with the IFMIS gradient.
 *
 * @example Default
 * ```jsx
 * <ConfirmationPopup
 *   onConfirm={() => submit()}
 *   onCancel={() => close()}
 * />
 * ```
 *
 * @example Custom copy + custom icon colour
 * ```jsx
 * <ConfirmationPopup
 *   title="Discard this draft?"
 *   confirmLabel="Discard"
 *   cancelLabel="Keep editing"
 *   iconColorClassName="text-red-600"
 *   onConfirm={discard}
 *   onCancel={close}
 * />
 * ```
 *
 * @example Custom icon + button palette
 * ```jsx
 * <ConfirmationPopup
 *   icon={<Trash size={60} weight="fill" className="text-red-600" />}
 *   confirmButtonClassName="bg-red-600 hover:bg-red-700"
 *   cancelButtonClassName="border-red-600 text-red-600"
 *   onConfirm={remove}
 * />
 * ```
 */
export const ConfirmationPopup = forwardRef<
  HTMLDivElement,
  ConfirmationPopupProps
>(
  (
    {
      title = "Are you sure of this action?",
      icon,
      iconColorClassName = "text-orange-600",
      confirmLabel = "Yes",
      cancelLabel = "No",
      onConfirm,
      onCancel,
      confirmButtonClassName,
      cancelButtonClassName,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const titleId = useId();

    // Resolve the icon. `null` opts out; otherwise fall back to the default
    // 60px filled Info glyph in the requested colour.
    const renderedIcon: ReactNode =
      icon === null
        ? null
        : icon !== undefined
          ? icon
          : (() => {
              const DefaultIcon: Icon = Info;
              return (
                <DefaultIcon
                  size={60}
                  weight="fill"
                  className={cn("shrink-0", iconColorClassName)}
                  aria-hidden="true"
                />
              );
            })();

    return (
      <div
        ref={ref}
        role="alertdialog"
        aria-labelledby={titleId}
        className={cn(
          "flex w-[400px] max-w-full flex-col items-center justify-center gap-10 rounded-3xl p-5",
          // Gradient from the Figma frame — peach → white, top to bottom.
          "bg-[linear-gradient(180deg,#ECA993_-84.08%,#FFFFFF_46.41%)]",
          className,
        )}
        {...props}
      >
        <div className="flex w-full flex-col items-center gap-4">
          {renderedIcon}
          <p
            id={titleId}
            className="text-h4 text-center text-body-primary"
          >
            {title}
          </p>
        </div>

        <div className="flex w-full items-center justify-center gap-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled}
            className={cn(
              "inline-flex h-11 w-[150px] items-center justify-center rounded-2xl px-3",
              "border-[1.5px] border-orange-600 bg-transparent",
              "text-base font-semibold text-orange-600",
              "transition-colors select-none whitespace-nowrap",
              "hover:bg-orange-50 active:bg-orange-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
              cancelButtonClassName,
            )}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={disabled}
            className={cn(
              "inline-flex h-11 w-[150px] items-center justify-center rounded-2xl px-3",
              "border-[1.5px] border-transparent bg-orange-600",
              "text-base font-semibold text-white",
              "transition-colors select-none whitespace-nowrap",
              "hover:bg-orange-700 active:bg-orange-800",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
              confirmButtonClassName,
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    );
  },
);

ConfirmationPopup.displayName = "ConfirmationPopup";
