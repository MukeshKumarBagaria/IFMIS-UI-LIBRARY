import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("does not render any button (the Back action lives in CtaTray)", () => {
    render(<PageTitle title="Voucher" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders the decorative diamonds by default and hides them on request", () => {
    const { container, rerender } = render(<PageTitle title="Voucher" />);
    // No breadcrumbs, so the only SVGs are the two diamonds.
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
