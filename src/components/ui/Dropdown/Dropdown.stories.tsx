import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { User, Buildings, Tag } from "@phosphor-icons/react";
import { Dropdown, type DropdownOption } from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
  title: "UI/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A labelled **select**. One trigger opens a popover list of options;",
          "the same component covers **single** and **multiple** selection and",
          "every Figma state (default · hover · active/open · selected ·",
          "preview · disabled).",
          "",
          "Works in plain JavaScript / JSX — no TypeScript needed.",
          "",
          "### How to use it",
          "```jsx",
          'import { Dropdown } from "@ifmis/ui";',
          'import { User } from "@phosphor-icons/react";',
          "",
          "<Dropdown",
          '  label="Country"',
          "  labelIcon={<User />}",
          '  placeholder="Select a country"',
          "  options={[",
          '    { value: "in", label: "India" },',
          '    { value: "np", label: "Nepal" },',
          "  ]}",
          "  onValueChange={(v) => console.log(v)}",
          "/>",
          "```",
          "",
          "### Notes",
          "- `value` / `onValueChange` are a `string` in single mode and a",
          "  `string[]` in multiple mode.",
          "- Controlled (`value`) or uncontrolled (`defaultValue`).",
          "- `previewSelection` lists the chosen labels under the closed field.",
          "- Full keyboard support: ↑/↓, Home/End, Enter/Space, Esc.",
        ].join("\n"),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    previewSelection: { control: "boolean" },
    options: { control: false },
    onValueChange: { action: "valueChange" },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const COUNTRIES: DropdownOption[] = [
  { value: "in", label: "India" },
  { value: "np", label: "Nepal" },
  { value: "bt", label: "Bhutan" },
  { value: "bd", label: "Bangladesh" },
  { value: "lk", label: "Sri Lanka" },
];

const baseArgs = {
  label: "Label",
  labelIcon: <User />,
  placeholder: "Placeholder",
  options: COUNTRIES,
};

/** Closed, nothing selected — the resting state. */
export const Default: Story = { args: { ...baseArgs } };

/** Open the menu (click or press ↓) to see the active popover and items. */
export const Active: Story = {
  args: { ...baseArgs, defaultValue: "in" },
};

/** A chosen value swaps the muted placeholder for the Header-16 label. */
export const Selected: Story = {
  args: { ...baseArgs, defaultValue: "np" },
};

/** Disabled — not focusable, not openable. */
export const Disabled: Story = {
  args: { ...baseArgs, disabled: true },
};

/** Error state — red border + alert subtext, wired for assistive tech. */
export const WithError: Story = {
  args: { ...baseArgs, error: "Please choose a country." },
};

/** Helper subtext below the field. */
export const WithHelperText: Story = {
  args: { ...baseArgs, helperText: "Pick the country of residence." },
};

/** Multiple selection — the popover stays open and items toggle. */
export const Multiple: Story = {
  args: {
    ...baseArgs,
    multiple: true,
    label: "Countries",
    defaultValue: ["in", "bt"],
  },
};

/**
 * The Figma "Preview items" frame — chosen labels listed in a muted grey box
 * beneath the closed field. Great for multi-select summaries.
 */
export const PreviewSelection: Story = {
  args: {
    ...baseArgs,
    multiple: true,
    previewSelection: true,
    label: "Countries",
    defaultValue: ["in", "np", "bt"],
  },
};

/** One disabled option (Bhutan) — visible but not selectable. */
export const WithDisabledOption: Story = {
  args: {
    ...baseArgs,
    options: COUNTRIES.map((o) =>
      o.value === "bt" ? { ...o, disabled: true } : o,
    ),
  },
};

/** Controlled — drive the value from your own state. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | string[]>("in");
    return (
      <div className="flex flex-col gap-3">
        <Dropdown
          {...args}
          value={value}
          onValueChange={setValue}
          label="Country"
          labelIcon={<Buildings />}
          options={COUNTRIES}
        />
        <p className="text-body-xs text-body-secondary">
          Selected: <code>{JSON.stringify(value)}</code>
        </p>
      </div>
    );
  },
};

/** Different label icons — the icon is fully swappable. */
export const Icons: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <Dropdown label="Account" labelIcon={<User />} placeholder="Placeholder" options={COUNTRIES} />
      <Dropdown label="Office" labelIcon={<Buildings />} placeholder="Placeholder" options={COUNTRIES} />
      <Dropdown label="Category" labelIcon={<Tag />} placeholder="Placeholder" options={COUNTRIES} />
    </div>
  ),
};
