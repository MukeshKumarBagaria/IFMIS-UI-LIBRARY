import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmationPopup } from "./ConfirmationPopup";

describe("ConfirmationPopup", () => {
  it("renders the default title and Yes/No actions", () => {
    render(<ConfirmationPopup />);
    expect(screen.getByText("Are you sure of this action?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument();
  });

  it("is a labelled alertdialog", () => {
    render(<ConfirmationPopup />);
    expect(screen.getByRole("alertdialog")).toHaveAccessibleName(
      "Are you sure of this action?",
    );
  });

  it("accepts a custom title and labels", () => {
    render(
      <ConfirmationPopup
        title="Discard this draft?"
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />,
    );
    expect(screen.getByText("Discard this draft?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Keep editing" }),
    ).toBeInTheDocument();
  });

  it("fires onConfirm when the confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<ConfirmationPopup onConfirm={onConfirm} />);
    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("fires onCancel when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<ConfirmationPopup onCancel={onCancel} />);
    await user.click(screen.getByRole("button", { name: "No" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("disables both buttons when disabled is true", () => {
    render(<ConfirmationPopup disabled />);
    expect(screen.getByRole("button", { name: "Yes" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "No" })).toBeDisabled();
  });

  it("renders a custom icon node when provided", () => {
    render(
      <ConfirmationPopup
        icon={<span data-testid="custom-icon">!</span>}
      />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders no icon when icon is null", () => {
    const { container } = render(<ConfirmationPopup icon={null} />);
    // Default Info glyph would be an <svg> child; ensure none is rendered.
    expect(container.querySelector("svg")).toBeNull();
  });

  it("merges custom button class names", () => {
    render(
      <ConfirmationPopup
        confirmButtonClassName="bg-red-600 custom-confirm"
        cancelButtonClassName="border-red-600 custom-cancel"
      />,
    );
    expect(screen.getByRole("button", { name: "Yes" }).className).toContain(
      "custom-confirm",
    );
    expect(screen.getByRole("button", { name: "No" }).className).toContain(
      "custom-cancel",
    );
  });
});
