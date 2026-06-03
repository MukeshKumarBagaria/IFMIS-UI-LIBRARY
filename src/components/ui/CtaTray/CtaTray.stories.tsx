import type { Meta, StoryObj } from "@storybook/react";
import { CtaTray } from "./CtaTray";
import {
  ResetButton,
  RejectButton,
  ReturnButton,
  SaveButton,
  ForwardButton,
} from "../FormButton";

const meta: Meta<typeof CtaTray> = {
  title: "UI/CtaTray",
  component: CtaTray,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The sticky **action bar** at the bottom of a form: a white rounded",
          "card holding a rounded pill of action buttons. The pill tints to",
          "match the **last clicked button** (purple = Forward, green = Save,",
          "orange = Return, red = Reject, grey = Reset) — automatically.",
          "",
          "Works in plain JavaScript / JSX — no TypeScript needed.",
          "",
          "### How to use it",
          "Drop `FormButton` presets inside in the order you want. The tray",
          "wires the highlight for you and preserves each button's `onClick`.",
          "```jsx",
          "import {",
          "  CtaTray, ResetButton, RejectButton,",
          "  ReturnButton, SaveButton, ForwardButton,",
          '} from "@ifmis/ui";',
          "",
          "<CtaTray>",
          '  <ResetButton type="reset" />',
          "  <RejectButton onClick={reject} />",
          "  <ReturnButton onClick={goBack} />",
          "  <SaveButton onClick={save} />",
          "  <ForwardButton onClick={next} />",
          "</CtaTray>",
          "```",
          "",
          "### Customise",
          "- `onBack`: renders a **Back** button at the far left (pill moves right).",
          "- `align`: `end` (default) · `start` · `center` · `between`.",
          "- `highlight={false}` keeps the pill grey regardless of clicks.",
          "- Controlled tint: pass `tone` + `onToneChange`.",
          "- Render any subset/order of buttons, override labels, add your own.",
        ].join("\n"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CtaTray>;

// A fragment value (not a wrapper component) so CtaTray can still see the
// individual buttons as children.
const standardButtons = (
  <>
    <ResetButton type="reset" />
    <RejectButton />
    <ReturnButton />
    <SaveButton />
    <ForwardButton />
  </>
);

/** Click any button — the pill recolours to that button's tone. */
export const Default: Story = {
  render: () => <CtaTray>{standardButtons}</CtaTray>,
};

/** With a leftmost **Back** button — matches the Figma frame 1:1. */
export const WithBack: Story = {
  render: () => (
    <CtaTray onBack={() => alert("Back")}>{standardButtons}</CtaTray>
  ),
};

/** The five highlight states from the Figma frame (forced via `tone`). */
export const HighlightStates: Story = {
  render: () => {
    const tones = ["neutral", "primary", "success", "warning", "danger"] as const;
    return (
      <div className="flex flex-col gap-4">
        {tones.map((t) => (
          <CtaTray key={t} tone={t}>
            {standardButtons}
          </CtaTray>
        ))}
      </div>
    );
  },
};

/** Left-aligned, and a minimal Save / Forward tray. */
export const Variations: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CtaTray align="between">
        <ResetButton type="reset" />
        <ForwardButton />
      </CtaTray>
      <CtaTray>
        <SaveButton />
        <ForwardButton />
      </CtaTray>
    </div>
  ),
};

/** No auto-tint — pill stays grey. */
export const NoHighlight: Story = {
  render: () => <CtaTray highlight={false}>{standardButtons}</CtaTray>,
};
