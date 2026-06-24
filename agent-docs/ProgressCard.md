# ProgressCard

> A **status-tinted workflow-step card** — the atomic building block of the IFMIS progress system. One of four statuses drives every visible colour: card surface, title, badge, avatar chip, name line, and the optional remarks side band.

```jsx
import { ProgressCard, initialsFromName, PROGRESS_STATUS_TOKENS } from "@ifmis/ui";
```

- **Type:** Card (`<div>`).
- **Types:** `ProgressCardProps`, `ProgressCardStatus` (`"success" | "pending" | "rejected" | "returned"`), `ProgressCardUser`, `ProgressStatusTokens`.
- Helpers: `initialsFromName(name)`, and the shared `PROGRESS_STATUS_TOKENS` map.

---

## Purpose

Show a single workflow event (Creator submitted, Verifier pending, Approver rejected…) with consistent status colour. Use standalone to call out one event, or compose into [`ProgressStepper`](ProgressStepper.md) for the full vertical rail.

## When to use

- A standalone workflow-status callout in a page (record summary, audit row, notification).
- As a step inside [`ProgressStepper`](ProgressStepper.md) (the stepper renders `ProgressCard`s).

## When NOT to use

- The full collapsible tracker with dot rail → use [`ProgressStepper`](ProgressStepper.md).
- A generic status pill → use [`Badge`](Badge.md).
- An actionable status card with buttons → use [`ActionCard`](ActionCard.md).

## Statuses

| `status` | Card | Default badge | Glyph |
| --- | --- | --- | --- |
| `success` | green | `Submitted` | CheckCircle |
| `pending` | yellow | `Pending` | Spinner |
| `rejected` | red | `Rejected` | XCircle |
| `returned` | orange | `Returned` | KeyReturn |

All colours come from the shared `PROGRESS_STATUS_TOKENS` map so the card matches its dot in the stepper. (Business rule, not enforced: the Creator step should never be `rejected`.)

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `status` | `"success" \| "pending" \| "rejected" \| "returned"` | — | **Required.** Drives every colour. |
| `label` | `ReactNode` | — | **Required.** Title at the top of the card. |
| `badgeLabel` | `ReactNode \| null` | per status | `null` hides the badge entirely. |
| `badgeIcon` | `ReactNode \| null` | per status | `null` makes a text-only badge. |
| `timestamp` | `ReactNode` | — | Shown with a clock icon when present. |
| `user` | `ProgressCardUser` | — | Avatar + name + optional role. |
| `remarks` | `ReactNode` | — | Shows the side-banded block when truthy. |
| `remarksTitle` | `ReactNode` | `"Remarks"` | Heading inside the remarks block. |
| `className` | `string` | — | Merged onto the outer card. |

`ProgressCardUser`: `{ name (required), role?, initials? (derived from name), avatarSrc?, avatarAlt? (defaults to name) }`. All other native `<div>` props are forwarded; the root carries `data-status`. The card is `width: 100%`.

## Usage examples

### Minimal

```jsx
<ProgressCard
  status="success"
  label="Creator"
  timestamp="Submitted on 05 May 2026"
  user={{ name: "Amit Mohan", role: "Employee" }}
/>
```

### Rejected with remarks

```jsx
<ProgressCard
  status="rejected"
  label="Approver"
  timestamp="Received on 05 May 2026"
  user={{ name: "Amit Mohan", role: "Employee" }}
  remarks="Application doesn't meet eligibility under Section 4."
/>
```

### Custom copy / badge

```jsx
<ProgressCard status="pending" label="Under review" badgeLabel="In queue" timestamp="Since 03 Jan 2026" />
<ProgressCard status="success" label="Creator" badgeLabel="Featured" badgeIcon={<Star weight="fill" />} />
<ProgressCard status="success" label="Creator" badgeLabel={null} />  {/* no badge */}
```

### Avatar image

```jsx
<ProgressCard
  status="success"
  label="Creator"
  user={{ name: "Amit Mohan", avatarSrc: "/avatars/amit.jpg", avatarAlt: "Amit Mohan" }}
/>
```

## Best practices

- Pass only the rows that matter — everything except `status` and `label` is optional and hidden when omitted.
- Let initials derive from `user.name`; override `user.initials` only when the auto pair is wrong for the locale.
- Size via the parent (e.g. `w-[280px]` rail or a fluid column).

## Common mistakes

- **Using it for a clickable status card** — it has no actions; use [`ActionCard`](ActionCard.md).
- **Relying on colour alone** — the label/badge text carries the status.
- **Avatar image without `avatarAlt`** — defaults to `user.name`, but pass it explicitly for clarity.

## Accessibility

- The root carries `data-status`; the visible label/badge/remarks convey the status.
- Clock and badge glyphs are `aria-hidden` (text is authoritative).
- Avatar images use `avatarAlt` (defaults to `user.name`).

## Related components

- [`ProgressStepper`](ProgressStepper.md) — composes `ProgressCard`s into a tracker.
- [`Badge`](Badge.md) — standalone status pill.
- [`ActionCard`](ActionCard.md) — status card with actions.
