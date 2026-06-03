import type { Meta, StoryObj } from "@storybook/react";
import { Coins } from "@phosphor-icons/react";
import { HoverPill, HoverPillTip, type HoverPillPlacement } from "./HoverPill";

const meta: Meta<typeof HoverPill> = {
  title: "UI/HoverPill",
  component: HoverPill,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The small grey **on-hover pill** from the Figma spec: a rounded",
          "Header-14 pill with a solid grey arrow protruding from one edge.",
          "",
          "`HoverPill` is the standalone visual; `HoverPillTip` wraps a trigger",
          "and reveals the pill on hover/focus (used by the Sidebar to show a",
          "module's name).",
          "",
          "### How to use it",
          "```jsx",
          'import { HoverPill, HoverPillTip } from "@ifmis/ui";',
          "",
          "// Standalone pill",
          '<HoverPill placement="top-start">Deposit</HoverPill>',
          "",
          "// Tooltip on a trigger",
          '<HoverPillTip label="Deposit" placement="top">',
          "  <button>icon</button>",
          "</HoverPillTip>",
          "```",
        ].join("\n"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HoverPill>;

const SIX: HoverPillPlacement[] = [
  "top-start",
  "top-end",
  "bottom-start",
  "bottom-end",
  "left",
  "right",
];

/** The six Figma arrow positions. */
export const AllPlacements: Story = {
  render: () => (
    // Generous gaps so the protruding arrows never overlap a neighbouring
    // pill or its caption.
    <div className="grid grid-cols-2 gap-x-16 gap-y-12 p-12 sm:grid-cols-3">
      {SIX.map((p) => (
        <div key={p} className="flex flex-col items-center gap-5">
          <HoverPill placement={p}>Deposit</HoverPill>
          <code className="text-body-xs text-body-secondary">{p}</code>
        </div>
      ))}
    </div>
  ),
};

/** A single pill — tweak the placement from the controls. */
export const Single: Story = {
  args: { children: "Deposit", placement: "top-start" },
  argTypes: {
    placement: {
      control: "select",
      options: [
        "top",
        "top-start",
        "top-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "right",
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="flex justify-center p-16">
        <Story />
      </div>
    ),
  ],
};

/** As a tooltip — hover or focus the icon button to reveal the name. */
export const AsTooltip: StoryObj = {
  render: () => (
    <div className="flex gap-16 p-16">
      {(["top", "right", "bottom", "left"] as HoverPillPlacement[]).map((p) => (
        <HoverPillTip key={p} label="Deposit" placement={p}>
          <button
            type="button"
            aria-label="Deposit"
            className="flex size-10 items-center justify-center rounded-xl border border-grey-300 bg-white text-heading hover:bg-grey-100"
          >
            <Coins size={20} weight="duotone" />
          </button>
        </HoverPillTip>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Hover or keyboard-focus a button to reveal its `HoverPill`. This is exactly how the Sidebar surfaces a non-active module's name.",
      },
    },
  },
};

/** Forced-open tooltip (so the pill is visible in docs without hovering). */
export const TooltipOpen: StoryObj = {
  render: () => (
    <div className="flex justify-center p-16">
      <HoverPillTip label="Deposit" placement="top" open>
        <button
          type="button"
          aria-label="Deposit"
          className="flex size-10 items-center justify-center rounded-xl border border-grey-300 bg-white text-heading"
        >
          <Coins size={20} weight="duotone" />
        </button>
      </HoverPillTip>
    </div>
  ),
};
