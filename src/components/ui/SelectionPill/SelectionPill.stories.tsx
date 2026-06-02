import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "@phosphor-icons/react";
import { SelectionPill } from "./SelectionPill";

const meta: Meta<typeof SelectionPill> = {
  title: "UI/SelectionPill",
  component: SelectionPill,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A toggleable **selection chip** for filters, tags and single/multi",
          "select sets. Selected → Purple-600 with a white label + check; ",
          "unselected → Surface/Grey-bg with a muted label.",
          "",
          "Works controlled (`selected` + `onSelectedChange`) or uncontrolled",
          "(`defaultSelected`). The leading check icon is overridable.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    onSelectedChange: { action: "selectedChange" },
  },
  args: { children: "Selected" },
};

export default meta;
type Story = StoryObj<typeof SelectionPill>;

/** Selected — Purple-600 surface, white label + check. */
export const Selected: Story = {
  args: { defaultSelected: true, children: "Selected" },
};

/** Unselected — muted grey chip. */
export const Unselected: Story = {
  args: { defaultSelected: false, children: "Un-selected" },
};

/** Both states side by side, matching the Figma frame. */
export const States: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <SelectionPill {...args} defaultSelected>
        Selected
      </SelectionPill>
      <SelectionPill {...args} defaultSelected={false}>
        Un-selected
      </SelectionPill>
    </div>
  ),
};

/** Small and medium sizes. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <SelectionPill {...args} size="sm" defaultSelected>
        Small
      </SelectionPill>
      <SelectionPill {...args} size="md" defaultSelected>
        Medium
      </SelectionPill>
    </div>
  ),
};

/** Icon is a slot: custom glyph, or `null` for a label-only chip. */
export const IconOptions: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <SelectionPill {...args} icon={<Plus weight="bold" />} defaultSelected>
        Add filter
      </SelectionPill>
      <SelectionPill {...args} icon={null} defaultSelected>
        No icon
      </SelectionPill>
    </div>
  ),
};

/** Disabled in both states. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <SelectionPill {...args} disabled defaultSelected>
        Selected
      </SelectionPill>
      <SelectionPill {...args} disabled defaultSelected={false}>
        Un-selected
      </SelectionPill>
    </div>
  ),
};

/** A controlled multi-select group backed by a `Set`. */
function MultiSelectGroupDemo() {
  const options = ["Roads", "Health", "Education", "Water"];
  const [picked, setPicked] = useState<Set<string>>(new Set(["Health"]));
  const toggle = (id: string) => (on: boolean) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <SelectionPill
            key={o}
            selected={picked.has(o)}
            onSelectedChange={toggle(o)}
          >
            {o}
          </SelectionPill>
        ))}
      </div>
      <p className="text-body-xs text-body-secondary">
        Picked: <code>{[...picked].join(", ") || "none"}</code>
      </p>
    </div>
  );
}

export const MultiSelectGroup: Story = {
  render: () => <MultiSelectGroupDemo />,
};
