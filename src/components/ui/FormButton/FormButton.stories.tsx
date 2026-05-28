import type { Meta, StoryObj } from "@storybook/react";
import {
  FormButton,
  ForwardButton,
  SubmitButton,
  ApproveButton,
  SaveButton,
  ReturnButton,
  ResetButton,
  RejectButton,
} from "./FormButton";

const meta: Meta<typeof FormButton> = {
  title: "UI/FormButton",
  component: FormButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "The CTA / form action buttons used in the action bar at the bottom",
          "of forms. Seven ready-made presets — **Forward, Submit, Approve,",
          "Save, Return, Reset, Reject** — plus the `FormButton` base they're",
          "built on.",
          "",
          "Works in plain JavaScript / JSX — no TypeScript needed.",
          "",
          "### How to use it",
          "Most of the time, use a preset and wire `onClick` (or `type`):",
          "```jsx",
          "import {",
          "  SubmitButton, SaveButton, ResetButton, RejectButton,",
          '} from "@ifmis/ui";',
          "",
          "<div className=\"flex gap-3\">",
          '  <SubmitButton type="submit" />',
          "  <SaveButton onClick={save} />",
          '  <ResetButton type="reset" />',
          "  <RejectButton onClick={reject} />",
          "</div>",
          "```",
          "",
          "Every preset is fully overridable — change the label via children,",
          "swap icons, disable, show a spinner, or restyle width via",
          "`className`:",
          "```jsx",
          "<SubmitButton loading={saving}>Submitting…</SubmitButton>",
          '<ForwardButton>Next step</ForwardButton>',
          '<SaveButton className="w-full" onClick={save} />',
          "```",
          "",
          "Need a one-off action with a different label/icon? Use the base and",
          "pick a `tone`:",
          "```jsx",
          'import { FormButton } from "@ifmis/ui";',
          'import { Printer } from "@phosphor-icons/react";',
          "",
          '<FormButton tone="neutral" leftIcon={<Printer />} onClick={print}>',
          "  Print",
          "</FormButton>",
          "```",
          "",
          "### Tones",
          "`primary` (purple) · `success` (green) · `warning` (orange) ·",
          "`neutral` (outlined) · `danger` (red). Hover/focus/disabled are",
          "automatic — don't pass them as props.",
        ].join("\n"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormButton>;

/** The full set — hover any button to see its hover token. */
export const AllButtons: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <ForwardButton />
      <SubmitButton />
      <ApproveButton />
      <SaveButton />
      <ReturnButton />
      <ResetButton />
      <RejectButton />
    </div>
  ),
};

export const Forward: Story = { render: () => <ForwardButton /> };
export const Submit: Story = { render: () => <SubmitButton /> };
export const Approve: Story = { render: () => <ApproveButton /> };
export const Save: Story = { render: () => <SaveButton /> };
export const Return: Story = { render: () => <ReturnButton /> };
export const Reset: Story = { render: () => <ResetButton /> };
export const Reject: Story = { render: () => <RejectButton /> };

/** Disabled + loading states. */
export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <SubmitButton loading>Submitting…</SubmitButton>
      <SaveButton disabled />
      <RejectButton disabled />
    </div>
  ),
};

/** Overriding labels and icons — every preset stays fully dynamic. */
export const Customised: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <ForwardButton>Next step</ForwardButton>
      <SubmitButton className="w-full">Send for approval</SubmitButton>
      <ResetButton>Clear all</ResetButton>
    </div>
  ),
};

/** A typical CTA action bar layout. */
export const ActionBar: Story = {
  render: () => (
    <div className="flex w-full items-center justify-between rounded-2xl border border-surface-border-purple bg-white p-4">
      <ResetButton type="reset" />
      <div className="flex gap-3">
        <ReturnButton />
        <RejectButton />
        <SubmitButton type="submit" />
      </div>
    </div>
  ),
};
