import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AadhaarESign } from "./AadhaarESign";

const boxes = () => screen.getAllByRole("textbox");

describe("AadhaarESign", () => {
  it("renders the title, prompt, label and submit button", () => {
    render(<AadhaarESign />);
    expect(screen.getByText("Aadhaar E - Sign")).toBeInTheDocument();
    expect(
      screen.getByText("Enter the last 4 digits of your Aadhaar ID"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Aadhaar ID number/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send OTP" })).toBeInTheDocument();
  });

  it("renders `length` boxes (default 4)", () => {
    render(<AadhaarESign />);
    expect(boxes()).toHaveLength(4);
  });

  it("is a labelled dialog", () => {
    render(<AadhaarESign />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAccessibleName("Aadhaar E - Sign");
  });

  it("fills digits sequentially as the user types and reports onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AadhaarESign onChange={onChange} />);

    const all = boxes();
    all[0].focus();
    await user.keyboard("2114");

    expect(onChange).toHaveBeenLastCalledWith("2114");
    expect(all[0]).toHaveValue("2");
    expect(all[3]).toHaveValue("4");
  });

  it("ignores non-digit characters", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AadhaarESign onChange={onChange} />);
    boxes()[0].focus();
    await user.keyboard("a1b2");
    expect(onChange).toHaveBeenLastCalledWith("12");
  });

  it("removes the last digit on Backspace", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AadhaarESign defaultValue="211" onChange={onChange} />);
    boxes()[0].focus();
    await user.keyboard("{Backspace}");
    expect(onChange).toHaveBeenLastCalledWith("21");
  });

  it("distributes a pasted code across the boxes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AadhaarESign onChange={onChange} />);
    const first = boxes()[0];
    first.focus();
    await user.paste("2114");
    expect(onChange).toHaveBeenLastCalledWith("2114");
  });

  it("respects a controlled value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AadhaarESign value="99" onChange={onChange} />);
    const all = boxes();
    expect(all[0]).toHaveValue("9");
    expect(all[1]).toHaveValue("9");
    all[0].focus();
    await user.keyboard("8");
    // Parent owns the value — DOM stays "99", but onChange reports the next.
    expect(onChange).toHaveBeenLastCalledWith("998");
    expect(boxes()[0]).toHaveValue("9");
  });

  it("shows the error banner with role=alert in the error state", () => {
    render(<AadhaarESign state="error" defaultValue="2114" />);
    const alert = screen.getByRole("alert");
    expect(within(alert).getByText("Incorrect number!")).toBeInTheDocument();
  });

  it("shows the success banner with role=status in the success state", () => {
    render(<AadhaarESign state="success" defaultValue="2114" />);
    const status = screen.getByRole("status");
    expect(within(status).getByText("Verified successfully")).toBeInTheDocument();
  });

  it("applies the error border class to the boxes", () => {
    render(<AadhaarESign state="error" defaultValue="2114" />);
    expect(boxes()[0].className).toContain("border-red-600");
  });

  it("fires onSubmit with the current digits", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AadhaarESign defaultValue="2114" onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Send OTP" }));
    expect(onSubmit).toHaveBeenCalledWith("2114");
  });

  it("disables submit until complete when requireComplete is set", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <AadhaarESign defaultValue="21" requireComplete onSubmit={onSubmit} />,
    );
    const submit = screen.getByRole("button", { name: "Send OTP" });
    expect(submit).toBeDisabled();
    await user.click(submit);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("renders the close button only when onClose is given, and fires it", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(<AadhaarESign />);
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();

    rerender(<AadhaarESign onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("supports a custom length", () => {
    render(<AadhaarESign length={6} />);
    expect(boxes()).toHaveLength(6);
  });

  it("hides the card preview with cardPreview={null}", () => {
    const { container } = render(<AadhaarESign cardPreview={null} />);
    // The built-in preview renders GOVERNMENT OF INDIA text; it should be gone.
    expect(container.textContent).not.toContain("GOVERNMENT OF INDIA");
  });

  it("disables inputs and submit when disabled", () => {
    render(<AadhaarESign disabled defaultValue="2114" />);
    boxes().forEach((b) => expect(b).toBeDisabled());
    expect(screen.getByRole("button", { name: "Send OTP" })).toBeDisabled();
  });
});
