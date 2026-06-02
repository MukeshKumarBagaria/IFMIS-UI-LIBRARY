import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Label } from "./Label";

describe("Label", () => {
  it("renders its text", () => {
    render(<Label>Email address</Label>);
    expect(screen.getByText("Email address")).toBeInTheDocument();
  });

  it("does not show an asterisk by default", () => {
    render(<Label>Name</Label>);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("shows a decorative asterisk when required", () => {
    render(<Label required>PAN number</Label>);
    const star = screen.getByText("*");
    expect(star).toBeInTheDocument();
    expect(star).toHaveAttribute("aria-hidden", "true");
  });

  it("associates with an input via htmlFor and focuses it on click", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" aria-label="Email" />
      </>,
    );
    await user.click(screen.getByText("Email"));
    expect(screen.getByLabelText("Email")).toHaveFocus();
  });

  it("forwards className and a ref", () => {
    let node: HTMLLabelElement | null = null;
    render(
      <Label className="custom" ref={(n) => (node = n)}>
        Label
      </Label>,
    );
    const label = screen.getByText("Label");
    expect(label).toHaveClass("custom");
    expect(node).toBeInstanceOf(HTMLLabelElement);
  });
});
