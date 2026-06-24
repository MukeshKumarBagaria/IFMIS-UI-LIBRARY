# AadhaarESign

> Aadhaar e-sign / OTP-request **dialog panel**: purple header (pen icon + title + close), a body with a prompt, a masked-number label, a functional segmented digit input, and an Aadhaar card preview, plus a grey footer with a "Send OTP" action.

```jsx
import { AadhaarESign, AadhaarCardPreview } from "@ifmis/ui";
```

- **Type:** Composite dialog panel (not an overlay/modal itself).
- **Exports:** `AadhaarESign`, `AadhaarCardPreview`
- **Types:** `AadhaarESignProps`, `AadhaarESignState`, `AadhaarCardPreviewProps`
- **Element:** `<div role="dialog">` (forwards `ref` to the panel).

---

## Purpose

Capture the last few digits of an Aadhaar ID (or any short numeric code) to trigger an OTP / e-sign flow. It bundles the prompt copy, an accessible segmented [`OtpInput`](OtpInput.md), inline validation messaging, a masked card preview, and a primary submit button into one panel.

This is the **dialog panel only**. It does **not** render a backdrop, manage focus-trapping, or portal itself. You render it inside your own modal/overlay container.

## When to use

- Requesting the last 4 digits of an Aadhaar number before sending an OTP.
- Any short fixed-length numeric verification step that wants the same visual treatment (set `length`, `prompt`, `label`, and hide the card).

## When NOT to use

- You only need the raw digit boxes without the dialog chrome → use [`OtpInput`](OtpInput.md).
- You need a generic OTP entry dialog (not Aadhaar-specific) → use [`OtpDialog`](OtpDialog.md).
- You need a yes/no confirmation → use [`ConfirmationPopup`](ConfirmationPopup.md).

## States

`state` drives the digit-box border colour and an inline message banner:

| `state`   | Boxes        | Banner                                              |
| --------- | ------------ | --------------------------------------------------- |
| `default` | grey         | none                                                |
| `error`   | red          | `role="alert"`, red banner, default "Incorrect number!" |
| `success` | green        | `role="status"`, green banner, default "Verified successfully" |

The digit value can be **controlled** (`value` + `onChange`) or **uncontrolled** (`defaultValue`). Non-numeric characters are stripped and the value is clamped to `length`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `ReactNode` | `"Aadhaar E - Sign"` | Header title. |
| `headerIcon` | `ReactNode \| null` | pen glyph | Header leading icon; `null` hides it. |
| `prompt` | `ReactNode` | `"Enter the last 4 digits of your Aadhaar ID"` | Body prompt. |
| `label` | `ReactNode` | `"Aadhaar ID number **** **** ****"` | Label above the boxes. |
| `length` | `number` | `4` | Number of digit boxes. |
| `value` | `string` | — | Controlled digit value (pair with `onChange`). |
| `defaultValue` | `string` | `""` | Uncontrolled initial value. |
| `onChange` | `(value: string) => void` | — | Fires with the next digit string on every change. |
| `state` | `"default" \| "error" \| "success"` | `"default"` | Box colour + message banner. |
| `errorMessage` | `ReactNode` | sensible default | Error banner content. |
| `successMessage` | `ReactNode` | sensible default | Success banner content. |
| `onSubmit` | `(value: string) => void` | — | "Send OTP" handler; receives current digits. |
| `submitLabel` | `ReactNode` | `"Send OTP"` | Submit button label. |
| `submitting` | `boolean` | `false` | Spinner on the submit button + disables it. |
| `requireComplete` | `boolean` | `false` | Disable submit until all boxes are filled. |
| `onClose` | `() => void` | — | Close (X) handler. **Omit to hide the X.** |
| `closeLabel` | `string` | `"Close"` | Accessible name for the X. |
| `cardImageSrc` | `string` | — | `<img>` src for the card preview. |
| `cardPreview` | `ReactNode \| null` | built-in card | Full override of the card slot; `null` hides it. Wins over `cardImageSrc`. |
| `cardLastFour` | `string` | `"8888"` | Digits highlighted on the built-in card. |
| `disabled` | `boolean` | `false` | Disables inputs + submit. |
| `className` | `string` | — | Merged onto the panel. |

All other native `<div>` props (`id`, `data-*`, `aria-*`, `ref`) are forwarded. `data-state` reflects the current `state`. `title`, `onChange`, and `onSubmit` are re-typed (not the native DOM versions).

### `AadhaarCardPreview` props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `lastFour` | `string` | `"8888"` | Digits highlighted in the bottom-right circle. |
| `className` | `string` | — | Merged onto the card. |

The built-in card is fully token-drawn (no bundled image) and `aria-hidden`.

## Usage examples

### Uncontrolled (simplest)

```jsx
<AadhaarESign
  onClose={close}
  onSubmit={(digits) => sendOtp(digits)}
/>
```

### Controlled with validation

```jsx
const [digits, setDigits] = useState("");
const [state, setState] = useState("default");

<AadhaarESign
  value={digits}
  onChange={(next) => { setDigits(next); setState("default"); }}
  state={state}
  requireComplete
  submitting={loading}
  onClose={close}
  onSubmit={async (d) => {
    const ok = await verifyLastFour(d);
    setState(ok ? "success" : "error");
  }}
/>
```

### Rendered inside a modal container

```jsx
<div className="fixed inset-0 grid place-items-center bg-black/40 p-4">
  <AadhaarESign onClose={close} onSubmit={sendOtp} />
</div>
```

### Reused for a generic 6-digit code

```jsx
<AadhaarESign
  length={6}
  prompt="Enter the 6-digit OTP"
  label="OTP sent to your mobile"
  cardPreview={null}
/>
```

### Card preview options

```jsx
<AadhaarESign cardLastFour="8888" />               {/* built-in token card */}
<AadhaarESign cardImageSrc="/aadhaar-thumb.png" /> {/* your image          */}
<AadhaarESign cardPreview={<MyCard />} />           {/* full override        */}
<AadhaarESign cardPreview={null} />                 {/* no card              */}
```

## Best practices

- Reset `state` back to `"default"` inside `onChange` so the error/success banner clears as the user edits.
- Use `requireComplete` to keep "Send OTP" disabled until all digits are entered.
- Use `submitting` (not `disabled`) during the async request — it shows a spinner and blocks double submits.
- Render inside a centered modal container; the panel is `width: 100%` capped at 500px and its inner row wraps on narrow widths.

## Common mistakes

- **Treating it as a full modal.** It has no backdrop or focus trap — wrap it yourself.
- **Forgetting `onClose`.** Omitting `onClose` hides the X button entirely (by design); pass it if you want a close affordance.
- **Setting `disabled` during submit.** Prefer `submitting`, which both disables and shows the spinner.
- **Passing formatted digits to `value`.** Spaces/dashes are stripped anyway; pass the raw digit string.

## Accessibility

- Panel is `role="dialog"` labelled by its header title (`aria-labelledby`).
- Each digit box is a real `<input inputMode="numeric">` with a per-box `aria-label`; the group carries the field label.
- Error banner is `role="alert"` (assertive); success banner is `role="status"` (polite).
- Close button has an accessible name (`closeLabel`) and a visible focus ring.
- Card preview and icons are `aria-hidden`.

## Related components

- [`OtpInput`](OtpInput.md) — the segmented digit input used inside.
- [`OtpDialog`](OtpDialog.md) — generic OTP-entry dialog.
- [`Button`](Button.md) — the submit button.
- [`ConfirmationPopup`](ConfirmationPopup.md) — simpler confirm/cancel dialog panel.
