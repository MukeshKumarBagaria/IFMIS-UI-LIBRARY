import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OtpDialog } from "./OtpDialog";

const boxes = () => screen.getAllByRole("textbox");

describe("OtpDialog", () => {
  it("renders header, heading, contacts and footer actions", () => {
    render(
      <OtpDialog
        contacts={["*******789", "ad******@gmail.com"]}
        onResend={() => {}}
        secondsRemaining={0}
      />,
    );
    expect(screen.getByText("E - Sign")).toBeInTheDocument();
    expect(screen.getByText("Enter OTP")).toBeInTheDocument();
    expect(screen.getByText("*******789")).toBeInTheDocument();
    expect(screen.getByText("ad******@gmail.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resend OTP" })).toBeInTheDocument();
  });

  it("renders 6 boxes by default and respects a custom length", () => {
    const { rerender } = render(<OtpDialog secondsRemaining={0} />);
    expect(boxes()).toHaveLength(6);
    rerender(<OtpDialog length={4} secondsRemaining={0} />);
    expect(boxes()).toHaveLength(4);
  });

  it("is a labelled dialog", () => {
    render(<OtpDialog secondsRemaining={0} />);
    expect(screen.getByRole("dialog")).toHaveAccessibleName("E - Sign");
  });

  it("shows the error banner with role=alert", () => {
    render(<OtpDialog state="error" defaultValue="245143" secondsRemaining={0} />);
    const alert = screen.getByRole("alert");
    expect(
      within(alert).getByText("Incorrect OTP, please check the code and try again"),
    ).toBeInTheDocument();
  });

  it("shows the success banner with role=status", () => {
    render(<OtpDialog state="success" defaultValue="245143" secondsRemaining={0} />);
    const status = screen.getByRole("status");
    expect(within(status).getByText("E - Sign successful")).toBeInTheDocument();
  });

  it("disables Resend while the timer is running, enables it at 0", () => {
    const { rerender } = render(<OtpDialog secondsRemaining={30} onResend={() => {}} />);
    expect(screen.getByRole("button", { name: "Resend OTP" })).toBeDisabled();
    rerender(<OtpDialog secondsRemaining={0} onResend={() => {}} />);
    expect(screen.getByRole("button", { name: "Resend OTP" })).toBeEnabled();
  });

  it("shows the resend countdown text", () => {
    render(<OtpDialog secondsRemaining={30} />);
    expect(screen.getByText(/You can resend OTP in:/)).toBeInTheDocument();
    expect(screen.getByText("30 seconds")).toBeInTheDocument();
  });

  it("fires onResend when Resend is clicked (timer at 0)", async () => {
    const user = userEvent.setup();
    const onResend = vi.fn();
    render(<OtpDialog secondsRemaining={0} onResend={onResend} />);
    await user.click(screen.getByRole("button", { name: "Resend OTP" }));
    expect(onResend).toHaveBeenCalledTimes(1);
  });

  it("fires onBack and onClose", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const onClose = vi.fn();
    render(<OtpDialog secondsRemaining={0} onBack={onBack} onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "Back" }));
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("hides the Back button when showBack is false", () => {
    render(<OtpDialog showBack={false} secondsRemaining={0} />);
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
  });

  it("hides the close button when onClose is not given", () => {
    render(<OtpDialog secondsRemaining={0} />);
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
  });

  it("hides the contact box when contacts is null", () => {
    render(<OtpDialog contacts={null} secondsRemaining={0} />);
    expect(screen.queryByText("*******789")).toBeNull();
  });

  it("fires onComplete when all digits are entered", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<OtpDialog length={4} secondsRemaining={0} onComplete={onComplete} />);
    boxes()[0].focus();
    await user.keyboard("2451");
    expect(onComplete).toHaveBeenCalledWith("2451");
  });

  it("supports a custom resend text formatter", () => {
    render(
      <OtpDialog
        secondsRemaining={5}
        formatResendText={(s) => `wait ${s}`}
      />,
    );
    expect(screen.getByText("wait 5")).toBeInTheDocument();
  });

  describe("internal countdown timer", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("counts down from resendDelay and enables Resend at 0", async () => {
      render(<OtpDialog resendDelay={3} onResend={() => {}} />);
      expect(screen.getByText("3 seconds")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Resend OTP" })).toBeDisabled();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });

      expect(screen.getByText("0 seconds")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Resend OTP" })).toBeEnabled();
    });
  });
});
