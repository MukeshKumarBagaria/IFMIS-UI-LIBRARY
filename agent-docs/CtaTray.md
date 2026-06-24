# CtaTray

> The **sticky action bar** at the bottom of a form. A white rounded card wraps a rounded "pill" of action buttons; the pill's background **auto-tints to match the last button clicked** (purple/green/orange/red/grey). Drop `FormButton` presets inside and the tray does the rest.

```jsx
import { CtaTray } from "@ifmis/ui";
```

- **Type:** Form action bar / button group container.
- **Types:** `CtaTrayProps`, `CtaTrayTone` (= `FormButtonTone`: `"neutral" | "primary" | "success" | "warning" | "danger"`), `CtaTrayAlign` (`"start" | "center" | "end" | "between"`).

---

## Purpose

Render the standardized footer action row for module forms. It intercepts each child button's click to recolour the pill (a gentle visual echo of the action), while still calling the consumer's own `onClick`.

## When to use

- The bottom action bar of a form/wizard step (Reset / Reject / Return / Save / Forward).
- Any grouped row of [`FormButton`](FormButton.md) actions that should share the tray styling.

## When NOT to use

- A single standalone button → use [`Button`](Button.md) / [`FormButton`](FormButton.md) directly.
- A modal confirm/cancel pair → use [`ConfirmationPopup`](ConfirmationPopup.md).

## How auto-highlight works

Each [`FormButton`](FormButton.md) preset carries a static `tone`; a bare `FormButton` exposes a `tone` prop. The tray reads each child's tone, wraps its `onClick`, and tints the pill to the clicked tone. Non-button children (and elements without a tone) pass through untouched. Children inside a `<>…</>` fragment are flattened and still detected; custom wrapper components are **not** inspected.

| Clicked | Tone | Pill background |
| --- | --- | --- |
| Reset | `neutral` | grey |
| Forward | `primary` | light purple |
| Save | `success` | green-50 |
| Return | `warning` | orange-50 |
| Reject | `danger` | red-50 |

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | The action buttons, in display order. |
| `tone` | `CtaTrayTone` | — | Controlled pill tint. Omit for auto-tracking. |
| `defaultTone` | `CtaTrayTone` | `"neutral"` | Initial tint when uncontrolled. |
| `onToneChange` | `(tone) => void` | — | Fires on each button click with its tone. |
| `highlight` | `boolean` | `true` | `false` keeps the pill grey always. |
| `align` | `"start" \| "center" \| "end" \| "between"` | `"end"` | Pill placement in the card (overridden to split when `onBack` set). |
| `ariaLabel` | `string` | `"Form actions"` | Accessible label for the button group. |
| `onBack` | `() => void` | — | Renders a neutral "Back" button at the far left; pushes the pill right. Omit to hide. |
| `backLabel` | `ReactNode` | `"Back"` | Back button label. |
| `className` | `string` | — | Merged onto the outer card. |

All other native `<div>` props are forwarded (`onChange` omitted).

## Usage examples

### Standard tray (auto-highlight)

```jsx
import {
  CtaTray, ResetButton, RejectButton,
  ReturnButton, SaveButton, ForwardButton,
} from "@ifmis/ui";

<CtaTray>
  <ResetButton type="reset" />
  <RejectButton onClick={onReject} />
  <ReturnButton onClick={onReturn} />
  <SaveButton onClick={onSave} />
  <ForwardButton onClick={onNext} />
</CtaTray>
```

### With a Back button

```jsx
<CtaTray onBack={() => navigate(-1)}>
  <SaveButton onClick={save} />
  <ForwardButton onClick={next} />
</CtaTray>
```

### Custom button + subset

```jsx
import { CtaTray, FormButton, SaveButton } from "@ifmis/ui";
import { Printer } from "@phosphor-icons/react";

<CtaTray>
  <FormButton tone="neutral" leftIcon={<Printer />} onClick={print}>Print</FormButton>
  <SaveButton onClick={save} />
</CtaTray>
```

### Controlled highlight / turn it off

```jsx
const [tone, setTone] = useState("neutral");
<CtaTray tone={tone} onToneChange={setTone}>…</CtaTray>

<CtaTray highlight={false}>…</CtaTray>
```

### Sticky footer

```jsx
<div className="sticky bottom-0 z-10 bg-background pt-3">
  <CtaTray>
    <ResetButton type="reset" />
    <ForwardButton type="submit" />
  </CtaTray>
</div>
```

## Best practices

- Use the [`FormButton`](FormButton.md) presets so the tints map correctly.
- Inside a `<form>`, set `type="submit"` / `type="reset"` so the buttons drive the form (default is `type="button"`).
- Push the primary action (Forward/Submit) to the far right (it's also read last by AT).
- On narrow screens, keep to 2–3 buttons; move extra/destructive actions into an overflow menu rather than wrapping to three lines.

## Common mistakes

- **Wrapping buttons in a custom component** — the tray can't inspect it for a tone; pass buttons directly or inside a fragment.
- **Rebuilding the card/pill with raw Tailwind** — compose `CtaTray` instead.
- **Relying on the tint to convey state** — it's decorative; the label must carry the meaning.

## Accessibility

- The pill is a `role="group"` named by `ariaLabel`.
- Children are real `<button>`s, focusable with visible focus rings, reached in DOM order.
- The tint is decorative — never rely on colour alone.

## Related components

- [`FormButton`](FormButton.md) — the preset action buttons that go inside.
- [`Button`](Button.md) — base button (used for the Back button).
- [`ConfirmationPopup`](ConfirmationPopup.md) — modal confirm/cancel.
