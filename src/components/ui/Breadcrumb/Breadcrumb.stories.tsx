import type { Meta, StoryObj } from "@storybook/react";
import { House } from "@phosphor-icons/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Page-trail navigation chips. The **last** item is the current page",
          "(purple on neutral-100); the rest are muted grey chips with a caret",
          "between each. Handles any number of items.",
          "",
          "Works in plain JavaScript / JSX — no TypeScript needed.",
          "",
          "### How to use it",
          "Pass an `items` array. Each crumb becomes a link (`href`), a button",
          "(`onClick`), or plain text — inferred automatically.",
          "```jsx",
          'import { Breadcrumb } from "@ifmis/ui";',
          "",
          "<Breadcrumb",
          "  items={[",
          '    { label: "Home", href: "/" },',
          '    { label: "Vouchers", href: "/vouchers" },',
          '    { label: "VCH-2026-0042" }, // last = current page',
          "  ]}",
          "/>",
          "```",
          "",
          "### Customise",
          "- `separator` — any node (defaults to a caret).",
          "- Per item: `href`, `onClick`, `icon`, `current`, `className`.",
          "- `current: true` overrides which crumb is active (else it's the last).",
        ].join("\n"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2" },
    ],
  },
};

export const Links: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Vouchers", href: "#" },
      { label: "Pending", href: "#" },
      { label: "VCH-2026-0042" },
    ],
  },
};

/** Many levels — wraps gracefully. */
export const ManyItems: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "HRMS", href: "#" },
      { label: "Pay Related", href: "#" },
      { label: "Salary", href: "#" },
      { label: "FY 2025-26", href: "#" },
      { label: "March", href: "#" },
      { label: "Statement" },
    ],
  },
};

/** Buttons wired to a router. */
export const WithButtons: Story = {
  args: {
    items: [
      { label: "Dashboard", onClick: () => alert("go /") },
      { label: "HRMS", onClick: () => alert("go /hrms") },
      { label: "Leave Management" },
    ],
  },
};

/** A leading icon on the first crumb. */
export const WithIcon: Story = {
  args: {
    items: [
      { label: "Home", href: "#", icon: <House weight="fill" /> },
      { label: "Reports", href: "#" },
      { label: "Monthly" },
    ],
  },
};

/** Custom separator — any node works (here, a slash). */
export const CustomSeparator: Story = {
  args: {
    separator: <span className="text-grey-500">/</span>,
    items: [
      { label: "Home", href: "#" },
      { label: "Settings", href: "#" },
      { label: "Profile" },
    ],
  },
};
