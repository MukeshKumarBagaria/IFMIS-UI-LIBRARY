import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "@phosphor-icons/react";
import { SectionTitle } from "./SectionTitle";
import { Button } from "../Button";

const meta: Meta<typeof SectionTitle> = {
  title: "UI/SectionTitle",
  component: SectionTitle,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The labelled bar that heads a section within a page: a neutral strip",
          "with a purple accent rail on the left, the section heading, and an",
          "optional action area on the right (custom content or a default",
          '"more" overflow button).',
          "",
          "It composes the shared `<Heading>` (visual size locked to 18px /",
          "Header-18), so typography and colour stay consistent across modules.",
          "",
          "### How to use it",
          "```jsx",
          'import { SectionTitle } from "@ifmis/ui";',
          "",
          '<SectionTitle title="Beneficiary details" />',
          "```",
        ].join("\n"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SectionTitle>;

/** Matches the Figma 1:1 — heading on the left, "more" button on the right. */
export const Default: Story = {
  args: {
    title: "Sub Section Title",
    onMore: () => alert("More options"),
  },
};

/** Just the heading bar, no action. */
export const Plain: Story = {
  args: {
    title: "Beneficiary details",
  },
};

/** A custom action instead of the default overflow button. */
export const WithCustomAction: Story = {
  args: {
    title: "Attachments",
    action: (
      <Button size="small" variant="tertiary" leftIcon={<Plus />}>
        Add file
      </Button>
    ),
  },
};

/** Longer titles wrap gracefully and grow the bar. */
export const LongTitle: Story = {
  args: {
    title: "Statement of expenditure for the financial year 2025-26 (provisional)",
    onMore: () => alert("More options"),
  },
};
