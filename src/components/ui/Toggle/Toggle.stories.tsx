import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "An accessible labelled on/off **switch** rendered as a tinted pill.",
          "The whole pill is clickable; state drives the pill surface, the track",
          "colour and the label colour together.",
          "",
          "Works controlled (`checked` + `onCheckedChange`) or uncontrolled",
          "(`defaultChecked`).",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    labelPosition: { control: "inline-radio", options: ["start", "end"] },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    onCheckedChange: { action: "checkedChange" },
  },
  args: { children: "Toggle on" },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

/** Default off state — Surface/Grey-bg pill, grey track. */
export const Off: Story = {
  args: { defaultChecked: false },
};

/** On state — Purple-50 pill, Purple-600 track, header-coloured label. */
export const On: Story = {
  args: { defaultChecked: true },
};

/** Both states side by side, matching the Figma frame. */
export const States: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <Toggle {...args} defaultChecked>
        Toggle on
      </Toggle>
      <Toggle {...args} defaultChecked={false}>
        Toggle on
      </Toggle>
    </div>
  ),
};

/** Small and medium sizes. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Toggle {...args} size="sm" defaultChecked>
        Small
      </Toggle>
      <Toggle {...args} size="md" defaultChecked>
        Medium
      </Toggle>
    </div>
  ),
};

/** Label can sit before or after the switch. */
export const LabelPosition: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <Toggle {...args} labelPosition="end" defaultChecked>
        Label after
      </Toggle>
      <Toggle {...args} labelPosition="start" defaultChecked>
        Label before
      </Toggle>
    </div>
  ),
};

/** Disabled in both states. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <Toggle {...args} disabled defaultChecked>
        Toggle on
      </Toggle>
      <Toggle {...args} disabled defaultChecked={false}>
        Toggle on
      </Toggle>
    </div>
  ),
};

/** Bare switch — no visible label, so an `aria-label` supplies the name. */
export const NoLabel: Story = {
  args: { children: undefined, "aria-label": "Dark mode" },
};

/** Fully controlled: the parent owns the value. */
function ControlledDemo() {
  const [on, setOn] = useState(true);
  return (
    <div className="flex flex-col items-start gap-3">
      <Toggle checked={on} onCheckedChange={setOn}>
        Auto-save
      </Toggle>
      <p className="text-body-xs text-body-secondary">
        Value: <code>{String(on)}</code>
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
