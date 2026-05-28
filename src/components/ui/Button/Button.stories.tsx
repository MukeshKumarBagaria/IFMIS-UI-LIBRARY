import type { Meta, StoryObj } from "@storybook/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "The IFMIS button primitive. Three `variant`s",
          "(`primary` / `secondary` / `tertiary`) across two `size`s",
          "(`standard` 44px / `small` 32px).",
          "",
          "### How to use it",
          "Works in plain JavaScript / JSX — no TypeScript needed.",
          "The Figma states (Hover / Pressed / Focused / Disabled) are **not**",
          "props — they map to native interaction pseudo-classes, so you only",
          "choose a variant/size and wire `onClick`.",
          "",
          "```jsx",
          'import { Button } from "@ifmis/ui";',
          'import { CaretRight } from "@phosphor-icons/react";',
          "",
          "<Button onClick={save}>Save</Button>",
          "",
          '<Button variant="secondary" size="small" rightIcon={<CaretRight />}>',
          "  Next",
          "</Button>",
          "",
          "// Disabled / loading",
          "<Button loading>Saving…</Button>",
          "",
          "// Render as a link (Radix Slot) — keeps button styling",
          "<Button asChild>",
          '  <a href="/reports">Reports</a>',
          "</Button>",
          "```",
          "",
          "Pass any icon node to `leftIcon` / `rightIcon`; the button sizes it",
          "(24px standard, 20px small). `asChild` ignores the icon props.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description: "Visual style.",
      table: { defaultValue: { summary: "primary" } },
    },
    size: {
      control: "select",
      options: ["standard", "small"],
      description: "Standard = 44px tall, Small = 32px tall.",
      table: { defaultValue: { summary: "standard" } },
    },
    disabled: { control: "boolean", description: "Disables the button." },
    loading: {
      control: "boolean",
      description: "Shows a spinner in the left slot and disables the button.",
    },
    leftIcon: { control: false, description: "Icon node before the label." },
    rightIcon: { control: false, description: "Icon node after the label." },
    asChild: {
      control: false,
      description:
        "Render the child element instead of a <button> (Radix Slot).",
    },
    children: { control: "text", description: "Button label." },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "standard",
    leftIcon: <CaretLeft weight="bold" />,
    rightIcon: <CaretRight weight="bold" />,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Tertiary: Story = { args: { variant: "tertiary" } };

export const Small: Story = { args: { size: "small" } };
export const Loading: Story = { args: { loading: true, children: "Submitting" } };
export const Disabled: Story = { args: { disabled: true } };

export const NoIcons: Story = {
  args: { leftIcon: undefined, rightIcon: undefined },
};

/**
 * Full matrix — every variant in both sizes. Hover / focus (Tab) / press
 * the buttons to see the interactive states from Figma. The "Disabled"
 * column uses the native disabled state.
 */
export const Showcase: Story = {
  render: () => {
    const variants = ["primary", "secondary", "tertiary"] as const;
    const sizes = ["standard", "small"] as const;
    return (
      <div className="flex flex-col gap-8">
        {sizes.map((size) => (
          <div key={size} className="flex flex-col gap-3">
            <h3 className="text-heading text-sm font-semibold uppercase tracking-wide">
              {size}
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              {variants.map((variant) => (
                <Button
                  key={variant}
                  variant={variant}
                  size={size}
                  leftIcon={<CaretLeft weight="bold" />}
                  rightIcon={<CaretRight weight="bold" />}
                >
                  Button
                </Button>
              ))}
              {variants.map((variant) => (
                <Button
                  key={`${variant}-disabled`}
                  variant={variant}
                  size={size}
                  disabled
                  leftIcon={<CaretLeft weight="bold" />}
                  rightIcon={<CaretRight weight="bold" />}
                >
                  Button
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
