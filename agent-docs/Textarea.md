# Textarea

> The multi-line counterpart to [`TextField`](TextField.md) — the same [`FormField`](FormField.md) shell and state styling, with a vertically-resizable `<textarea>` and an optional live character counter.

```jsx
import { Textarea } from "@ifmis/ui";
```

- **Type:** Form multi-line input. `ref` forwards to the `<textarea>`.
- **Types:** `TextareaProps`. (Uses `FieldState` for `state`.)

---

## Purpose

A multi-line text input with full field chrome (label, states, error/helper, counter). Same API and state model as `TextField`.

## When to use

- Remarks, notes, reasons, comments — any free-form multi-line text.
- Inputs needing a character counter / `maxLength`.

## When NOT to use

- Single-line text → use [`TextField`](TextField.md).
- A select → use [`Dropdown`](Dropdown.md).

## States

Same model as [`TextField`](TextField.md): `default`, `error` (red border + banner), `disabled`, `fetched` (read-only backend value). `error`/`disabled` inferred; hover/focus are native.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Field label. |
| `labelIcon` | `ReactNode` | — | 20px icon before the label. |
| `required` | `boolean` | `false` | Red asterisk + `aria-required`. |
| `error` | `ReactNode` | — | Reddens field + red banner (`role="alert"`) + `aria-invalid`. |
| `helperText` | `ReactNode` | — | Neutral subtext (hidden when `error` set). |
| `state` | `"default" \| "error" \| "disabled" \| "fetched"` | `"default"` | Usually inferred; force for `fetched`. |
| `rows` | `number` | `4` | Visible text rows. |
| `showCount` | `boolean` | auto | Character counter (auto-on when `maxLength` is set). |
| `boxClassName` | `string` | — | Classes for the bordered box. |
| `textareaClassName` | `string` | — | Classes for the `<textarea>`. |
| `className` | `string` | — | Classes for the outer FormField wrapper. |

All native `<textarea>` attributes (`value`, `defaultValue`, `onChange`, `maxLength`, `name`, `placeholder`, `disabled`, `readOnly`, `ref`) are forwarded. Full-width; grows with `resize-y`.

## Usage examples

```jsx
<Textarea label="Remarks" placeholder="Add a note…" rows={5} />

{/* counter turns on automatically with maxLength */}
<Textarea label="Reason" maxLength={250} required />

<Textarea label="Comment" error="This field is required" />
<Textarea label="Notes" helperText="Visible only to reviewers." />
<Textarea label="Imported" value="…" state="fetched" readOnly />
```

## Best practices

- Size with `rows`, then let users drag to resize (`resize-y` is built in).
- Pair `maxLength` with the counter so users see remaining room.
- Use `fetched` for imported/read-only long text; `disabled` for "not editable here".

## Common mistakes

- **Using it for single-line input** — use [`TextField`](TextField.md).
- **Expecting the counter without `maxLength` or `showCount`** — it's off by default unless one is set.

## Accessibility

- Label ↔ textarea linked via `htmlFor`/`id`.
- `error` sets `aria-invalid` and a `role="alert"` banner tied via `aria-describedby`; helper text is described the same way.

## Related components

- [`TextField`](TextField.md) — single-line input.
- [`FormField`](FormField.md) — the field shell it composes.
