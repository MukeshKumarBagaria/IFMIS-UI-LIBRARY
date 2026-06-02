import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The multi-line counterpart to `TextField` — same label/subtext shell",
          "and state styling, with a vertically-resizable `<textarea>` and an",
          "optional character counter.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    state: { control: "inline-radio", options: ["default", "fetched"] },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    rows: { control: { type: "number", min: 2, max: 12 } },
  },
  args: { label: "Remarks", placeholder: "Add a note…", rows: 4 },
  decorators: [(Story) => <div className="w-[360px]"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};
export const Required: Story = { args: { label: "Reason", required: true } };
export const WithCounter: Story = { args: { label: "Reason", maxLength: 250, showCount: true } };
export const ErrorState: Story = {
  args: { label: "Comment", error: "This field is required" },
};
export const HelperText: Story = {
  args: { label: "Notes", helperText: "Visible only to reviewers." },
};
export const Disabled: Story = { args: { label: "Locked", disabled: true } };
export const Fetched: Story = {
  args: { label: "Imported remarks", value: "Pulled from the previous record.", state: "fetched", readOnly: true },
};
