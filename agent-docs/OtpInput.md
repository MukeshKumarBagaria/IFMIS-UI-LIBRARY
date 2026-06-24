# OtpInput

> An accessible, segmented **code input** — a row of single-digit boxes for OTP / PIN / verification codes. Sequential left-to-right entry, keyboard + paste support, digits only. The shared primitive behind [`OtpDialog`](OtpDialog.md) and [`AadhaarESign`](AadhaarESign.md).

```jsx
import { OtpInput } from "@ifmis/ui";
```

- **Type:** Form input (segmented). Renders a `role="group"` of `<input inputMode="numeric">`.
- **Types:** `OtpInputProps`, `OtpInputState` (`"default" | "error" | "success"`).

---

## Purpose

Capture a fixed-length numeric code with the standard OTP UX. The value is always a clean prefix string (no gaps).

## When to use

- A standalone OTP/PIN/verification code field in any form.
- As the input inside a custom verification flow.

## When NOT to use

- The full E-Sign OTP dialog (header, contacts, resend) → use [`OtpDialog`](OtpDialog.md).
- Aadhaar last-4 dialog → use [`AadhaarESign`](AadhaarESign.md).
- General single-line text → use [`TextField`](TextField.md).

## Behaviour

- **Sequential entry** — digits fill left-to-right; deletions step back.
- **Keyboard** — typing advances; Backspace removes + steps back; ←/→ move.
- **Paste** — distributes pasted digits across the boxes.
- **Digits only**, with `inputMode="numeric"` (mobile number pad) and `autocomplete="one-time-code"` (iOS SMS autofill).
- `onComplete` fires once when the last empty box is filled.

## States

`default` (grey), `error` (red border), `success` (green border). `state` is visual only — convey the error/success text next to the field.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `length` | `number` | `6` | Number of boxes. |
| `value` | `string` | — | Controlled value. Pair with `onChange`. |
| `defaultValue` | `string` | `""` | Uncontrolled initial value. |
| `onChange` | `(next: string) => void` | — | Fires on every change. |
| `onComplete` | `(value: string) => void` | — | Fires once when all boxes fill. |
| `state` | `"default" \| "error" \| "success"` | `"default"` | Box border colour. |
| `disabled` | `boolean` | `false` | Disable all boxes. |
| `autoFocus` | `boolean` | `false` | Focus the first box on mount. |
| `aria-label` | `string` | `"Verification code"` | Group name (+ per-box labels derive from it). |
| `id` | `string` | — | Applied to the first box (for an external `<label htmlFor>`). |
| `className` | `string` | — | On the group wrapper. |

## Usage examples

### Basic

```jsx
<OtpInput length={6} onComplete={(code) => verify(code)} />
```

### Controlled with auto-submit + error reset

```jsx
const [code, setCode] = useState("");
const [state, setState] = useState("default");

<OtpInput
  value={code}
  onChange={(v) => { setCode(v); setState("default"); }}
  state={state}
  onComplete={async (c) => setState((await verify(c)) ? "success" : "error")}
/>
```

### States

```jsx
<OtpInput state="error" defaultValue="245143" />
<OtpInput state="success" defaultValue="245143" />
```

## Best practices

- Pair `onComplete` with auto-submit, but still provide an explicit submit button for accessibility.
- Reset `state` to `"default"` on the next edit so the error border clears as the user corrects the code.
- Treat the code as transient — don't keep it in global state longer than needed.
- For a labelled field, set `id` + a `<label htmlFor>`, or pass `aria-label`.

## Common mistakes

- **Relying on `state` colour alone** — add visible error/success text (both dialogs do this with a banner).
- **Passing a formatted value** — non-digits are stripped; pass the raw digit string.

## Accessibility

- Boxes are real `<input inputMode="numeric">` in a `role="group"`; each gets a per-box `aria-label` ("…, digit 2 of 6").
- Fully keyboard-operable; visible focus ring on each box.

## Related components

- [`OtpDialog`](OtpDialog.md) — full OTP entry dialog (uses OtpInput).
- [`AadhaarESign`](AadhaarESign.md) — Aadhaar last-4 dialog (uses OtpInput).
- [`TextField`](TextField.md) — general single-line text input.
