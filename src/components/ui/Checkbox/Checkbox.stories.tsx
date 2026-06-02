import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "An icon + label checkbox built on a real, visually-hidden",
          "`<input type=\"checkbox\">` — so it works in forms, with the keyboard",
          "and with screen readers out of the box.",
          "",
          "States: unchecked, checked (Purple-500), indeterminate and disabled",
          "(Text/Body/Disabled). Works controlled (`checked` + `onCheckedChange`)",
          "or uncontrolled (`defaultChecked`).",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    onCheckedChange: { action: "checkedChange" },
  },
  args: { children: "This is a checkbox" },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

/** Unchecked — outlined square, header-coloured label. */
export const Unchecked: Story = {
  args: { defaultChecked: false, children: "This is unchecked" },
};

/** Checked — Purple-500 fill with a white tick. */
export const Checked: Story = {
  args: { defaultChecked: true, children: "This is checked" },
};

/** Disabled — box + label in Text/Body/Disabled (#CCC). */
export const Disabled: Story = {
  args: { disabled: true, children: "This is disabled" },
};

/** The three states from the Figma frame, stacked. */
export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Checkbox {...args} defaultChecked={false}>
        This is unchecked
      </Checkbox>
      <Checkbox {...args} defaultChecked>
        This is checked
      </Checkbox>
      <Checkbox {...args} disabled>
        This is disabled
      </Checkbox>
    </div>
  ),
};

/** Indeterminate — the "some selected" dash. */
export const Indeterminate: Story = {
  args: { indeterminate: true, children: "Some selected" },
};

/** Small / medium / large. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Checkbox {...args} size="sm" defaultChecked>
        Small (20px)
      </Checkbox>
      <Checkbox {...args} size="md" defaultChecked>
        Medium (24px)
      </Checkbox>
      <Checkbox {...args} size="lg" defaultChecked>
        Large (28px)
      </Checkbox>
    </div>
  ),
};

/** A managed list with a "select all" indeterminate parent. */
function SelectAllListDemo() {
  const items = ["Roads", "Health", "Education"];
  const [checked, setChecked] = useState<Record<string, boolean>>({
    Roads: true,
    Health: false,
    Education: false,
  });

  const values = Object.values(checked);
  const allChecked = values.every(Boolean);
  const someChecked = values.some(Boolean);

  const toggleAll = (next: boolean) =>
    setChecked(Object.fromEntries(items.map((i) => [i, next])));

  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        checked={allChecked}
        indeterminate={someChecked && !allChecked}
        onCheckedChange={toggleAll}
      >
        Select all
      </Checkbox>
      <div className="ml-7 flex flex-col gap-3">
        {items.map((item) => (
          <Checkbox
            key={item}
            checked={checked[item]}
            onCheckedChange={(next) =>
              setChecked((prev) => ({ ...prev, [item]: next }))
            }
          >
            {item}
          </Checkbox>
        ))}
      </div>
    </div>
  );
}

export const SelectAllList: Story = {
  render: () => <SelectAllListDemo />,
};
