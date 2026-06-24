# SectionTitle

> The labelled bar that heads a **section within a page** — one notch below [`PageTitle`](PageTitle.md). A neutral strip with a purple accent rail on the left, the section heading (18px), and an optional right-aligned action.

```jsx
import { SectionTitle } from "@ifmis/ui";
```

- **Type:** Section heading bar (`<div>`; title is a real heading via `<Heading>`).
- **Types:** `SectionTitleProps`.

---

## Purpose

Title a section inside a page with consistent typography and a configurable semantic heading level. Composes the shared `<Heading>` (visual size locked to Header-18).

## When to use

- Heading a section/subsection within a page (under the page's `<h1>`).
- Sections needing a right-aligned action (overflow menu, add button, status).

## When NOT to use

- The page's main title → use [`PageTitle`](PageTitle.md).
- A collapsible section header → use [`Accordion`](Accordion.md).
- A standalone form label → use [`Label`](Label.md).

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | **Required.** The section heading (18px / Header-18). |
| `as` | `ElementType` | `"h2"` | Heading tag, decoupled from visual size (use `h3`+ when nesting). |
| `action` | `ReactNode` | — | Right-aligned content; **overrides** `onMore`. |
| `onMore` | `() => void` | — | Renders the default "more" overflow button when set (and no `action`). |
| `moreLabel` | `string` | `"More options"` | Accessible label for the default "more" button. |
| `className` | `string` | — | Merged onto the bar. |

Other native `<div>` attributes (`id`, `data-*`, `style`, `ref`) are forwarded. The bar is `width: 100%`.

## Usage examples

### Plain

```jsx
<SectionTitle title="Beneficiary details" />
```

### With overflow menu

```jsx
<SectionTitle title="Line items" onMore={() => openMenu()} />
```

### Custom action

```jsx
import { Button } from "@ifmis/ui";
import { Plus } from "@phosphor-icons/react";

<SectionTitle
  title="Attachments"
  action={<Button size="small" variant="tertiary" leftIcon={<Plus />}>Add file</Button>}
/>
```

### Nested heading level

```jsx
<SectionTitle title="Deductions" as="h3" />
```

## Best practices

- Use one `SectionTitle` per section, with `as` set so it nests correctly under the page's `<h1>` (usually `h2`).
- Use `onMore` for the common overflow case; use `action` for anything else (it takes precedence).
- Keep the right-side action to a single button or compact menu so the bar stays one or two lines.

## Common mistakes

- **Using it as the page's main title** — that's [`PageTitle`](PageTitle.md).
- **Leaving `as` at default when nesting deeper** — breaks the document outline; set `h3`+.
- **Passing both `action` and `onMore`** — `action` wins, `onMore` is ignored.

## Accessibility

- The title is a real heading; set `as` so it lands at the right outline level.
- The default "more" button is a native `<button>` with an `aria-label` and a visible focus ring.

## Related components

- [`PageTitle`](PageTitle.md) — the page-level heading band.
- [`Accordion`](Accordion.md) — collapsible section headers.
- [`Typography`](Typography.md) — the `Heading` it composes.
