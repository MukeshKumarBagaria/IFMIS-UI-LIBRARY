import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./Label";
import { Input } from "../Input";

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

/** The intended pairing: a label wired to an input. */
export const WithInput: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="grn" required>
        GRN number
      </Label>
      <Input id="grn" placeholder="Enter GRN" />
    </div>
  ),
};
