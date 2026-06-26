import type { Meta, StoryObj } from "@storybook/react";
import { Clock } from "@phosphor-icons/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A small pill-shaped status indicator (icon + label). Four semantic",
          "variants mapped to the brand scales, each with a sensible default",
          "icon. The icon is fully dynamic — override it, or pass `null` for a",
          "text-only badge.",
          "",
          "Used throughout the app (list flags, counts) and inside the",
          "`Accordion` header for section status.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "danger", "pending", "info", "default"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Success: Story = {
  args: { variant: "success", children: "Complete" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Danger" },
};

export const Pending: Story = {
  args: { variant: "pending", children: "Pending" },
};

/** Genuinely informational call-out — blue, not grey. */
export const Info: Story = {
  args: { variant: "info", children: "Info" },
};

/** The fallback when `variant` is omitted — neutral grey for draft/not-started states. */
export const Default: Story = {
  args: { children: "Draft" },
};

/** All five side by side. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="success">Complete</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="pending">Pending</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="default">Draft</Badge>
    </div>
  ),
};

/** Text-only (icon hidden) and a custom icon. */
export const IconOptions: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default" icon={null}>
        Draft
      </Badge>
      <Badge variant="pending" icon={<Clock weight="fill" />}>
        Awaiting review
      </Badge>
    </div>
  ),
};
