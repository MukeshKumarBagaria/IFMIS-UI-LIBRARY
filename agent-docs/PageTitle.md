# PageTitle

> The heading band that tops every IFMIS screen: a white card (purple border) holding the page **title** (an `<h1>`) and an optional **breadcrumb** trail, with the brand diamond motif bleeding off the right edge. A thin composition over [`Heading`](Typography.md) + [`Breadcrumb`](Breadcrumb.md).

```jsx
import { PageTitle } from "@ifmis/ui";
```

- **Type:** Page heading band (`<div>` card; title is an `<h1>`).
- **Types:** `PageTitleProps`.

---

## Purpose

The consistent title band at the top of each module screen. It delegates the title to `<Heading>` and the trail to `<Breadcrumb>`, so typography and accessibility stay identical everywhere.

## When to use

- The top of every module screen — exactly one per screen.

## When NOT to use

- A sub-section heading within a page → use [`SectionTitle`](SectionTitle.md).
- A standalone breadcrumb (no title band) → use [`Breadcrumb`](Breadcrumb.md).
- The page's **Back** action → put it in [`CtaTray`](CtaTray.md)'s `onBack`, not here.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | **Required.** The page heading. Rendered as an `<h1>` (24px). |
| `breadcrumbs` | `BreadcrumbItem[]` | — | Trail, root → current (last = current page). Omit to hide the row. |
| `breadcrumbProps` | `Omit<BreadcrumbProps, "items">` | — | Extra props for the underlying `<Breadcrumb>` (e.g. `separator`, `ariaLabel`). |
| `hideDecoration` | `boolean` | `false` | Drop the decorative diamond motif. |
| `className` | `string` | — | Merged onto the card. |

Other native `<div>` attributes (`id`, `data-*`, `style`, `ref`) are forwarded. The band is `width: 100%` and `min-h` (grows with content). See [`Breadcrumb`](Breadcrumb.md) for the `BreadcrumbItem` shape.

## Usage examples

### Title only

```jsx
<PageTitle title="Dashboard" />
```

### Title + breadcrumbs

```jsx
<PageTitle
  title="Salary Statement"
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "HRMS", href: "/hrms" },
    { label: "Pay Related", href: "/hrms/pay" },
    { label: "FY 2025-26" }, // last item = current page
  ]}
/>
```

### Custom breadcrumb separator

```jsx
<PageTitle
  title="Reports"
  breadcrumbs={items}
  breadcrumbProps={{ separator: <span className="text-grey-500">/</span> }}
/>
```

### Hide decoration

```jsx
<PageTitle title="This is a page title" hideDecoration />
```

## Best practices

- Put exactly **one** `<PageTitle>` at the top of each screen (it's the `<h1>`).
- Make the last breadcrumb the page you're on (no `href`).
- Keep the title to a single line where possible; for detail, add a [`SectionTitle`](SectionTitle.md) below.
- Put the Back action in the bottom [`CtaTray`](CtaTray.md), not the title band.

## Common mistakes

- **Wrapping the title in another heading** — it's already an `<h1>`.
- **Adding a Back button inside PageTitle** — it belongs in `CtaTray`.
- **Using more than one PageTitle per screen** — breaks the document outline.

## Accessibility

- The title is a real `<h1>` — one page heading per screen.
- Breadcrumbs render inside `<nav aria-label="Breadcrumb">` with the current crumb marked `aria-current="page"`.
- The diamond motif is `aria-hidden`.

## Related components

- [`Breadcrumb`](Breadcrumb.md) — the trail it embeds.
- [`SectionTitle`](SectionTitle.md) — sub-section headings.
- [`Typography`](Typography.md) — the `Heading` it uses.
- [`CtaTray`](CtaTray.md) — hosts the page Back action.
