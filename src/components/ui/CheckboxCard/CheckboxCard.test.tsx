import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckboxCard } from "./CheckboxCard";

describe("CheckboxCard", () => {
  it("renders a checkbox input with its title as the accessible name", () => {
    render(<CheckboxCard title="Premium plan" />);
    const box = screen.getByRole("checkbox", { name: "Premium plan" });
    expect(box).toBeInTheDocument();
    expect(box).not.toBeChecked();
  });

  it("renders the description when provided", () => {
    render(
      <CheckboxCard title="Premium plan" description="14-day free trial" />,
    );
    expect(screen.getByText("14-day free trial")).toBeInTheDocument();
  });

  it("omits the description node when not provided", () => {
    render(<CheckboxCard title="Premium plan" />);
    expect(screen.queryByText(/free trial/i)).not.toBeInTheDocument();
  });

  it("reflects defaultChecked", () => {
    render(<CheckboxCard defaultChecked title="On" />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("toggles when uncontrolled and reports the next value", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <CheckboxCard title="Click me" onCheckedChange={onCheckedChange} />,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("does not change its own state when controlled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <CheckboxCard
        title="Controlled"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    const box = screen.getByRole("checkbox");
    await user.click(box);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(box).not.toBeChecked();
  });

  it("clicking the title toggles the input", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <CheckboxCard title="Click target" onCheckedChange={onCheckedChange} />,
    );

    await user.click(screen.getByText("Click target"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("is operable with the keyboard", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <CheckboxCard title="Keyboard" onCheckedChange={onCheckedChange} />,
    );

    await user.tab();
    expect(screen.getByRole("checkbox")).toHaveFocus();
    await user.keyboard(" ");

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not fire when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <CheckboxCard
        title="Disabled"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    await user.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("forwards form attributes to the native input", () => {
    render(
      <CheckboxCard title="Accept" name="terms" value="yes" required />,
    );
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("name", "terms");
    expect(box).toHaveAttribute("value", "yes");
    expect(box).toBeRequired();
  });

  it("links the label to the input via htmlFor / id", () => {
    render(<CheckboxCard id="my-card" title="Linked" />);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("id", "my-card");
    expect(screen.getByText("Linked").closest("label")).toHaveAttribute(
      "for",
      "my-card",
    );
  });

  it("forwards a ref to the input", () => {
    let captured: HTMLInputElement | null = null;
    render(
      <CheckboxCard
        title="Ref"
        ref={(node) => {
          captured = node;
        }}
      />,
    );
    expect(captured).toBeInstanceOf(HTMLInputElement);
  });

  it("reflects state via data-state on the wrapper, and applies the gradient class when checked", () => {
    const { rerender } = render(
      <CheckboxCard title="Card" checked={false} />,
    );
    const labelEl = screen.getByText("Card").closest("label")!;
    expect(labelEl).toHaveAttribute("data-state", "unchecked");
    // Unchecked card uses the grey surface, not the gradient.
    expect(labelEl.innerHTML).toContain("bg-surface-grey-bg");

    rerender(<CheckboxCard title="Card" checked />);
    expect(labelEl).toHaveAttribute("data-state", "checked");
    // Checked card renders the gradient via the arbitrary background-image utility.
    expect(labelEl.innerHTML).toContain("gradient-card-checked");
  });
});
