# Scrollbar

> A horizontal **scroll control** — a draggable thumb between two caret steppers, on a ruler-ticked track. Follows the ARIA slider pattern (drag, click, keyboard). Controlled or uncontrolled. Used by [`DataTable`](DataTable.md) for synced horizontal paging.

```jsx
import { Scrollbar } from "@ifmis/ui";
```

- **Type:** Slider control (`role="slider"`).
- **Types:** `ScrollbarProps`.

---

## Purpose

A standalone horizontal scroll/position control with caret steppers and a draggable thumb. Report position changes via `onValueChange` and drive a scroll container (or any 0–N position) yourself.

## When to use

- A custom horizontal scroll affordance for a wide element (e.g. [`DataTable`](DataTable.md)'s `showScrollbar`).
- Any single-axis position picker mapped to a numeric range.

## When NOT to use

- A page-number navigator → use [`Pagination`](Pagination.md).
- A form value slider with labels/ticks semantics for data entry — this is a scroll/position control, not a labelled form field (wrap in [`FormField`](FormField.md) if you need that chrome).

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `number` | — | Controlled position. Pair with `onValueChange`. |
| `defaultValue` | `number` | `min` | Uncontrolled initial position. |
| `onValueChange` | `(value: number) => void` | — | Fires with the next position whenever the thumb moves. |
| `min` | `number` | `0` | Lower bound. |
| `max` | `number` | `100` | Upper bound. |
| `step` | `number` | `10` | Distance a caret click / arrow key moves the thumb. |
| `thumbWidth` | `number` | `64` | Width of the draggable thumb (px). |
| `showTicks` | `boolean` | `true` | Render ruler tick marks. |
| `disabled` | `boolean` | `false` | Disable both carets and dragging. |
| `aria-label` | `string` | `"Scroll"` | Accessible name for the slider. |
| `className` | `string` | — | Merged onto the outer wrapper. |

Other `<div>` attributes forwarded. The reported value is always clamped to `[min, max]`; the track flexes to fill its container (min 200px). The caret toward a bound auto-disables at that bound.

## Usage examples

### Uncontrolled

```jsx
<div className="w-[420px]">
  <Scrollbar defaultValue={0} onValueChange={(v) => console.log(v)} />
</div>
```

### Controlled (synced to a scrolling element)

```jsx
const [pos, setPos] = useState(25);
<Scrollbar value={pos} onValueChange={setPos} step={5} />
```

### Custom range / step

```jsx
<Scrollbar defaultValue={0} max={500} step={25} onValueChange={scrollTo} />
```

### Thumb width / no ticks / disabled

```jsx
<Scrollbar defaultValue={40} thumbWidth={96} />
<Scrollbar defaultValue={40} showTicks={false} />
<Scrollbar defaultValue={30} disabled />
```

### Driving a DataTable (built-in)

```jsx
<DataTable columns={wideColumns} data={rows} showScrollbar />
```

(The table maps scroll position to a 0–100 value and renders a synced `Scrollbar` for you.)

## Best practices

- Map the `min`/`max` range to whatever your content needs (e.g. 0–500 px of scroll travel) and convert in `onValueChange`.
- Use controlled mode when syncing to a real scroll container so the thumb tracks native scrolling.
- Give the wrapper a width — the track has a 200px minimum and flexes to fill.

## Common mistakes

- **Confusing it with Pagination** — this is a continuous position control, not page numbers.
- **Forgetting to wire `onValueChange`** — the thumb moves but nothing scrolls unless you act on the value.

## Accessibility

- The track is `role="slider"` with `aria-orientation="horizontal"`, `aria-valuemin`/`max`/`now`, and an `aria-label`.
- **Keys (track focused):** ←/↓ step down, →/↑ step up, Home → min, End → max.
- Caret buttons are labelled "Scroll left"/"Scroll right" and use native `disabled` at each bound.
- When `disabled`, the track leaves the tab order (`tabIndex={-1}`) and is `aria-disabled`.

## Related components

- [`DataTable`](DataTable.md) — uses Scrollbar for synced horizontal scrolling.
- [`Pagination`](Pagination.md) — discrete page navigation.
