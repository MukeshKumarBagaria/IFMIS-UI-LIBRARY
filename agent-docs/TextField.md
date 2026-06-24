# TextField

> The IFMIS **labelled text input** — a label (with optional icon + required marker), a bordered control that can hold a leading icon, the `<input>`, and trailing content, plus helper/error subtext. Built on [`FormField`](FormField.md), so label/error/input are correctly wired for AT.

```jsx
import { TextField } from "@ifmis/ui";
```

- **Type:** Form text input. `ref` forwards to the `<input>`.
- **Types:** `TextFieldProps`. (Uses `FieldState` from FormField for `state`.)

---

## Purpose

A single-line text input with the full design-system field chrome (label, states, affixes, error/helper). A thin layer over a native `<input>`, so all native attributes flow through.

## When to use

- Any single-line text/email/tel/number input in a form.
- Inputs needing a leading icon, a trailing affix (e.g. calendar), or a read-only "fetched" value.

## When NOT to use

- Multi-line text → use [`Textarea`](Textarea.md).
- A select → use [`Dropdown`](Dropdown.md).
- A search box with suggestions → use [`SearchField`](SearchField.md).
- A custom control needing only the field chrome → use [`FormField`](FormField.md) directly.

## States

| State | Look | How to trigger |
| --- | --- | --- |
| `default` | grey border; hover neutral-100; focus 1.5px purple | — |
| `fetched` | grey border, neutral-200 fill (read-only backend value) | `state="fetched"` |
| `disabled` | grey-200 border, grey-bg | `disabled` |
| `error` | red-600 border + red subtext banner | `error="…"` |

`error` and `disabled` are inferred (error wins, then disabled); hover/focus are native pseudo-states.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Field label (wired to the input). |
| `labelIcon` | `ReactNode` | — | 20px icon before the label. |
| `required` | `boolean` | `false` | Red asterisk + `aria-required`. |
| `error` | `ReactNode` | — | Reddens field + red banner (`role="alert"`) + `aria-invalid`. |
| `helperText` | `ReactNode` | — | Neutral subtext (hidden when `error` set). |
| `state` | `"default" \| "error" \| "disabled" \| "fetched"` | `"default"` | `error`/`disabled` usually inferred; force here for `fetched`. |
| `startIcon` | `ReactNode` | — | Inline leading icon inside the box (20px, muted). |
| `endContent` | `ReactNode` | — | Trailing content (e.g. `FieldIconBox`, clear button). |
| `boxClassName` | `string` | — | Classes for the bordered box. |
| `inputClassName` | `string` | — | Classes for the `<input>`. |
| `className` | `string` | — | Classes for the outer FormField wrapper. |

All native `<input>` attributes (`type`, `value`, `defaultValue`, `onChange`, `name`, `placeholder`, `disabled`, `readOnly`, `inputMode`, `ref`) are forwarded. The field is `width: 100%`.

## Usage examples

### Basics

```jsx
<TextField label="Full name" placeholder="Enter name" />
<TextField label="PAN number" required />
```

### Error / helper

```jsx
<TextField label="Email" error="Enter a valid email address" />
<TextField label="Username" helperText="3–20 characters, letters and digits." />
```

### Icons & affixes

```jsx
import { User, CalendarDots, CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import { TextField, FieldIconBox } from "@ifmis/ui";

<TextField label="Full name" labelIcon={<User />} />
<TextField label="Search" startIcon={<MagnifyingGlass />} />
<TextField
  label="Date of birth"
  placeholder="DD/MM/YYYY"
  endContent={<FieldIconBox><CalendarDots /><CaretDown /></FieldIconBox>}
/>
```

### Fetched (read-only backend value)

```jsx
<TextField label="GRN (auto-filled)" state="fetched" value="GRN-2026-0042" readOnly />
```

### Controlled / uncontrolled

```jsx
<TextField label="Name" defaultValue="Amit" />

const [v, setV] = useState("");
<TextField label="Name" value={v} onChange={(e) => setV(e.target.value)} />
```

## Best practices

- **Always pass a `label`** (wired to the input via `htmlFor`/`id`).
- Clear `error` as the user fixes the value so the red state doesn't linger.
- Use `state="fetched"` (not `disabled`) for server-filled read-only values — `disabled` means "you can't act here", `fetched` means "this came from data".
- Set the right `type`/`inputMode` (`email`, `tel`, `number`) so mobile keyboards behave.

## Common mistakes

- **Using `disabled` for fetched data** — use `state="fetched"`.
- **Multi-line content** — use [`Textarea`](Textarea.md).
- **Conveying "required" only with the asterisk** — also set native `required` (the component sets `aria-required` when `required` is passed).

## Accessibility

- Label ↔ input linked via `htmlFor`/`id`; clicking the label focuses the field.
- `error` sets `aria-invalid` and the banner is `role="alert"`, tied via `aria-describedby`. Helper text is described the same way.
- `required` sets `aria-required`; pair with the native `required` attribute.
- Focus shows the purple active border + ring (`:focus-within`).

## Related components

- [`Textarea`](Textarea.md) — multi-line input.
- [`FormField`](FormField.md) — the field shell it composes.
- [`Dropdown`](Dropdown.md) / [`SearchField`](SearchField.md) — select / search inputs.
- [`Label`](Label.md) — standalone label.
