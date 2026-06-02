import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField } from "./TextField";
import { FieldIconBox } from "../FormField";

describe("TextField", () => {
  it("renders a labelled input wired via htmlFor/id", () => {
    render(<TextField label="Full name" placeholder="Enter" />);
    const input = screen.getByLabelText("Full name");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Enter");
  });

  it("accepts typed input and fires onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Name" onChange={onChange} />);
    await user.type(screen.getByLabelText("Name"), "Amit");
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText("Name")).toHaveValue("Amit");
  });

  it("shows a required asterisk and sets aria-required", () => {
    render(<TextField label="PAN" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByLabelText(/PAN/)).toHaveAttribute("aria-required", "true");
  });

  it("renders an error banner, reddens the box, and sets aria-invalid", () => {
    render(<TextField label="Email" error="Bad email" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Bad email");
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", alert.id);
    // Box (input's parent) is reddened.
    expect(input.parentElement?.className).toContain("border-red-600");
  });

  it("shows helper text and links it via aria-describedby", () => {
    render(<TextField label="User" helperText="3–20 chars" />);
    const helper = screen.getByText("3–20 chars");
    expect(screen.getByLabelText("User")).toHaveAttribute(
      "aria-describedby",
      helper.id,
    );
  });

  it("hides helper text when an error is present", () => {
    render(<TextField label="X" helperText="help" error="err" />);
    expect(screen.queryByText("help")).toBeNull();
    expect(screen.getByText("err")).toBeInTheDocument();
  });

  it("applies the fetched-state fill", () => {
    render(<TextField label="GRN" value="G-1" state="fetched" readOnly />);
    expect(screen.getByLabelText("GRN").parentElement?.className).toContain(
      "bg-neutral-200",
    );
  });

  it("disables the input and applies disabled styling", () => {
    render(<TextField label="Locked" disabled />);
    const input = screen.getByLabelText("Locked");
    expect(input).toBeDisabled();
    expect(input.parentElement?.className).toContain("bg-surface-grey-bg");
  });

  it("renders start icon and trailing content", () => {
    render(
      <TextField
        label="Date"
        startIcon={<svg data-testid="start" />}
        endContent={<FieldIconBox><svg data-testid="end" /></FieldIconBox>}
      />,
    );
    expect(screen.getByTestId("start")).toBeInTheDocument();
    expect(screen.getByTestId("end")).toBeInTheDocument();
  });

  it("forwards a ref to the input and arbitrary props", () => {
    let node: HTMLInputElement | null = null;
    render(<TextField label="R" ref={(n) => (node = n)} name="field" data-x="y" />);
    expect(node).toBeInstanceOf(HTMLInputElement);
    const input = screen.getByLabelText("R");
    expect(input).toHaveAttribute("name", "field");
    expect(input).toHaveAttribute("data-x", "y");
  });
});
