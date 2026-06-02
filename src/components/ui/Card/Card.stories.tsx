import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./Card";
import { Button } from "../Button";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A bordered surface for grouping related content. A compound set of",
          "parts — `Card`, `CardHeader`, `CardTitle`, `CardDescription`,",
          "`CardContent`, `CardFooter` — that you mix and match. Every part is a",
          "plain styled element, so anything goes inside.",
        ].join("\n"),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

/** The full anatomy: header (title + description), content, footer. */
export const Complete: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Beneficiary details</CardTitle>
        <CardDescription>Last updated 2 hours ago</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-2 text-body-sm">
          <dt className="text-body-secondary">Name</dt>
          <dd className="text-body-primary">Amit Mohan</dd>
          <dt className="text-body-secondary">Account</dt>
          <dd className="text-body-primary">****-****-8821</dd>
        </dl>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="secondary" size="small">
          Edit
        </Button>
        <Button size="small">Save</Button>
      </CardFooter>
    </Card>
  ),
};

/** Header + content only — no footer. */
export const NoFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-body-sm text-body-secondary">
          This card has a title and content but no footer actions.
        </p>
      </CardContent>
    </Card>
  ),
};

/** Bare card — just a padded surface. Drop any content inside. */
export const Bare: Story = {
  render: () => (
    <Card className="p-6">
      <p className="text-body-sm">A bare card with custom padding.</p>
    </Card>
  ),
};

/** Cards in a responsive grid. */
export const Grid: Story = {
  decorators: [(Story) => <div className="max-w-3xl"><Story /></div>],
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {["Pending", "Approved", "Rejected"].map((label) => (
        <Card key={label}>
          <CardHeader>
            <CardTitle>{label}</CardTitle>
            <CardDescription>12 vouchers</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
};
