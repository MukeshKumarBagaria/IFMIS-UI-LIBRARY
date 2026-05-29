import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageTitle } from "./PageTitle";

describe("PageTitle", () => {
  it("renders the title as a level-1 heading", () => {
    render(<PageTitle title="This is a page title" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "This is a page title" }),
    ).toBeInTheDocument();
  });

  it("renders a breadcrumb nav when items are provided", () => {
    render(
      <PageTitle
        title="Voucher"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Voucher" }]}
      />,
    );
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });

  it("omits the breadcrumb nav when no items are given", () => {
    render(<PageTitle title="Voucher" />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("renders the back button and fires onBack when clicked", async () => {
    const onBack = vi.fn();
    render(<PageTitle title="Voucher" onBack={onBack} />);
    const back = screen.getByRole("button", { name: "Back" });
    await userEvent.click(back);
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("omits the back button when onBack is not provided", () => {
    render(<PageTitle title="Voucher" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("supports a custom back label", () => {
    render(<PageTitle title="Voucher" onBack={() => {}} backLabel="Go back" />);
    expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
  });

  it("renders the decorative diamonds by default and hides them on request", () => {
    const { container, rerender } = render(<PageTitle title="Voucher" />);
    // No breadcrumbs / back button, so the only SVGs are the two diamonds.
    expect(container.querySelectorAll("svg")).toHaveLength(2);

    rerender(<PageTitle title="Voucher" hideDecoration />);
    expect(container.querySelectorAll("svg")).toHaveLength(0);
  });

  it("forwards className and arbitrary props to the root", () => {
    const { container } = render(
      <PageTitle title="Voucher" className="custom-band" data-testid="band" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("custom-band");
    expect(root).toHaveAttribute("data-testid", "band");
  });
});
