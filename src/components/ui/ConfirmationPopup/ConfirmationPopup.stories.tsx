import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Trash, WarningOctagon, SignOut } from "@phosphor-icons/react";
import { ConfirmationPopup } from "./ConfirmationPopup";

const meta: Meta<typeof ConfirmationPopup> = {
  title: "UI/ConfirmationPopup",
  component: ConfirmationPopup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A 400px-wide confirmation panel with a peach→white gradient, a",
          "circular brand icon, a short prompt, and a paired *cancel / confirm*",
          "action row (outlined **No** + solid **Yes** by default).",
          "",
          "Every text label, the icon, the icon colour, and both button styles",
          "are overridable — the bare component matches the Figma frame 1:1.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    confirmLabel: { control: "text" },
    cancelLabel: { control: "text" },
    iconColorClassName: { control: "text" },
    disabled: { control: "boolean" },
    onConfirm: { action: "confirm" },
    onCancel: { action: "cancel" },
  },
  args: {
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmationPopup>;

/** The Figma default — Info icon in orange-600, Yes/No actions. */
export const Default: Story = {};

/** Custom copy for a destructive flow. */
export const DestructiveCopy: Story = {
  args: {
    title: "Discard this draft?",
    confirmLabel: "Discard",
    cancelLabel: "Keep editing",
  },
};

/** Recolour the *default* icon with `iconColorClassName`. */
export const RedIconColor: Story = {
  args: {
    title: "Delete this record?",
    confirmLabel: "Delete",
    iconColorClassName: "text-red-600",
  },
};

/** Pass any node as `icon` to swap the glyph entirely. */
export const CustomIcon: Story = {
  args: {
    title: "Move this item to trash?",
    confirmLabel: "Move to trash",
    icon: (
      <Trash
        size={60}
        weight="fill"
        className="text-red-600"
        aria-hidden="true"
      />
    ),
  },
};

/** Recolour the buttons with `confirm/cancelButtonClassName`. */
export const RedButtons: Story = {
  args: {
    title: "Permanently delete this user?",
    confirmLabel: "Delete",
    icon: (
      <WarningOctagon
        size={60}
        weight="fill"
        className="text-red-600"
        aria-hidden="true"
      />
    ),
    cancelButtonClassName: "border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100",
    confirmButtonClassName: "bg-red-600 hover:bg-red-700 active:bg-red-800",
  },
};

/** Hide the icon entirely with `icon={null}`. */
export const NoIcon: Story = {
  args: {
    icon: null,
    title: "Submit your form for approval?",
  },
};

/** Both actions disabled — useful while an async confirm is in flight. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/** Fully interactive — wire confirm/cancel to your own state. */
function InteractiveDemo() {
  const [status, setStatus] = useState<"idle" | "confirmed" | "cancelled">(
    "idle",
  );

  if (status !== "idle") {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-h5 text-body-primary">
          You {status === "confirmed" ? "confirmed" : "cancelled"} the action.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-base font-semibold text-orange-600 underline"
        >
          Show popup again
        </button>
      </div>
    );
  }

  return (
    <ConfirmationPopup
      icon={
        <SignOut
          size={60}
          weight="fill"
          className="text-orange-600"
          aria-hidden="true"
        />
      }
      title="Log out of IFMIS?"
      confirmLabel="Log out"
      cancelLabel="Stay"
      onConfirm={() => setStatus("confirmed")}
      onCancel={() => setStatus("cancelled")}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
