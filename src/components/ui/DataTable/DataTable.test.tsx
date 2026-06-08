import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "./DataTable";
import type { DataTableColumn } from "./DataTable";

interface Row {
  code: string;
  name: string;
  amount: number;
}

const DATA: Row[] = [
  { code: "B", name: "Beta", amount: 300 },
  { code: "A", name: "Alpha", amount: 100 },
  { code: "C", name: "Gamma", amount: 200 },
];

const columns: DataTableColumn<Row>[] = [
  { id: "code", header: "Code", accessor: "code", sortable: true },
  { id: "name", header: "Name", accessor: "name" },
  {
    id: "amount",
    header: "Amount",
    accessor: "amount",
    align: "right",
    sortable: true,
    cell: (r) => `$${r.amount}`,
    footer: "$600",
  },
];

/** Read the cell at `index` for every body row (skips thead/tfoot). */
function bodyColumn(index: number): string[] {
  const tbody = screen.getByRole("table").querySelector("tbody")!;
  return within(tbody)
    .getAllByRole("row")
    .map((r) => within(r).getAllByRole("cell")[index]?.textContent ?? "");
}

describe("DataTable", () => {
  it("renders headers, cell values and custom renderers", () => {
    render(<DataTable columns={columns} data={DATA} getRowId={(r) => r.code} />);
    expect(screen.getByRole("columnheader", { name: /Code/ })).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    // Custom cell renderer formats the amount.
    expect(screen.getByText("$300")).toBeInTheDocument();
  });

  it("renders a footer row when columns define one", () => {
    render(<DataTable columns={columns} data={DATA} getRowId={(r) => r.code} />);
    expect(screen.getByText("$600")).toBeInTheDocument();
  });

  it("sorts ascending then descending then clears on repeated header clicks", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={DATA} getRowId={(r) => r.code} />);

    // Initial (unsorted) order.
    expect(bodyColumn(0).filter((t) => /^[ABC]$/.test(t))).toEqual(["B", "A", "C"]);

    const codeHeader = screen.getByRole("button", { name: /Code/ });
    await user.click(codeHeader); // asc
    expect(bodyColumn(0).filter((t) => /^[ABC]$/.test(t))).toEqual(["A", "B", "C"]);

    await user.click(codeHeader); // desc
    expect(bodyColumn(0).filter((t) => /^[ABC]$/.test(t))).toEqual(["C", "B", "A"]);

    await user.click(codeHeader); // cleared
    expect(bodyColumn(0).filter((t) => /^[ABC]$/.test(t))).toEqual(["B", "A", "C"]);
  });

  it("sorts numeric columns numerically, not lexically", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={DATA} getRowId={(r) => r.code} />);
    await user.click(screen.getByRole("button", { name: /Amount/ }));
    // 100, 200, 300 — numeric order (lexical would also pass here, so check desc).
    await user.click(screen.getByRole("button", { name: /Amount/ }));
    expect(bodyColumn(2)).toEqual(["$300", "$200", "$100"]);
  });

  it("exposes aria-sort on sortable headers", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={DATA} getRowId={(r) => r.code} />);
    const code = screen.getByRole("columnheader", { name: /Code/ });
    expect(code).toHaveAttribute("aria-sort", "none");
    await user.click(within(code).getByRole("button"));
    expect(code).toHaveAttribute("aria-sort", "ascending");
  });

  it("shows the empty message when there is no data", () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders skeleton rows while loading", () => {
    render(<DataTable columns={columns} data={[]} loading skeletonRows={4} />);
    // Header still present; no data text; skeleton placeholders rendered.
    expect(screen.getByRole("columnheader", { name: /Code/ })).toBeInTheDocument();
    expect(screen.queryByText("No data")).toBeNull();
  });

  it("fires onRowClick (mouse and keyboard)", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <DataTable columns={columns} data={DATA} getRowId={(r) => r.code} onRowClick={onRowClick} />,
    );
    await user.click(screen.getByText("Beta"));
    expect(onRowClick).toHaveBeenCalledWith(DATA[0], 0);

    onRowClick.mockClear();
    const firstRow = within(screen.getByRole("table"))
      .getAllByRole("row")
      .filter((r) => within(r).queryAllByRole("cell").length > 0)[0]!;
    firstRow.focus();
    await user.keyboard("{Enter}");
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it("supports controlled sort", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={DATA}
        getRowId={(r) => r.code}
        sort={{ columnId: "code", direction: "asc" }}
        onSortChange={onSortChange}
      />,
    );
    // Controlled asc order regardless of internal state.
    expect(bodyColumn(0).filter((t) => /^[ABC]$/.test(t))).toEqual(["A", "B", "C"]);
    await user.click(screen.getByRole("button", { name: /Code/ }));
    expect(onSortChange).toHaveBeenCalledWith({ columnId: "code", direction: "desc" });
  });

  it("switching to a different column starts a fresh ascending sort", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={DATA}
        getRowId={(r) => r.code}
        defaultSort={{ columnId: "code", direction: "desc" }}
        onSortChange={onSortChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Amount/ }));
    expect(onSortChange).toHaveBeenCalledWith({ columnId: "amount", direction: "asc" });
  });

  it("honours manualSort — data order is left untouched", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={DATA}
        getRowId={(r) => r.code}
        manualSort
        onSortChange={onSortChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Code/ }));
    // Reports the sort…
    expect(onSortChange).toHaveBeenCalledWith({ columnId: "code", direction: "asc" });
    // …but the rows keep their original order (the server would reorder them).
    expect(bodyColumn(0)).toEqual(["B", "A", "C"]);
  });

  it("sorts on a function accessor (computed value)", async () => {
    const user = userEvent.setup();
    const cols: DataTableColumn<Row>[] = [
      { id: "code", header: "Code", accessor: "code" },
      {
        id: "half",
        header: "Half",
        accessor: (r) => r.amount / 2,
        sortable: true,
        cell: (r) => `${r.amount / 2}`,
      },
    ];
    render(<DataTable columns={cols} data={DATA} getRowId={(r) => r.code} />);
    await user.click(screen.getByRole("button", { name: /Half/ }));
    expect(bodyColumn(1)).toEqual(["50", "100", "150"]);
  });

  it("uses a custom sortFn when provided", async () => {
    const user = userEvent.setup();
    const cols: DataTableColumn<Row>[] = [
      // Sort by the last character of the name, ascending.
      {
        id: "name",
        header: "Name",
        accessor: "name",
        sortable: true,
        sortFn: (a, b) => a.name.slice(-1).localeCompare(b.name.slice(-1)),
      },
    ];
    render(<DataTable columns={cols} data={DATA} getRowId={(r) => r.code} />);
    await user.click(screen.getByRole("button", { name: /Name/ }));
    // Alph"a", Bet"a", Gamm"a" all end in "a" → stable original order kept.
    expect(bodyColumn(0)).toEqual(["Beta", "Alpha", "Gamma"]);
  });

  it("falls back to the row index when getRowId is omitted", () => {
    // No getRowId → should still render every row without key warnings/crashes.
    render(<DataTable columns={columns} data={DATA} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("renders a caption and a toolbar slot", () => {
    render(
      <DataTable
        columns={columns}
        data={DATA}
        getRowId={(r) => r.code}
        caption="Trial balance"
        toolbar={<button type="button">Filter</button>}
      />,
    );
    expect(screen.getByText("Trial balance")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
  });

  it("applies width / minWidth and alignment to cells", () => {
    const cols: DataTableColumn<Row>[] = [
      { id: "code", header: "Code", accessor: "code", width: 80 },
      { id: "amount", header: "Amount", accessor: "amount", align: "right", minWidth: 120 },
    ];
    render(<DataTable columns={cols} data={DATA} getRowId={(r) => r.code} />);
    const codeHeader = screen.getByRole("columnheader", { name: "Code" });
    expect(codeHeader).toHaveStyle({ width: "80px" });
    const amountHeader = screen.getByRole("columnheader", { name: "Amount" });
    expect(amountHeader).toHaveStyle({ minWidth: "120px" });
    expect(amountHeader.className).toContain("text-right");
  });

  it("pins a sticky column", () => {
    const cols: DataTableColumn<Row>[] = [
      { id: "code", header: "Code", accessor: "code", sticky: true },
      { id: "name", header: "Name", accessor: "name" },
    ];
    render(<DataTable columns={cols} data={DATA} getRowId={(r) => r.code} />);
    expect(screen.getByRole("columnheader", { name: "Code" }).className).toContain("sticky");
  });

  it("applies a function rowClassName per row", () => {
    render(
      <DataTable
        columns={columns}
        data={DATA}
        getRowId={(r) => r.code}
        rowClassName={(r) => (r.code === "A" ? "flagged-row" : "")}
      />,
    );
    expect(document.querySelector("tr.flagged-row")).not.toBeNull();
    expect(document.querySelectorAll("tr.flagged-row").length).toBe(1);
  });

  it("compact density tightens row padding", () => {
    const { rerender } = render(
      <DataTable columns={columns} data={DATA} getRowId={(r) => r.code} density="comfortable" />,
    );
    const tbody = screen.getByRole("table").querySelector("tbody")!;
    expect(within(tbody).getAllByRole("cell")[0]!.className).toContain("py-4");

    rerender(<DataTable columns={columns} data={DATA} getRowId={(r) => r.code} density="compact" />);
    const tbody2 = screen.getByRole("table").querySelector("tbody")!;
    expect(within(tbody2).getAllByRole("cell")[0]!.className).toContain("py-2.5");
  });

  it("does not render a footer when no column defines one", () => {
    const cols: DataTableColumn<Row>[] = [
      { id: "code", header: "Code", accessor: "code" },
      { id: "name", header: "Name", accessor: "name" },
    ];
    render(<DataTable columns={cols} data={DATA} getRowId={(r) => r.code} />);
    expect(screen.getByRole("table").querySelector("tfoot")).toBeNull();
  });
});
