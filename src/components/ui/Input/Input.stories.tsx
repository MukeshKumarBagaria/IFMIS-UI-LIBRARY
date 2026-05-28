import type { Meta, StoryObj } from "@storybook/react";
import { MagnifyingGlass, Lock, Eye } from "@phosphor-icons/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Single-line text field. Spreads all native `<input>` attributes",
          "(`value`, `onChange`, `type`, `name`, `required`, `maxLength`, …),",
          "so it drops into controlled or uncontrolled forms unchanged.",
          "",
          "### How to use it",
          "Works in plain JavaScript / JSX — no TypeScript needed.",
          "",
          "```jsx",
          'import { Input } from "@ifmis/ui";',
          'import { MagnifyingGlass } from "@phosphor-icons/react";',
          "",
          "// Controlled",
          "const [q, setQ] = useState(\"\");",
          "<Input value={q} onChange={(e) => setQ(e.target.value)} placeholder=\"Search\" />",
          "",
          "// Validation state (pair with a message below the field)",
          '<Input state="error" aria-invalid value={email} onChange={...} />',
          "{error && <p className=\"text-body-xs text-destructive\">{error}</p>}",
          "",
          "// Icons / text inside the field",
          "<Input startAdornment={<MagnifyingGlass size={16} />} placeholder=\"Search\" />",
          '<Input type="password" endAdornment={<button>show</button>} />',
          "```",
          "",
          "### Notes",
          "- `size`: `sm` (32px) · `md` (40px, default) · `lg` (44px).",
          "- `state`: `default` · `error` (red ring) · `success` (green ring).",
          "- Adornments are decorative wrappers — for a clickable show/hide",
          "  password toggle, put a real `<button>` in `endAdornment`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Field height: sm 32px · md 40px · lg 44px.",
      table: { defaultValue: { summary: "md" } },
    },
    state: {
      control: "select",
      options: ["default", "error", "success"],
      description: "Validation styling. Drive from your form state.",
      table: { defaultValue: { summary: "default" } },
    },
    disabled: { control: "boolean", description: "Disables the field." },
    placeholder: { control: "text", description: "Empty-state hint text." },
    startAdornment: {
      control: false,
      description: "Node rendered inside the field on the left (e.g. an icon).",
    },
    endAdornment: {
      control: false,
      description: "Node rendered inside the field on the right.",
    },
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
