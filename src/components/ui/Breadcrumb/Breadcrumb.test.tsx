import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("renders a nav landmark with all items", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Vouchers", href: "/vouchers" },
          { label: "Detail" },
        ]}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Vouchers")).toBeInTheDocument();
    expect(screen.getByText("Detail")).toBeInTheDocument();
  });

  it("marks the last item as the current page (non-interactive)", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Current" },
        ]}
      />,
    );
    const current = screen.getByText("Current");
    expect(current).toHaveAttribute("aria-current", "page");
    // Links exist only for the non-current crumbs.
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders href crumbs as links and onClick crumbs as buttons", async () => {
    const onClick = vi.fn();
    render(
      <Breadcrumb
        items={[
          { label: "Linkish", href: "/x" },
          { label: "Clickish", onClick },
          { label: "Here" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Linkish" })).toHaveAttribute("href", "/x");
    await userEvent.click(screen.getByRole("button", { name: "Clickish" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("honours an explicit `current` item", () => {
    render(
      <Breadcrumb
        items={[
          { label: "A", href: "/a" },
          { label: "B", current: true },
          { label: "C", href: "/c" },
        ]}
      />,
    );
    expect(screen.getByText("B")).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("C")).not.toHaveAttribute("aria-current");
  });

  it("renders a separator between every pair (n-1 total)", () => {
    const { container } = render(
      <Breadcrumb
        separator={<span data-testid="sep">/</span>}
        items={[
          { label: "A", href: "/a" },
          { label: "B", href: "/b" },
          { label: "C", href: "/c" },
          { label: "D" },
        ]}
      />,
    );
    expect(container.querySelectorAll('[data-testid="sep"]')).toHaveLength(3);
  });
});
