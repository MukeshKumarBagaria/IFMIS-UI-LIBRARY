import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Scrollbar } from "./Scrollbar";

describe("Scrollbar", () => {
  it("exposes the ARIA slider contract", () => {
    render(<Scrollbar defaultValue={20} min={0} max={100} aria-label="Pager" />);
    const slider = screen.getByRole("slider", { name: "Pager" });
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
    expect(slider).toHaveAttribute("aria-valuenow", "20");
  });

  it("disables the left caret at the minimum and the right caret at the maximum", () => {
    const { rerender } = render(<Scrollbar defaultValue={0} />);
    expect(screen.getByRole("button", { name: "Scroll left" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Scroll right" })).toBeEnabled();

    rerender(<Scrollbar value={100} />);
    expect(screen.getByRole("button", { name: "Scroll left" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Scroll right" })).toBeDisabled();
  });

  it("steps by `step` when the carets are clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Scrollbar defaultValue={50} step={10} onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Scroll right" }));
    expect(onValueChange).toHaveBeenLastCalledWith(60);

    await user.click(screen.getByRole("button", { name: "Scroll left" }));
    expect(onValueChange).toHaveBeenLastCalledWith(50);
  });

  it("clamps stepping at the bounds", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Scrollbar defaultValue={95} step={10} onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Scroll right" }));
    expect(onValueChange).toHaveBeenLastCalledWith(100);
  });

  it("moves with the arrow keys and Home/End", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Scrollbar defaultValue={50} step={5} onValueChange={onValueChange} />);

    const slider = screen.getByRole("slider");
    slider.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith(55);
    await user.keyboard("{ArrowLeft}");
    expect(onValueChange).toHaveBeenLastCalledWith(50);
    await user.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith(0);
    await user.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith(100);
  });

  it("supports controlled usage", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [v, setV] = useState(0);
      return <Scrollbar value={v} step={25} onValueChange={setV} />;
    }
    render(<Controlled />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "0");

    await user.click(screen.getByRole("button", { name: "Scroll right" }));
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "25");
  });

  it("ignores interaction when disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Scrollbar defaultValue={50} disabled onValueChange={onValueChange} />);

    expect(screen.getByRole("button", { name: "Scroll left" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Scroll right" })).toBeDisabled();

    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
