# Pagination

> A pill-shaped **page navigator** — prev/next caret steppers around a row of page numbers. The active page is a purple circle; long ranges collapse around the current page with ellipses. Controlled or uncontrolled.

```jsx
import { Pagination, paginationRange } from "@ifmis/ui";
```

- **Type:** Navigation (`<nav>` landmark).
- **Types:** `PaginationProps`, `PaginationItem` (`number | "start-ellipsis" | "end-ellipsis"`).
- `paginationRange` is the exported range-building algorithm.

---

## Purpose

Let users move between pages of a dataset. It manages the page-number row and ellipsis truncation; you handle the data fetch/slice in `onPageChange`.

## When to use

- Paging through a [`DataTable`](DataTable.md), a list, or any paged dataset.
- A "rows per page" / "go to page" footer toolbar (paired with [`Dropdown`](Dropdown.md)).

## When NOT to use

- Infinite scroll / "load more" patterns.
- Linear multi-step flows → use [`ProgressStepper`](ProgressStepper.md).

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `count` | `number` | — | **Required.** Total number of pages. |
| `page` | `number` | — | Controlled current page (1-based). Pair with `onPageChange`. |
| `defaultPage` | `number` | `1` | Uncontrolled initial page (1-based). |
| `onPageChange` | `(page: number) => void` | — | Fires with the next page (1-based) on every change. |
| `siblingCount` | `number` | `1` | Pages shown on each side of the current page. |
| `boundaryCount` | `number` | `1` | Pages always shown at the very start / end. |
| `hideControls` | `boolean` | `false` | Hide the prev/next caret buttons. |
| `disabled` | `boolean` | `false` | Disable the entire pager. |
| `aria-label` | `string` | `"Pagination"` | Accessible name for the `<nav>` landmark. |
| `className` | `string` | — | Merged onto the outer `<nav>`. |

Other `<nav>` attributes forwarded. Pages are clamped to `[1, count]`, so out-of-range `page`/`defaultPage` values are safe. Carets disable at the first/last page.

## Usage examples

### Uncontrolled

```jsx
<Pagination count={10} defaultPage={1} onPageChange={(page) => load(page)} />
```

### Controlled (page from URL/table state)

```jsx
const [page, setPage] = useState(1);
<Pagination count={10} page={page} onPageChange={setPage} />
```

### Truncation

```jsx
{/* count=10, page=5 → 1 … 4 5 6 … 10 */}
<Pagination count={10} defaultPage={5} />

{/* Two siblings either side → 1 … 3 4 5 6 7 … 10 */}
<Pagination count={20} defaultPage={10} siblingCount={2} />
```

### Numbers only / disabled

```jsx
<Pagination count={5} defaultPage={2} hideControls />
<Pagination count={10} defaultPage={3} disabled />
```

### Table footer toolbar (with Dropdown)

```jsx
<div className="flex flex-wrap items-center gap-8">
  <Dropdown label="Rows per page" defaultValue="10" options={rowOptions} />
  <Pagination count={total} page={page} onPageChange={setPage} />
  <Dropdown label="Go to page" value={String(page)} onValueChange={(v) => setPage(Number(v))} options={pageOptions} />
</div>
```

### Using the range algorithm directly

```jsx
import { paginationRange } from "@ifmis/ui";

paginationRange({ count: 10, page: 5, siblingCount: 1, boundaryCount: 1 });
// → [1, "start-ellipsis", 4, 5, 6, "end-ellipsis", 10]
```

## Best practices

- Use `onPageChange` to fetch/slice the data; the pager doesn't fetch anything.
- Use controlled mode when the page is owned elsewhere (URL, table state).
- Tune `siblingCount`/`boundaryCount` for the dataset size rather than rendering all numbers.

## Common mistakes

- **Forgetting to react to `onPageChange`** — the pager updates its highlight but your data won't change unless you load it.
- **Passing 0-based page numbers** — pages are 1-based.
- **Expecting it to slice your data** — it only reports the page; slice yourself (see [`DataTable`](DataTable.md)).

## Accessibility

- The bar is a `<nav>` landmark named by `aria-label`.
- Each number is a `<button>` labelled "Go to page N"; the current page has `aria-current="page"`.
- Caret chips are labelled "Previous/Next page" and use native `disabled` at the ends.
- Ellipsis markers are `aria-hidden`; visible focus ring on each chip.

## Related components

- [`DataTable`](DataTable.md) — the grid you typically paginate.
- [`Dropdown`](Dropdown.md) — "rows per page" / "go to page" selects.
