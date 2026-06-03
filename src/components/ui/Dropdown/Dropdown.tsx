import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { CaretDown, CaretUp, Check } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import { useAnchoredPosition } from "../../../lib/useAnchoredPosition";
import { FormField, FieldIconBox } from "../FormField";

/* ===========================================================================
 * Dropdown — the IFMIS labelled select, straight from the Figma spec.
 *
 * A labelled trigger that opens a popover list of options. One component
 * covers **single** and **multiple** selection and every Figma state:
 *
 *   - default   → grey border (surface-border-grey), white, caret-down affix.
 *   - hover     → neutral-100 fill.
 *   - active    → open: 1.5px purple-500 border + a purple-bordered popover
 *                 (8px below the field). Each option is a 44px purple pill —
 *                 purple-100 when selected, purple-50 when not — with a
 *                 circular check indicator on the left.
 *   - selected  → the trigger swaps the muted placeholder for the chosen
 *                 label(s) in Header-16 (primary, semibold).
 *   - preview   → `previewSelection` renders the chosen labels in a muted
 *                 grey list under the closed field (the "Preview items" frame).
 *   - disabled  → grey-200 border, grey-bg, disabled text.
 *
 * Built on a real `<button role="combobox">` + `role="listbox"` with full
 * keyboard support (arrows / Home / End / Enter / Space / Escape / type-to-
 * open) and `aria-activedescendant`, so focus, AT and forms work for free.
 * Composes `FormField`, so the label, required marker, error/helper subtext
 * and ARIA wiring match every other field in the library.
 *
 * Works **controlled** (`value` + `onValueChange`) or **uncontrolled**
 * (`defaultValue`). `value` is a `string` in single mode and a `string[]` in
 * multiple mode; `onValueChange` reports the same shape.
 * ========================================================================= */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface DropdownOption {
  /** Stable value committed on selection. */
  value: string;
  /** Visible label (any node). */
  label: ReactNode;
  /** Disable this single option (kept visible, not selectable). */
  disabled?: boolean;
}

export interface DropdownProps {
  /** The selectable options, in display order. */
  options: DropdownOption[];
  /** Allow more than one selection. Default `false`. */
  multiple?: boolean;
  /**
   * Controlled selection. `string` in single mode, `string[]` in multiple
   * mode. Pair with `onValueChange`. Omit for uncontrolled (`defaultValue`).
   */
  value?: string | string[];
  /** Uncontrolled initial selection (same shape as `value`). */
  defaultValue?: string | string[];
  /** Fires with the next selection whenever it changes. */
  onValueChange?: (value: string | string[]) => void;
  /** Fires when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /** Empty-state text shown when nothing is selected. */
  placeholder?: ReactNode;
  /** Field label. */
  label?: ReactNode;
  /** Icon shown before the label (auto-sized to 20px). */
  labelIcon?: ReactNode;
  /** Append a required asterisk + `aria-required`. */
  required?: boolean;
  /** Disable the whole control. */
  disabled?: boolean;
  /** Error subtext — reddens the field and shows the alert banner. */
  error?: ReactNode;
  /** Neutral helper subtext (hidden when `error` is set). */
  helperText?: ReactNode;
  /**
   * Render the chosen labels in a muted grey list **below** the closed field
   * (the Figma "Preview items" frame). Handy for multi-select summaries.
   */
  previewSelection?: boolean;
  /**
   * Close the popover after a selection. Defaults to `true` for single and
   * `false` for multiple selection.
   */
  closeOnSelect?: boolean;

  /** Name for hidden form inputs (one per selected value). */
  name?: string;
  /** Explicit control id (otherwise auto-generated). */
  id?: string;
  /** Accessible name for the listbox when `label` isn't a plain string. */
  "aria-label"?: string;

  /** Classes for the outer `FormField` wrapper. */
  className?: string;
  /** Classes for the trigger button. */
  triggerClassName?: string;
  /** Classes for the popover listbox. */
  listboxClassName?: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const toArray = (v: string | string[] | undefined): string[] =>
  v == null ? [] : Array.isArray(v) ? v : [v];

/** Indices of options that can actually be focused/selected. */
const enabledIndices = (options: DropdownOption[]): number[] =>
  options.reduce<number[]>((acc, opt, i) => {
    if (!opt.disabled) acc.push(i);
    return acc;
  }, []);

/* -------------------------------------------------------------------------- */
/* Selection indicator — the circular check on the left of each option        */
/* -------------------------------------------------------------------------- */

function SelectionIndicator({ selected }: { selected: boolean }) {
  return selected ? (
    <span
      aria-hidden="true"
      className="grid size-6 shrink-0 place-items-center rounded-full bg-purple-500 text-white"
    >
      <Check weight="bold" className="size-4" />
    </span>
  ) : (
    <span
      aria-hidden="true"
      className="size-6 shrink-0 rounded-full border-2 border-purple-500"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Dropdown                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * `Dropdown` — labelled single/multiple select with all Figma states.
 *
 * @example Single (uncontrolled)
 * ```jsx
 * <Dropdown
 *   label="Country"
 *   labelIcon={<User />}
 *   placeholder="Select a country"
 *   options={[
 *     { value: "in", label: "India" },
 *     { value: "np", label: "Nepal" },
 *   ]}
 *   onValueChange={(v) => console.log(v)}
 * />
 * ```
 *
 * @example Multiple (controlled) with a preview list
 * ```jsx
 * const [v, setV] = useState(["a"]);
 * <Dropdown
 *   multiple
 *   previewSelection
 *   label="Modules"
 *   value={v}
 *   onValueChange={setV}
 *   options={items}
 * />
 * ```
 */
export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      options,
      multiple = false,
      value,
      defaultValue,
      onValueChange,
      onOpenChange,
      placeholder = "Select…",
      label,
      labelIcon,
      required,
      disabled = false,
      error,
      helperText,
      previewSelection = false,
      closeOnSelect = !multiple,
      name,
      id,
      "aria-label": ariaLabel,
      className,
      triggerClassName,
      listboxClassName,
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState<string[]>(() =>
      toArray(defaultValue),
    );
    const selectedValues = isControlled ? toArray(value) : internal;

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

    // The listbox renders in a portal so it's never clipped by an ancestor's
    // overflow (a scroll container, a table, the Storybook docs preview…).
    const coords = useAnchoredPosition(triggerRef, open);

    const reactId = useId();
    const baseId = id ?? reactId;
    const listboxId = `${baseId}-listbox`;
    const optionId = (index: number) => `${baseId}-option-${index}`;

    const setTriggerRef = (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    };

    const selectedOptions = useMemo(
      () => options.filter((o) => selectedValues.includes(o.value)),
      [options, selectedValues],
    );
    const hasSelection = selectedOptions.length > 0;

    const setOpenState = useCallback(
      (next: boolean) => {
        setOpen(next);
        onOpenChange?.(next);
      },
      [onOpenChange],
    );

    const commit = useCallback(
      (nextValues: string[]) => {
        if (!isControlled) setInternal(nextValues);
        onValueChange?.(multiple ? nextValues : (nextValues[0] ?? ""));
      },
      [isControlled, multiple, onValueChange],
    );

    const openMenu = useCallback(() => {
      if (disabled) return;
      // Start on the first selected option, else the first enabled one.
      const firstSelected = options.findIndex((o) =>
        selectedValues.includes(o.value),
      );
      const fallback = enabledIndices(options)[0] ?? -1;
      setActiveIndex(
        firstSelected >= 0 && !options[firstSelected]?.disabled
          ? firstSelected
          : fallback,
      );
      setOpenState(true);
    }, [disabled, options, selectedValues, setOpenState]);

    const closeMenu = useCallback(
      (refocus = true) => {
        setOpenState(false);
        if (refocus) triggerRef.current?.focus();
      },
      [setOpenState],
    );

    const handleSelect = useCallback(
      (option: DropdownOption) => {
        if (option.disabled) return;
        let next: string[];
        if (multiple) {
          next = selectedValues.includes(option.value)
            ? selectedValues.filter((v) => v !== option.value)
            : [...selectedValues, option.value];
        } else {
          next = [option.value];
        }
        commit(next);
        if (closeOnSelect) closeMenu();
      },
      [multiple, selectedValues, commit, closeOnSelect, closeMenu],
    );

    const moveActive = useCallback(
      (direction: 1 | -1 | "first" | "last") => {
        const enabled = enabledIndices(options);
        if (enabled.length === 0) return;
        if (direction === "first") {
          setActiveIndex(enabled[0]!);
          return;
        }
        if (direction === "last") {
          setActiveIndex(enabled[enabled.length - 1]!);
          return;
        }
        const pos = enabled.indexOf(activeIndex);
        const nextPos =
          pos === -1
            ? direction === 1
              ? 0
              : enabled.length - 1
            : (pos + direction + enabled.length) % enabled.length;
        setActiveIndex(enabled[nextPos]!);
      },
      [options, activeIndex],
    );

    // Keep the active option scrolled into view (guarded — jsdom lacks it).
    useEffect(() => {
      if (open && activeIndex >= 0) {
        optionRefs.current[activeIndex]?.scrollIntoView?.({ block: "nearest" });
      }
    }, [open, activeIndex]);

    // Close on outside pointer-down.
    useEffect(() => {
      if (!open) return;
      const onPointerDown = (event: MouseEvent) => {
        const target = event.target as Node;
        // The listbox is portaled outside the root — exempt it too.
        if (
          rootRef.current?.contains(target) ||
          listRef.current?.contains(target)
        ) {
          return;
        }
        setOpenState(false);
      };
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
    }, [open, setOpenState]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const { key } = event;

      if (!open) {
        if (
          key === "ArrowDown" ||
          key === "ArrowUp" ||
          key === "Enter" ||
          key === " "
        ) {
          event.preventDefault();
          openMenu();
        }
        return;
      }

      switch (key) {
        case "ArrowDown":
          event.preventDefault();
          moveActive(1);
          break;
        case "ArrowUp":
          event.preventDefault();
          moveActive(-1);
          break;
        case "Home":
          event.preventDefault();
          moveActive("first");
          break;
        case "End":
          event.preventDefault();
          moveActive("last");
          break;
        case "Enter":
        case " ": {
          event.preventDefault();
          const option = options[activeIndex];
          if (option) handleSelect(option);
          break;
        }
        case "Escape":
          event.preventDefault();
          closeMenu();
          break;
        case "Tab":
          setOpenState(false);
          break;
        default:
          break;
      }
    };

    // ---- Trigger appearance per state -------------------------------------
    const triggerStateClasses = disabled
      ? "cursor-not-allowed border border-grey-200 bg-surface-grey-bg"
      : open
        ? "border-[1.5px] border-purple-500 bg-surface-card"
        : cn(
            "border border-surface-border-grey bg-surface-card hover:bg-neutral-100",
            "focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500",
          );

    const valueTextClasses = disabled
      ? "font-medium text-body-disabled"
      : hasSelection
        ? "font-semibold text-body-primary"
        : "font-medium text-body-secondary";

    return (
      <FormField
        label={label}
        labelIcon={labelIcon}
        required={required}
        error={error}
        helperText={helperText}
        htmlFor={baseId}
        className={className}
      >
        {({ id: fieldId, describedBy, invalid }) => (
          <div ref={rootRef} className="relative w-full">
            <button
              ref={setTriggerRef}
              id={fieldId}
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={open ? listboxId : undefined}
              aria-activedescendant={
                open && activeIndex >= 0 ? optionId(activeIndex) : undefined
              }
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              aria-required={required || undefined}
              disabled={disabled}
              onClick={() => (open ? closeMenu(false) : openMenu())}
              onKeyDown={handleKeyDown}
              className={cn(
                "flex h-11 w-full items-center justify-between gap-2 rounded-2xl px-3 text-left outline-none transition-colors",
                triggerStateClasses,
                triggerClassName,
              )}
            >
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-body-sm",
                  valueTextClasses,
                )}
              >
                {hasSelection
                  ? selectedOptions.map((o, i) => (
                      <span key={o.value}>
                        {i > 0 ? ", " : ""}
                        {o.label}
                      </span>
                    ))
                  : placeholder}
              </span>
              <FieldIconBox aria-hidden="true" className={cn(disabled && "opacity-60")}>
                {open ? <CaretUp /> : <CaretDown />}
              </FieldIconBox>
            </button>

            {open &&
              coords &&
              createPortal(
                <ul
                  ref={listRef}
                  id={listboxId}
                  role="listbox"
                  aria-multiselectable={multiple || undefined}
                  aria-label={typeof label === "string" ? label : ariaLabel}
                  style={{
                    position: "fixed",
                    top: coords.top,
                    left: coords.left,
                    width: coords.width,
                  }}
                  className={cn(
                    "z-50 flex max-h-72 list-none flex-col gap-3 overflow-auto rounded-2xl border border-surface-border-purple bg-surface-card p-2 shadow-card",
                    listboxClassName,
                  )}
                >
                  {options.length === 0 ? (
                    <li className="px-3 py-2 text-body-sm text-body-secondary">
                      No options
                    </li>
                  ) : (
                    options.map((option, index) => {
                      const selected = selectedValues.includes(option.value);
                      const active = index === activeIndex;
                      return (
                        <li
                          key={option.value}
                          ref={(node) => {
                            optionRefs.current[index] = node;
                          }}
                          id={optionId(index)}
                          role="option"
                          aria-selected={selected}
                          aria-disabled={option.disabled || undefined}
                          onClick={() => handleSelect(option)}
                          onMouseEnter={() =>
                            !option.disabled && setActiveIndex(index)
                          }
                          className={cn(
                            "flex h-11 shrink-0 items-center gap-1.5 rounded-xl px-3 text-body-sm text-body-primary transition-colors",
                            selected
                              ? "bg-purple-100 font-semibold"
                              : "bg-purple-50 font-medium",
                            option.disabled
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer",
                            active && !option.disabled &&
                              "ring-1 ring-purple-300 ring-inset",
                          )}
                        >
                          <SelectionIndicator selected={selected} />
                          <span className="min-w-0 flex-1 truncate">
                            {option.label}
                          </span>
                        </li>
                      );
                    })
                  )}
                </ul>,
                document.body,
              )}

            {previewSelection && hasSelection && (
              <div className="mt-2 flex w-full flex-col gap-2 rounded-2xl bg-surface-grey-bg px-3 py-1 text-body-xs font-normal text-body-secondary">
                {selectedOptions.map((o) => (
                  <p key={o.value} className="w-full">
                    {o.label}
                  </p>
                ))}
              </div>
            )}

            {name &&
              selectedValues.map((v) => (
                <input key={v} type="hidden" name={name} value={v} />
              ))}
          </div>
        )}
      </FormField>
    );
  },
);

Dropdown.displayName = "Dropdown";
