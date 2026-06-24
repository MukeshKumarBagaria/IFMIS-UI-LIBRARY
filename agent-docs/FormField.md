# FormField

> The shared **shell** behind every IFMIS form control: an optional label (with icon + required marker), a control slot, and an optional subtext (neutral helper line or a red error banner). It owns the id + ARIA wiring tying label, control, and subtext together.

```jsx
import { FormField, FieldIconBox, fieldStateClasses } from "@ifmis/ui";
```

- **Type:** Field wrapper / layout shell (`<div>`).
- **Types:** `FormFieldProps`, `FormFieldRenderProps`, `FieldIconBoxProps`, `FieldState` (`"default" | "error" | "disabled" | "fetched"`).
- Also exports `FieldIconBox` (boxed trailing affix) and `fieldStateClasses` (shared control border/background classes).

---

## Purpose

Give any form control the same label/error/helper chrome and correct accessibility wiring. [`TextField`](TextField.md), [`Textarea`](Textarea.md), and [`Dropdown`](Dropdown.md) are built on it. Use it directly to wrap a custom control (a date picker, a third-party select, etc.).

## When to use

- Wrapping a **custom** control so it gets the standard label + error + helper layout and ARIA wiring.
- Building a new field component on top of the design system.

## When NOT to use

- A plain text input → use [`TextField`](TextField.md) (already built on FormField).
- A multi-line input → use [`Textarea`](Textarea.md).
- A select → use [`Dropdown`](Dropdown.md).
- Just a standalone label → use [`Label`](Label.md).

## How the render-prop wiring works

Pass a **render function** as `children`. It receives `{ id, describedBy, invalid }` to spread onto your control:

- `id` → put on the control (ties it to the `<label htmlFor>`).
- `describedBy` → the subtext id, for the control's `aria-describedby` (present only when helper/error shown).
- `invalid` → `true` when `error` is set, for `aria-invalid`.

You may also pass a plain node as `children` if you don't need the wiring.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Field label. |
| `labelIcon` | `ReactNode` | — | Icon before the label (auto-sized to 20px). |
| `required` | `boolean` | — | Appends a red asterisk (decorative). |
| `error` | `ReactNode` | — | Red banner (`role="alert"`) + flips `invalid`. Takes precedence over `helperText`. |
| `helperText` | `ReactNode` | — | Neutral subtext (shown only when no `error`). |
| `htmlFor` | `string` | auto-generated | Explicit control id. |
| `children` | `ReactNode \| (field: FormFieldRenderProps) => ReactNode` | — | The control, or a render function. |
| `className` | `string` | — | Merged onto the outer `<div>`. |

Other native `<div>` attributes are forwarded.

### `fieldStateClasses` (shared control styling)

| Key | Look |
| --- | --- |
| `default` | grey border; hover neutral-100; focus 1.5px purple |
| `error` | red-600 border |
| `disabled` | grey-200 border, grey-bg |
| `fetched` | grey border, neutral-200 fill (read-only fetched value) |

### `FieldIconBox`

A small boxed trailing affix (e.g. a date field's calendar + caret). Auto-sizes child icons to 16px and tints them. Accepts any `<span>` props.

## Usage examples

### Wrapping a custom control

```jsx
import { FormField } from "@ifmis/ui";

<FormField label="Country" required error={err} helperText="Pick your country.">
  {({ id, describedBy, invalid }) => (
    <MySelect id={id} aria-describedby={describedBy} aria-invalid={invalid} />
  )}
</FormField>
```

### Error vs helper

```jsx
<FormField label="Account" error="Account not found">…</FormField>
<FormField label="Account" helperText="11-digit number">…</FormField>
```

### Using the shared field styling for a bespoke box

```jsx
import { cn } from "@ifmis/ui";
import { FormField, fieldStateClasses, FieldIconBox } from "@ifmis/ui";

<div className={cn("h-11 rounded-2xl border px-3", fieldStateClasses.default)}>
  <input className="…" />
  <FieldIconBox><CalendarDots /><CaretDown /></FieldIconBox>
</div>
```

## Best practices

- Spread `id`, `aria-describedby`, and `aria-invalid` from the render-prop onto your control so AT associations are correct.
- Use `error` for validation messages (it renders `role="alert"`); use `helperText` for neutral hints. Don't set both expecting both to show — `error` wins.
- Reuse `fieldStateClasses` and `FieldIconBox` so custom fields match the built-in ones visually.

## Common mistakes

- **Not applying the render-prop `id`** — the label won't be associated with the control.
- **Conveying "required" only with the asterisk** — it's `aria-hidden`; also set `aria-required`/native `required` on the control.
- **Reinventing label/error layout** — wrap with `FormField` instead.

## Accessibility

- Generates a stable control id and points the `<label>` at it.
- Wires the subtext to the control via `aria-describedby`; errors render as `role="alert"`.
- The required asterisk is decorative (`aria-hidden`) — convey requirement on the control itself.

## Related components

- [`TextField`](TextField.md), [`Textarea`](Textarea.md), [`Dropdown`](Dropdown.md) — built on FormField.
- [`Label`](Label.md) — standalone label primitive.
- [`SearchField`](SearchField.md) — search input (uses field styling).
