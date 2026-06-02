import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AadhaarESign } from "./AadhaarESign";

const meta: Meta<typeof AadhaarESign> = {
  title: "UI/AadhaarESign",
  component: AadhaarESign,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The **Aadhaar E-Sign** dialog panel: a purple header (pen + title +",
          "close), a body with a prompt, a masked-number label, a functional",
          "segmented digit input, and an Aadhaar card preview, and a grey footer",
          "with **Send OTP**.",
          "",
          "States `default | error | success` recolour the boxes and show an",
          "inline message. The digit entry is controlled or uncontrolled.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    state: { control: "inline-radio", options: ["default", "error", "success"] },
    submitting: { control: "boolean" },
    requireComplete: { control: "boolean" },
    disabled: { control: "boolean" },
    onSubmit: { action: "submit" },
    onClose: { action: "close" },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[500px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AadhaarESign>;

/** Empty default state — grey boxes with "-" placeholders. */
export const Default: Story = {
  args: { onClose: () => {}, onSubmit: () => {} },
};

/** Error state — red boxes + the "Incorrect number!" banner. */
export const Error: Story = {
  args: { defaultValue: "2114", state: "error", onClose: () => {}, onSubmit: () => {} },
};

/** Success state — green boxes + a confirmation banner. */
export const Success: Story = {
  args: { defaultValue: "2114", state: "success", onClose: () => {}, onSubmit: () => {} },
};

/** Submit in flight — the button shows a spinner and is disabled. */
export const Submitting: Story = {
  args: { defaultValue: "2114", submitting: true, onClose: () => {} },
};

/** A real card image instead of the built-in placeholder. */
export const WithCardImage: Story = {
  args: {
    onClose: () => {},
    onSubmit: () => {},
    cardImageSrc:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='130' height='78'><rect width='130' height='78' rx='4' fill='%23eef' stroke='%23ccd'/><text x='65' y='42' font-size='9' text-anchor='middle' fill='%23667'>Aadhaar Card</text></svg>`,
      ),
  },
};

/** Fully interactive: type 4 digits, then Send OTP validates them. */
function InteractiveDemo() {
  const [digits, setDigits] = useState("");
  const [state, setState] = useState<"default" | "error" | "success">("default");

  return (
    <AadhaarESign
      value={digits}
      onChange={(next) => {
        setDigits(next);
        setState("default");
      }}
      state={state}
      requireComplete
      onClose={() => alert("close")}
      onSubmit={(d) => setState(d === "2114" ? "success" : "error")}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

/** A 6-digit variant — the same component, longer code. */
export const SixDigits: Story = {
  args: {
    length: 6,
    prompt: "Enter the 6-digit OTP",
    label: "OTP sent to your registered mobile",
    cardPreview: null,
    onClose: () => {},
    onSubmit: () => {},
  },
};
