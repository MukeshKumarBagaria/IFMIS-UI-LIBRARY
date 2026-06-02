import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("renders as a switch with its label", () => {
    render(<Toggle>Email alerts</Toggle>);
    const sw = screen.getByRole("switch", { name: "Email alerts" });
    expect(sw).toBeInTheDocument();
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("defaults to the off state and reflects defaultChecked", () => {
    render(<Toggle defaultChecked>On</Toggle>);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("toggles itself when uncontrolled and reports the next value", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Toggle onCheckedChange={onCheckedChange}>Auto-save</Toggle>);

    const sw = screen.getByRole("switch");
    await user.click(sw);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("does not change its own state when controlled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Toggle checked={false} onCheckedChange={onCheckedChange}>
        Controlled
      </Toggle>,
    );

    const sw = screen.getByRole("switch");
    await user.click(sw);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    // Stays off because the parent owns the value.
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("is operable with the keyboard", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Toggle onCheckedChange={onCheckedChange}>Keyboard</Toggle>);

    await user.tab();
    expect(screen.getByRole("switch")).toHaveFocus();
    await user.keyboard("[Space]");

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not fire when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Toggle disabled onCheckedChange={onCheckedChange}>
        Disabled
      </Toggle>,
    );

    await user.click(screen.getByRole("switch"));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("supports a bare switch via aria-label", () => {
    render(<Toggle aria-label="Dark mode" />);
    expect(screen.getByRole("switch", { name: "Dark mode" })).toBeInTheDocument();
  });

  it("forwards className and reflects state via data-state", () => {
    render(
      <Toggle className="custom" defaultChecked>
        Styled
      </Toggle>,
    );
    const sw = screen.getByRole("switch");
    expect(sw).toHaveClass("custom");
    expect(sw).toHaveAttribute("data-state", "on");
  });
});
