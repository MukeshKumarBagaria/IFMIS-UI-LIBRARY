import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Upload } from "./Upload";

describe("Upload", () => {
  it("renders the label and default Upload button", () => {
    render(<Upload label="Attach file" />);
    expect(screen.getByText("Attach file")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
  });

  it("fires onUpload when the default button is clicked", async () => {
    const onUpload = vi.fn();
    render(<Upload onUpload={onUpload} />);
    await userEvent.click(screen.getByRole("button", { name: /upload/i }));
    expect(onUpload).toHaveBeenCalledOnce();
  });

  it("shows the progress percentage while uploading", () => {
    render(<Upload state="uploading" progress={42} />);
    expect(screen.getByText("Uploading - 42%")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("offers Retry in the error state", async () => {
    const onRetry = vi.fn();
    render(<Upload state="error" onRetry={onRetry} />);
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("toggles the file dropdown and exposes preview/delete actions", async () => {
    const onDeleteFile = vi.fn();
    render(
      <Upload
        state="uploaded"
        files={[{ id: "1", name: "report.pdf" }]}
        onDeleteFile={onDeleteFile}
      />,
    );
    // Collapsed → "Add More Files" visible.
    expect(
      screen.getByRole("button", { name: "Add More Files" }),
    ).toBeInTheDocument();
    // Expand.
    await userEvent.click(
      screen.getByRole("button", { name: /expand files/i }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Delete report.pdf" }),
    );
    expect(onDeleteFile).toHaveBeenCalledWith({ id: "1", name: "report.pdf" });
  });
});
