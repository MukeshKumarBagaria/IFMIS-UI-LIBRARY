# SelectionPill

> A toggleable **selection chip** for filters, tags, categories, and single/multi-select sets. Selected pills fill purple; unselected sit quietly on grey. Renders as a toggle button (`aria-pressed`). Controlled or uncontrolled.

```jsx
import { SelectionPill, selectionPillVariants } from "@ifmis/ui";
```

- **Type:** Toggle button / chip (`<button>`).
- **Types:** `SelectionPillProps`.
- `selectionPillVariants` is the exported CVA class generator.

---

## Purpose

A clickable, toggleable chip — the interactive counterpart to the static [`Badge`](Badge.md). Use it wherever the user picks/deselects options.

## When to use

- Filter chips, tag selectors, category pickers.
- Single- or multi-select sets where each option is a compact pill.

## When NOT to use

- A static status indicator (not clickable) → use [`Badge`](Badge.md).
- A larger option card with title + subtext → use [`CheckboxCard`](CheckboxCard.md).
- A standard form checkbox → use [`Checkbox`](Checkbox.md).

## States

`selected` (purple-600 surface, white label + check) and `unselected` (grey surface, muted label). A leading check icon shows by default in **both** states.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `selected` | `boolean` | — | Controlled value. Pair with `onSelectedChange`. |
| `defaultSelected` | `boolean` | `false` | Uncontrolled initial value. |
| `onSelectedChange` | `(selected: boolean) => void` | — | Fires with the next value on every toggle. |
| `size` | `"sm" \| "md"` | `"md"` | Chip size. |
| `icon` | `ReactNode \| null` | check | Omit = check (both states); `null` = label only; node = custom (inherits colour + size). |
| `disabled` | `boolean` | `false` | Dims and blocks interaction. |
| `children` | `ReactNode` | — | The label. |
| `className` | `string` | — | Merged onto the pill. |

Other `<button>` attributes (`id`, `name`, `aria-*`, `data-*`, `ref`) forwarded; `data-state` reflects selection. `type` and `value` are omitted/managed.

## Usage examples

### States (uncontrolled)

```jsx
<SelectionPill defaultSelected>Selected</SelectionPill>
<SelectionPill>Un-selected</SelectionPill>
```

### Controlled multi-select group

```jsx
const [picked, setPicked] = useState(new Set(["Health"]));

const toggle = (id) => (on) =>
  setPicked((prev) => {
    const next = new Set(prev);
    on ? next.add(id) : next.delete(id);
    return next;
  });

{options.map((o) => (
  <SelectionPill key={o} selected={picked.has(o)} onSelectedChange={toggle(o)}>
    {o}
  </SelectionPill>
))}
```

### Sizes / icons

```jsx
<SelectionPill size="sm" defaultSelected>Small</SelectionPill>
<SelectionPill icon={<Plus weight="bold" />} defaultSelected>Add filter</SelectionPill>
<SelectionPill icon={null} defaultSelected>No icon</SelectionPill>
```

## Best practices

- Use controlled mode for a group, driving all pills from one state object (e.g. a `Set`).
- The label is the accessible name; keep it short.
- For mutually-exclusive single-select, manage the selection so only one is `selected`.

## Common mistakes

- **Using it as a static flag** — that's [`Badge`](Badge.md); SelectionPill is a button.
- **Forgetting `onSelectedChange` in controlled mode** — the pill won't update.

## Accessibility

- Renders as a toggle button with `aria-pressed`; toggles with Space/Enter.
- The label is the accessible name; the default check icon is `aria-hidden`.
- Visible focus ring on keyboard focus.

## Related components

- [`Badge`](Badge.md) — static (non-interactive) status pill.
- [`CheckboxCard`](CheckboxCard.md) — card-style selectable option.
- [`Checkbox`](Checkbox.md) — standard checkbox.
- [`DataTable`](DataTable.md) — filter chips in its `toolbar` slot.
