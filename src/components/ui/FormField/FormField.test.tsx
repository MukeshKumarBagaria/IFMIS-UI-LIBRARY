import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormField } from "./FormField";

const control = ({ id, describedBy, invalid }: { id: string; describedBy?: string; invalid: boolean }) => (
  <input
    id={id}
    aria-label="control"
    aria-describedby={describedBy}
    aria-invalid={invalid || undefined}
  />
);

describe("FormField", () => {
  it("links the label to the control via htmlFor/id", () => {
    render(<FormField label="Country">{control}</FormField>);
    const input = screen.getByLabelText("control");
    const label = screen.getByText("Country").closest("label");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("shows a required asterisk", () => {
    render(<FormField label="X" required>{control}</FormField>);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders an error banner and wires aria-invalid + describedby", () => {
    render(<FormField label="X" error="Bad value">{control}</FormField>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Bad value");
    const input = screen.getByLabelText("control");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", alert.id);
  });

  it("renders helper text and links it, when no error", () => {
    render(<FormField label="X" helperText="hint">{control}</FormField>);
    const helper = screen.getByText("hint");
    expect(screen.getByLabelText("control")).toHaveAttribute(
      "aria-describedby",
      helper.id,
    );
  });

  it("prefers error over helper text", () => {
    render(
      <FormField label="X" helperText="hint" error="err">
        {control}
      </FormField>,
    );
    expect(screen.queryByText("hint")).toBeNull();
    expect(screen.getByText("err")).toBeInTheDocument();
  });

  it("accepts a plain node as children", () => {
    render(
      <FormField label="X">
        <input aria-label="plain" />
      </FormField>,
    );
    expect(screen.getByLabelText("plain")).toBeInTheDocument();
  });

  it("honours an explicit htmlFor id", () => {
    render(
      <FormField label="X" htmlFor="my-id">
        {({ id }) => <input id={id} aria-label="c" />}
      </FormField>,
    );
    expect(screen.getByLabelText("c")).toHaveAttribute("id", "my-id");
  });
});
