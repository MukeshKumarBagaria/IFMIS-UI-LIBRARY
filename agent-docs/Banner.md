# Banner

> An **inline notification surface** for in-page status messages. Three semantic variants, each with a default icon and the correct ARIA role wired in. Compound component (optional title/description sub-parts).

```jsx
import { Banner, BannerTitle, BannerDescription, bannerVariants } from "@ifmis/ui";
```

- **Type:** Inline notification (compound).
- **Types:** `BannerProps`, `BannerTitleProps`, `BannerDescriptionProps`, `BannerVariant` (`"danger" | "success" | "info"`).
- `bannerVariants` is the exported CVA class generator for custom layouts.

---

## Purpose

Show a persistent, in-flow status message tied to a page section — validation errors, save failures, confirmations, neutral notices.

## When to use

- A blocking validation/error message above a form or section (`danger`).
- A confirmation that persists until the condition clears (`success`).
- A neutral, in-page notice (`info`).

## When NOT to use

- **Transient feedback** that should float and auto-vanish ("Saved!") → use a toast, not a Banner. Banners persist until the condition clears or the user dismisses.
- A status pill/flag → use [`Badge`](Badge.md).
- A status card with actions → use [`ActionCard`](ActionCard.md).

## Variants

| `variant` | Colour | ARIA role (auto) |
| --- | --- | --- |
| `danger` | red | `role="alert"` (interrupts) |
| `success` | green | `role="status"` (polite) |
| `info` (default) | blue | `role="status"` (polite) |

## Props

### `<Banner>`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `"danger" \| "success" \| "info"` | `"info"` | Colour, default icon, and ARIA role. |
| `icon` | `ReactNode \| null` | variant default | Omit = default (warning/check/info); `null` = none; node = custom (inherits text colour). |
| `onDismiss` | `() => void` | — | When set, renders a trailing close button. Omit for non-dismissible. |
| `dismissLabel` | `string` | `"Dismiss"` | Accessible label for the close button. |
| `role` | `string` | auto | Overrides the auto `alert`/`status` role. |
| `children` | `ReactNode` | — | Message — a string, or `BannerTitle`/`BannerDescription`. |
| `className` | `string` | — | Merged onto the banner. |

`BannerTitle` / `BannerDescription` are `<p>` wrappers accepting any `<p>` attributes. All other native `<div>` attributes flow to `Banner`. Banner is `width: 100%` by default.

## Usage examples

### Simple

```jsx
<Banner variant="danger">Unable to save your changes.</Banner>
<Banner variant="success">All changes synced.</Banner>
<Banner variant="info">Scheduled maintenance tonight.</Banner>
```

### Title + description

```jsx
import { Banner, BannerTitle, BannerDescription } from "@ifmis/ui";

<Banner variant="danger">
  <BannerTitle>Validation failed</BannerTitle>
  <BannerDescription>
    Two required fields are missing. Review the highlighted rows and try again.
  </BannerDescription>
</Banner>
```

### Dismissible (you own the visibility state)

```jsx
const [shown, setShown] = useState(true);

{shown && (
  <Banner variant="info" onDismiss={() => setShown(false)}>
    New approval workflow is live.
  </Banner>
)}
```

### Icons

```jsx
<Banner variant="info" icon={null}>Text-only banner.</Banner>
<Banner variant="success" icon={<Trophy weight="fill" />}>You did it!</Banner>
```

### Constrained width

```jsx
<div className="max-w-2xl">
  <Banner variant="info">Constrained to a readable measure.</Banner>
</div>
```

## Best practices

- **One banner per concern.** Combine related notices into one with a title + description rather than stacking.
- **Match the variant to severity.** Reserve `danger` (which interrupts screen readers) for blocking problems.
- **Keep it actionable** — if the user must do something, say what, and put any action inside the description.

## Common mistakes

- **Using a Banner for transient "Saved!" feedback** — that's a toast.
- **Forgetting visibility state for dismissible banners** — `onDismiss` only fires the callback; you must conditionally render.
- **Nesting block elements inside one `BannerDescription`** — use multiple `BannerDescription` blocks instead.

## Accessibility

- `danger` → `role="alert"` (assistive tech interrupts immediately); `success`/`info` → `role="status"` (polite). Override via `role`.
- Default icons are `aria-hidden` — the text carries the meaning.
- The dismiss button has an accessible name (`dismissLabel`) and a visible focus ring.

## Related components

- [`Badge`](Badge.md) — compact status pill.
- [`ActionCard`](ActionCard.md) — status card with actions.
- [`ConfirmationPopup`](ConfirmationPopup.md) — modal confirmation.
