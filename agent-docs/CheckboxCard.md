# CheckboxCard

> A card-shaped, selectable checkbox with a bold **title** and optional **subtext**. The whole card is clickable; the checked card fills with a purple gradient. Backed by a real `<input type="checkbox">`.

```jsx
import { CheckboxCard, checkboxCardVariants } from "@ifmis/ui";
```

- **Type:** Form control / selectable card (`<label>` wrapping `<input type="checkbox">`); `ref` forwards to the input.
- **Types:** `CheckboxCardProps`.
- `checkboxCardVariants` is the exported CVA class generator.

---

## Purpose

A prominent, tappable option card for choosing plans, features, or settings — larger and more descriptive than a plain [`Checkbox`](Checkbox.md), with a title + subtext.

## When to use

- Single-select option lists (radio-like) of plans/tiers.
- Multi-select feature pickers where each option needs a description.

## When NOT to use

- A compact inline boolean → use [`Checkbox`](Checkbox.md).
- An on/off setting → use [`Toggle`](Toggle.md).
- A small filter chip → use [`SelectionPill`](SelectionPill.md).

## States

- **unchecked** — grey surface, grey border, dark indicator with white check.
- **checked** — purple gradient fill, white border, white indicator/title/subtext.
- **checked + hover** — the gradient deepens (only checked + enabled cards have a hover treatment).
- **disabled** — 60% opacity, `cursor: not-allowed`, hover gradient suppressed.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | **Required.** Bold first line (16px / 600). |
| `description` | `ReactNode` | — | Optional subtext (14px / 400). |
| `checked` | `boolean` | — | Controlled value. Pair with `onCheckedChange`. |
| `defaultChecked` | `boolean` | `false` | Uncontrolled initial value. |
| `onCheckedChange` | `(checked: boolean) => void` | — | Fires with the next value on change. |
| `disabled` | `boolean` | `false` | Fades the card and blocks interaction + hover. |
| `className` | `string` | — | Merged onto the visible card surface. |
| `indicatorClassName` | `string` | — | Merged onto the circular indicator. |

All other native `<input>` props (`name`, `value`, `required`, `id`, `ref`, `aria-*`, `data-*`) are forwarded. `onChange` (native event) also fires. `type`, `size`, `checked`, `defaultChecked`, `title` from the native input are re-typed/omitted.

## Usage examples

### Uncontrolled

```jsx
<CheckboxCard
  defaultChecked
  title="Premium plan"
  description="14-day free trial, cancel anytime"
  onCheckedChange={(v) => save(v)}
/>
```

### Single-select list (radio-like)

```jsx
const [picked, setPicked] = useState("standard");

{plans.map((p) => (
  <CheckboxCard
    key={p.id}
    title={p.title}
    description={p.description}
    checked={picked === p.id}
    onCheckedChange={(on) => on && setPicked(p.id)}
  />
))}
```

### Multi-select list

```jsx
const [picked, setPicked] = useState(new Set(["analytics"]));

{features.map((f) => (
  <CheckboxCard
    key={f.id}
    title={f.title}
    description={f.description}
    checked={picked.has(f.id)}
    onCheckedChange={(on) =>
      setPicked((prev) => {
        const next = new Set(prev);
        on ? next.add(f.id) : next.delete(f.id);
        return next;
      })
    }
  />
))}
```

### Title only

```jsx
<CheckboxCard title="Enable notifications" />
```

## Best practices

- For single-select, ignore "uncheck" by gating on `on` (`onCheckedChange={(on) => on && setPicked(id)}`).
- Keep titles to a few words; put detail in `description`.
- The two gradients live as CSS vars (`--gradient-card-checked` / `--gradient-card-checked-hover`) in the theme — change once to repaint all cards.

## Common mistakes

- **Using it for a compact inline boolean** — that's [`Checkbox`](Checkbox.md).
- **Forgetting `title`** — it's required (it's also the accessible name).
- **Expecting a hover effect when unchecked** — only checked + enabled cards have one.

## Accessibility

- Backed by a real `<input type="checkbox">` — focusable, toggled with Space, announced as a checkbox.
- The `<label>` wraps input + card; the visible **title** is the accessible name.
- Visible focus ring traces the card surface on keyboard focus.
- The decorative indicator is `aria-hidden`.

## Related components

- [`Checkbox`](Checkbox.md) — compact icon + label checkbox.
- [`SelectionPill`](SelectionPill.md) — selectable chip.
- [`Toggle`](Toggle.md) — on/off switch.
