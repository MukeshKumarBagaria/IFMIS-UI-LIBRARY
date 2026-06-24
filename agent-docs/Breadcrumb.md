# Breadcrumb

> Page-trail navigation chips showing where the user is. The last crumb is the current page; the rest are muted chips separated by a caret. Renders each crumb as a link, button, or text **inferred from its props**.

```jsx
import { Breadcrumb } from "@ifmis/ui";
```

- **Type:** Navigation (`<nav><ol>`).
- **Types:** `BreadcrumbProps`, `BreadcrumbItem`.

---

## Purpose

Render a hierarchical "you are here" trail driven by a simple `items` array. No need to choose element types — Breadcrumb infers whether each crumb is an anchor, a button, or plain text.

## When to use

- Showing the navigation path on a detail/sub-page (Home › Module › Record).
- Any place a multi-level location indicator is needed.

## When NOT to use

- Linear multi-step progress → use [`ProgressStepper`](ProgressStepper.md).
- Primary site navigation → use [`Sidebar`](Sidebar.md) / [`Header`](Header.md).

## How each crumb renders (inferred)

| Item has… | Renders as | Notes |
| --- | --- | --- |
| `href` | `<a>` | Standard anchor navigation. |
| `onClick` (no `href`) | `<button>` | Good for SPA routers. |
| neither | `<span>` | Plain text. |
| is the current crumb | `<span aria-current="page">` | Always non-interactive. |

The current crumb is the **last item** by default, or any item with `current: true`.

## Props

### `<Breadcrumb>`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | — | **Required.** The trail, root → current. Any number of items. |
| `separator` | `ReactNode` | caret-right | Rendered between crumbs (`aria-hidden`). |
| `ariaLabel` | `string` | `"Breadcrumb"` | Label for the `<nav>` landmark. |
| `className` | `string` | — | Applied to the `<nav>`. |

Other native `<nav>`/`HTMLElement` attributes are forwarded (`children` is omitted).

### `BreadcrumbItem`

| Field | Type | Notes |
| --- | --- | --- |
| `label` | `ReactNode` | **Required.** Visible text/node. |
| `href` | `string` | Renders an `<a>`. |
| `onClick` | `() => void` | Renders a `<button>` (ignored if `href` set). |
| `icon` | `ReactNode` | Leading icon (auto-sized to 16px). |
| `current` | `boolean` | Force this item to be the active crumb. |
| `className` | `string` | Per-item class override. |
| `key` | `React.Key` | Stable key; falls back to index. |

## Usage examples

### Links (last item = current page)

```jsx
<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Vouchers", href: "/vouchers" },
    { label: "VCH-2026-0042" }, // no href/onClick → current
  ]}
/>
```

### Router buttons

```jsx
<Breadcrumb
  items={[
    { label: "Dashboard", onClick: () => navigate("/") },
    { label: "HRMS", onClick: () => navigate("/hrms") },
    { label: "Leave" },
  ]}
/>
```

### Leading icon + custom separator

```jsx
import { House } from "@phosphor-icons/react";

<Breadcrumb
  separator={<span className="text-grey-500">/</span>}
  items={[
    { label: "Home", href: "/", icon: <House weight="fill" /> },
    { label: "Reports", href: "/reports" },
    { label: "Monthly" },
  ]}
/>
```

### Explicit current crumb

```jsx
<Breadcrumb
  items={[
    { label: "A", href: "/a" },
    { label: "B", current: true },
    { label: "C", href: "/c" },
  ]}
/>
```

## Best practices

- Keep the current page as the **last** item (or mark it `current`).
- Use `href` for real navigation so links are crawlable and open in a new tab.
- Keep labels short — long labels cause awkward wrapping. For deep trails on mobile, collapse middle crumbs.

## Common mistakes

- **Making the current crumb a link** — it's the page you're already on; leave off `href`/`onClick`.
- **Setting both `href` and `onClick`** — `onClick` is ignored when `href` is present.

## Accessibility

- Wrapped in `<nav aria-label="Breadcrumb">` with an ordered list `<ol>`.
- The current crumb carries `aria-current="page"`.
- Separators are `aria-hidden`.
- Button crumbs get a visible focus ring.

## Related components

- [`ProgressStepper`](ProgressStepper.md) — linear step progress.
- [`PageTitle`](PageTitle.md) — page heading often paired above content.
- [`Sidebar`](Sidebar.md) — primary navigation.
