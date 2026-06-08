import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";
import { Dropdown } from "../Dropdown";

const meta: Meta<typeof Pagination> = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A pill-shaped page navigator — prev/next caret steppers around a row",
          "of page numbers. The active page is a Purple-500 circle; the carets",
          "disable at the first / last page. Long ranges collapse around the",
          "current page with ellipses (`siblingCount` / `boundaryCount`).",
          "",
          "Works controlled (`page` + `onPageChange`) or uncontrolled",
          "(`defaultPage`). Pair it with `Dropdown` for the “Rows per page” and",
          "“Go to page” controls (see the *Full toolbar* story).",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    count: { control: "number" },
    siblingCount: { control: "number" },
    boundaryCount: { control: "number" },
    hideControls: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: { count: 4, defaultPage: 1 },
};

/** Many pages — the range collapses around the current page with ellipses. */
export const Truncated: Story = {
  args: { count: 10, defaultPage: 5 },
};

export const Disabled: Story = {
  args: { count: 10, defaultPage: 3, disabled: true },
};

/** Just the numbers, no caret steppers. */
export const NoControls: Story = {
  args: { count: 5, defaultPage: 2, hideControls: true },
};

/** Controlled — the current page is mirrored in a live read-out. */
export const Controlled: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <div className="flex flex-col items-start gap-3">
        <Pagination count={10} page={page} onPageChange={setPage} />
        <p className="text-body-sm text-body-secondary">Page: {page}</p>
      </div>
    );
  },
};

/**
 * The complete table footer from the design — "Rows per page" and "Go to page"
 * built from the existing `Dropdown`, with `Pagination` in the middle.
 */
export const FullToolbar: Story = {
  render: () => {
    const TOTAL = 10;
    const [page, setPage] = useState(1);
    const pageOptions = Array.from({ length: TOTAL }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1} / ${TOTAL}`,
    }));
    return (
      <div className="flex flex-wrap items-center gap-8">
        <Dropdown
          label="Rows per page"
          defaultValue="10"
          triggerClassName="w-24 rounded-3xl"
          options={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "50", label: "50" },
          ]}
        />
        <Pagination count={TOTAL} page={page} onPageChange={setPage} />
        <Dropdown
          label="Go to page"
          value={String(page)}
          onValueChange={(v) => setPage(Number(v))}
          triggerClassName="w-28 rounded-3xl"
          options={pageOptions}
        />
      </div>
    );
  },
};
