import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a labelled textarea", () => {
    render(<Textarea label="Remarks" placeholder="Note" />);
    const ta = screen.getByLabelText("Remarks");
    expect(ta.tagName).toBe("TEXTAREA");
    expect(ta).toHaveAttribute("placeholder", "Note");
  });

  it("respects rows", () => {
    render(<Textarea label="R" rows={7} />);
    expect(screen.getByLabelText("R")).toHaveAttribute("rows", "7");
  });

  it("accepts input and fires onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea label="R" onChange={onChange} />);
    await user.type(screen.getByLabelText("R"), "hello");
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText("R")).toHaveValue("hello");
  });

  it("shows a live character counter when maxLength is set", async () => {
    const user = userEvent.setup();
    render(<Textarea label="R" maxLength={10} />);
    expect(screen.getByText("0/10")).toBeInTheDocument();
    await user.type(screen.getByLabelText("R"), "abc");
    expect(screen.getByText("3/10")).toBeInTheDocument();
  });

  it("shows an error banner and sets aria-invalid", () => {
    render(<Textarea label="Comment" error="Required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(screen.getByLabelText("Comment")).toHaveAttribute("aria-invalid", "true");
  });

  it("disables the textarea", () => {
    render(<Textarea label="L" disabled />);
    expect(screen.getByLabelText("L")).toBeDisabled();
  });

  it("forwards a ref", () => {
    let node: HTMLTextAreaElement | null = null;
    render(<Textarea label="R" ref={(n) => (node = n)} />);
    expect(node).toBeInstanceOf(HTMLTextAreaElement);
  });
});
