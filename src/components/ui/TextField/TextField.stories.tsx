import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { User, CalendarDots, CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import { TextField } from "./TextField";
import { FieldIconBox } from "../FormField";

const meta: Meta<typeof TextField> = {
  title: "UI/TextField",
  component: TextField,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The IFMIS labelled text input: a label (with optional icon + required",
          "marker), a bordered control with optional leading/trailing content,",
          "and a helper or error subtext.",
          "",
          "States — default, hover, focus (active), disabled, fetched — plus an",
          "error treatment that reddens the border and shows the red banner.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    state: { control: "inline-radio", options: ["default", "fetched"] },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  args: {
    label: "Label",
    placeholder: "Placeholder",
  },
  decorators: [(Story) => <div className="w-[320px]"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {};

export const WithLabelIcon: Story = {
  args: { labelIcon: <User />, label: "Full name" },
};

export const Required: Story = {
  args: { label: "PAN number", required: true },
};

/** Error — red border + red subtext banner with an info icon. */
export const ErrorState: Story = {
  args: { label: "Email", defaultValue: "not-an-email", error: "Enter a valid email address" },
};

/** Neutral helper text below the field. */
export const HelperText: Story = {
  args: { label: "Username", helperText: "3–20 characters, letters and digits." },
};

/** A boxed trailing affix — e.g. a date field's calendar + caret. */
export const WithTrailingAffix: Story = {
  args: {
    label: "Date of birth",
    placeholder: "DD/MM/YYYY",
    endContent: (
      <FieldIconBox>
        <CalendarDots />
        <CaretDown />
      </FieldIconBox>
    ),
  },
};

/** Leading icon inside the field. */
export const WithStartIcon: Story = {
  args: { label: "Search", placeholder: "Search…", startIcon: <MagnifyingGlass /> },
};

/** Disabled. */
export const Disabled: Story = {
  args: { label: "Locked", placeholder: "Placeholder", disabled: true },
};

/** Fetched — a read-only value pulled from a backend (neutral-200 fill). */
export const Fetched: Story = {
  args: { label: "GRN (auto-filled)", value: "GRN-2026-0042", state: "fetched", readOnly: true },
};

/** All states stacked. */
export const States: Story = {
  decorators: [(Story) => <div className="w-[320px]"><Story /></div>],
  render: () => (
    <div className="flex flex-col gap-4">
      <TextField label="Default" placeholder="Placeholder" />
      <TextField label="Fetched" value="Read-only value" state="fetched" readOnly />
      <TextField label="Disabled" placeholder="Placeholder" disabled />
      <TextField label="Error" defaultValue="bad" error="Something is wrong" />
    </div>
  ),
};

/** Controlled. */
function ControlledDemo() {
  const [value, setValue] = useState("");
  return (
    <TextField
      label="Controlled"
      placeholder="Type here"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      helperText={`You typed ${value.length} characters`}
    />
  );
}
export const Controlled: Story = { render: () => <ControlledDemo /> };
