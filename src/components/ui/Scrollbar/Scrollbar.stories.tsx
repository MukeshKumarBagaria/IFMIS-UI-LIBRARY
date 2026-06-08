import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Scrollbar } from "./Scrollbar";

const meta: Meta<typeof Scrollbar> = {
  title: "UI/Scrollbar",
  component: Scrollbar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A horizontal scroll control — a draggable thumb between two caret",
          "steppers. The caret you can still move toward stays active (white);",
          "the end you've bottomed out against goes disabled (Grey-200).",
          "",
          "Works controlled (`value` + `onValueChange`) or uncontrolled",
          "(`defaultValue`), and follows the ARIA slider pattern, so it's",
          "drag-, click- and keyboard-operable (arrows, Home/End).",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    thumbWidth: { control: "number" },
    showTicks: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Scrollbar>;

export const Default: Story = {
  args: { defaultValue: 0 },
  render: (args) => (
    <div className="w-[420px]">
      <Scrollbar {...args} />
    </div>
  ),
};

/** Thumb pinned to the far left — the left caret is disabled. */
export const MaxLeft: Story = {
  args: { defaultValue: 0 },
  render: (args) => (
    <div className="w-[420px]">
      <Scrollbar {...args} />
    </div>
  ),
};

/** Thumb pinned to the far right — the right caret is disabled. */
export const MaxRight: Story = {
  args: { defaultValue: 100 },
  render: (args) => (
    <div className="w-[420px]">
      <Scrollbar {...args} />
    </div>
  ),
};

/** Track without the ruler ticks. */
export const NoTicks: Story = {
  args: { defaultValue: 40, showTicks: false },
  render: (args) => (
    <div className="w-[420px]">
      <Scrollbar {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { defaultValue: 30, disabled: true },
  render: (args) => (
    <div className="w-[420px]">
      <Scrollbar {...args} />
    </div>
  ),
};

/** Controlled — the value is mirrored in a live read-out. */
export const Controlled: Story = {
  render: () => {
    const [pos, setPos] = useState(25);
    return (
      <div className="flex w-[420px] flex-col gap-3">
        <Scrollbar value={pos} onValueChange={setPos} step={5} />
        <p className="text-body-sm text-body-secondary">Value: {pos}</p>
      </div>
    );
  },
};
