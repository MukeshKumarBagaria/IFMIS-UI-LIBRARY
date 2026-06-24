# Dropdown

> A labelled **select**. One trigger opens a popover list of options; the same component covers **single and multiple** selection, searchable filtering, removable chips, preview lists, and every field state. Built on a real `<button role="combobox">` driving a `role="listbox"`, composing [`FormField`](FormField.md).

```jsx
import { Dropdown } from "@ifmis/ui";
```

- **Type:** Select / combobox (popover rendered in a portal). `ref` forwards to the trigger button.
- **Types:** `DropdownProps`, `DropdownOption`.

---

## Purpose

Replace a native `<select>` with a fully styled, accessible, themeable picker that matches the rest of the form library. Handles single and multi-select with one API.

## When to use

- Choosing one or more values from a known list of options.
- Searchable pickers, multi-select with chips, or selects needing label/error/helper text.

## When NOT to use

- Free-text input with optional suggestions → use [`SearchField`](SearchField.md).
- A small set of mutually exclusive visual options → consider [`SelectionPill`](SelectionPill.md) or [`CheckboxCard`](CheckboxCard.md).
- A plain text field → use [`TextField`](TextField.md).

## Single vs multiple

Add `multiple` to allow more than one selection. Then:
- The popover stays open on select (`closeOnSelect` defaults to `false` for multiple, `true` for single).
- `value`/`onValueChange` switch from `string` to `string[]` automatically.
- The closed trigger shows removable chips, collapsing past `maxVisibleChips` into "+N more".
- The open popover gains a "Clear all" footer; each option row shows a circular check indicator.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `options` | `DropdownOption[]` | — | **Required.** `{ value, label, disabled? }[]`. |
| `multiple` | `boolean` | `false` | Allow multiple selection. |
| `maxVisibleChips` | `number` | `2` | Chips shown before "+N more" (multi). |
| `value` | `string \| string[]` | — | Controlled selection (array in multiple mode). |
| `defaultValue` | `string \| string[]` | — | Uncontrolled initial selection. |
| `onValueChange` | `(value: string \| string[]) => void` | — | Fires on change (array in multiple mode). |
| `onOpenChange` | `(open: boolean) => void` | — | Fires when the popover opens/closes. |
| `placeholder` | `ReactNode` | `"Select…"` | Empty-state text. |
| `label` | `ReactNode` | — | Field label. |
| `labelIcon` | `ReactNode` | — | Icon before the label (20px). |
| `required` | `boolean` | `false` | Red asterisk + `aria-required`. |
| `disabled` | `boolean` | `false` | Disable the whole control. |
| `error` | `ReactNode` | — | Error subtext + invalid styling. |
| `helperText` | `ReactNode` | — | Neutral helper subtext (hidden when `error` set). |
| `previewSelection` | `boolean` | `false` | List chosen labels in a muted box below the closed field. |
| `closeOnSelect` | `boolean` | `!multiple` | Close the popover after a selection. |
| `searchable` | `boolean` | `false` | Show a search box that filters options. |
| `searchPlaceholder` | `string` | `"Search…"` | Placeholder for the search box. |
| `onSearchChange` | `(query: string) => void` | — | Fires with the search query on each keystroke. |
| `filterOption` | `(opt, query) => boolean` | substring match | Custom search matcher (query is lowercased). |
| `noResultsText` | `ReactNode` | `"No results"` | Empty state when a search matches nothing. |
| `flip` | `boolean` | `true` | Open upward when there's no room below. |
| `name` | `string` | — | Emit hidden `<input>`s (one per selected value) for form submission. |
| `id` | `string` | auto | Explicit control id. |
| `aria-label` | `string` | — | Accessible name for the listbox when `label` isn't a plain string. |
| `className` | `string` | — | Classes for the outer `FormField`. |
| `triggerClassName` | `string` | — | Classes for the trigger button. |
| `listboxClassName` | `string` | — | Classes for the popover listbox. |

### `DropdownOption`

| Field | Type | Notes |
| --- | --- | --- |
| `value` | `string` | **Required.** Stable value committed on selection. |
| `label` | `ReactNode` | **Required.** Visible label. |
| `disabled` | `boolean` | Keep visible but not selectable. |

## Usage examples

### Single (uncontrolled)

```jsx
import { Dropdown } from "@ifmis/ui";
import { User } from "@phosphor-icons/react";

<Dropdown
  label="Country"
  labelIcon={<User />}
  placeholder="Select a country"
  options={[
    { value: "in", label: "India" },
    { value: "np", label: "Nepal" },
  ]}
  onValueChange={(v) => console.log(v)} // string
/>
```

### Multiple with chips + preview

```jsx
const [v, setV] = useState(["in", "bt"]);

<Dropdown
  multiple
  previewSelection
  maxVisibleChips={2}
  label="Countries"
  value={v}
  onValueChange={setV}        // string[]
  options={countries}
/>
```

### Searchable (filter as you type)

```jsx
<Dropdown
  searchable
  label="Country"
  options={countries}
  onSearchChange={(q) => maybeFetch(q)}
/>
```

### Controlled single

```jsx
const [value, setValue] = useState("in");
<Dropdown label="Country" value={value} onValueChange={setValue} options={countries} />
```

### With error / disabled option

```jsx
<Dropdown label="Country" required error="Please choose a country" options={countries} />
<Dropdown label="Plan" options={[{ value: "pro", label: "Pro", disabled: true }, ...]} />
```

### Native form submission

```jsx
<form onSubmit={…}>
  <Dropdown name="country" label="Country" options={countries} />
  <button type="submit">Save</button>
</form>
```

## Best practices

- In multiple mode, expect `string[]` from `onValueChange`; in single mode, `string`.
- Pass `name` for native form submission (emits hidden inputs).
- For large/remote lists, wire `searchable` + `onSearchChange` to a server query and pass back the filtered `options`.
- The field is `width: 100%` — constrain it via the parent (`max-w-sm`).
- Keep the popover usable on small screens — it auto-flips upward near the viewport bottom (override with `flip={false}`).

## Common mistakes

- **Assuming `value` is always a string** — it's `string[]` in multiple mode.
- **Putting the dropdown in an `overflow:hidden` container and worrying about clipping** — the popover is portaled to `document.body`, so it isn't clipped.
- **Expecting `closeOnSelect` to default the same in both modes** — single closes, multiple stays open unless you set it.
- **Wrapping it in your own `FormField`** — it already composes one; pass `label`/`error`/`helperText` directly.

## Accessibility

- Trigger is `<button role="combobox">` with `aria-haspopup="listbox"`, `aria-expanded`, `aria-activedescendant`.
- List is `role="listbox"` (`aria-multiselectable` when multiple); items are `role="option"` with `aria-selected`.
- **Keys:** `↓`/`↑` move active option (skipping disabled), `Home`/`End` jump, `Enter`/`Space` select, `Esc` closes and refocuses the trigger; `↓`/`Enter`/`Space` open a closed menu.
- Clicking outside closes; label is tied to the trigger via `htmlFor`/`id`.
- Selection chips' `×` are `aria-hidden` (AT users toggle in the list).

## Related components

- [`FormField`](FormField.md) — the field wrapper it composes.
- [`SearchField`](SearchField.md) — free-text input with suggestions.
- [`TextField`](TextField.md) — single-line text input.
- [`Label`](Label.md) — standalone field label.
