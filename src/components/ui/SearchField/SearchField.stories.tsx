import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SearchField, type SearchSuggestion } from "./SearchField";

const meta: Meta<typeof SearchField> = {
  title: "UI/SearchField",
  component: SearchField,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A rounded **search input** with a leading magnifying-glass icon.",
          "Covers every Figma state — default · hover · active · active with",
          "suggestions · disabled — plus a **collapsible** 40×40 icon variant",
          "for tight toolbars.",
          "",
          "Works in plain JavaScript / JSX — no TypeScript needed.",
          "",
          "### How to use it",
          "```jsx",
          'import { SearchField } from "@ifmis/ui";',
          "",
          "// Simple search",
          '<SearchField aria-label="Search" onSearch={(q) => run(q)} />',
          "",
          "// With autocomplete suggestions",
          "<SearchField",
          '  aria-label="Search people"',
          "  suggestions={[{ value: \"John Doe\" }, { value: \"John Wick\" }]}",
          "  onSuggestionSelect={(s) => pick(s.value)}",
          "/>",
          "```",
          "",
          "### Notes",
          "- Controlled (`value`) or uncontrolled (`defaultValue`).",
          "- `suggestions` auto-filter by the typed text; set `autoFilter={false}`",
          "  for server-side results.",
          "- `collapsible` renders the round icon button that expands on click.",
          "- Keyboard: ↑/↓ move, Home/End jump, Enter selects (or fires",
          "  `onSearch`), Esc closes.",
        ].join("\n"),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    disabled: { control: "boolean" },
    collapsible: { control: "boolean" },
    autoFilter: { control: "boolean" },
    suggestions: { control: false },
    onValueChange: { action: "valueChange" },
    onSearch: { action: "search" },
    onSuggestionSelect: { action: "suggestionSelect" },
  },
  args: {
    "aria-label": "Search",
    placeholder: "Search...",
  },
};

export default meta;
type Story = StoryObj<typeof SearchField>;

const NAMES: SearchSuggestion[] = [
  { value: "John Doe" },
  { value: "John Woe" },
  { value: "John Wick" },
  { value: "Jane Roe" },
];

/** Resting state — grey border, white, placeholder. */
export const Default: Story = {};

/** Pre-filled value: the typed text renders in Header-16 (primary, semibold). */
export const Active: Story = {
  args: { defaultValue: "John" },
};

/**
 * Type to see the autocomplete popover. The value-matching row is purple-100;
 * the keyboard/hover-active row is purple-50.
 */
export const WithSuggestions: Story = {
  args: { suggestions: NAMES, defaultValue: "John" },
};

/** Disabled — not focusable, muted text and border. */
export const Disabled: Story = {
  args: { disabled: true },
};

/** The collapsed 40×40 icon button — click it to expand into the field. */
export const Collapsible: Story = {
  args: { collapsible: true, suggestions: NAMES },
};

/** Drive the value from your own state. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <div className="flex flex-col gap-3">
        <SearchField
          {...args}
          value={value}
          onValueChange={setValue}
          suggestions={NAMES}
        />
        <p className="text-body-xs text-body-secondary">
          Query: <code>{value || "—"}</code>
        </p>
      </div>
    );
  },
};

/** Every state, stacked — mirrors the Figma "Search Fields" frame. */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <SearchField aria-label="Default" placeholder="Search..." />
      <SearchField
        aria-label="Active"
        placeholder="Search..."
        defaultValue="John"
      />
      <SearchField
        aria-label="Active with suggestions"
        defaultValue="John"
        suggestions={NAMES}
      />
      <SearchField aria-label="Disabled" placeholder="Search..." disabled />
      <SearchField aria-label="Collapsed" collapsible />
    </div>
  ),
};
