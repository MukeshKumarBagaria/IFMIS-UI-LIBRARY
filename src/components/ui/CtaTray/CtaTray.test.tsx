import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CtaTray } from "./CtaTray";
import {
  ResetButton,
  SaveButton,
  ForwardButton,
  RejectButton,
} from "../FormButton";

function pill() {
  return screen.getByRole("group", { name: "Form actions" });
}

describe("CtaTray", () => {
  it("renders the buttons inside a labelled group", () => {
    render(
      <CtaTray>
        <ResetButton type="reset" />
        <RejectButton />
        <SaveButton />
        <ForwardButton />
      </CtaTray>,
    );
    expect(pill()).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("starts neutral and recolours to the clicked button's tone", async () => {
    render(
      <CtaTray>
        <ResetButton type="reset" />
        <RejectButton />
        <SaveButton />
        <ForwardButton />
      </CtaTray>,
    );
    expect(pill()).toHaveClass("bg-surface-grey-bg");

    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(pill()).toHaveClass("bg-green-50");

    await userEvent.click(screen.getByRole("button", { name: /reject/i }));
    expect(pill()).toHaveClass("bg-red-50");
  });

  it("preserves each button's own onClick", async () => {
    const onSave = vi.fn();
    render(
      <CtaTray>
        <SaveButton onClick={onSave} />
      </CtaTray>,
    );
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSave).toHaveBeenCalledOnce();
  });

  it("reports the tone via onToneChange", async () => {
    const onToneChange = vi.fn();
    render(
      <CtaTray onToneChange={onToneChange}>
        <ForwardButton />
      </CtaTray>,
    );
    await userEvent.click(screen.getByRole("button", { name: /forward/i }));
    expect(onToneChange).toHaveBeenCalledWith("primary");
  });

  it("stays grey when highlight is disabled", async () => {
    render(
      <CtaTray highlight={false}>
        <SaveButton />
        <ForwardButton />
      </CtaTray>,
    );
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(pill()).toHaveClass("bg-surface-grey-bg");
  });

  it("honours a controlled tone", () => {
    render(
      <CtaTray tone="warning">
        <SaveButton />
        <ForwardButton />
      </CtaTray>,
    );
    expect(pill()).toHaveClass("bg-orange-50");
  });
});
