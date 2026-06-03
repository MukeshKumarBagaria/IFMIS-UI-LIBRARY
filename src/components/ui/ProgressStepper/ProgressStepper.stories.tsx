import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProgressStepper, type ProgressStep } from "./ProgressStepper";

const meta: Meta<typeof ProgressStepper> = {
  title: "UI/ProgressStepper",
  component: ProgressStepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A collapsible vertical workflow tracker. A purple header bar with a",
          "collapse toggle, a body with a coloured dot rail + dashed connectors,",
          "step cards (`success` / `pending` / `rejected`), and an optional",
          "**View Details** footer button.",
          "",
          "Data-driven via the `steps` array — pass labels, statuses, timestamps,",
          "users, and per-row remarks; the component handles all the colour",
          "co-ordination, badge defaults, and rail rendering.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    collapsible: { control: "boolean" },
    showViewDetails: { control: "boolean" },
    viewDetailsLabel: { control: "text" },
    onCollapsedChange: { action: "collapsed-change" },
    onViewDetails: { action: "view-details" },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[320px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProgressStepper>;

const FIGMA_STEPS: ProgressStep[] = [
  {
    id: "creator",
    label: "Creator",
    status: "success",
    timestamp: "Submitted on 05 May 2026",
    user: { name: "Amit Mohan", role: "Employee" },
  },
  {
    id: "verifier",
    label: "Verifier",
    status: "pending",
    timestamp: "Received on 05 May 2026",
    user: { name: "Amit Mohan", role: "Employee" },
    remarks: (
      <>
        This is a remark made
        <br />
        when forwarding/returning the application
      </>
    ),
  },
  {
    id: "approver",
    label: "Approver",
    status: "rejected",
    timestamp: "Received on 05 May 2026",
    user: { name: "Amit Mohan", role: "Employee" },
    remarks: (
      <>
        This is a remark made
        <br />
        when forwarding/returning the application
      </>
    ),
  },
];

/** The Figma frame — Submitted / Pending / Rejected with View Details. */
export const Default: Story = {
  args: { steps: FIGMA_STEPS, showViewDetails: true },
};

/** Collapsed by default — just the purple header is visible. */
export const Collapsed: Story = {
  args: { steps: FIGMA_STEPS, defaultCollapsed: true },
};

/** Single-step, no remarks. */
export const SingleStep: Story = {
  args: {
    steps: [
      {
        id: "creator",
        label: "Creator",
        status: "success",
        timestamp: "Submitted on 05 May 2026",
        user: { name: "Amit Mohan", role: "Employee" },
      },
    ],
  },
};

/** All three statuses in their own pure form (no remarks). */
export const AllSuccess: Story = {
  args: {
    steps: FIGMA_STEPS.map((s) => ({
      ...s,
      status: "success" as const,
      remarks: undefined,
      badgeLabel: undefined,
    })),
  },
};

/** Custom badge label + custom timestamp + remarks heading override. */
export const CustomCopy: Story = {
  args: {
    title: "Application status",
    showViewDetails: true,
    viewDetailsLabel: "Open file",
    steps: [
      {
        id: "creator",
        label: "Drafted",
        status: "success",
        badgeLabel: "Filed",
        timestamp: "On 02 Jan 2026",
        user: { name: "Priya Sharma", role: "Field Officer" },
      },
      {
        id: "verifier",
        label: "Under review",
        status: "pending",
        badgeLabel: "In queue",
        timestamp: "Since 03 Jan 2026",
        user: { name: "Ravi Kumar", role: "Sub-Inspector" },
        remarks: "Need clarification on annexure B before forwarding.",
        remarksTitle: "Note from reviewer",
      },
    ],
  },
};

/** Hide the badge with `badgeLabel: null`. */
export const HiddenBadges: Story = {
  args: {
    steps: FIGMA_STEPS.map((s) => ({ ...s, badgeLabel: null })),
  },
};

/** Avatar from an image URL. */
export const WithAvatarImage: Story = {
  args: {
    steps: [
      {
        id: "creator",
        label: "Creator",
        status: "success",
        timestamp: "Submitted on 05 May 2026",
        user: {
          name: "Amit Mohan",
          role: "Employee",
          avatarSrc:
            "https://api.dicebear.com/9.x/initials/svg?seed=Amit%20Mohan",
        },
      },
      ...FIGMA_STEPS.slice(1),
    ],
  },
};

/** Collapsible toggled off — header has no button, panel is always open. */
export const NotCollapsible: Story = {
  args: { steps: FIGMA_STEPS, collapsible: false },
};

/** Workflow with a returned step — orange palette. */
export const WithReturnedStep: Story = {
  args: {
    steps: [
      {
        id: "creator",
        label: "Creator",
        status: "returned",
        timestamp: "Returned on 05 May 2026",
        user: { name: "Amit Mohan", role: "Employee" },
        remarks: "Please re-upload the signed declaration page.",
      },
      {
        id: "verifier",
        label: "Verifier",
        status: "pending",
        timestamp: "Awaiting resubmission",
        user: { name: "Asha Pillai", role: "Reviewer" },
      },
    ],
  },
};

/** Fully interactive — controlled collapse + click handler. */
function InteractiveDemo() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-body-secondary">
        Panel is {collapsed ? "collapsed" : "expanded"}.
      </p>
      <ProgressStepper
        steps={FIGMA_STEPS}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        showViewDetails
        onViewDetails={() => alert("Open details")}
      />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
