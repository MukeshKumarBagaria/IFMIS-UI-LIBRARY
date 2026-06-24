# SearchField

> A rounded **search input** with a leading magnifying-glass icon, optional autocomplete suggestions, and a collapsible 40×40 icon variant for tight toolbars. A real `<input role="combobox">` driving a `role="listbox"` popover (portaled).

```jsx
import { SearchField } from "@ifmis/ui";
```

- **Type:** Search input / combobox. `ref` forwards to the `<input>`.
- **Types:** `SearchFieldProps`, `SearchSuggestion`.

---

## Purpose

A free-text search box that can optionally show an autocomplete list. Filters suggestions client-side by default, or accepts server-side results verbatim.

## When to use

- A search box (toolbar, page header, list filter), with or without suggestions.
- A collapsible search icon that expands into a field in a tight toolbar.

## When NOT to use

- Choosing from a fixed list of values → use [`Dropdown`](Dropdown.md).
- A labelled text field for form data → use [`TextField`](TextField.md).

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | — | Controlled text. Pair with `onValueChange`. |
| `defaultValue` | `string` | `""` | Uncontrolled initial text. |
| `onValueChange` | `(value: string) => void` | — | Fires on every change / suggestion pick. |
| `onSearch` | `(value: string) => void` | — | Fires on Enter when no suggestion is active. |
| `suggestions` | `SearchSuggestion[]` | — | `{ value, label?, disabled? }[]`. |
| `onSuggestionSelect` | `(s: SearchSuggestion) => void` | — | Fires when a suggestion is chosen. |
| `autoFilter` | `boolean` | `true` | Filter suggestions by typed text (set `false` for server-side). |
| `minChars` | `number` | `1` | Characters before suggestions appear. |
| `icon` | `ReactNode` | search glyph | Swap the leading icon. |
| `placeholder` | `string` | `"Search…"` | Empty-state text. |
| `disabled` | `boolean` | `false` | Disable the field. |
| `collapsible` | `boolean` | `false` | Render the expandable 40×40 icon button. |
| `collapsed` | `boolean` | — | Controlled collapsed state. |
| `defaultCollapsed` | `boolean` | `true` (when collapsible) | Uncontrolled initial collapsed state. |
| `onCollapsedChange` | `(collapsed: boolean) => void` | — | Fires on collapse/expand. |
| `aria-label` | `string` | — | Accessible name (recommended — no visible label). |
| `className` | `string` | — | Classes for the outer wrapper / icon button. |
| `inputClassName` | `string` | — | Classes for the search box. |
| `listboxClassName` | `string` | — | Classes for the suggestions popover. |

All other native `<input>` attributes (`name`, `autoComplete`, `maxLength`) are forwarded. `SearchSuggestion`: `{ value (required), label? (defaults to value), disabled? }`.

## Usage examples

### Basic

```jsx
<SearchField aria-label="Search" onSearch={(q) => run(q)} />
```

### Client-side suggestions

```jsx
<SearchField
  aria-label="Search people"
  suggestions={[{ value: "John Doe" }, { value: "John Woe" }, { value: "John Wick" }]}
  onSuggestionSelect={(s) => pick(s.value)}
/>
```

### Server-side suggestions

```jsx
<SearchField
  autoFilter={false}
  value={query}
  onValueChange={(q) => { setQuery(q); fetchResults(q); }}
  suggestions={results}
/>
```

### Collapsible toolbar icon

```jsx
<SearchField collapsible aria-label="Search" />
```

### Controlled

```jsx
const [q, setQ] = useState("");
<SearchField value={q} onValueChange={setQ} suggestions={results} />
```

## Best practices

- Always pass `aria-label` — there's no visible label.
- For large/remote datasets, use `autoFilter={false}` + `onValueChange` to fetch and feed `suggestions`.
- Use `onSearch` for the "submit search" (Enter with no highlighted suggestion); use `onSuggestionSelect` for picking a row.
- The field is `width: 100%` — constrain the parent (`max-w-sm`).

## Common mistakes

- **Forgetting `aria-label`** — leaves the field unnamed for screen readers.
- **Leaving `autoFilter` on for server results** — it would double-filter; set `false`.
- **Worrying about overflow clipping** — the popover is portaled to `document.body`.

## Accessibility

- The input is `role="combobox"` with `aria-autocomplete="list"`, `aria-expanded`, `aria-activedescendant`.
- The popover is `role="listbox"`; each suggestion is `role="option"` with `aria-selected`.
- **Keys:** `↓` opens/moves down, `↑` up, `Home`/`End` jump (skip disabled), `Enter` selects active suggestion or fires `onSearch`, `Esc` closes.
- Clicking outside closes the popover (and collapses an empty collapsible field).

## Related components

- [`Dropdown`](Dropdown.md) — select from a fixed list.
- [`TextField`](TextField.md) — labelled text input.
