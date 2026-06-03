import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HoverPill, HoverPillTip } from "./HoverPill";

describe("HoverPill (presentational)", () => {
  it("renders the label and a decorative arrow", () => {
    const { container } = render(<HoverPill>Deposit</HoverPill>);
    expect(screen.getByText("Deposit")).toBeInTheDocument();
    // The arrow is an aria-hidden span.
    const arrow = container.querySelector('span[aria-hidden="true"]');
    expect(arrow).toBeInTheDocument();
  });

  it("places the arrow per placement", () => {
    const { container, rerender } = render(
      <HoverPill placement="top-start">A</HoverPill>,
    );
    const arrow = () =>
      container.querySelector('span[aria-hidden="true"]') as HTMLElement;
    expect(arrow().className).toContain("top-full");
    expect(arrow().className).toContain("border-t-surface-border-grey");

    rerender(<HoverPill placement="bottom-end">A</HoverPill>);
    expect(arrow().className).toContain("bottom-full");
    expect(arrow().className).toContain("border-b-surface-border-grey");

    rerender(<HoverPill placement="left">A</HoverPill>);
    expect(arrow().className).toContain("left-full");
    expect(arrow().className).toContain("border-l-surface-border-grey");

    rerender(<HoverPill placement="right">A</HoverPill>);
    expect(arrow().className).toContain("right-full");
    expect(arrow().className).toContain("border-r-surface-border-grey");
  });

  it("forwards className and arbitrary props", () => {
    const { container } = render(
      <HoverPill className="custom" data-testid="pill">
        X
      </HoverPill>,
    );
    const pill = container.firstElementChild as HTMLElement;
    expect(pill).toHaveClass("custom");
    expect(pill).toHaveAttribute("data-testid", "pill");
  });
});

describe("HoverPillTip (behavioural)", () => {
  it("is hidden until hover, then shows the pill", async () => {
    render(
      <HoverPillTip label="Deposit">
        <button>icon</button>
      </HoverPillTip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await userEvent.hover(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toHaveTextContent("Deposit");

    await userEvent.unhover(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows on focus and hides on blur", async () => {
    render(
      <HoverPillTip label="Deposit">
        <button>icon</button>
      </HoverPillTip>,
    );
    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await userEvent.tab();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("wires aria-describedby to the trigger while open", async () => {
    render(
      <HoverPillTip label="Deposit">
        <button>icon</button>
      </HoverPillTip>,
    );
    const button = screen.getByRole("button");
    expect(button).not.toHaveAttribute("aria-describedby");

    await userEvent.hover(button);
    const tip = screen.getByRole("tooltip");
    expect(button).toHaveAttribute("aria-describedby", tip.id);
  });

  it("renders a decorative pill without tooltip semantics", async () => {
    render(
      <HoverPillTip label="Deposit" decorative>
        <button aria-label="Deposit">icon</button>
      </HoverPillTip>,
    );
    await userEvent.hover(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.getByText("Deposit")).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-describedby");
  });

  it("respects a controlled open prop", () => {
    const { rerender } = render(
      <HoverPillTip label="Deposit" open={false}>
        <button>icon</button>
      </HoverPillTip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    rerender(
      <HoverPillTip label="Deposit" open>
        <button>icon</button>
      </HoverPillTip>,
    );
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("never shows when disabled", async () => {
    render(
      <HoverPillTip label="Deposit" disabled>
        <button>icon</button>
      </HoverPillTip>,
    );
    await userEvent.hover(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("applies the requested placement to the pill arrow", async () => {
    render(
      <HoverPillTip label="Deposit" placement="right">
        <button>icon</button>
      </HoverPillTip>,
    );
    await userEvent.hover(screen.getByRole("button"));
    const tip = screen.getByRole("tooltip");
    // A right-placed pill puts its arrow on the left edge (pointing left).
    const arrow = tip.querySelector('span[aria-hidden="true"]') as HTMLElement;
    expect(arrow.className).toContain("right-full");
    expect(arrow.className).toContain("border-r-surface-border-grey");
  });
});
