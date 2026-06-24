# StatCard

> A tonal **dashboard metric card** — a title, a `value / total` counter, a ringed icon, and a gradient progress bar. Five tones repaint the surface, text, icon ring, and progress bar together.

```jsx
import { StatCard } from "@ifmis/ui";
```

- **Type:** Metric card (`<div>`; title is an `<h3>`).
- **Types:** `StatCardProps`, `StatCardTone` (`"purple" | "green" | "red" | "yellow" | "blue"`).

---

## Purpose

Show a single dashboard metric with a count, an optional total, and a progress bar. Pick the tone by meaning (totals, resolved, rejected, pending, neutral).

## When to use

- KPI/metric tiles on a dashboard, usually in a responsive grid.
- A count + total + progress summary.

## When NOT to use

- An actionable status card with buttons → use [`ActionCard`](ActionCard.md).
- A workflow step → use [`ProgressCard`](ProgressCard.md).
- Tabular data → use [`DataTable`](DataTable.md).

## Tones

`purple` (default), `green`, `red`, `yellow`, `blue`. Conventionally: purple = totals, green = resolved, red = rejected/overdue, yellow = pending, blue = neutral.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `tone` | `"purple" \| "green" \| "red" \| "yellow" \| "blue"` | `"purple"` | Surface, text, icon ring, progress colours. |
| `title` | `ReactNode` | — | **Required.** Card heading (truncates if long). |
| `value` | `ReactNode` | — | **Required.** The large primary number. |
| `total` | `ReactNode` | — | Rendered as `/ {total}`. Omit for value-only. |
| `icon` | `ReactNode \| null` | Files glyph | Omit = default (tone-coloured); `null` = none (no ring); node = custom (inherits tone, sized to 24px). |
| `progress` | `number` (0–100) | derived | Explicit fill %. Defaults to `value / total` when both are numbers; otherwise 0. |
| `hideProgress` | `boolean` | `false` | Hide the bar entirely. |
| `progressLabel` | `string` | `"{value} of {total}"` | Accessible label for the bar. |
| `progressClassName` | `string` | — | Extra classes for the progress track. |
| `className` | `string` | — | Merged onto the card. |

All other native `<div>` props forwarded; `data-tone` is set on the root. The card is `width: 100%`.

## Usage examples

### Tones

```jsx
<StatCard tone="purple" title="All Grievance" value={13} total={13} />
<StatCard tone="green"  title="Resolved"      value={9}  total={13} />
<StatCard tone="red"    title="Rejected"      value={2}  total={13} />
<StatCard tone="yellow" title="Pending"       value={5}  total={13} />
<StatCard tone="blue"   title="Reopened"      value={1}  total={13} />
```

### Progress (derived / explicit / hidden)

```jsx
<StatCard tone="green" title="Resolved" value={8} total={20} />              {/* derived → 40% */}
<StatCard tone="green" title="Resolved" value={8} total={20} progress={65} />{/* explicit */}
<StatCard tone="red"   title="Overdue"  value={5} total={12} hideProgress /> {/* no bar */}
```

### Icon / value-only

```jsx
<StatCard tone="green" title="Approved" value={9} total={13} icon={<CheckCircle weight="fill" />} />
<StatCard tone="blue"  title="Open tickets" value={42} icon={null} />
```

### Responsive grid

```jsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
  {stats.map((s) => (
    <StatCard key={s.id} tone={s.tone} title={s.title} value={s.value} total={s.total} />
  ))}
</div>
```

## Best practices

- Pick the tone by meaning, not decoration.
- Keep titles short ("All Grievance", "Resolved") — they truncate so card heights stay uniform.
- Use explicit `progress` when the bar tracks something other than `value / total` (e.g. SLA elapsed).
- Lay cards out in a grid, not a fixed-width row.

## Common mistakes

- **Using it for an actionable card** — it has no buttons; use [`ActionCard`](ActionCard.md).
- **Expecting derived progress with non-numeric `value`/`total`** — the bar reads 0; pass `progress`.
- **Long titles in a grid** — they truncate (expected), but keep them short for clarity.

## Accessibility

- The title is a real `<h3>` — ensure it nests under the page's heading order (usually under an `<h2>` section).
- The progress bar is `role="progressbar"` with `aria-valuenow/min/max` and an `aria-label` (set `progressLabel` for a clearer sentence).
- The default icon is `aria-hidden`; the title + value carry the meaning.

## Related components

- [`ActionCard`](ActionCard.md) — status card with actions.
- [`ProgressCard`](ProgressCard.md) — workflow-step card.
- [`DataTable`](DataTable.md) — tabular data.
