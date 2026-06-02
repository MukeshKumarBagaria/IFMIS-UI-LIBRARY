import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OtpDialog } from "./OtpDialog";

const meta: Meta<typeof OtpDialog> = {
  title: "UI/OtpDialog",
  component: OtpDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The **E-Sign OTP** dialog: header (info + title + close), body (prompt,",
          "the masked contacts the code was sent to, a 6-box code input, and an",
          "error/success banner), and a footer with a **resend countdown**, a",
          "**Back** button, and **Resend OTP**.",
          "",
          "Built on the shared `OtpInput`. Code entry is controlled/uncontrolled;",
          "the resend timer runs internally from `resendDelay` (or controlled via",
          "`secondsRemaining`), enabling Resend at 0.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    state: { control: "inline-radio", options: ["default", "error", "success"] },
    showBack: { control: "boolean" },
    resendDelay: { control: { type: "number", min: 0, max: 120 } },
    disabled: { control: "boolean" },
    onResend: { action: "resend" },
    onBack: { action: "back" },
    onClose: { action: "close" },
    onComplete: { action: "complete" },
  },
  args: {
    contacts: ["*******789", "ad******@gmail.com"],
    onClose: () => {},
    onBack: () => {},
    onResend: () => {},
  },
  decorators: [
    (Story) => (
      <div className="max-w-[550px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OtpDialog>;

/** Default — empty boxes, resend disabled while the 30s timer counts down. */
export const Default: Story = {
  args: { secondsRemaining: 30 },
};

/** Error — red boxes + the "Incorrect OTP" banner; resend available. */
export const Error: Story = {
  args: { defaultValue: "245143", state: "error", secondsRemaining: 0 },
};

/** Success — green boxes + the "E - Sign successful" banner. */
export const Success: Story = {
  args: { defaultValue: "245143", state: "success", secondsRemaining: 0 },
};

/** Resend available (timer at 0) — the button is enabled and purple. */
export const ResendReady: Story = {
  args: { secondsRemaining: 0 },
};

/** No Back button — single-action footer. */
export const NoBackButton: Story = {
  args: { showBack: false, secondsRemaining: 0 },
};

/** Fully interactive: live 30s countdown, validate on complete, resend resets. */
function InteractiveDemo() {
  const [code, setCode] = useState("");
  const [state, setState] = useState<"default" | "error" | "success">("default");

  return (
    <OtpDialog
      contacts={["*******789", "ad******@gmail.com"]}
      value={code}
      onChange={(v) => {
        setCode(v);
        setState("default");
      }}
      state={state}
      resendDelay={30}
      onComplete={(c) => setState(c === "245143" ? "success" : "error")}
      onResend={() => {
        setCode("");
        setState("default");
      }}
      onBack={() => alert("back")}
      onClose={() => alert("close")}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
