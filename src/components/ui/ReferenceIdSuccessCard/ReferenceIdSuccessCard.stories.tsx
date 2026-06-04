import type { Meta, StoryObj } from "@storybook/react";
import { ReferenceIdSuccessCard } from "./ReferenceIdSuccessCard";

const meta: Meta<typeof ReferenceIdSuccessCard> = {
  title: "UI/ReferenceIdSuccessCard",
  component: ReferenceIdSuccessCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The IFMIS **“Submitted Successfully”** confirmation card — a",
          "green-gradient surface with a success badge, a title, the reference",
          "id in a big dashed pill, a supporting line, and a one-click **Copy**",
          "button.",
          "",
          "Every piece of text is a prop, so it works for any *success + reference",
          "id* moment (grievance, payment, registration…). The copy button writes",
          "`copyValue` (defaults to `referenceId`) to the clipboard, flips to a",
          '"Copied!" state, and fires `onCopy`.',
          "",
          "### How to use it",
          "```jsx",
          'import { ReferenceIdSuccessCard } from "@ifmis/ui";',
          "",
          "<ReferenceIdSuccessCard",
          '  referenceId="SR - BM-BPL - 0001 - 000234"',
          "  onCopy={(id) => console.log(id)}",
          "/>",
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    showCopyButton: { control: "boolean" },
    copiedDuration: { control: { type: "number", min: 0, step: 500 } },
    onCopy: { action: "copy" },
    icon: { control: false },
  },
  args: {
    referenceId: "SR - BM-BPL - 0001 - 000234",
  },
  decorators: [
    (Story) => (
      <div className="max-w-[657px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ReferenceIdSuccessCard>;

/** Default — exactly the Figma grievance confirmation. */
export const Default: Story = {};

/**
 * Every label is a prop — reuse the same card for a payment confirmation,
 * a registration receipt, or anything with a reference id.
 */
export const Customised: Story = {
  args: {
    title: "Payment Successful!",
    referenceId: "TXN-2026-000912",
    description: "Your payment has been recorded in the IFMIS-Next Gen System",
    copyLabel: "Copy Transaction ID",
  },
};

/** Without the copy button — a read-only confirmation. */
export const WithoutCopyButton: Story = {
  args: { showCopyButton: false },
};

/** No success icon — title leads the card. */
export const WithoutIcon: Story = {
  args: { icon: null },
};

/** A longer id wraps cleanly inside the dashed pill. */
export const LongReferenceId: Story = {
  args: {
    referenceId: "SR - BM-BPL - 0001 - 000234 - REV - 2026 - 0099",
  },
};
