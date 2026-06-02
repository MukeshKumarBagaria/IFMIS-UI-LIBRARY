import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders a checkbox input with its label", () => {
    render(<Checkbox>Subscribe</Checkbox>);
    const box = screen.getByRole("checkbox", { name: "Subscribe" });
    expect(box).toBeInTheDocument();
    expect(box).not.toBeChecked();
  });

  it("reflects defaultChecked", () => {
    render(<Checkbox defaultChecked>On</Checkbox>);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("toggles when uncontrolled and reports the next value", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange}>Click me</Checkbox>);

    await user.click(screen.getByRole("checkbox"));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("does not change its own state when controlled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox checked={false} onCheckedChange={onCheckedChange}>
        Controlled
      </Checkbox>,
    );

    const box = screen.getByRole("checkbox");
    await user.click(box);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    // Parent owns the value — stays unchecked.
    expect(box).not.toBeChecked();
  });

  it("clicking the label toggles the input", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange}>Label text</Checkbox>);

    await user.click(screen.getByText("Label text"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("is operable with the keyboard", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange}>Keyboard</Checkbox>);

    await user.tab();
    expect(screen.getByRole("checkbox")).toHaveFocus();
    await user.keyboard(" ");

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("renders the indeterminate state via DOM flag and aria-checked=mixed", () => {
    render(
      <Checkbox indeterminate aria-label="Some selected">
        Some selected
      </Checkbox>,
    );
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    expect(box.indeterminate).toBe(true);
    expect(box).toHaveAttribute("aria-checked", "mixed");
  });

  it("does not fire when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox disabled onCheckedChange={onCheckedChange}>
        Disabled
      </Checkbox>,
    );

    await user.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("forwards form attributes to the native input", () => {
    render(
      <Checkbox name="terms" value="yes" required>
        Accept
      </Checkbox>,
    );
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("name", "terms");
    expect(box).toHaveAttribute("value", "yes");
    expect(box).toBeRequired();
  });

  it("links the label to the input via htmlFor / id", () => {
    render(<Checkbox id="my-box">Linked</Checkbox>);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("id", "my-box");
    expect(screen.getByText("Linked").closest("label")).toHaveAttribute(
      "for",
      "my-box",
    );
  });

  it("forwards a ref to the input", () => {
    let captured: HTMLInputElement | null = null;
    render(
      <Checkbox
        ref={(node) => {
          captured = node;
        }}
      >
        Ref
      </Checkbox>,
    );
    expect(captured).toBeInstanceOf(HTMLInputElement);
  });

  it("reflects state via data-state on the wrapper", () => {
    const { rerender } = render(<Checkbox checked={false}>Box</Checkbox>);
    expect(screen.getByText("Box").closest("label")).toHaveAttribute(
      "data-state",
      "unchecked",
    );

    rerender(<Checkbox checked>Box</Checkbox>);
    expect(screen.getByText("Box").closest("label")).toHaveAttribute(
      "data-state",
      "checked",
    );

    rerender(
      <Checkbox checked={false} indeterminate>
        Box
      </Checkbox>,
    );
    expect(screen.getByText("Box").closest("label")).toHaveAttribute(
      "data-state",
      "indeterminate",
    );
  });
});
