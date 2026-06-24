# HoverPill

> The small grey **on-hover pill** with a directional arrow. Two exports: `HoverPill` (the standalone visual pill) and `HoverPillTip` (wraps a trigger and reveals a pill on hover/focus — powers the Sidebar's "module name on hover").

```jsx
import { HoverPill, HoverPillTip } from "@ifmis/ui";
```

- **Type:** Tooltip / pill (CSS-positioned, no portal).
- **Types:** `HoverPillProps`, `HoverPillTipProps`, `HoverPillPlacement`.

---

## Purpose

Show a compact label pill pointing at an anchor — either statically (`HoverPill`) or as a hover/focus tooltip around a trigger (`HoverPillTip`).

## When to use

- A lightweight tooltip showing a short label on hover/focus (e.g. an icon button's name).
- The Sidebar's collapsed-module hover labels.

## When NOT to use

- Rich/interactive popover content → build with a portal-based popover (e.g. compose [`Dropdown`](Dropdown.md)/[`ProfileMenu`](Header.md) patterns).
- A persistent inline message → use [`Banner`](Banner.md).
- A status indicator → use [`Badge`](Badge.md).

> `HoverPillTip` is CSS-positioned (no portal), so the trigger's container **must not clip overflow** or the pill is cut off.

## Placements

The name describes **where the pill sits relative to its anchor**; the arrow points back at the anchor.

| Placement | Pill is… | Arrow |
| --- | --- | --- |
| `top` / `top-start` / `top-end` | above the anchor | bottom edge, points down |
| `bottom` / `bottom-start` / `bottom-end` | below the anchor | top edge, points up |
| `left` | left of the anchor | right edge, points right |
| `right` | right of the anchor | left edge, points left |

(`top`/`bottom` are centred; `*-start`/`*-end` align to the edges.)

## Props

### `HoverPill`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Pill text. |
| `placement` | `HoverPillPlacement` | `"top-start"` | Arrow edge + alignment. |
| `className` | `string` | — | Merged onto the pill. |

All other `<div>` attributes are forwarded.

### `HoverPillTip`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | **Required.** Pill text shown on hover/focus. |
| `children` | `ReactElement` | — | **Required.** A single focusable trigger element. |
| `placement` | `HoverPillPlacement` | `"top"` | Which side the pill appears on. |
| `open` | `boolean` | — | Controlled visibility (omit for hover/focus). |
| `defaultOpen` | `boolean` | `false` | Initial visibility when uncontrolled. |
| `disabled` | `boolean` | `false` | Never show the tip. |
| `decorative` | `boolean` | `false` | `aria-hidden` pill, no `aria-describedby` (use when the trigger already names itself). |
| `className` | `string` | — | Classes for the inline wrapper. |
| `pillClassName` | `string` | — | Classes for the floating pill. |

## Usage examples

### Standalone pill

```jsx
<HoverPill placement="top-start">Deposit</HoverPill>
```

### As a tooltip

```jsx
import { HoverPillTip } from "@ifmis/ui";
import { Coins } from "@phosphor-icons/react";

<HoverPillTip label="Deposit" placement="top">
  <button aria-label="Deposit"><Coins /></button>
</HoverPillTip>
```

### Decorative (trigger already named)

```jsx
<HoverPillTip label="Deposit" decorative>
  <button aria-label="Deposit">…</button>
</HoverPillTip>
```

### Controlled

```jsx
<HoverPillTip label="Deposit" open={showHint}>
  <button>…</button>
</HoverPillTip>
```

## Best practices

- Use `decorative` when the trigger already carries the same accessible name (e.g. an icon button with `aria-label`) so screen readers don't announce it twice.
- Keep the trigger inside a container that doesn't clip overflow.
- Leave room on the arrow's side — the pointer protrudes ~7px past the pill edge.

## Common mistakes

- **Wrapping the trigger in an `overflow-hidden` container** — the pill gets clipped (it's not portaled).
- **Passing multiple children to `HoverPillTip`** — it expects a single focusable element.
- **Using it for rich/interactive content** — it's a label pill only.

## Accessibility

- `HoverPillTip` shows on **hover and keyboard focus**, so it's reachable without a mouse.
- The pill is `role="tooltip"` linked via `aria-describedby` — unless `decorative` is set.

## Related components

- [`Sidebar`](Sidebar.md) — uses `HoverPillTip` for collapsed module labels.
- [`Badge`](Badge.md) — static status pill.
- [`Banner`](Banner.md) — persistent inline message.
