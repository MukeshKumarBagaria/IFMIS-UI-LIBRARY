import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReferenceIdSuccessCard } from "./ReferenceIdSuccessCard";

describe("ReferenceIdSuccessCard", () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    writeText.mockClear();
    Object.assign(navigator, { clipboard: { writeText } });
  });

  it("renders the default copy, reference id and labels", () => {
    render(<ReferenceIdSuccessCard referenceId="SR - 0001 - 000234" />);
    expect(
      screen.getByText("Grievance Submitted Successfully!"),
    ).toBeInTheDocument();
    expect(screen.getByText("SR - 0001 - 000234")).toBeInTheDocument();
    expect(
      screen.getByText(/Registered in the IFMIS-Next Gen System/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /copy grievance id/i }),
    ).toBeInTheDocument();
  });

  it("lets every text be customised", () => {
    render(
      <ReferenceIdSuccessCard
        title="Payment Successful!"
        referenceId="TXN-1"
        description="Recorded successfully"
        copyLabel="Copy Transaction ID"
      />,
    );
    expect(screen.getByText("Payment Successful!")).toBeInTheDocument();
    expect(screen.getByText("Recorded successfully")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /copy transaction id/i }),
    ).toBeInTheDocument();
  });

  it("copies the reference id and flips to the copied state", async () => {
    const onCopy = vi.fn();
    render(
      <ReferenceIdSuccessCard
        referenceId="SR - 0001 - 000234"
        onCopy={onCopy}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /copy grievance id/i }),
    );

    expect(writeText).toHaveBeenCalledWith("SR - 0001 - 000234");
    expect(onCopy).toHaveBeenCalledWith("SR - 0001 - 000234");
    // Button shows the copied feedback.
    expect(
      await screen.findByRole("button", { name: /copied/i }),
    ).toBeInTheDocument();
  });

  it("resets to the resting label after copiedDuration", async () => {
    render(
      <ReferenceIdSuccessCard referenceId="SR-1" copiedDuration={50} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /copy/i }));
    expect(
      await screen.findByRole("button", { name: /copied/i }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /copy grievance id/i }),
      ).toBeInTheDocument(),
    );
  });

  it("copies an explicit copyValue when given", async () => {
    render(
      <ReferenceIdSuccessCard
        referenceId={<span>SR - 0001</span>}
        copyValue="SR-0001-RAW"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /copy/i }));
    expect(writeText).toHaveBeenCalledWith("SR-0001-RAW");
  });

  it("hides the copy button when showCopyButton is false", () => {
    render(
      <ReferenceIdSuccessCard referenceId="SR-1" showCopyButton={false} />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("omits the success icon when icon is null", () => {
    const { container } = render(
      <ReferenceIdSuccessCard referenceId="SR-1" icon={null} />,
    );
    // The default badge is the only decorative svg above the title.
    expect(container.querySelector(".bg-green-600")).not.toBeInTheDocument();
  });

  it("forwards a ref and extra props to the root", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <ReferenceIdSuccessCard
        ref={ref}
        referenceId="SR-1"
        data-testid="card"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("card")).toBe(ref.current);
  });
});
