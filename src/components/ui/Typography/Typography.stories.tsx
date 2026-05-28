import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "./Heading";
import { Text } from "./Text";

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Two components cover all text: **`Heading`** (H1–H6) and **`Text`**",
          "(body copy). Both render Google Sans Flex and match the Figma scale",
          "1:1. Both accept `className` and forward refs.",
          "",
          "### How to use it",
          "Works in plain JavaScript / JSX — no TypeScript needed.",
          "",
          "```jsx",
          'import { Heading, Text } from "@ifmis/ui";',
          "",
          "<Heading level={1}>Dashboard</Heading>",
          "<Heading level={3}>Section title</Heading>",
          "",
          "<Text>Default body — 16px / regular / primary colour.</Text>",
          '<Text size="md" weight="medium">Form label</Text>',
          '<Text size="xs" color="secondary">Helper / caption text</Text>',
          "```",
          "",
          "### `Heading` props",
          "- `level`: `1`–`6` — visual size (H1 32px → H6 14px), all SemiBold.",
          "- `as`: override the rendered tag to **decouple rank from looks**,",
          "  e.g. `<Heading level={3} as=\"h2\">` looks like H3 but is an `<h2>`.",
          "- `align`: `left` (default) · `center` · `right`.",
          "",
          "### `Text` props",
          "- `size`: `xs` 14 · `sm` 16 (default) · `md` 18 · `lg` 20 (px).",
          "- `weight`: `regular` (default) · `medium` · `semibold`.",
          "- `color`: `primary` (default) · `secondary` · `muted` · `inherit`.",
          "- `align`, `truncate`, and `as` (default `<p>`; use `\"span\"` inline).",
        ].join("\n"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const Row = ({
  label,
  meta,
  children,
}: {
  label: string;
  meta: string;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-[60px_1fr_240px] items-baseline gap-6 border-b border-border py-4 last:border-0">
    <span className="text-body-xs font-medium text-muted-foreground">{label}</span>
    <div>{children}</div>
    <span className="text-body-xs text-muted-foreground">{meta}</span>
  </div>
);

/** All 6 heading levels — mirror of the Figma "Headers" frame. */
export const Headings: Story = {
  render: () => (
    <div className="max-w-4xl">
      <Row label="H1" meta="32 / SemiBold / 100%">
        <Heading level={1}>IFMS Design System</Heading>
      </Row>
      <Row label="H2" meta="24 / SemiBold / 100%">
        <Heading level={2}>IFMS Design System</Heading>
      </Row>
      <Row label="H3" meta="20 / SemiBold / 100%">
        <Heading level={3}>IFMS Design System</Heading>
      </Row>
      <Row label="H4" meta="18 / SemiBold / 100%">
        <Heading level={4}>IFMS Design System</Heading>
      </Row>
      <Row label="H5" meta="16 / SemiBold / 100%">
        <Heading level={5}>IFMS Design System</Heading>
      </Row>
      <Row label="H6" meta="14 / SemiBold / 100%">
        <Heading level={6}>IFMS Design System</Heading>
      </Row>
    </div>
  ),
};

/** Body Medium — weight 500, line-height 1.5. Maps to Figma B1–B4. */
export const BodyMedium: Story = {
  render: () => (
    <div className="max-w-4xl">
      <Row label="B1" meta="20 / Medium / 30">
        <Text size="lg" weight="medium">
          Welcome to IFMIS Next Gen Integrated Financial System Next Generation
        </Text>
      </Row>
      <Row label="B2" meta="18 / Medium / 27">
        <Text size="md" weight="medium">
          Welcome to IFMIS Next Gen Integrated Financial System Next Generation
        </Text>
      </Row>
      <Row label="B3" meta="16 / Medium / 24">
        <Text size="sm" weight="medium">
          Welcome to IFMIS Next Gen Integrated Financial System Next Generation
        </Text>
      </Row>
      <Row label="B4" meta="14 / Medium / 21">
        <Text size="xs" weight="medium">
          Welcome to IFMIS Next Gen Integrated Financial System Next Generation
        </Text>
      </Row>
    </div>
  ),
};

/** Body Regular — weight 400, line-height 1.5. Maps to Figma b1–b4. */
export const BodyRegular: Story = {
  render: () => (
    <div className="max-w-4xl">
      <Row label="b1" meta="20 / Regular / 30">
        <Text size="lg">
          Welcome to IFMIS Next Gen Integrated Financial System Next Generation
        </Text>
      </Row>
      <Row label="b2" meta="18 / Regular / 27">
        <Text size="md">
          Welcome to IFMIS Next Gen Integrated Financial System Next Generation
        </Text>
      </Row>
      <Row label="b3" meta="16 / Regular / 24">
        <Text size="sm">
          Welcome to IFMIS Next Gen Integrated Financial System Next Generation
        </Text>
      </Row>
      <Row label="b4" meta="14 / Regular / 21">
        <Text size="xs">
          Welcome to IFMIS Next Gen Integrated Financial System Next Generation
        </Text>
      </Row>
    </div>
  ),
};

/** Text color variants. */
export const Colors: Story = {
  render: () => (
    <div className="max-w-2xl space-y-3">
      <Text color="primary">
        Body Primary — #2E2E2E — default body color, highest legibility.
      </Text>
      <Text color="secondary">
        Body Secondary — #595959 — for helper text, captions, metadata.
      </Text>
      <Text color="muted">
        Muted foreground — for placeholder and disabled-adjacent text.
      </Text>
    </div>
  ),
};

/** Headings are decoupled from semantics — `as` controls the HTML tag. */
export const SemanticsVsAppearance: Story = {
  render: () => (
    <div className="max-w-2xl space-y-4">
      <Heading level={1} as="h1">
        Page Title (level=1, as=h1)
      </Heading>
      <Heading level={3} as="h2">
        Section heading that looks like H3 but is semantically H2
      </Heading>
      <Text size="md">
        Use the <code className="rounded bg-grey-25 px-1">as</code> prop when the
        visual style and the heading rank should not match (rare, but happens).
      </Text>
    </div>
  ),
};
