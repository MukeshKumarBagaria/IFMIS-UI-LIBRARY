# Badge

> A small, pill-shaped **status indicator** — an icon plus a short label. Four semantic variants. Static (non-interactive) by design.

```jsx
import { Badge, badgeVariants } from "@ifmis/ui";
```

- **Type:** Status pill (`<span>`).
- **Types:** `BadgeProps`, `BadgeVariant` (`"success" | "danger" | "pending" | "info"`).
- `badgeVariants` is the exported CVA class generator.

---

## Purpose

Communicate a status, flag, or count at a glance — section completion, list flags, error counts. The [`Accordion`](Accordion.md) header uses Badge for section status.

## When to use

- Showing the state of a record/section ("Complete", "Pending", "3 errors").
- Small inline flags or counts next to a title or row.

## When NOT to use

- Anything clickable → use [`SelectionPill`](SelectionPill.md). A Badge is a static indicator, never a button.
- A full inline message → use [`Banner`](Banner.md).

## Variants

| `variant` | Surface / border / text | Default icon |
| --- | --- | --- |
| `success` | green | filled CheckCircle (green) |
| `danger` | red | filled Warning (red) |
| `pending` | yellow | Spinner (**orange** icon, by design) |
| `info` (default) | grey | filled Info (grey) |

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `"success" \| "danger" \| "pending" \| "info"` | `"info"` | Colour + default icon. |
| `icon` | `ReactNode \| null` | variant default | Omit = default; `null` = text-only; node = custom (inherits variant colour, sized to 16px). |
| `children` | `ReactNode` | — | The label. |
| `className` | `string` | — | Merged onto the pill. |

All other native `<span>` attributes (`id`, `data-*`, `title`, `ref`, `aria-*`) are forwarded.

## Usage examples

```jsx
import { Badge } from "@ifmis/ui";
import { Clock } from "@phosphor-icons/react";

<Badge variant="success">Complete</Badge>
<Badge variant="danger">3 errors</Badge>
<Badge variant="pending">Awaiting review</Badge>
<Badge variant="info" icon={null}>Draft</Badge>             {/* text-only */}
<Badge variant="pending" icon={<Clock weight="fill" />}>Awaiting</Badge>
```

### Wrapping row of badges

```jsx
<div className="flex flex-wrap items-center gap-2">
  {flags.map((f) => (
    <Badge key={f.id} variant={f.variant}>{f.label}</Badge>
  ))}
</div>
```

## Best practices

- Let the **label** carry the meaning; keep it to one or two words. Colour is reinforcement, not the message.
- Match the variant to semantics: `success` = done, `danger` = blocking, `pending` = in-progress, `info` = neutral.
- Badges are inline and `shrink-0`, so they never squash in a flex row.

## Common mistakes

- **Using a Badge as a button** — use [`SelectionPill`](SelectionPill.md) for clickable chips.
- **Icon-only badge with no text and no `aria-label`** — the status is lost to screen readers (see Accessibility).
- **Stuffing a sentence into the label** — use a [`Banner`](Banner.md) for messages.

## Accessibility

- The label carries the meaning, so default icons are `aria-hidden`.
- If you render a badge with **no text**, add an accessible name yourself (e.g. `aria-label`).

## Related components

- [`SelectionPill`](SelectionPill.md) — interactive/selectable chip.
- [`Banner`](Banner.md) — inline status message.
- [`Accordion`](Accordion.md) — uses Badge in section headers.
