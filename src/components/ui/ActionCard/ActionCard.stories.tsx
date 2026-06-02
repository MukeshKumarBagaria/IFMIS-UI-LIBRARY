import type { Meta, StoryObj } from "@storybook/react";
import { ActionCard } from "./ActionCard";

const meta: Meta<typeof ActionCard> = {
  title: "UI/ActionCard",
  component: ActionCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A status-tinted card with a gradient header, a body and a footer of",
          "small actions. Three tones — `pending` (orange), `success` (green) and",
          "`danger` (red) — repaint the header, the counter and the buttons in",
          "lock-step.",
          "",
          "Works as a single prop-driven block, or composed from sub-parts",
          "(`ActionCard.Header`, `.Body`, `.Footer`, `.Badge`, `.Button`).",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    tone: { control: "inline-radio", options: ["pending", "success", "danger"] },
    badge: { control: "boolean" },
    onCancel: { action: "cancel" },
    onOpen: { action: "open" },
  },
  args: {
    title: "Pending",
    heading: "Header",
    description: "This is a description for this card, feel free to replace the content.",
    badge: true,
    counter: "20 of 30",
  },
  decorators: [
    (Story) => (
      <div className="max-w-[480px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActionCard>;

/** Default pending card — Brand/OrangeGradient header, Orange-600 actions. */
export const Pending: Story = {
  args: { tone: "pending", title: "Pending", onCancel: () => {}, onOpen: () => {} },
};

/** Success card — Brand/GreenGradient header, Green-600 actions. */
export const Success: Story = {
  args: { tone: "success", title: "Submitted", onCancel: () => {}, onOpen: () => {} },
};

/** Danger card — Brand/RedGradient header, Red-600 actions. */
export const Danger: Story = {
  args: { tone: "danger", title: "Rejected", onCancel: () => {}, onOpen: () => {} },
};

/** The three tones stacked, matching the Figma frame. */
export const AllTones: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <ActionCard {...args} tone="pending" title="Pending" onCancel={() => {}} onOpen={() => {}} />
      <ActionCard {...args} tone="success" title="Submitted" onCancel={() => {}} onOpen={() => {}} />
      <ActionCard {...args} tone="danger"  title="Rejected"  onCancel={() => {}} onOpen={() => {}} />
    </div>
  ),
};

/** No badge, no counter — minimal card with just title + heading + description. */
export const Minimal: Story = {
  args: {
    badge: false,
    counter: undefined,
    onCancel: undefined,
    onOpen: undefined,
    hideFooter: true,
  },
};

/** Footer with just a primary action (no cancel). */
export const PrimaryActionOnly: Story = {
  args: { onCancel: undefined, onOpen: () => {} },
};

/** Renders at narrow widths — the heading row and footer wrap to two lines. */
export const Narrow: Story = {
  args: { onCancel: () => {}, onOpen: () => {} },
  decorators: [
    (Story) => (
      <div className="max-w-[280px]">
        <Story />
      </div>
    ),
  ],
};

/** Fully composed via sub-parts — handy when the body or footer needs custom content. */
export const Compound: Story = {
  render: () => (
    <ActionCard tone="success">
      <ActionCard.Header>Submitted</ActionCard.Header>
      <ActionCard.Body
        heading="Quarterly report"
        description="All reviewers approved on 24 May 2026."
        badge={<ActionCard.Badge>3 approvers</ActionCard.Badge>}
      />
      <ActionCard.Footer counter="20 of 30">
        <ActionCard.Button kind="outline">Cancel</ActionCard.Button>
        <ActionCard.Button>Open</ActionCard.Button>
      </ActionCard.Footer>
    </ActionCard>
  ),
};
