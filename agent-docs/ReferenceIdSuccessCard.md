# ReferenceIdSuccessCard

> The IFMIS **"Submitted Successfully"** confirmation card — a green-gradient surface with a success badge, a title, the reference id in a big **dashed pill**, a supporting line, and a one-click **Copy** button. Every piece of text is a prop, so it covers any "success + reference id" moment.

```jsx
import { ReferenceIdSuccessCard } from "@ifmis/ui";
```

- **Type:** Confirmation card (`<div>`).
- **Types:** `ReferenceIdSuccessCardProps`.

---

## Purpose

Confirm that a request was registered and surface its reference id prominently, with a built-in copy-to-clipboard affordance. Reusable for grievances, payments, registrations, etc.

## When to use

- A success screen/step that issues a reference/transaction/registration id the user should copy.

## When NOT to use

- A pending/rejected status → use [`ProgressCard`](ProgressCard.md) / [`ActionCard`](ActionCard.md).
- A transient "Saved!" notice → use a toast or [`Banner`](Banner.md).
- A confirm/cancel decision → use [`ConfirmationPopup`](ConfirmationPopup.md).

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `referenceId` | `ReactNode` | — | **Required.** The id shown large in the dashed pill. |
| `title` | `ReactNode` | `"Grievance Submitted Successfully!"` | Success message title. |
| `description` | `ReactNode` | IFMIS registration line | Supporting line under the id. |
| `icon` | `ReactNode \| null` | green check badge | Omit = default; `null` = none; node = custom. |
| `showCopyButton` | `boolean` | `true` | Toggle the copy button. |
| `copyLabel` | `ReactNode` | `"Copy Grievance ID"` | Resting copy-button label. |
| `copiedLabel` | `ReactNode` | `"Copied!"` | Label while in the copied state. |
| `copyValue` | `string` | `referenceId` (if string) | Exact text written to the clipboard. |
| `copiedDuration` | `number` | `2000` | How long (ms) the copied state lasts. |
| `onCopy` | `(value: string) => void` | — | Fires after a copy attempt (even if the clipboard API rejects). |
| `idClassName` | `string` | — | Classes for the dashed id pill. |
| `copyButtonClassName` | `string` | — | Classes for the copy button. |
| `className` | `string` | — | Classes for the card root. |

Forwards `ref` and any extra `<div>` attributes. The card is `width: 100%` capped at 657px.

## Usage examples

### Basic

```jsx
<ReferenceIdSuccessCard
  referenceId="SR - BM-BPL - 0001 - 000234"
  onCopy={(id) => console.log("copied", id)}
/>
```

### Customised (payment receipt)

```jsx
<ReferenceIdSuccessCard
  title="Payment Successful!"
  referenceId="TXN-2026-000912"
  description="Your payment has been recorded in the IFMIS-Next Gen System"
  copyLabel="Copy Transaction ID"
  onCopy={(id) => toast(`Copied ${id}`)}
/>
```

### Node `referenceId` (set `copyValue` explicitly)

```jsx
<ReferenceIdSuccessCard
  referenceId={<strong>SR - 0001</strong>}
  copyValue="SR-0001"
  copiedLabel="Copied!"
  onCopy={(id) => toast(`Copied ${id}`)}
/>
```

### Read-only / no icon

```jsx
<ReferenceIdSuccessCard referenceId="SR-0001" showCopyButton={false} />
<ReferenceIdSuccessCard referenceId="SR-0001" icon={null} />
```

## Best practices

- When `referenceId` is a node (not a plain string), set `copyValue` so the right text is copied.
- `onCopy` fires even if the Clipboard API rejects (insecure context / denied permission) — use it to surface a manual-copy fallback.
- Size via the parent (`max-w-[657px]`).

## Common mistakes

- **Node `referenceId` without `copyValue`** — nothing usable gets copied (empty string).
- **Using it for non-success states** — it's green-themed for success only.

## Accessibility

- The copy control is a native `<button>` with a visible focus ring and `aria-live="polite"`, so screen readers announce the "Copied!" flip.
- The success badge and copy/check icons are `aria-hidden`; meaning lives in the visible text.
- Colour is decorative — the title and id text carry the message independent of the green theme.

## Related components

- [`ProgressCard`](ProgressCard.md) / [`ActionCard`](ActionCard.md) — for non-final or actionable statuses.
- [`Banner`](Banner.md) — inline success messaging.
- [`ConfirmationPopup`](ConfirmationPopup.md) — confirm/cancel dialog.
