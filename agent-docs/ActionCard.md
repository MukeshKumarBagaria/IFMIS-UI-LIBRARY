# ActionCard

> A status-tinted card with a **gradient header**, a **white body**, and a **grey footer of small actions**. Three tones (`pending`/`success`/`danger`) communicate state at a glance. Supports both a prop-driven shape and a compound (sub-part) shape.

```jsx
import {
  ActionCard,           // root (also ActionCard.Header/.Body/.Footer/.Badge/.Button)
  useActionCardTone,    // hook: read the nearest card's tone
} from "@ifmis/ui";
```

- **Type:** Card / compound component (tone via context).
- **Types:** `ActionCardProps`, `ActionCardTone`, `ActionCardHeaderProps`, `ActionCardBodyProps`, `ActionCardFooterProps`, `ActionCardBadgeProps`, `ActionCardButtonProps`.
- Sub-parts are also exported individually: `ActionCardHeader`, `ActionCardBody`, `ActionCardFooter`, `ActionCardBadge`, `ActionCardButton`, plus `actionCardButtonVariants`.

---

## Purpose

Surface an actionable item with a status colour — e.g. a pending approval, a successful submission, a rejected request — with a heading, description, optional badge/counter, and up to two actions.

## When to use

- A dashboard tile or list item representing a task/record with a status and quick actions ("Open", "Cancel").
- A summary card where the colour itself conveys pending/success/danger.

## When NOT to use

- A pure metric/number → use [`StatCard`](StatCard.md).
- A success confirmation with a reference id → use [`ReferenceIdSuccessCard`](ReferenceIdSuccessCard.md).
- A collapsible form section → use [`Accordion`](Accordion.md).
- A static inline alert (no card chrome) → use [`Banner`](Banner.md).

## Tones

| `tone` | Header gradient | Use for |
| --- | --- | --- |
| `pending` (default) | orange | Awaiting action/review |
| `success` | green | Completed/approved |
| `danger` | red | Rejected/error |

Tone drives the header gradient, body title colour, footer counter colour, and the footer button colours. Sub-parts read tone from context, so they stay in sync.

## Two usage shapes

1. **Prop-driven** (common case): pass `title`, `heading`, `description`, `badge`, `counter`, `onCancel`, `onOpen`.
2. **Compound** (full control): pass `<ActionCard.Header>`, `<ActionCard.Body>`, `<ActionCard.Footer>` (with `.Badge` / `.Button`) as `children`. Providing `children` **replaces** the prop-driven layout.

## Props

### `<ActionCard>` (root)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `tone` | `"pending" \| "success" \| "danger"` | `"pending"` | Colour treatment. |
| `title` | `ReactNode` | — | Header title (prop-driven). |
| `icon` | `ReactNode \| null` | tone Info icon | Header leading icon; `null` hides, omit for default. |
| `heading` | `ReactNode` | — | Bold body heading. |
| `description` | `ReactNode` | — | Body description (multi-line allowed). |
| `badge` | `ReactNode \| boolean` | — | `true` = default badge; node = custom; `false`/omit = none. |
| `badgeLabel` | `ReactNode` | `"Badge"` | Label on the default badge. |
| `badgeIcon` | `ReactNode \| null` | filled CheckCircle | Icon on the default badge; `null` hides. |
| `counter` | `ReactNode` | — | Left-side footer stat (e.g. `"20 of 30"`). |
| `onCancel` | `MouseEventHandler` | — | Cancel handler. **Omit to hide the cancel button.** |
| `onOpen` | `MouseEventHandler` | — | Open handler. **Omit to hide the open button.** |
| `cancelLabel` | `ReactNode` | `"Cancel"` | Outline button label. |
| `openLabel` | `ReactNode` | `"Open"` | Primary button label. |
| `hideFooter` | `boolean` | `false` | Force-hide the footer. |
| `children` | `ReactNode` | — | Compound mode — replaces prop-driven layout. |
| `className` | `string` | — | Merged on the root. |

The footer auto-hides when `counter`, `onCancel`, and `onOpen` are all absent. All other native `<div>` props forwarded; `data-tone` reflects tone.

### Sub-parts

| Part | Key props | Notes |
| --- | --- | --- |
| `<ActionCard.Header>` | `icon` (`node \| null`) | Gradient strip; title is `children`. |
| `<ActionCard.Body>` | `heading`, `description`, `badge` | White block; extra content via `children`. |
| `<ActionCard.Footer>` | `counter` | Grey tray; buttons go in `children` (right-aligned). |
| `<ActionCard.Badge>` | `icon` (default filled CheckCircle) | Neutral grey pill; usable outside the card too. |
| `<ActionCard.Button>` | `kind` (`"primary" \| "outline"`), `tone`, `rightIcon` | 32px tone-aware button; `tone` falls back to the card's tone. Renders `<button type="button">`. |

`useActionCardTone()` returns the tone of the nearest `<ActionCard>` ancestor.

## Usage examples

### Prop-driven (common case)

```jsx
<ActionCard
  tone="pending"
  title="Pending"
  heading="Quarterly report"
  description="Awaiting two reviewer approvals."
  badge
  counter="20 of 30"
  onCancel={() => discard()}
  onOpen={() => open(id)}
/>
```

### Compound (full control)

```jsx
<ActionCard tone="success">
  <ActionCard.Header icon={<MyGlyph />}>Submitted</ActionCard.Header>
  <ActionCard.Body
    heading="Quarterly report"
    description="All reviewers approved on 24 May 2026."
    badge={<ActionCard.Badge>3 approvers</ActionCard.Badge>}
  />
  <ActionCard.Footer counter="20 of 30">
    <ActionCard.Button kind="outline">Cancel</ActionCard.Button>
    <ActionCard.Button>Open</ActionCard.Button>
  </ActionCard.Footer>
</ActionCard>
```

### Hiding parts

```jsx
<ActionCard tone="danger" title="Rejected" heading="…" description="…" hideFooter />
<ActionCard {...props} badge={false} />          {/* no badge */}
<ActionCard {...props} onCancel={undefined} />   {/* only the Open button */}
```

### Custom labels and icons

```jsx
<ActionCard
  tone="pending"
  title="Awaiting review"
  icon={<Clock weight="fill" className="size-10 text-orange-900" />}
  heading="Quarterly report"
  badge badgeLabel="3 reviewers" badgeIcon={<Users weight="fill" className="size-5" />}
  counter="20 of 30"
  cancelLabel="Discard" openLabel="Continue"
  onCancel={onCancel} onOpen={onOpen}
/>
```

### Responsive grid

```jsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
  {items.map((item) => <ActionCard key={item.id} {...item} />)}
</div>
```

## Best practices

- Pick `tone` to match the status being shown — the colour is the primary signal.
- The card is always `width: 100%`; size it via your layout container (grid/flex/max-width).
- For one-off layouts, prefer the compound shape over fighting the prop API.
- Sizing icons: when passing a custom header `icon`, size it yourself (default is `size-10`).

## Common mistakes

- **Mixing `children` with prop-driven props.** Providing `children` discards `title`/`heading`/`description`/footer props — pick one shape.
- **Expecting a button to show without its handler.** `onCancel`/`onOpen` must be present for their buttons to render.
- **Using it for a plain number** — that's [`StatCard`](StatCard.md).

## Accessibility

- The header title is plain text — if the card stands alone in a landmark, give it an `id` and reference it from `<section aria-labelledby>`.
- Default icons are `aria-hidden`; meaning is carried by the title and button labels.
- Footer buttons are real `<button type="button">` with a visible focus ring. Disable via the native `disabled` prop on the sub-part.

## Related components

- [`StatCard`](StatCard.md) — metric tiles.
- [`ReferenceIdSuccessCard`](ReferenceIdSuccessCard.md) — success confirmation with reference id.
- [`Banner`](Banner.md) — inline status messages without card chrome.
- [`Badge`](Badge.md) — standalone status pills.
- [`Accordion`](Accordion.md) — collapsible form sections.
