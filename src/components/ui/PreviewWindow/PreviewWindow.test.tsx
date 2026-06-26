import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PreviewWindow } from "./PreviewWindow";

describe("PreviewWindow", () => {
  it("renders the title and the placeholder when no children are given", () => {
    render(<PreviewWindow title="invoice_inv_860" />);
    expect(screen.getByText("invoice_inv_860")).toBeInTheDocument();
    expect(
      screen.getByText("REPLACE YOUR FORMAT WITH THIS FRAME"),
    ).toBeInTheDocument();
  });

  it("renders children instead of the placeholder", () => {
    render(
      <PreviewWindow title="doc.pdf">
        <span>custom preview</span>
      </PreviewWindow>,
    );
    expect(screen.getByText("custom preview")).toBeInTheDocument();
    expect(
      screen.queryByText("REPLACE YOUR FORMAT WITH THIS FRAME"),
    ).not.toBeInTheDocument();
  });

  it("only renders the actions whose handlers are provided", () => {
    const { rerender } = render(<PreviewWindow title="doc.pdf" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    rerender(<PreviewWindow title="doc.pdf" onClose={() => {}} />);
    expect(screen.getByRole("button", { name: /close preview/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /print/i })).not.toBeInTheDocument();
  });

  it("fires the print, expand and close handlers", async () => {
    const onPrint = vi.fn();
    const onExpand = vi.fn();
    const onClose = vi.fn();
    render(
      <PreviewWindow
        title="doc.pdf"
        onPrint={onPrint}
        onExpand={onExpand}
        onClose={onClose}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /print/i }));
    await userEvent.click(screen.getByRole("button", { name: /expand preview/i }));
    await userEvent.click(screen.getByRole("button", { name: /close preview/i }));
    expect(onPrint).toHaveBeenCalledOnce();
    expect(onExpand).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
