import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FormButton,
  ForwardButton,
  SubmitButton,
  ResetButton,
  RejectButton,
} from "./FormButton";

describe("FormButton", () => {
  it("renders presets with their default labels", () => {
    render(
      <>
        <ForwardButton />
        <SubmitButton />
        <ResetButton />
        <RejectButton />
      </>,
    );
    expect(screen.getByRole("button", { name: /forward/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reject/i })).toBeInTheDocument();
  });

  it("lets you override the label via children", () => {
    render(<ForwardButton>Next step</ForwardButton>);
    expect(
      screen.getByRole("button", { name: "Next step" }),
    ).toBeInTheDocument();
  });

  it("applies the tone classes on the base", () => {
    render(<FormButton tone="success">Save</FormButton>);
    expect(screen.getByRole("button")).toHaveClass("bg-green-200");
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<SubmitButton onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled and non-interactive while loading", async () => {
    const onClick = vi.fn();
    render(<SubmitButton loading onClick={onClick} />);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("defaults type to 'button' but allows submit/reset", () => {
    render(
      <>
        <SubmitButton type="submit">Go</SubmitButton>
        <ResetButton type="reset" />
      </>,
    );
    expect(screen.getByRole("button", { name: "Go" })).toHaveAttribute(
      "type",
      "submit",
    );
    expect(screen.getByRole("button", { name: /reset/i })).toHaveAttribute(
      "type",
      "reset",
    );
  });
});
