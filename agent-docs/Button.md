# Button

> The design-system **base button**. Use it directly for any interaction. Four visual variants across two sizes. Interaction states map to native pseudo-classes — you never wire hover/focus/active yourself.

```jsx
import { Button, buttonVariants } from "@ifmis/ui";
```

- **Type:** Button primitive (`<button>`, or any element via `asChild`).
- **Types:** `ButtonProps`.
- `buttonVariants` is the exported CVA class generator.

---

## Purpose

The universal clickable control. Specific call-to-action shapes (Submit, Save, Reject…) live in [`FormButton`](FormButton.md) and consume the same tokens — use `Button` for everything else.

## When to use

- Any generic action: Continue, Cancel, Open, Add, etc.
- As a styled link via `asChild` (wrap a router `<Link>` or `<a>`).

## When NOT to use

- Standardized form CTAs with preset colours/icons (Submit/Approve/Reject…) → use [`FormButton`](FormButton.md).
- A sticky row of form actions → use [`CtaTray`](CtaTray.md).
- A toggle/switch → use [`Toggle`](Toggle.md).

## Variants

| `variant` | Look | Use for |
| --- | --- | --- |
| `primary` (default) | Solid purple, white label | The single primary action on a screen/dialog. |
| `secondary` | Outlined purple | Cancel/back next to a primary. |
| `tertiary` | Text-only | Inline link-like action ("Forgot password?"). |
| `neutral` | Outlined grey | Low-emphasis action that shouldn't compete (e.g. "Back"). |

> Note: the `tertiary` size only exists at "standard" metrics in Figma; both sizes map onto 32px-tall metrics.

## Sizes

| `size` | Height |
| --- | --- |
| `standard` (default) | 44px |
| `small` | 32px |

Icons scale with the size automatically (24px standard / 20px small).

## States

Hover/pressed/focused/disabled are **not props** — they map to `:hover`, `:active`, `:focus-visible` (keyboard-only ring), and `:disabled`. You only choose variant/size and wire `onClick`.

The cursor follows enabled/disabled automatically: `pointer` while the button is interactive, falling back to the platform `default` arrow on `:disabled` (no `not-allowed` glyph). Nothing to configure — it's baked into `buttonVariants`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "neutral"` | `"primary"` | Colour treatment. |
| `size` | `"standard" \| "small"` | `"standard"` | 44px / 32px tall. |
| `leftIcon` | `ReactNode` | — | Icon before the label. Ignored when `asChild`. |
| `rightIcon` | `ReactNode` | — | Icon after the label. Ignored when `asChild`. |
| `loading` | `boolean` | `false` | Swaps left icon for a spinner **and** disables the button. |
| `disabled` | `boolean` | `false` | Standard HTML disabled. |
| `asChild` | `boolean` | `false` | Render the child element instead of `<button>` (Radix `<Slot>`). |
| `className` | `string` | — | Merged onto the button. |

All other native `<button>` attributes (`type`, `name`, `form`, `onClick`, `aria-*`, `ref`) are forwarded. **Default `type` is `"button"`** — set `type="submit"` to submit a form.

## Usage examples

### Variants

```jsx
<Button variant="primary">Continue</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="tertiary">Skip</Button>
<Button variant="neutral">Back</Button>
```

### Sizes + icons

```jsx
import { CaretRight, FloppyDisk } from "@phosphor-icons/react";

<Button size="small">Continue</Button>
<Button leftIcon={<FloppyDisk />}>Save</Button>
<Button rightIcon={<CaretRight />}>Continue</Button>
```

### Loading

```jsx
const [saving, setSaving] = useState(false);
<Button loading={saving} onClick={save}>Save</Button>
```

### As a link (Radix Slot)

```jsx
import { Link } from "react-router-dom";

<Button asChild>
  <Link to="/dashboard">Open dashboard</Link>
</Button>
```

When `asChild` is on, the child receives the button styles and `leftIcon`/`rightIcon`/`loading` are **ignored** — render content inside the child yourself.

### Full-width / responsive row

```jsx
<Button className="w-full sm:w-auto">Continue</Button>

<div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
  <Button variant="secondary" className="w-full sm:w-auto">Cancel</Button>
  <Button className="w-full sm:w-auto">Continue</Button>
</div>
```

### Icon-only (needs aria-label)

```jsx
<Button aria-label="Open menu" leftIcon={<List />} />
```

## Best practices

- Pair **primary + secondary**, not two primaries — keep the hierarchy clear.
- Use `loading` (not `disabled`) during async work — it disables and shows a spinner, preventing double submits.
- For form submission, set `type="submit"` explicitly (default is `"button"`).
- `Button` is content-sized (`inline-flex`); stretch with `w-full` for mobile.

## Common mistakes

- **Expecting a form to submit** — the default `type` is `"button"`; add `type="submit"`.
- **Nesting `<button>` inside `<a>`** — use `asChild` to wrap a link instead.
- **Passing `leftIcon` with `asChild`** — icon props are ignored in that mode.
- **Icon-only button without `aria-label`** — gives screen-reader users no name.

## Accessibility

- Renders a real `<button>` (or your element via `asChild`) — full keyboard and AT support.
- Focus ring is `:focus-visible` only, so it appears for keyboard users, not mouse clicks.
- `loading` auto-disables to prevent double clicks.
- Always pass `aria-label` for icon-only buttons.

## Related components

- [`FormButton`](FormButton.md) — preset form CTAs (Submit/Save/Reject…).
- [`CtaTray`](CtaTray.md) — sticky action row.
- [`ActionCard`](ActionCard.md) — has its own mini buttons.
