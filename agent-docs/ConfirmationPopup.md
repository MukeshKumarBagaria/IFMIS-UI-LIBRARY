# ConfirmationPopup

> A compact **"Are you sure?"** confirmation **panel** for destructive or irreversible flows. A 400px card with a peach→white gradient, a circular icon, a one-line prompt, and a paired No/Yes action row. Everything visible is overridable.

```jsx
import { ConfirmationPopup } from "@ifmis/ui";
```

- **Type:** Confirmation panel (`<div role="alertdialog">`). Not an overlay itself.
- **Types:** `ConfirmationPopupProps`.

---

## Purpose

Ask the user to confirm an action before it happens — delete, discard, submit-for-approval. The defaults match the Figma frame exactly (orange brand palette, Info icon, "Are you sure of this action?").

This is the **panel only** — it has no backdrop/focus-trap. Render it inside your own modal/overlay container.

## When to use

- Confirming a destructive or irreversible operation.
- Any simple yes/no decision before proceeding.

## When NOT to use

- An Aadhaar/OTP entry step → use [`AadhaarESign`](AadhaarESign.md) / [`OtpDialog`](OtpDialog.md).
- A persistent in-page status message → use [`Banner`](Banner.md).
- A card with richer content/actions → use [`ActionCard`](ActionCard.md).

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `ReactNode` | `"Are you sure of this action?"` | One-line prompt; also the dialog's accessible name. |
| `icon` | `ReactNode \| null` | default Info glyph | Omit = default (filled Info, 60×60); `null` = none; node = custom (size/colour it yourself). |
| `iconColorClassName` | `string` | `"text-orange-600"` | Recolours the **default** icon. Ignored when `icon` is a node. |
| `confirmLabel` | `ReactNode` | `"Yes"` | Confirm button label. |
| `cancelLabel` | `ReactNode` | `"No"` | Cancel button label. |
| `onConfirm` | `() => void` | — | Confirm handler. |
| `onCancel` | `() => void` | — | Cancel handler. |
| `confirmButtonClassName` | `string` | — | Merged onto the confirm button. |
| `cancelButtonClassName` | `string` | — | Merged onto the cancel button. |
| `disabled` | `boolean` | `false` | Disables both buttons. |
| `className` | `string` | — | Merged onto the outer panel. |

All other native `<div>` props are forwarded.

## Usage examples

### Default

```jsx
<ConfirmationPopup onConfirm={() => submit()} onCancel={() => close()} />
```

### Destructive copy + recoloured icon

```jsx
<ConfirmationPopup
  title="Discard this draft?"
  confirmLabel="Discard"
  cancelLabel="Keep editing"
  iconColorClassName="text-red-600"
  onConfirm={discard}
  onCancel={close}
/>
```

### Custom icon + recoloured buttons

```jsx
import { Trash } from "@phosphor-icons/react";

<ConfirmationPopup
  title="Permanently delete this user?"
  confirmLabel="Delete"
  icon={<Trash size={60} weight="fill" className="text-red-600" />}
  cancelButtonClassName="border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100"
  confirmButtonClassName="bg-red-600 hover:bg-red-700 active:bg-red-800"
  onConfirm={remove}
/>
```

### Async confirm (disable while in flight)

```jsx
const [busy, setBusy] = useState(false);

<ConfirmationPopup
  disabled={busy}
  onConfirm={async () => {
    setBusy(true);
    try { await api.deleteUser(id); modal.close(); }
    finally { setBusy(false); }
  }}
  onCancel={modal.close}
/>
```

### Inside a modal overlay

```jsx
{open && (
  <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
    <ConfirmationPopup
      onConfirm={() => { confirm(); setOpen(false); }}
      onCancel={() => setOpen(false)}
    />
  </div>
)}
```

## Best practices

- When recolouring the base button palette, also override the `hover:`/`active:`/`focus-visible:` classes so interaction feedback stays correct.
- Disable both buttons (`disabled`) during async confirms to prevent double submits.
- Keep the prompt to one short line; use a clear verb in `confirmLabel` ("Delete", "Discard") rather than just "Yes" for destructive actions.

## Common mistakes

- **Treating it as a full modal** — it has no backdrop or focus trap; wrap it yourself.
- **Using `iconColorClassName` with a custom `icon` node** — it's ignored; colour your node directly.
- **Custom icon conveying meaning beyond the title without a label** — label it yourself (the default Info glyph is `aria-hidden`).

## Accessibility

- `role="alertdialog"` (more urgent than a plain dialog), labelled by the title via `aria-labelledby`.
- Both actions are real `<button type="button">` with keyboard focus rings.
- `disabled` is forwarded natively to both buttons.
- Default Info glyph is `aria-hidden`.

## Related components

- [`Button`](Button.md) — the standard button primitive.
- [`Banner`](Banner.md) — persistent in-page messaging.
- [`ActionCard`](ActionCard.md) — richer status card with actions.
- [`OtpDialog`](OtpDialog.md) / [`AadhaarESign`](AadhaarESign.md) — verification dialogs.
