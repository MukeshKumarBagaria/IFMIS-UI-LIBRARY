import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("renders a textbox and forwards the placeholder", () => {
    render(<Input placeholder="Search…" />);
    expect(screen.getByPlaceholderText("Search…")).toBeInTheDocument();
  });

  it("defaults to type=text but honours an explicit type", () => {
    const { rerender } = render(<Input aria-label="f" />);
    expect(screen.getByLabelText("f")).toHaveAttribute("type", "text");

    rerender(<Input aria-label="f" type="email" />);
    expect(screen.getByLabelText("f")).toHaveAttribute("type", "email");
  });

  it("accepts typed input when uncontrolled", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="name" />);
    const input = screen.getByLabelText("name");
    await user.type(input, "Amit");
    expect(input).toHaveValue("Amit");
  });

  it("fires onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input aria-label="q" onChange={onChange} />);
    await user.type(screen.getByLabelText("q"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("applies the error state border class", () => {
    render(<Input aria-label="e" state="error" />);
    expect(screen.getByLabelText("e").className).toContain("border-destructive");
  });

  it("applies the success state border class", () => {
    render(<Input aria-label="s" state="success" />);
    expect(screen.getByLabelText("s").className).toContain("border-success");
  });

  it("applies size classes", () => {
    render(<Input aria-label="sm" size="sm" />);
    expect(screen.getByLabelText("sm").className).toContain("h-8");
  });

  it("renders start and end adornments and pads accordingly", () => {
    render(
      <Input
        aria-label="adorned"
        startAdornment={<span data-testid="start">@</span>}
        endAdornment={<span data-testid="end">.com</span>}
      />,
    );
    expect(screen.getByTestId("start")).toBeInTheDocument();
    expect(screen.getByTestId("end")).toBeInTheDocument();
    const input = screen.getByLabelText("adorned");
    expect(input.className).toContain("pl-9");
    expect(input.className).toContain("pr-9");
  });

  it("is disabled when the disabled prop is set", () => {
    render(<Input aria-label="d" disabled />);
    expect(screen.getByLabelText("d")).toBeDisabled();
  });

  it("forwards a ref to the input element", () => {
    let node: HTMLInputElement | null = null;
    render(<Input aria-label="r" ref={(n) => (node = n)} />);
    expect(node).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards className and arbitrary props", () => {
    render(<Input aria-label="c" className="custom" data-x="y" />);
    const input = screen.getByLabelText("c");
    expect(input).toHaveClass("custom");
    expect(input).toHaveAttribute("data-x", "y");
  });
});
