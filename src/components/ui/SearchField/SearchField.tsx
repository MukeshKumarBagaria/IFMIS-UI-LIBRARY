import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { createPortal } from "react-dom";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import { useAnchoredPosition } from "../../../lib/useAnchoredPosition";

/* ===========================================================================
 * SearchField — the IFMIS rounded search input, straight from the Figma spec.
 *
 * A 40px-tall, fully-rounded (24px) search box with a leading magnifying-glass
 * icon. Every Figma state is covered:
 *
 *   - default   → grey border (surface-border-grey), white.
 *   - hover     → neutral-100 fill.
 *   - active    → 1.5px purple-500 border; the typed value is Header-16
 *                 (primary, semibold).
 *   - active +  → an autocomplete popover (8px below) of suggestions: each is
 *     suggestion  a 12px pill — purple-100 for the value-match, purple-50 when
 *                 keyboard/hover-active, transparent otherwise — in Header text.
 *   - disabled  → grey-200 border, disabled text.
 *   - collapsed → a 40×40 round icon button that expands into the field
 *                 (`collapsible`), so it can live in a tight toolbar.
 *
 * It's a real `<input role="combobox">` driving a `role="listbox"` with full
 * keyboard support (↑/↓, Home/End, Enter, Esc) and `aria-activedescendant`, so
 * focus, AT and forms work for free. Controlled (`value` + `onValueChange`) or
 * uncontrolled (`defaultValue`); suggestions are auto-filtered by default but
 * you can drive them yourself (`autoFilter={false}`) for server-side search.
 * ========================================================================= */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface SearchSuggestion {
  /** Value committed when the suggestion is chosen. */
  value: string;
  /** Visible label (any node). Defaults to `value`. */
  label?: ReactNode;
  /** Disable this single suggestion (visible, not selectable). */
  disabled?: boolean;
}

export interface SearchFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "size" | "prefix" | "type"
  > {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Fires with the next text on every keystroke / suggestion pick. */
  onValueChange?: (value: string) => void;
  /** Fires on Enter when no suggestion is highlighted (a "submit search"). */
  onSearch?: (value: string) => void;

  /** Autocomplete suggestions. */
  suggestions?: SearchSuggestion[];
  /** Fires when a suggestion is chosen. */
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  /**
   * Filter `suggestions` by the current value (case-insensitive substring).
   * Set `false` to show them verbatim (e.g. server-side results). Default
   * `true`.
   */
  autoFilter?: boolean;
  /** Minimum characters before suggestions appear. Default `1`. */
  minChars?: number;

  /** Swap the leading icon. Defaults to a magnifying glass. */
  icon?: ReactNode;
  /** Placeholder text. Default `"Search…"`. */
  placeholder?: string;
  /** Disable the field. */
  disabled?: boolean;

  /** Render as a 40×40 icon button that expands into the field on click. */
  collapsible?: boolean;
  /** Controlled collapsed state (for `collapsible`). */
  collapsed?: boolean;
  /** Uncontrolled initial collapsed state. Default `true` when collapsible. */
  defaultCollapsed?: boolean;
  /** Fires when the field collapses/expands. */
  onCollapsedChange?: (collapsed: boolean) => void;

  /** Accessible name (recommended when there's no visible label). */
  "aria-label"?: string;
  /** Classes for the outer wrapper. */
  className?: string;
  /** Classes for the search box / input. */
  inputClassName?: string;
  /** Classes for the suggestions listbox. */
  listboxClassName?: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const suggestionText = (s: SearchSuggestion): string =>
  typeof s.label === "string" ? s.label : s.value;

const enabledIndices = (items: SearchSuggestion[]): number[] =>
  items.reduce<number[]>((acc, s, i) => {
    if (!s.disabled) acc.push(i);
    return acc;
  }, []);

/* -------------------------------------------------------------------------- */
/* SearchField                                                                */
/* -------------------------------------------------------------------------- */

/**
 * `SearchField` — rounded search input with autocomplete + collapse.
 *
 * @example Basic (uncontrolled)
 * ```jsx
 * <SearchField aria-label="Search" onSearch={(q) => run(q)} />
 * ```
 *
 * @example With suggestions (controlled)
 * ```jsx
 * const [q, setQ] = useState("");
 * <SearchField
 *   value={q}
 *   onValueChange={setQ}
 *   suggestions={[{ value: "John Doe" }, { value: "John Wick" }]}
 *   onSuggestionSelect={(s) => pick(s.value)}
 * />
 * ```
 *
 * @example Collapsible toolbar icon
 * ```jsx
 * <SearchField collapsible aria-label="Search" />
 * ```
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      onSearch,
      suggestions,
      onSuggestionSelect,
      autoFilter = true,
      minChars = 1,
      icon,
      placeholder = "Search…",
      disabled = false,
      collapsible = false,
      collapsed,
      defaultCollapsed,
      onCollapsedChange,
      "aria-label": ariaLabel,
      className,
      inputClassName,
      listboxClassName,
      onFocus,
      onBlur,
      onKeyDown,
      ...inputProps
    },
    ref,
  ) => {
    // ---- Value (controlled / uncontrolled) --------------------------------
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const currentValue = isControlled ? value : internalValue;

    // ---- Collapse (controlled / uncontrolled) -----------------------------
    const isCollapseControlled = collapsed !== undefined;
    const [internalCollapsed, setInternalCollapsed] = useState(
      defaultCollapsed ?? collapsible,
    );
    const isCollapsed = collapsible
      ? isCollapseControlled
        ? collapsed
        : internalCollapsed
      : false;

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const boxRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
    const focusOnExpand = useRef(false);

    const reactId = useId();
    const listboxId = `${reactId}-listbox`;
    const optionId = (index: number) => `${reactId}-option-${index}`;

    const setInputRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    // ---- Suggestions visible for the current value ------------------------
    const visible = useMemo<SearchSuggestion[]>(() => {
      if (!suggestions || suggestions.length === 0) return [];
      if (!autoFilter) return suggestions;
      const q = currentValue.trim().toLowerCase();
      if (q === "") return suggestions;
      return suggestions.filter((s) =>
        suggestionText(s).toLowerCase().includes(q),
      );
    }, [suggestions, autoFilter, currentValue]);

    const canShowSuggestions =
      !disabled && currentValue.length >= minChars && visible.length > 0;
    const isOpen = open && canShowSuggestions;

    // The suggestions render in a portal so they're never clipped by an
    // ancestor's overflow (a scroll container, a table, the docs preview…).
    const coords = useAnchoredPosition(boxRef, isOpen);

    const setCollapsedState = useCallback(
      (next: boolean) => {
        if (!isCollapseControlled) setInternalCollapsed(next);
        onCollapsedChange?.(next);
      },
      [isCollapseControlled, onCollapsedChange],
    );

    const commitValue = useCallback(
      (next: string) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const closeList = useCallback(() => {
      setOpen(false);
      setActiveIndex(-1);
    }, []);

    const selectSuggestion = useCallback(
      (suggestion: SearchSuggestion) => {
        if (suggestion.disabled) return;
        commitValue(suggestion.value);
        onSuggestionSelect?.(suggestion);
        closeList();
        inputRef.current?.focus();
      },
      [commitValue, onSuggestionSelect, closeList],
    );

    const moveActive = useCallback(
      (direction: 1 | -1 | "first" | "last") => {
        const enabled = enabledIndices(visible);
        if (enabled.length === 0) return;
        if (direction === "first") return setActiveIndex(enabled[0]!);
        if (direction === "last")
          return setActiveIndex(enabled[enabled.length - 1]!);
        const pos = enabled.indexOf(activeIndex);
        const nextPos =
          pos === -1
            ? direction === 1
              ? 0
              : enabled.length - 1
            : (pos + direction + enabled.length) % enabled.length;
        setActiveIndex(enabled[nextPos]!);
      },
      [visible, activeIndex],
    );

    // Keep the active option in view (guarded — jsdom lacks scrollIntoView).
    useEffect(() => {
      if (isOpen && activeIndex >= 0) {
        optionRefs.current[activeIndex]?.scrollIntoView?.({ block: "nearest" });
      }
    }, [isOpen, activeIndex]);

    // Focus the input right after it expands from the collapsed icon.
    useEffect(() => {
      if (!isCollapsed && focusOnExpand.current) {
        focusOnExpand.current = false;
        inputRef.current?.focus();
      }
    }, [isCollapsed]);

    // Close the list (and collapse if empty) on outside pointer-down.
    useEffect(() => {
      const onPointerDown = (event: MouseEvent) => {
        const target = event.target as Node;
        // The suggestions list is portaled outside the root — exempt it too.
        if (
          rootRef.current?.contains(target) ||
          listRef.current?.contains(target)
        ) {
          return;
        }
        closeList();
        if (collapsible && !isCollapseControlled && currentValue === "") {
          setInternalCollapsed(true);
        }
      };
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
    }, [closeList, collapsible, isCollapseControlled, currentValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      commitValue(next);
      setOpen(true);
      setActiveIndex(-1);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (disabled) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) setOpen(true);
          else moveActive(1);
          break;
        case "ArrowUp":
          event.preventDefault();
          if (isOpen) moveActive(-1);
          break;
        case "Home":
          if (isOpen) {
            event.preventDefault();
            moveActive("first");
          }
          break;
        case "End":
          if (isOpen) {
            event.preventDefault();
            moveActive("last");
          }
          break;
        case "Enter": {
          const active = isOpen ? visible[activeIndex] : undefined;
          if (active) {
            event.preventDefault();
            selectSuggestion(active);
          } else {
            onSearch?.(currentValue);
            closeList();
          }
          break;
        }
        case "Escape":
          if (isOpen) {
            event.preventDefault();
            closeList();
          }
          break;
        default:
          break;
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(event);
      if (canShowSuggestions) setOpen(true);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event);
      // Collapse an empty, uncontrolled collapsible field when focus leaves
      // the component entirely (not when moving into the suggestion list).
      if (
        collapsible &&
        !isCollapseControlled &&
        currentValue === "" &&
        !rootRef.current?.contains(event.relatedTarget as Node)
      ) {
        setInternalCollapsed(true);
      }
    };

    // ---- Collapsed icon button --------------------------------------------
    if (isCollapsed) {
      return (
        <button
          type="button"
          aria-label={ariaLabel ?? "Open search"}
          aria-expanded={false}
          disabled={disabled}
          onClick={() => {
            focusOnExpand.current = true;
            setCollapsedState(false);
          }}
          className={cn(
            "flex size-10 items-center justify-center rounded-3xl border bg-white transition-colors",
            disabled
              ? "cursor-not-allowed border-grey-200 text-body-disabled"
              : "border-surface-border-grey text-body-secondary hover:bg-neutral-100",
            className,
          )}
        >
          {icon ?? <MagnifyingGlass className="size-6" weight="regular" />}
        </button>
      );
    }

    // ---- Expanded field ---------------------------------------------------
    const boxClasses = disabled
      ? "cursor-not-allowed border-grey-200 bg-white"
      : cn(
          "border-surface-border-grey bg-white hover:bg-neutral-100",
          "focus-within:border-[1.5px] focus-within:border-purple-500 focus-within:bg-white",
        );

    return (
      <div ref={rootRef} className={cn("relative w-full", className)}>
        <div
          ref={boxRef}
          className={cn(
            "group flex h-10 w-full items-center gap-1.5 rounded-3xl border px-3 transition-colors",
            boxClasses,
            inputClassName,
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex shrink-0 items-center [&_svg]:size-5 [&_svg]:shrink-0",
              disabled
                ? "text-body-disabled"
                : "text-body-secondary group-focus-within:text-body-primary",
            )}
          >
            {icon ?? <MagnifyingGlass weight="regular" />}
          </span>
          <input
            ref={setInputRef}
            type="search"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={isOpen ? listboxId : undefined}
            aria-activedescendant={
              isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined
            }
            aria-autocomplete={suggestions ? "list" : undefined}
            aria-label={ariaLabel}
            disabled={disabled}
            placeholder={placeholder}
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-body-sm font-semibold text-body-primary outline-none",
              "placeholder:font-medium placeholder:text-body-secondary",
              "disabled:cursor-not-allowed disabled:placeholder:text-body-disabled",
              // Strip the native WebKit clear/search affordances — we own the chrome.
              "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
            )}
            {...inputProps}
          />
        </div>

        {isOpen &&
          coords &&
          createPortal(
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-label={ariaLabel ?? "Suggestions"}
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                width: coords.width,
              }}
              className={cn(
                "z-50 flex max-h-72 list-none flex-col gap-3 overflow-auto rounded-2xl border border-surface-border-purple bg-neutral-50 px-1 py-2 shadow-card",
                listboxClassName,
              )}
            >
            {visible.map((suggestion, index) => {
              const selected = suggestion.value === currentValue;
              const active = index === activeIndex;
              return (
                <li
                  key={suggestion.value}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  id={optionId(index)}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={suggestion.disabled || undefined}
                  // Use mousedown so selection fires before the input's blur.
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectSuggestion(suggestion);
                  }}
                  onMouseEnter={() =>
                    !suggestion.disabled && setActiveIndex(index)
                  }
                  className={cn(
                    "flex shrink-0 items-center rounded-xl px-2 py-1.5 text-body-sm leading-6 text-heading transition-colors",
                    selected
                      ? "bg-purple-100 font-medium"
                      : active
                        ? "bg-purple-50 font-normal"
                        : "bg-transparent font-normal",
                    suggestion.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {suggestion.label ?? suggestion.value}
                  </span>
                </li>
              );
            })}
            </ul>,
            document.body,
          )}
      </div>
    );
  },
);

SearchField.displayName = "SearchField";
