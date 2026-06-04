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
import {
  CaretDown,
  CaretUp,
  Check,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
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
 *                 (8px below the field). Each option is a 44px row that fills
 *                 purple-100 only on hover (no fill at rest, no border). In
 *                 **multiple** mode every row carries a circular check
 *                 indicator on the right (filled when selected); single mode
 *                 shows a plain check on the selected row only.
 *   - selected  → single mode swaps the muted placeholder for the chosen label
 *                 in Header-16 (primary, semibold). **Multiple** mode renders
 *                 the selection as removable chips (× clears one); past
 *                 `maxVisibleChips` (default 2) the rest collapse into a
 *                 "+N more" affordance that opens the menu. The open popover
 *                 grows a "Clear all" footer that empties the selection.
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
   * In `multiple` mode, how many selection chips the closed trigger shows
   * before collapsing the rest into a "+N more" affordance. Default `2`.
   */
  maxVisibleChips?: number;
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

  /**
   * Show a search input at the top of the popover that filters the options as
   * you type. Default `false`.
   */
  searchable?: boolean;
  /** Placeholder for the search input. Default `"Search…"`. */
  searchPlaceholder?: string;
  /** Fires with the search query on every keystroke (controlled or not). */
  onSearchChange?: (query: string) => void;
  /**
   * Custom matcher for `searchable`. Receives an option and the lowercased
   * query; return `true` to keep it. Defaults to a case-insensitive substring
   * match on a string `label` (falling back to `value`).
   */
  filterOption?: (option: DropdownOption, query: string) => boolean;
  /** Empty-state text shown when a search yields nothing. Default `"No results"`. */
  noResultsText?: ReactNode;
  /**
   * Flip the popover **above** the field when there isn't room below it (near
   * the bottom of the viewport). Default `true`.
   */
  flip?: boolean;

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
/* Selection indicator — the circular check on the right of a multi-select row */
/* -------------------------------------------------------------------------- */

function SelectionIndicator({ selected }: { selected: boolean }) {
  return selected ? (
    <span
      aria-hidden="true"
      className="grid size-5 shrink-0 place-items-center rounded-full bg-purple-500 text-white"
    >
      <Check weight="bold" className="size-3" />
    </span>
  ) : (
    <span
      aria-hidden="true"
      className="size-5 shrink-0 rounded-full border-[1.5px] border-purple-500"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Selection chip — a removable pill shown in the multi-select trigger         */
/* -------------------------------------------------------------------------- */

function SelectionChip({
  label,
  onRemove,
}: {
  label: ReactNode;
  /** Remove just this value. Called on the × press. */
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex max-w-[10rem] shrink-0 items-center gap-1 rounded-full bg-purple-50 py-0.5 pl-2.5 pr-1 text-body-xs font-medium text-purple-700">
      <span className="truncate">{label}</span>
      {/*
        The chip lives inside the combobox <button>, so the × is a plain span
        (not a nested <button>, which would be invalid). It's aria-hidden — AT
        users remove a value by toggling it off in the list — and stops event
        propagation so it never opens/closes the menu.
      */}
      <span
        aria-hidden="true"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="grid size-4 shrink-0 cursor-pointer place-items-center rounded-full text-purple-700 transition-colors hover:bg-purple-100"
      >
        <X weight="bold" className="size-3" />
      </span>
    </span>
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
      maxVisibleChips = 2,
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
      searchable = false,
      searchPlaceholder = "Search…",
      onSearchChange,
      filterOption,
      noResultsText = "No results",
      flip = true,
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
    const [query, setQuery] = useState("");

    const rootRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const searchRef = useRef<HTMLInputElement | null>(null);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

    // The listbox renders in a portal so it's never clipped by an ancestor's
    // overflow (a scroll container, a table, the Storybook docs preview…).
    // `flip` lets it open upward when there's no room below.
    const coords = useAnchoredPosition(triggerRef, open, { flip });

    // ---- Searchable filtering ---------------------------------------------
    const normalizedQuery = query.trim().toLowerCase();
    const defaultFilter = (option: DropdownOption, q: string) => {
      const text =
        typeof option.label === "string" ? option.label : option.value;
      return text.toLowerCase().includes(q);
    };
    const visibleOptions = useMemo(() => {
      if (!searchable || !normalizedQuery) return options;
      const match = filterOption ?? defaultFilter;
      return options.filter((o) => match(o, normalizedQuery));
    }, [options, searchable, normalizedQuery, filterOption]);

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

    // Remove a single value (the × on a chip). Keeps the menu state untouched.
    const removeValue = useCallback(
      (value: string) => {
        commit(selectedValues.filter((v) => v !== value));
      },
      [commit, selectedValues],
    );

    // Empty the whole selection (the "Clear all" footer button).
    const clearAll = useCallback(() => {
      commit([]);
    }, [commit]);

    const moveActive = useCallback(
      (direction: 1 | -1 | "first" | "last") => {
        const enabled = enabledIndices(visibleOptions);
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
      [visibleOptions, activeIndex],
    );

    // Keep the active option scrolled into view (guarded — jsdom lacks it).
    useEffect(() => {
      if (open && activeIndex >= 0) {
        optionRefs.current[activeIndex]?.scrollIntoView?.({ block: "nearest" });
      }
    }, [open, activeIndex]);

    // Clear the search query whenever the menu closes, so it reopens fresh.
    useEffect(() => {
      if (!open) setQuery("");
    }, [open]);

    // Callback ref: focus the search input the moment it mounts (i.e. when the
    // searchable popover opens). A stable identity means React only runs this
    // on mount/unmount, so it never steals focus mid-type on a reposition.
    const setSearchRef = useCallback((node: HTMLInputElement | null) => {
      searchRef.current = node;
      node?.focus();
    }, []);

    // While actively filtering, keep the active option on the first match.
    useEffect(() => {
      if (!open || !searchable || !normalizedQuery) return;
      setActiveIndex(enabledIndices(visibleOptions)[0] ?? -1);
    }, [open, searchable, normalizedQuery, visibleOptions]);

    const updateQuery = (next: string) => {
      setQuery(next);
      onSearchChange?.(next);
    };

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
          const option = visibleOptions[activeIndex];
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

    // Keyboard handling for the search input: drive the list with the arrows /
    // Enter / Escape, but leave typing (and Home/End cursor moves) to the input.
    const handleSearchKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          moveActive(1);
          break;
        case "ArrowUp":
          event.preventDefault();
          moveActive(-1);
          break;
        case "Enter": {
          event.preventDefault();
          const option = visibleOptions[activeIndex];
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
              {multiple && hasSelection ? (
                // Multi-select: render the selection as removable chips, with a
                // "+N more" affordance once it overflows `maxVisibleChips`.
                <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
                  {selectedOptions.slice(0, maxVisibleChips).map((o) => (
                    <SelectionChip
                      key={o.value}
                      label={o.label}
                      onRemove={() => removeValue(o.value)}
                    />
                  ))}
                  {selectedOptions.length > maxVisibleChips && (
                    <span className="shrink-0 text-body-xs font-medium text-body-secondary">
                      +{selectedOptions.length - maxVisibleChips} more
                    </span>
                  )}
                </span>
              ) : (
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
              )}
              <FieldIconBox aria-hidden="true" className={cn(disabled && "opacity-60")}>
                {open ? <CaretUp /> : <CaretDown />}
              </FieldIconBox>
            </button>

            {open &&
              coords &&
              createPortal(
                <div
                  ref={listRef}
                  style={{
                    position: "fixed",
                    left: coords.left,
                    width: coords.width,
                    // Pin to the bottom of the field, or to its top when flipped.
                    ...(coords.placement === "top"
                      ? { bottom: coords.bottom }
                      : { top: coords.top }),
                    maxHeight: Math.min(288, coords.maxHeight),
                  }}
                  className="z-50 flex flex-col overflow-hidden rounded-2xl border border-surface-border-purple bg-surface-card shadow-card"
                >
                  {/* Search input — filters the list as you type. */}
                  {searchable && (
                    <div className="flex items-center gap-2 border-b border-surface-border-purple/40 px-3 py-2">
                      <MagnifyingGlass
                        aria-hidden="true"
                        className="size-4 shrink-0 text-body-secondary"
                      />
                      <input
                        ref={setSearchRef}
                        type="search"
                        value={query}
                        onChange={(e) => updateQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder}
                        aria-controls={listboxId}
                        aria-activedescendant={
                          activeIndex >= 0 ? optionId(activeIndex) : undefined
                        }
                        className="min-w-0 flex-1 bg-transparent text-body-sm text-body-primary outline-none placeholder:text-body-secondary/70"
                      />
                    </div>
                  )}

                  <ul
                    id={listboxId}
                    role="listbox"
                    aria-multiselectable={multiple || undefined}
                    aria-label={typeof label === "string" ? label : ariaLabel}
                    className={cn(
                      "flex min-h-0 flex-1 list-none flex-col gap-3 overflow-auto p-2",
                      listboxClassName,
                    )}
                  >
                    {visibleOptions.length === 0 ? (
                      <li className="px-3 py-2 text-body-sm text-body-secondary">
                        {searchable && normalizedQuery
                          ? noResultsText
                          : "No options"}
                      </li>
                    ) : (
                      visibleOptions.map((option, index) => {
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
                              "flex h-11 shrink-0 items-center gap-1.5 rounded-lg px-3 text-body-sm text-body-primary transition-colors",
                              selected ? "font-semibold" : "font-medium",
                              // No fill at rest. Hover / keyboard highlight gets a
                              // light fill; a single-select selection keeps a
                              // slightly stronger persistent fill.
                              active && !option.disabled && "bg-purple-50",
                              !multiple && selected && "bg-purple-100",
                              option.disabled
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer",
                            )}
                          >
                            <span className="min-w-0 flex-1 truncate">
                              {option.label}
                            </span>
                            {/*
                              The circular check indicator is a multi-select
                              affordance. Single select leans on the row fill
                              above; the check is a subtle confirmation.
                            */}
                            {multiple ? (
                              <SelectionIndicator selected={selected} />
                            ) : (
                              selected && (
                                <Check
                                  aria-hidden="true"
                                  weight="bold"
                                  className="size-4 shrink-0 text-purple-500"
                                />
                              )
                            )}
                          </li>
                        );
                      })
                    )}
                  </ul>

                  {/* Clear-all footer — multi-select only, shown with a selection. */}
                  {multiple && hasSelection && (
                    <div className="flex justify-end border-t border-surface-border-purple/40 px-2 py-1.5">
                      <button
                        type="button"
                        onClick={clearAll}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-body-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        <X weight="bold" className="size-3.5" />
                        Clear all
                      </button>
                    </div>
                  )}
                </div>,
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
