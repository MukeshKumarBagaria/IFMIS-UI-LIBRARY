import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Funnel } from "@phosphor-icons/react";
import { DataTable } from "./DataTable";
import type { DataTableColumn } from "./DataTable";
import { Badge } from "../Badge";
import { Pagination } from "../Pagination";

/* ------------------------------------------------------------------ */
/* Sample financial data                                              */
/* ------------------------------------------------------------------ */

interface LedgerRow {
  code: string;
  account: string;
  department: string;
  budget: number;
  spent: number;
  status: "success" | "pending" | "danger";
}

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const ROWS: LedgerRow[] = [
  { code: "4001", account: "Salaries & Wages", department: "Health", budget: 12_000_000, spent: 9_450_000, status: "success" },
  { code: "4002", account: "Medical Supplies", department: "Health", budget: 5_400_000, spent: 5_390_000, status: "pending" },
  { code: "4101", account: "School Infrastructure", department: "Education", budget: 8_200_000, spent: 8_900_000, status: "danger" },
  { code: "4102", account: "Teaching Materials", department: "Education", budget: 1_300_000, spent: 740_000, status: "success" },
  { code: "4201", account: "Road Maintenance", department: "Works", budget: 22_500_000, spent: 18_100_000, status: "success" },
  { code: "4202", account: "Bridge Repairs", department: "Works", budget: 6_750_000, spent: 6_700_000, status: "pending" },
  { code: "4301", account: "Crop Subsidies", department: "Agriculture", budget: 14_000_000, spent: 13_200_000, status: "success" },
  { code: "4302", account: "Irrigation Grants", department: "Agriculture", budget: 9_900_000, spent: 10_400_000, status: "danger" },
];

const STATUS_LABEL: Record<LedgerRow["status"], string> = {
  success: "On track",
  pending: "At limit",
  danger: "Over budget",
};

const columns: DataTableColumn<LedgerRow>[] = [
  { id: "code", header: "Code", accessor: "code", sticky: true, sortable: true, width: 90 },
  { id: "account", header: "Account", accessor: "account", sortable: true, minWidth: 200 },
  { id: "department", header: "Department", accessor: "department", sortable: true },
  { id: "budget", header: "Budget", accessor: "budget", align: "right", sortable: true, cell: (r) => inr(r.budget) },
  { id: "spent", header: "Spent", accessor: "spent", align: "right", sortable: true, cell: (r) => inr(r.spent) },
  {
    id: "variance",
    header: "Variance",
    align: "right",
    accessor: (r) => r.budget - r.spent,
    sortable: true,
    cell: (r) => {
      const v = r.budget - r.spent;
      return (
        <span className={v < 0 ? "font-semibold text-red-600" : "text-body-secondary"}>
          {inr(v)}
        </span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    align: "center",
    accessor: "status",
    cell: (r) => {
      const tone = r.status === "success" ? "success" : r.status === "pending" ? "pending" : "danger";
      return <Badge variant={tone}>{STATUS_LABEL[r.status]}</Badge>;
    },
  },
];

/* ------------------------------------------------------------------ */

const meta: Meta<typeof DataTable<LedgerRow>> = {
  title: "UI/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A generic, sortable financial data grid built on a semantic `<table>`.",
          "Purple-50 headers outlined in Surface/Borders-purple, white rows, a 12px",
          "rounded frame, and horizontal scrolling for wide statements.",
          "",
          "Bring `columns` + `data` (fully typed); opt into sorting, sticky header /",
          "first column, footer totals, density, loading, empty state, a toolbar",
          "slot, and the synced `Scrollbar`.",
        ].join("\n"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable<LedgerRow>>;

/** The full financial grid — sorting, sticky code column, currency, totals. */
export const Default: Story = {
  render: () => {
    const totalBudget = ROWS.reduce((s, r) => s + r.budget, 0);
    const totalSpent = ROWS.reduce((s, r) => s + r.spent, 0);
    const cols = columns.map((c) =>
      c.id === "code"
        ? { ...c, footer: "Total" }
        : c.id === "budget"
          ? { ...c, footer: inr(totalBudget) }
          : c.id === "spent"
            ? { ...c, footer: inr(totalSpent) }
            : c.id === "variance"
              ? { ...c, footer: inr(totalBudget - totalSpent) }
              : c,
    );
    return <DataTable aria-label="Budget ledger" columns={cols} data={ROWS} getRowId={(r) => r.code} />;
  },
};

/** Matches the Figma frame: many equal columns scrolling under the Scrollbar. */
export const WideWithScrollbar: Story = {
  render: () => {
    const wideCols: DataTableColumn<Record<string, string>>[] = Array.from(
      { length: 15 },
      (_, i) => ({
        id: `c${i}`,
        header: "Col header",
        accessor: `c${i}`,
        align: "center",
        minWidth: 130,
      }),
    );
    const wideData = Array.from({ length: 2 }, (_, r) =>
      Object.fromEntries(wideCols.map((c) => [c.id, "Table content"])),
    ) as Record<string, string>[];
    return (
      <DataTable
        aria-label="Wide table"
        columns={wideCols}
        data={wideData}
        showScrollbar
        toolbar={
          <>
            {["Filter", "Filter", "Filter"].map((label, i) => (
              <button
                key={i}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border-grey bg-surface-grey-bg px-3 py-1 text-body-xs font-medium text-body-secondary"
              >
                {label}
                <Funnel className="size-4" />
              </button>
            ))}
          </>
        }
      />
    );
  },
};

/** Sticky header with a capped body height. */
export const StickyHeader: Story = {
  render: () => (
    <DataTable
      aria-label="Scrolling ledger"
      columns={columns}
      data={[...ROWS, ...ROWS, ...ROWS]}
      getRowId={(r, i) => `${r.code}-${i}`}
      stickyHeader
      maxHeight={280}
    />
  ),
};

export const Loading: Story = {
  render: () => <DataTable columns={columns} data={[]} loading skeletonRows={5} />,
};

export const Empty: Story = {
  render: () => (
    <DataTable columns={columns} data={[]} emptyMessage="No transactions for this period." />
  ),
};

export const CompactDensity: Story = {
  render: () => <DataTable columns={columns} data={ROWS} getRowId={(r) => r.code} density="compact" />,
};

/** Composed with `Pagination` to page through a larger dataset. */
export const WithPagination: Story = {
  render: () => {
    const PAGE_SIZE = 3;
    const [page, setPage] = useState(1);
    const pageCount = Math.ceil(ROWS.length / PAGE_SIZE);
    const slice = ROWS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return (
      <div className="flex flex-col items-center gap-4">
        <DataTable aria-label="Paged ledger" columns={columns} data={slice} getRowId={(r) => r.code} />
        <Pagination count={pageCount} page={page} onPageChange={setPage} />
      </div>
    );
  },
};
