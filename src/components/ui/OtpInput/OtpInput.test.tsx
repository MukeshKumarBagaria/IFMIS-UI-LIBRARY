import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OtpInput } from "./OtpInput";

const boxes = () => screen.getAllByRole("textbox");

describe("OtpInput", () => {
  it("renders `length` boxes (default 6)", () => {
    render(<OtpInput />);
    expect(boxes()).toHaveLength(6);
  });

  it("fills sequentially and reports onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<OtpInput length={4} onChange={onChange} />);
    boxes()[0].focus();
    await user.keyboard("2114");
    expect(onChange).toHaveBeenLastCalledWith("2114");
    expect(boxes()[3]).toHaveValue("4");
  });

  it("fires onComplete once when the last box fills", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<OtpInput length={4} onComplete={onComplete} />);
    boxes()[0].focus();
    await user.keyboard("211");
    expect(onComplete).not.toHaveBeenCalled();
    await user.keyboard("4");
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith("2114");
  });

  it("ignores non-digits", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<OtpInput length={4} onChange={onChange} />);
    boxes()[0].focus();
    await user.keyboard("a1b2");
    expect(onChange).toHaveBeenLastCalledWith("12");
  });

  it("removes the last digit on Backspace", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<OtpInput length={4} defaultValue="211" onChange={onChange} />);
    boxes()[0].focus();
    await user.keyboard("{Backspace}");
    expect(onChange).toHaveBeenLastCalledWith("21");
  });

  it("distributes a pasted code", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<OtpInput length={6} onChange={onChange} />);
    boxes()[0].focus();
    await user.paste("245143");
    expect(onChange).toHaveBeenLastCalledWith("245143");
  });

  it("respects a controlled value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<OtpInput length={4} value="99" onChange={onChange} />);
    boxes()[0].focus();
    await user.keyboard("8");
    expect(onChange).toHaveBeenLastCalledWith("998");
    expect(boxes()[0]).toHaveValue("9"); // parent owns the value
  });

  it("applies the error border class", () => {
    render(<OtpInput defaultValue="245143" state="error" />);
    expect(boxes()[0].className).toContain("border-red-600");
  });

  it("disables all boxes", () => {
    render(<OtpInput defaultValue="245" disabled />);
    boxes().forEach((b) => expect(b).toBeDisabled());
  });

  it("uses aria-label for the group and per-box labels", () => {
    render(<OtpInput length={4} aria-label="OTP code" />);
    expect(screen.getByRole("group", { name: "OTP code" })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "OTP code, digit 1 of 4" }),
    ).toBeInTheDocument();
  });
});
