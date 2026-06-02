import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OtpInput } from "./OtpInput";

const meta: Meta<typeof OtpInput> = {
  title: "UI/OtpInput",
  component: OtpInput,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "An accessible segmented **code input** for OTP / PIN / verification",
          "codes. Sequential left-to-right entry, keyboard nav, paste support,",
          "digits-only, and `default | error | success` states.",
          "",
          "Controlled or uncontrolled; fires `onComplete` when the last box fills.",
          "Used by `AadhaarESign` and `OtpDialog`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    length: { control: { type: "number", min: 4, max: 8 } },
    state: { control: "inline-radio", options: ["default", "error", "success"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof OtpInput>;

export const Default: Story = { args: { length: 6 } };
export const Error: Story = { args: { length: 6, defaultValue: "245143", state: "error" } };
export const Success: Story = { args: { length: 6, defaultValue: "245143", state: "success" } };
export const FourDigits: Story = { args: { length: 4 } };
export const Disabled: Story = { args: { length: 6, defaultValue: "245", disabled: true } };

/** Controlled with an `onComplete` auto-submit. */
function ControlledDemo() {
  const [code, setCode] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <OtpInput
        length={6}
        value={code}
        onChange={(v) => {
          setCode(v);
          setDone(false);
        }}
        onComplete={() => setDone(true)}
      />
      <p className="text-body-xs text-body-secondary">
        Value: <code>{code || "—"}</code> {done && "✓ complete"}
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
