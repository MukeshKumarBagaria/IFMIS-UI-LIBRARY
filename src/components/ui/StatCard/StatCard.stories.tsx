import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircle } from "@phosphor-icons/react";
import { StatCard } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "UI/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A tonal dashboard metric card: title, a value / total counter, a",
          "ringed icon, and a gradient progress bar. Five tones — purple, green,",
          "red, yellow, blue — repaint the surface, text, icon ring and progress",
          "together.",
          "",
          "Progress is derived from `value / total` by default, or set explicitly",
          "with the `progress` prop (0–100).",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["purple", "green", "red", "yellow", "blue"],
    },
    progress: { control: { type: "range", min: 0, max: 100, step: 1 } },
    hideProgress: { control: "boolean" },
  },
  args: {
    title: "All Grievance",
    value: 13,
    total: 13,
    progress: 40,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[358px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Purple: Story = { args: { tone: "purple" } };
export const Green: Story = { args: { tone: "green" } };
export const Red: Story = { args: { tone: "red" } };
export const Yellow: Story = { args: { tone: "yellow" } };
export const Blue: Story = { args: { tone: "blue" } };

/** All five tones stacked, matching the Figma frame. */
export const AllTones: Story = {
  decorators: [(Story) => <div className="max-w-[358px]"><Story /></div>],
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(["purple", "green", "red", "yellow", "blue"] as const).map((tone) => (
        <StatCard key={tone} {...args} tone={tone} />
      ))}
    </div>
  ),
};

/** Progress derived automatically from value / total (here 8 / 20 = 40%). */
export const DerivedProgress: Story = {
  args: { tone: "green", title: "Resolved", value: 8, total: 20, progress: undefined },
};

/** A custom icon overrides the default Files glyph. */
export const CustomIcon: Story = {
  args: {
    tone: "green",
    title: "Approved",
    icon: <CheckCircle weight="fill" />,
  },
};

/** No icon, and value with no total. */
export const Minimal: Story = {
  args: { tone: "blue", title: "Open tickets", value: 42, total: undefined, icon: null },
};

/** Progress bar hidden — just the headline metric. */
export const NoProgress: Story = {
  args: { tone: "red", title: "Overdue", value: 5, total: 12, hideProgress: true },
};

/** A responsive dashboard grid. */
export const DashboardGrid: Story = {
  decorators: [(Story) => <div className="max-w-5xl"><Story /></div>],
  render: () => {
    const stats = [
      { tone: "purple", title: "All Grievance", value: 13, total: 13, progress: 100 },
      { tone: "green", title: "Resolved", value: 9, total: 13, progress: 70 },
      { tone: "red", title: "Rejected", value: 2, total: 13, progress: 15 },
      { tone: "yellow", title: "Pending", value: 5, total: 13, progress: 38 },
      { tone: "blue", title: "Reopened", value: 1, total: 13, progress: 8 },
    ] as const;
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>
    );
  },
};
