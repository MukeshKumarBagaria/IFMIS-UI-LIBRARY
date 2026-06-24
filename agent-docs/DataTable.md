# DataTable

> A generic, sortable **financial data grid** built on a semantic `<table>`. You bring a typed `columns` array and a `data` array; everything else (sorting, sticky header/column, footer totals, density, loading/empty states, toolbar, synced horizontal scrollbar) is opt-in.

```jsx
import { DataTable } from "@ifmis/ui";
```

- **Type:** Data grid. Generic over the row type `T` (`DataTable<T>`).
- **Types:** `DataTableProps<T>`, `DataTableColumn<T>`, `DataTableAlign` (`"left" | "center" | "right"`), `DataTableSort`, `SortDirection` (`"asc" | "desc"`).

---

## Purpose

Render dense, financial-style tabular data with the IFMIS table styling and the features a real statement needs. It renders exactly the rows you pass — pagination and server fetching stay in your control.

## When to use

- Ledgers, statements, transaction lists, any tabular financial data.
- Tables needing sorting, totals, sticky headers, or a pinned identifier column.

## When NOT to use

- A small static key/value layout → plain markup or [`StatCard`](StatCard.md).
- Selectable option lists → [`CheckboxCard`](CheckboxCard.md).
- It does **not** paginate internally — pair with [`Pagination`](Pagination.md).

## Props

### `DataTable<T>`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `columns` | `DataTableColumn<T>[]` | — | **Required.** Column definitions, in order. |
| `data` | `T[]` | — | **Required.** Row data. |
| `getRowId` | `(row, i) => string \| number` | row index | Stable React key per row. **Always pass this.** |
| `sort` | `DataTableSort \| null` | — | Controlled sort (`null` = unsorted). Pair with `onSortChange`. |
| `defaultSort` | `DataTableSort \| null` | `null` | Uncontrolled initial sort. |
| `onSortChange` | `(sort \| null) => void` | — | Fires when a header toggles. |
| `manualSort` | `boolean` | `false` | Skip internal sorting (server already sorted). |
| `stickyHeader` | `boolean` | `false` | Keep header visible (needs `maxHeight`). |
| `maxHeight` | `number \| string` | — | Cap body height → vertical scroll. |
| `showScrollbar` | `boolean` | `false` | Render the synced library [`Scrollbar`](Scrollbar.md) below the grid. |
| `density` | `"comfortable" \| "compact"` | `"comfortable"` | Row padding. |
| `toolbar` | `ReactNode` | — | Right-aligned slot above the grid (filter chips). |
| `caption` | `ReactNode` | — | `<caption>` above the grid. |
| `loading` | `boolean` | `false` | Show a skeleton instead of rows. |
| `skeletonRows` | `number` | `5` | Skeleton row count while loading. |
| `emptyMessage` | `ReactNode` | `"No data"` | Shown when `data` is empty. |
| `onRowClick` | `(row, i) => void` | — | Makes rows focusable + clickable (mouse + Enter/Space). |
| `rowClassName` | `string \| (row, i) => string` | — | Extra classes per row. |
| `className` | `string` | — | Outer wrapper. |
| `tableClassName` | `string` | — | The `<table>`. |
| `aria-label` | `string` | — | Accessible name for the grid. |

### `DataTableColumn<T>`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `id` | `string` | — | **Required.** Stable id — also sort key + React key. |
| `header` | `ReactNode` | — | **Required.** Header content. |
| `accessor` | `keyof T \| (row) => unknown` | — | Value for display fallback **and** sorting. |
| `cell` | `(row, i) => ReactNode` | accessor value | Custom cell render (display only). |
| `align` | `"left" \| "center" \| "right"` | `"left"` | Header + body alignment. |
| `sortable` | `boolean` | `false` | Click-to-sort (cycles asc → desc → unsorted). |
| `sortFn` | `(a, b) => number` | smart comparator | Custom ascending comparator. |
| `footer` | `ReactNode` | — | Renders a `<tfoot>` cell (any column with footer triggers the row). |
| `sticky` | `boolean` | `false` | Pin column to the left during horizontal scroll. |
| `width` | `number \| string` | — | Fixed width (number → px). |
| `minWidth` | `number \| string` | — | Minimum width. |
| `wrap` | `boolean` | `false` | Allow text wrapping (default: no wrap). |
| `headerClassName` | `string` | — | Extra header-cell classes. |
| `cellClassName` | `string \| (row, i) => string` | — | Extra body-cell classes. |

The default comparator is numeric/date/locale-aware with null handling (`100` sorts before `20` numerically).

## Usage examples

### Quickstart

```jsx
const columns = [
  { id: "code", header: "Code", accessor: "code" },
  { id: "account", header: "Account", accessor: "account" },
  { id: "spent", header: "Spent", accessor: "spent", align: "right" },
];

<DataTable
  aria-label="Budget ledger"
  columns={columns}
  data={rows}
  getRowId={(row) => row.code}
/>
```

### Format in `cell`, sort on `accessor`, plus footer totals

```jsx
const columns = [
  { id: "code", header: "Code", accessor: "code", sticky: true, sortable: true, footer: "Total" },
  { id: "account", header: "Account", accessor: "account", sortable: true },
  {
    id: "budget", header: "Budget", align: "right", accessor: "budget", sortable: true,
    cell: (r) => inr(r.budget), footer: inr(totalBudget),
  },
];
```

### Controlled / server-side sort

```jsx
const [sort, setSort] = useState({ columnId: "spent", direction: "desc" });

// Client-side:
<DataTable columns={columns} data={rows} sort={sort} onSortChange={setSort} />

// Server-side (table reports sort, doesn't reorder):
<DataTable manualSort columns={columns} data={pageFromServer} sort={sort} onSortChange={refetch} />
```

### Sticky header + wide scrolling

```jsx
<DataTable columns={columns} data={rows} stickyHeader maxHeight={280} />
<DataTable columns={wideColumns} data={rows} showScrollbar />
```

### Loading / empty

```jsx
<DataTable columns={columns} data={[]} loading skeletonRows={5} />
<DataTable columns={columns} data={[]} emptyMessage="No transactions for this period." />
```

### Pagination (slice the data yourself)

```jsx
const PAGE_SIZE = 10;
const [page, setPage] = useState(1);
const pageCount = Math.ceil(rows.length / PAGE_SIZE);
const slice = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

<>
  <DataTable columns={columns} data={slice} getRowId={(r) => r.id} />
  <Pagination count={pageCount} page={page} onPageChange={setPage} />
</>
```

### Row interaction + conditional styling

```jsx
<DataTable
  columns={columns}
  data={rows}
  onRowClick={(row) => navigate(`/ledger/${row.code}`)}
  rowClassName={(row) => (row.status === "danger" ? "bg-red-50" : "")}
/>
```

## Best practices

- **Always pass `getRowId`** — stable keys keep focus/selection correct across sort/page (otherwise it uses the row index).
- **Right-align numbers, left-align text** — the convention for financial statements.
- **Format in `cell`, sort on `accessor`** — keep the raw number in `accessor` so sorting stays numeric.
- **Pin the identifier column** (`sticky`) on wide tables.
- **Page large datasets** with [`Pagination`](Pagination.md); don't render thousands of rows.
- **Use `manualSort`** once sorting/paging moves server-side.

## Common mistakes

- **Omitting `getRowId`** — leads to index-based keys and subtle bugs on reorder.
- **Putting formatting in `accessor`** — breaks numeric sorting (sort uses `accessor`).
- **`stickyHeader` without `maxHeight`** — there's nothing to scroll, so it won't stick.
- **Expecting built-in pagination** — there is none; slice `data` yourself.

## Accessibility

- Real `<table>` with `<thead>`/`<tbody>`/`<tfoot>`, `scope="col"` headers, and a `<caption>` when set. Pass `aria-label` or `caption` to name the grid.
- Sortable headers are `<button>`s inside `<th>` exposing `aria-sort`.
- With `onRowClick`, rows become `tabIndex={0}` and respond to Enter/Space.
- Decorative sort glyphs are `aria-hidden`.

## Related components

- [`Pagination`](Pagination.md) — page through large datasets.
- [`Scrollbar`](Scrollbar.md) — the synced horizontal scrollbar (`showScrollbar`).
- [`SelectionPill`](SelectionPill.md) — filter chips for the `toolbar` slot.
