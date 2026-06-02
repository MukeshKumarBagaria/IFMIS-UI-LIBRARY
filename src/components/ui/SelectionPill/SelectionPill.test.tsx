import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectionPill } from "./SelectionPill";

describe("SelectionPill", () => {
  it("renders its label as a toggle button", () => {
    render(<SelectionPill>Roads</SelectionPill>);
    const pill = screen.getByRole("button", { name: "Roads" });
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveAttribute("aria-pressed", "false");
  });

  it("reflects defaultSelected", () => {
    render(<SelectionPill defaultSelected>Health</SelectionPill>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("renders the default check icon, and hides it with icon={null}", () => {
    const { container, rerender } = render(
      <SelectionPill defaultSelected>Selected</SelectionPill>,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();

    rerender(
      <SelectionPill defaultSelected icon={null}>
        Selected
      </SelectionPill>,
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders a custom icon", () => {
    render(
      <SelectionPill icon={<svg data-testid="custom" />}>Add</SelectionPill>,
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("toggles when uncontrolled and reports the next value", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <SelectionPill onSelectedChange={onSelectedChange}>Water</SelectionPill>,
    );

    const pill = screen.getByRole("button");
    await user.click(pill);

    expect(onSelectedChange).toHaveBeenCalledWith(true);
    expect(pill).toHaveAttribute("aria-pressed", "true");
  });

  it("does not change its own state when controlled", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <SelectionPill selected={false} onSelectedChange={onSelectedChange}>
        Controlled
      </SelectionPill>,
    );

    const pill = screen.getByRole("button");
    await user.click(pill);

    expect(onSelectedChange).toHaveBeenCalledWith(true);
    expect(pill).toHaveAttribute("aria-pressed", "false");
  });

  it("does not fire when disabled", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <SelectionPill disabled onSelectedChange={onSelectedChange}>
        Disabled
      </SelectionPill>,
    );

    await user.click(screen.getByRole("button"));
    expect(onSelectedChange).not.toHaveBeenCalled();
  });

  it("applies the selected surface class and forwards className", () => {
    render(
      <SelectionPill defaultSelected className="custom">
        Selected
      </SelectionPill>,
    );
    const pill = screen.getByRole("button");
    expect(pill).toHaveClass("custom");
    expect(pill.className).toContain("bg-purple-600");
    expect(pill).toHaveAttribute("data-state", "selected");
  });
});
