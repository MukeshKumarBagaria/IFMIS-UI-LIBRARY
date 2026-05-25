import type { Meta, StoryObj } from "@storybook/react";
import { MagnifyingGlass, Lock, Eye } from "@phosphor-icons/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    state: { control: "select", options: ["default", "error", "success"] },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  args: { placeholder: "Type here..." },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const Error: Story = { args: { state: "error", defaultValue: "invalid@" } };
export const Success: Story = { args: { state: "success", defaultValue: "valid@email.com" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "Locked value" } };

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3 max-w-xs">
      <Input {...args} size="sm" placeholder="Small" />
      <Input {...args} size="md" placeholder="Medium (default)" />
      <Input {...args} size="lg" placeholder="Large" />
    </div>
  ),
};

export const WithAdornments: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-xs">
      <Input startAdornment={<MagnifyingGlass size={16} />} placeholder="Search..." />
      <Input endAdornment={<Eye size={16} />} type="password" placeholder="Password" />
      <Input
        startAdornment={<Lock size={16} />}
        endAdornment={<Eye size={16} />}
        type="password"
        placeholder="Secured field"
      />
    </div>
  ),
};
