import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./Pagination";
import { paginationRange } from "./paginationRange";

describe("paginationRange", () => {
  it("lists every page when the range is short", () => {
    expect(paginationRange({ count: 4, page: 1 })).toEqual([1, 2, 3, 4]);
  });

  it("collapses both ends around the current page", () => {
    expect(paginationRange({ count: 10, page: 5 })).toEqual([
      1,
      "start-ellipsis",
      4,
      5,
      6,
      "end-ellipsis",
      10,
    ]);
  });

  it("only collapses the far end near the start", () => {
    // The sibling window keeps a stable width, so the start always shows a few
    // pages before the trailing ellipsis.
    expect(paginationRange({ count: 10, page: 1 })).toEqual([
      1,
      2,
      3,
      4,
      5,
      "end-ellipsis",
      10,
    ]);
  });
});

describe("Pagination", () => {
  it("marks the current page with aria-current", () => {
    render(<Pagination count={4} defaultPage={2} />);
    expect(screen.getByRole("button", { name: "Go to page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("button", { name: "Go to page 1" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("disables Previous on the first page and Next on the last", () => {
    const { rerender } = render(<Pagination count={4} defaultPage={1} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();

    rerender(<Pagination count={4} page={4} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("steps with the caret buttons", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination count={4} defaultPage={2} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);

    // Uncontrolled: the internal page is now 3, so Previous lands on 2.
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
  });

  it("jumps to a clicked page number", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination count={4} defaultPage={1} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Go to page 3" }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
  });

  it("supports controlled usage", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [page, setPage] = useState(1);
      return <Pagination count={5} page={page} onPageChange={setPage} />;
    }
    render(<Controlled />);
    await user.click(screen.getByRole("button", { name: "Go to page 4" }));
    expect(screen.getByRole("button", { name: "Go to page 4" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("ignores interaction when disabled", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination count={5} defaultPage={2} disabled onPageChange={onPageChange} />);

    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Go to page 4" }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("can hide the caret controls", () => {
    render(<Pagination count={4} defaultPage={1} hideControls />);
    expect(screen.queryByRole("button", { name: "Previous page" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Next page" })).toBeNull();
  });
});
