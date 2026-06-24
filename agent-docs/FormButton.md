# FormButton

> The call-to-action buttons for form action bars. One `FormButton` base (five tones) plus seven ready-made presets for the standard government workflow verbs (Forward, Submit, Approve, Save, Return, Reset, Reject).

```jsx
import {
  FormButton, formButtonVariants,
  ForwardButton, SubmitButton, ApproveButton,
  SaveButton, ReturnButton, ResetButton, RejectButton,
} from "@ifmis/ui";
```

- **Type:** Button (`<button>`).
- **Types:** `FormButtonProps`, `FormButtonTone` (`"primary" | "success" | "warning" | "neutral" | "danger"`), `PresetButtonProps`, `PresetButton`.
- Each preset exposes a static `.tone` so [`CtaTray`](CtaTray.md) can detect it.

---

## Purpose

The standardized form/record action buttons. They share fixed sizing (44px tall × 150px wide), tone tokens, and behaviour. The presets bake in tone + icon + default label; the base lets you make a one-off action.

## When to use

- The action bar at the bottom of a form (usually inside [`CtaTray`](CtaTray.md)).
- Standard workflow actions: Submit, Approve, Save, Return, Reset, Reject, Forward.
- One-off form-ish actions (Print, Export) via the `FormButton` base + a `tone`.

## When NOT to use

- A generic button (Continue, Open, links) → use [`Button`](Button.md).
- The action row container itself → use [`CtaTray`](CtaTray.md).

## The seven presets

| Component | Tone | Default icon | Default label | Use for |
| --- | --- | --- | --- | --- |
| `ForwardButton` | primary | CaretRight (right) | Forward | Advance a multi-step flow |
| `SubmitButton` | primary | CheckCircle (left) | Submit | Submit the form |
| `ApproveButton` | primary | CheckCircle (left) | Approve | Approve a record |
| `SaveButton` | success | FloppyDiskBack (left) | Save | Save draft/changes |
| `ReturnButton` | warning | KeyReturn (left) | Return | Send back / previous |
| `ResetButton` | neutral | — | Reset | Clear the form |
| `RejectButton` | danger | XCircle (left) | Reject | Reject a record |

## Tones (for the `FormButton` base)

| `tone` | Rest → Hover | Label |
| --- | --- | --- |
| `primary` (default) | Purple-600 → 700 | white |
| `success` | Green-200 → 300 | Green-800 |
| `warning` | Orange-200 → 300 | Orange-800 |
| `neutral` | white, grey border → darker grey | Grey-700 |
| `danger` | Red-200 → 300 | Red-800 |

## Props

`FormButton` (and every preset) spreads all native `<button>` attributes (`onClick`, `type`, `disabled`, `form`, `name`, `value`, `aria-*`).

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `tone` | `FormButtonTone` | `"primary"` | Base only — presets set this for you. |
| `children` | `ReactNode` | preset label | The button label. |
| `leftIcon` | `ReactNode` | preset icon | Icon before the label (auto-sized to 20px). |
| `rightIcon` | `ReactNode` | preset icon | Icon after the label. |
| `loading` | `boolean` | `false` | Spinner (replaces left icon) **and** disables. |
| `disabled` | `boolean` | `false` | Standard disabled state. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Defaults to `button` (safe inside forms). |
| `className` | `string` | — | Merged onto the base (tailwind-merge keeps your class winning). |

Hover/focus/disabled are native pseudo-class states — never passed as props.

## Usage examples

### Action bar with presets

```jsx
import { SubmitButton, SaveButton, ResetButton, RejectButton } from "@ifmis/ui";

<div className="flex items-center justify-end gap-3">
  <ResetButton type="reset" />
  <SaveButton onClick={onSave} />
  <RejectButton onClick={onReject} />
  <SubmitButton type="submit" />
</div>
```

### Override label / icon / state

```jsx
<ForwardButton>Next step</ForwardButton>
<SubmitButton leftIcon={<PaperPlaneTilt />}>Send</SubmitButton>
<SubmitButton loading={isSaving}>Submitting…</SubmitButton>
<RejectButton disabled />
<SubmitButton className="w-full" />   {/* override 150px width */}
```

### One-off action via the base

```jsx
import { FormButton } from "@ifmis/ui";
import { Printer } from "@phosphor-icons/react";

<FormButton tone="neutral" leftIcon={<Printer />} onClick={print}>
  Print
</FormButton>
```

### Responsive action row

```jsx
<div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
  <ResetButton type="reset" className="w-full sm:w-auto" />
  <SubmitButton type="submit" className="w-full sm:w-auto" />
</div>
```

## Best practices

- Use a **preset** whenever the action matches one of the seven verbs (so [`CtaTray`](CtaTray.md) tints correctly).
- Set `type="submit"` / `type="reset"` so buttons work inside a `<form>` (default is `button`).
- Use `loading` for async submit/approve to block double submits.
- Group with `flex gap-3` and push the primary action to the right.

## Common mistakes

- **Hand-rolling a coloured button with raw Tailwind** — use a `tone` instead.
- **Passing hover/pressed as props** — they're automatic.
- **Forgetting `type="submit"` inside a form** — it defaults to `button`.
- **Icon-only button without `aria-label`** — gives no accessible name.

## Accessibility

- Renders a native `<button>` — keyboard-focusable, Enter/Space activate, visible focus ring (`ring-blue-400`).
- `loading` also sets `disabled`; the spinner is `aria-hidden` and the label stays, keeping a stable accessible name.
- The label is the accessible name; pass `aria-label` for icon-only buttons.
- Tone colour is decorative — keep the meaning in the label.

## Related components

- [`CtaTray`](CtaTray.md) — the action bar container (auto-tints from presets).
- [`Button`](Button.md) — the generic button primitive.
