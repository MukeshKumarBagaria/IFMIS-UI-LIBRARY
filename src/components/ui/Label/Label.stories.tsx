import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "An accessible form-field label. Pair it with a control via",
          "`htmlFor` / `id` so clicking the label focuses the field. Set",
          "`required` to append a red asterisk.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    required: { control: "boolean" },
    children: { control: "text" },
  },
  args: { children: "Email address" },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const Required: Story = {
  args: { children: "PAN number", required: true },
};

/** The intended pairing: a label wired to a control. */
export const WithInput: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="grn" required>
        GRN number
      </Label>
      <input
        id="grn"
        placeholder="Enter GRN"
        className="h-11 w-full rounded-2xl border border-border bg-card px-3 text-body-sm text-body-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  ),
};
