import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxCard } from "./CheckboxCard";

const meta: Meta<typeof CheckboxCard> = {
  title: "UI/CheckboxCard",
  component: CheckboxCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A card-shaped, selectable checkbox with a bold title and an optional",
          "subtext. The checked card fills with a 105° purple gradient; on hover",
          "the gradient deepens. The unchecked card sits on Surface/Grey-bg.",
          "",
          "Built on a real, visually-hidden `<input type=\"checkbox\">` — it works",
          "in forms, with the keyboard and with screen readers out of the box.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    onCheckedChange: { action: "checkedChange" },
  },
  args: {
    title: "Checked",
    description: "This is a subtext for this card",
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxCard>;

/** Default checked card — light purple gradient. */
export const Checked: Story = {
  args: { defaultChecked: true },
};

/** Unchecked card — grey surface, dark indicator. */
export const Unchecked: Story = {
  args: { defaultChecked: false },
};

/** The three rows from the Figma frame, stacked. The middle one shows the
 * hover treatment — hover over it in the canvas to see the gradient deepen. */
export const States: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <CheckboxCard {...args} defaultChecked title="Checked">
        {/* Description comes from args */}
      </CheckboxCard>
      <p className="text-body-xs text-body-secondary">↓ hover the next card</p>
      <CheckboxCard {...args} defaultChecked title="Checked" />
      <CheckboxCard {...args} defaultChecked={false} title="Checked" />
    </div>
  ),
};

/** Title only — no subtext. */
export const TitleOnly: Story = {
  args: {
    defaultChecked: true,
    title: "Premium plan",
    description: undefined,
  },
};

/** Disabled in both states — hover gradient is suppressed. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <CheckboxCard {...args} disabled defaultChecked />
      <CheckboxCard {...args} disabled defaultChecked={false} />
    </div>
  ),
};

/** A controlled single-select list — one card at a time. */
function SingleSelectListDemo() {
  const plans = [
    { id: "basic", title: "Basic", description: "Free, forever" },
    { id: "standard", title: "Standard", description: "Most popular plan" },
    { id: "premium", title: "Premium", description: "14-day free trial" },
  ];
  const [picked, setPicked] = useState("standard");

  return (
    <div className="flex flex-col gap-3">
      {plans.map((p) => (
        <CheckboxCard
          key={p.id}
          title={p.title}
          description={p.description}
          checked={picked === p.id}
          onCheckedChange={(on) => on && setPicked(p.id)}
        />
      ))}
      <p className="text-body-xs text-body-secondary">
        Picked: <code>{picked}</code>
      </p>
    </div>
  );
}

export const SingleSelectList: Story = {
  render: () => <SingleSelectListDemo />,
};

/** A controlled multi-select list. */
function MultiSelectListDemo() {
  const features = [
    { id: "analytics", title: "Analytics", description: "Real-time dashboards" },
    { id: "alerts", title: "Alerts", description: "Email + Slack notifications" },
    { id: "sso", title: "Single sign-on", description: "SAML 2.0 / OIDC" },
  ];
  const [picked, setPicked] = useState<Set<string>>(new Set(["analytics"]));

  return (
    <div className="flex flex-col gap-3">
      {features.map((f) => (
        <CheckboxCard
          key={f.id}
          title={f.title}
          description={f.description}
          checked={picked.has(f.id)}
          onCheckedChange={(on) =>
            setPicked((prev) => {
              const next = new Set(prev);
              if (on) next.add(f.id);
              else next.delete(f.id);
              return next;
            })
          }
        />
      ))}
      <p className="text-body-xs text-body-secondary">
        Picked: <code>{[...picked].join(", ") || "none"}</code>
      </p>
    </div>
  );
}

export const MultiSelectList: Story = {
  render: () => <MultiSelectListDemo />,
};
