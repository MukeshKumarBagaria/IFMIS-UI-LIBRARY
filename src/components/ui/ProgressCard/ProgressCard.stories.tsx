import type { Meta, StoryObj } from "@storybook/react";
import { Star } from "@phosphor-icons/react";
import { ProgressCard } from "./ProgressCard";

const meta: Meta<typeof ProgressCard> = {
  title: "UI/ProgressCard",
  component: ProgressCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The status-tinted **workflow step card** from the IFMIS Figma. One",
          "of four statuses (`success` / `pending` / `rejected` / `returned`)",
          "drives every visible colour — card, title, badge, avatar, remarks.",
          "",
          "Designed as the **atom** of the progress system: drop one into any",
          "page, or stack several inside `ProgressStepper` for the full rail.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["success", "pending", "rejected", "returned"],
    },
    label: { control: "text" },
    badgeLabel: { control: "text" },
    timestamp: { control: "text" },
    remarks: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[280px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProgressCard>;

const SAMPLE_USER = { name: "Amit Mohan", role: "Employee" };

/** Success — green palette. */
export const Success: Story = {
  args: {
    status: "success",
    label: "Creator",
    timestamp: "Submitted on 05 May 2026",
    user: SAMPLE_USER,
  },
};

/** Pending — yellow palette, spinner glyph. */
export const Pending: Story = {
  args: {
    status: "pending",
    label: "Verifier",
    timestamp: "Received on 05 May 2026",
    user: SAMPLE_USER,
    remarks:
      "This is a remark made when forwarding/returning the application",
  },
};

/** Rejected — red palette, XCircle glyph. */
export const Rejected: Story = {
  args: {
    status: "rejected",
    label: "Approver",
    timestamp: "Received on 05 May 2026",
    user: SAMPLE_USER,
    remarks:
      "This is a remark made when forwarding/returning the application",
  },
};

/** Returned — orange palette, KeyReturn glyph (new in this iteration). */
export const Returned: Story = {
  args: {
    status: "returned",
    label: "Creator",
    timestamp: "Received on 05 May 2026",
    user: SAMPLE_USER,
    remarks:
      "This is a remark made when forwarding/returning the application",
  },
};

/** Minimal — no remarks, no badge override. */
export const Minimal: Story = {
  args: {
    status: "success",
    label: "Creator",
    user: SAMPLE_USER,
  },
};

/** Custom copy on label + badge + remarks heading. */
export const CustomCopy: Story = {
  args: {
    status: "pending",
    label: "Under review",
    badgeLabel: "In queue",
    timestamp: "Since 03 Jan 2026",
    user: { name: "Ravi Kumar", role: "Sub-Inspector" },
    remarks: "Need clarification on annexure B before forwarding.",
    remarksTitle: "Note from reviewer",
  },
};

/** Hide the badge entirely. */
export const NoBadge: Story = {
  args: {
    status: "success",
    label: "Creator",
    badgeLabel: null,
    timestamp: "Submitted on 05 May 2026",
    user: SAMPLE_USER,
  },
};

/** Custom badge glyph — pass any node as `badgeIcon`. */
export const CustomBadgeIcon: Story = {
  args: {
    status: "success",
    label: "Creator",
    badgeLabel: "Featured",
    badgeIcon: <Star weight="fill" aria-hidden="true" />,
    timestamp: "Submitted on 05 May 2026",
    user: SAMPLE_USER,
  },
};

/** Avatar from an image URL. */
export const WithAvatarImage: Story = {
  args: {
    status: "success",
    label: "Creator",
    timestamp: "Submitted on 05 May 2026",
    user: {
      name: "Amit Mohan",
      role: "Employee",
      avatarSrc:
        "https://api.dicebear.com/9.x/initials/svg?seed=Amit%20Mohan",
    },
  },
};

/** Stand-alone usage — render directly in a page section. */
export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ProgressCard
        status="success"
        label="Creator"
        timestamp="Submitted on 05 May 2026"
        user={SAMPLE_USER}
      />
      <ProgressCard
        status="pending"
        label="Verifier"
        timestamp="Received on 05 May 2026"
        user={SAMPLE_USER}
        remarks="Awaiting response from desk officer."
      />
      <ProgressCard
        status="returned"
        label="Creator"
        timestamp="Returned on 05 May 2026"
        user={SAMPLE_USER}
        remarks="Please re-upload the signed declaration page."
      />
      <ProgressCard
        status="rejected"
        label="Approver"
        timestamp="Received on 05 May 2026"
        user={SAMPLE_USER}
        remarks="Application doesn't meet eligibility under Section 4."
      />
    </div>
  ),
};
