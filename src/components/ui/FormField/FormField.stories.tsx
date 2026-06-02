import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./FormField";

const meta: Meta<typeof FormField> = {
  title: "UI/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The shared shell behind every IFMIS form control: label (+ icon +",
          "required marker), a control slot, and a helper/error subtext — with",
          "the label, error and control correctly wired for assistive tech.",
          "",
          "`TextField` and `Textarea` use it internally; reach for it directly to",
          "give a *custom* control (a Select, a date picker…) the same chrome.",
        ].join("\n"),
      },
    },
  },
  decorators: [(Story) => <div className="w-[320px]"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof FormField>;

/** Wrapping a plain native control via the render-prop. */
export const Basic: Story = {
  render: () => (
    <FormField label="Country" required helperText="Pick your country of residence.">
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className="h-11 w-full rounded-2xl border border-surface-border-grey bg-surface-card px-3"
        >
          <option>India</option>
          <option>Nepal</option>
        </select>
      )}
    </FormField>
  ),
};

/** Error banner + invalid wiring. */
export const WithError: Story = {
  render: () => (
    <FormField label="Account number" error="Account not found">
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          defaultValue="0000"
          className="h-11 w-full rounded-2xl border border-red-600 bg-surface-card px-3"
        />
      )}
    </FormField>
  ),
};
