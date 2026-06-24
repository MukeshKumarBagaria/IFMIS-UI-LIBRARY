# Toggle

> An accessible, labelled **on/off switch** rendered as a tinted pill. The whole pill is the control — click anywhere or press Space/Enter to flip. Follows the ARIA switch pattern. Controlled or uncontrolled.

```jsx
import { Toggle, toggleVariants } from "@ifmis/ui";
```

- **Type:** Switch control (`<button role="switch">`).
- **Types:** `ToggleProps`.
- `toggleVariants` is the exported CVA class generator for the pill surface.

---

## Purpose

A binary on/off setting switch (notifications, auto-save, dark mode). The on/off value repaints the pill surface, track, and label together.

## When to use

- An immediate on/off setting where the change takes effect right away.

## When NOT to use

- A form checkbox (especially in a list or for terms acceptance) → use [`Checkbox`](Checkbox.md).
- A selectable chip/filter → use [`SelectionPill`](SelectionPill.md).
- A larger selectable card → use [`CheckboxCard`](CheckboxCard.md).

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `checked` | `boolean` | — | Controlled value. Pair with `onCheckedChange`. |
| `defaultChecked` | `boolean` | `false` | Uncontrolled initial value. |
| `onCheckedChange` | `(checked: boolean) => void` | — | Fires with the next value on every flip. |
| `size` | `"sm" \| "md"` | `"md"` | Switch + label size. |
| `labelPosition` | `"start" \| "end"` | `"end"` | Label before or after the switch. |
| `disabled` | `boolean` | `false` | Greys out and blocks interaction. |
| `children` | `ReactNode` | — | The label. Omit for a bare switch (then pass `aria-label`). |
| `className` | `string` | — | Merged onto the pill. |

Other `<button>` attributes (`id`, `name`, `aria-*`, `data-*`, `ref`) forwarded; `data-state` reflects on/off. `onChange`, `type`, `value` are omitted/managed.

## Usage examples

### States

```jsx
<Toggle defaultChecked>Toggle on</Toggle>   {/* on → purple pill */}
<Toggle>Toggle on</Toggle>                   {/* off → grey pill  */}
```

### Controlled / uncontrolled

```jsx
<Toggle defaultChecked onCheckedChange={(next) => save(next)}>Email alerts</Toggle>

const [on, setOn] = useState(false);
<Toggle checked={on} onCheckedChange={setOn}>Auto-save</Toggle>
```

### Sizes / label position / bare switch

```jsx
<Toggle size="sm" defaultChecked>Small</Toggle>
<Toggle labelPosition="start" defaultChecked>Label before</Toggle>
<Toggle aria-label="Dark mode" checked={dark} onCheckedChange={setDark} />
```

## Best practices

- Use `onCheckedChange` (boolean) for the new value.
- Use a Toggle when the change applies immediately; use a [`Checkbox`](Checkbox.md) for form-submitted booleans.
- Always give a bare switch (no `children`) an `aria-label`.

## Common mistakes

- **Bare switch without `aria-label`** — leaves the control anonymous.
- **Using it for a checkbox-style form field** — prefer [`Checkbox`](Checkbox.md) for lists/terms.

## Accessibility

- Renders as `role="switch"` with `aria-checked`; toggles with Space/Enter.
- The visible label is the accessible name; pass `aria-label` for a bare switch.
- Visible focus ring on keyboard focus.

## Related components

- [`Checkbox`](Checkbox.md) — form checkbox.
- [`SelectionPill`](SelectionPill.md) — selectable chip.
- [`CheckboxCard`](CheckboxCard.md) — selectable card.
