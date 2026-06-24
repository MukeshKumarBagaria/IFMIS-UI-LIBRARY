# OtpDialog

> The **E-Sign OTP** entry **dialog panel**: a purple header (info + title + close), a body (heading, the masked contacts the code was sent to, a code input, error/success banner), and a footer with a **resend countdown**, a **Back** button, and **Resend OTP**. Builds on [`OtpInput`](OtpInput.md).

```jsx
import { OtpDialog } from "@ifmis/ui";
```

- **Type:** Dialog panel (`<div role="dialog">`). Not an overlay itself.
- **Types:** `OtpDialogProps`, `OtpDialogState` (`"default" | "error" | "success"`).

---

## Purpose

A complete OTP-verification panel with a managed resend timer. The richer sibling of [`AadhaarESign`](AadhaarESign.md); both share the [`OtpInput`](OtpInput.md) primitive.

This is the **panel only** — no backdrop or focus trap. Render it inside your own modal/overlay.

## When to use

- Verifying a one-time code sent to phone/email, with a resend flow.
- Any OTP step needing the contacts list + countdown + Back/Resend footer.

## When NOT to use

- Aadhaar last-4 entry → use [`AadhaarESign`](AadhaarESign.md).
- Just the digit boxes → use [`OtpInput`](OtpInput.md).
- A yes/no confirm → use [`ConfirmationPopup`](ConfirmationPopup.md).

## The resend countdown

The footer timer is managed internally from `resendDelay` (default 30s). **Resend OTP** is disabled while it counts down and enables at 0; clicking it fires `onResend` and **restarts** the timer. For full control, pass `secondsRemaining` and tick it yourself.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `ReactNode` | `"E - Sign"` | Header title. |
| `headerIcon` | `ReactNode \| null` | info badge | Header glyph; `null` hides it. |
| `heading` | `ReactNode` | `"Enter OTP"` | Body heading. |
| `description` | `ReactNode` | 6-digit prompt | Text above the contact list. |
| `contacts` | `ReactNode[] \| null` | sample 2 | Masked destinations (bullet list); `[]`/`null` hides the box. |
| `length` | `number` | `6` | Number of code boxes. |
| `value` | `string` | — | Controlled code. Pair with `onChange`. |
| `defaultValue` | `string` | — | Uncontrolled initial code. |
| `onChange` | `(value: string) => void` | — | Fires on every change. |
| `onComplete` | `(value: string) => void` | — | Fires once when all boxes fill. |
| `state` | `"default" \| "error" \| "success"` | `"default"` | Boxes + banner. |
| `errorMessage` | `ReactNode` | sensible | Error banner copy. |
| `successMessage` | `ReactNode` | sensible | Success banner copy. |
| `resendDelay` | `number` | `30` | Internal countdown start (seconds). |
| `secondsRemaining` | `number` | — | Controlled timer override. |
| `onResend` | `() => void` | — | Resend handler; restarts the internal timer. |
| `resendLabel` | `ReactNode` | `"Resend OTP"` | Resend button label. |
| `resendDisabled` | `boolean` | `false` | Force-disable resend (on top of countdown). |
| `formatResendText` | `(seconds: number) => ReactNode` | "You can resend…" | Footer text builder. |
| `showBack` | `boolean` | `true` | Show the Back button. |
| `backLabel` | `ReactNode` | `"Back"` | Back button label. |
| `onBack` | `() => void` | — | Back handler. |
| `onClose` | `() => void` | — | X handler. **Omit to hide the X.** |
| `closeLabel` | `string` | `"Close"` | Accessible name for the X. |
| `disabled` | `boolean` | `false` | Disable inputs + actions. |
| `className` | `string` | — | Merged onto the panel. |

All other native `<div>` props are forwarded; `data-state` reflects the state. The panel is `width: 100%` capped at 550px.

## Usage examples

### Uncontrolled with internal 30s timer

```jsx
<OtpDialog
  contacts={["*******789", "ad******@gmail.com"]}
  onComplete={(code) => verify(code)}
  onResend={() => resend()}
  onBack={goBack}
  onClose={close}
/>
```

### Controlled value + state

```jsx
const [code, setCode] = useState("");
const [state, setState] = useState("default");

<OtpDialog
  contacts={["*******789", "ad******@gmail.com"]}
  value={code}
  onChange={(v) => { setCode(v); setState("default"); }}  // clear error as they fix it
  state={state}
  onComplete={async (c) => setState((await verify(c)) ? "success" : "error")}
  onResend={() => { setCode(""); api.resendOtp(); }}
  onBack={() => router.back()}
  onClose={() => modal.close()}
/>
```

### Controlled timer

```jsx
const [left, setLeft] = useState(30);
useEffect(() => {
  const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
  return () => clearInterval(t);
}, []);

<OtpDialog secondsRemaining={left} onResend={() => { resend(); setLeft(30); }} />
```

### Reused for a 4-digit phone code

```jsx
<OtpDialog
  title="Verify phone"
  heading="Enter code"
  description="We texted a 4-digit code to:"
  contacts={["+91 ******789"]}
  length={4}
  showBack={false}
  resendLabel="Send again"
/>
```

### Inside a modal overlay

```jsx
<div className="fixed inset-0 grid place-items-center bg-black/40 p-4">
  <OtpDialog {...props} />
</div>
```

## Best practices

- **Mask PII before passing `contacts`** — the component renders the strings as-is.
- Clear the `error` state inside `onChange` so the banner clears as the user edits.
- Use `onComplete` to auto-verify once all digits are entered.
- For a server-dictated timer, use `secondsRemaining`; otherwise let the internal timer handle it (it restarts on resend).

## Common mistakes

- **Treating it as a full modal** — it has no backdrop or focus trap; wrap it yourself.
- **Passing unmasked phone/email to `contacts`** — mask first.
- **Expecting Resend to be enabled immediately** — it's disabled during the countdown.
- **Omitting `onClose` but expecting an X** — omitting `onClose` hides the X (by design).

## Accessibility

- `role="dialog"` labelled by the header title.
- The code input is a labelled group of numeric inputs (see [`OtpInput`](OtpInput.md)).
- Error banner is `role="alert"`; success banner is `role="status"`.
- Back/Resend/Close are real buttons with focus rings; Resend's disabled state during countdown is conveyed natively.

## Related components

- [`OtpInput`](OtpInput.md) — the segmented code input used inside.
- [`AadhaarESign`](AadhaarESign.md) — Aadhaar last-4 sibling dialog.
- [`Button`](Button.md) — the footer buttons.
- [`ConfirmationPopup`](ConfirmationPopup.md) — simpler confirm dialog.
