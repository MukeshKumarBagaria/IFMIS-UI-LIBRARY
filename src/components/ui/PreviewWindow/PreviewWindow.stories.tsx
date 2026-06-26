import type { Meta, StoryObj } from "@storybook/react";
import { PreviewWindow } from "./PreviewWindow";

const meta: Meta<typeof PreviewWindow> = {
  title: "UI/PreviewWindow",
  component: PreviewWindow,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The IFMIS file/format preview shell: a rounded grey window with a",
          "header (file name + Print / expand / close actions) and a large",
          "content area. The content area is a slot — pass `children` to render",
          "the real preview; omit it for the Figma placeholder frame.",
        ].join("\n"),
      },
    },
  },
  args: {
    title: "invoice_inv_860",
    onPrint: () => {},
    onExpand: () => {},
    onClose: () => {},
  },
  decorators: [
    (Story) => (
      <div className="max-w-[752px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PreviewWindow>;

/** The default placeholder state — matches the Figma frame 1:1. */
export const Placeholder: Story = {};

/** With real preview content plugged into the slot. */
export const WithContent: Story = {
  args: {
    title: "invoice_inv_860.pdf",
    children: (
      <div className="flex h-[480px] w-full items-center justify-center bg-surface-card">
        <p className="text-body-sm text-body-secondary">[ your PDF / image / iframe here ]</p>
      </div>
    ),
  },
};

/** Read-only preview — drop the print/expand actions, keep only close. */
export const CloseOnly: Story = {
  args: { onPrint: undefined, onExpand: undefined },
};
