# Checkbox

> An icon + label form control built on a real, visually-hidden `<input type="checkbox">`. Supports checked / unchecked / indeterminate states, three sizes, controlled and uncontrolled use.

```jsx
import { Checkbox } from "@ifmis/ui";
```

- **Type:** Form control (`<label>` wrapping `<input type="checkbox">`); `ref` forwards to the input.
- **Types:** `CheckboxProps`.

---

## Purpose

A standard checkbox with full form participation, keyboard support, and screen-reader semantics. The coloured box is presentational paint driven by the native input.

## When to use

- Boolean opt-ins ("I accept the terms"), multi-select lists, "select all" rows (via `indeterminate`).
- Any form field where a native checkbox is appropriate.

## When NOT to use

- A larger card-style selectable option with title + subtext → use [`CheckboxCard`](CheckboxCard.md).
- An on/off setting toggle → use [`Toggle`](Toggle.md).
- A removable/selectable filter chip → use [`SelectionPill`](SelectionPill.md).

## States

`default` (unchecked), `checked`, `indeterminate` ("some selected"), and `disabled`. `indeterminate` renders a dash, sets the native `input.indeterminate` flag, and `aria-checked="mixed"`; it visually takes precedence over `checked`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `checked` | `boolean` | — | Controlled value. Pair with `onCheckedChange`. |
| `defaultChecked` | `boolean` | `false` | Uncontrolled initial value. |
| `onCheckedChange` | `(checked: boolean) => void` | — | Fires with the next value on change. |
| `indeterminate` | `boolean` | `false` | Renders a dash; sets the native flag + `aria-checked="mixed"`. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Box + label size (20 / 24 / 28px box). |
| `disabled` | `boolean` | `false` | Greys box + label and blocks interaction. |
| `children` | `ReactNode` | — | The label. Omit for a bare box (then pass `aria-label`). |
| `className` | `string` | — | Merged onto the outer `<label>`. |
| `boxClassName` | `string` | — | Merged onto the coloured box. |

All other native `<input>` props (`name`, `value`, `required`, `id`, `ref`, `aria-*`, `data-*`) are forwarded to the underlying checkbox. `onChange` also fires (native event). Note `type`, `size`, `checked`, `defaultChecked` from the native input are re-typed/omitted.

## Usage examples

### Uncontrolled

```jsx
<Checkbox defaultChecked onCheckedChange={(v) => save(v)}>
  I accept the terms
</Checkbox>
```

### Controlled

```jsx
const [on, setOn] = useState(false);
<Checkbox checked={on} onCheckedChange={setOn}>Subscribe</Checkbox>
```

### "Select all" with indeterminate

```jsx
const items = ["Roads", "Health", "Education"];
const [checked, setChecked] = useState({ Roads: true, Health: false, Education: false });

const values = Object.values(checked);
const allChecked = values.every(Boolean);
const someChecked = values.some(Boolean);

<Checkbox
  checked={allChecked}
  indeterminate={someChecked && !allChecked}
  onCheckedChange={(next) =>
    setChecked(Object.fromEntries(items.map((i) => [i, next])))
  }
>
  Select all
</Checkbox>

{items.map((item) => (
  <Checkbox
    key={item}
    checked={checked[item]}
    onCheckedChange={(next) => setChecked((p) => ({ ...p, [item]: next }))}
  >
    {item}
  </Checkbox>
))}
```

### In a form (native attributes work)

```jsx
<form onSubmit={…}>
  <Checkbox name="terms" value="yes" required>I accept the terms</Checkbox>
  <button type="submit">Continue</button>
</form>
```

## Best practices

- Use `onCheckedChange` (boolean) for app logic; the native `onChange` is also available if you need the event.
- For "select all", drive parent + children from one state object and set `indeterminate` when only some are checked.
- Pick `size` to match surrounding text density.

## Common mistakes

- **Bare box without `aria-label`** — omitting `children` leaves no accessible name; add `aria-label`.
- **Setting `indeterminate` and expecting `checked` to show** — indeterminate wins visually.
- **Mixing controlled `checked` without `onCheckedChange`** — the box won't update.

## Accessibility

- Backed by a real `<input type="checkbox">` — natively focusable, toggled with Space, announced as a checkbox.
- A `<label>` wraps input + box, so clicking either toggles it and the visible label is the accessible name.
- For a bare box, pass `aria-label`.
- Indeterminate sets `input.indeterminate` and `aria-checked="mixed"`.
- Visible focus ring on keyboard focus.
- The native input is visually hidden (clipped to 1px, no visible paint) but kept `position: relative` — i.e. **in normal flow** rather than taken out of it like Tailwind's `sr-only` (`position: absolute`). It won't escape the `<label>` if you wrap `Checkbox` in an ancestor that clips or repositions absolutely-positioned descendants; click/focus targeting stays correct in those embeddings. No change needed on your end — it's an internal implementation detail, not a styling hook.

## Related components

- [`CheckboxCard`](CheckboxCard.md) — card-shaped selectable checkbox.
- [`Toggle`](Toggle.md) — on/off switch.
- [`SelectionPill`](SelectionPill.md) — selectable chip.
