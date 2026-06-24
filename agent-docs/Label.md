# Label

> An accessible **form-field label**. Pair it with a control via `htmlFor`/`id` so clicking it focuses the field and screen readers announce them together. Optional decorative required asterisk.

```jsx
import { Label } from "@ifmis/ui";
```

- **Type:** Form label (`<label>`).
- **Types:** `LabelProps` (extends all native `<label>` attributes).

---

## Purpose

A styled, accessible `<label>` for form fields that aren't built on [`FormField`](FormField.md) (which renders its own label). Use it when wiring up a bare input.

## When to use

- Labelling a standalone/native input or a custom control you're assembling by hand.

## When NOT to use

- A field already built on [`FormField`](FormField.md), [`TextField`](TextField.md), [`Textarea`](Textarea.md), or [`Dropdown`](Dropdown.md) — they render their own label via the `label` prop.
- A heading or section title → use [`PageTitle`](PageTitle.md) / [`SectionTitle`](SectionTitle.md) / [`Heading`](Typography.md).

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `required` | `boolean` | `false` | Appends a decorative (`aria-hidden`) red asterisk. |
| `children` | `ReactNode` | — | The label text. |
| `className` | `string` | — | Merged onto the `<label>`. |

All native `<label>` attributes (`htmlFor`, `id`, `onClick`, `ref`) are forwarded.

## Usage examples

### Basic

```jsx
<div className="flex flex-col gap-1.5">
  <Label htmlFor="email">Email address</Label>
  <input id="email" type="email" />
</div>
```

### Required

```jsx
<Label htmlFor="pan" required>PAN number</Label>
<input id="pan" required />
```

## Best practices

- **Always link `htmlFor` to the input's `id`** — an unassociated label is invisible to screen readers and doesn't grow the click target.
- Put `required` on **both** the `Label` (visual asterisk) and the native input (real validation + AT semantics).
- Don't use a placeholder as a label — placeholders vanish on input and fail accessibility.

## Common mistakes

- **Omitting `htmlFor`** — breaks the label↔control association.
- **Relying on the asterisk for semantics** — it's `aria-hidden`; set `required`/`aria-required` on the input too.
- **Using it inside `FormField`-based fields** — they already provide a label.

## Accessibility

- Renders a real `<label>` — associate it with `htmlFor={inputId}`.
- The required asterisk is `aria-hidden`; convey requirement on the input.
- For grouped controls (radio/checkbox sets), prefer `<fieldset>` + `<legend>`.

## Related components

- [`FormField`](FormField.md) — full field shell with built-in label/error/helper.
- [`TextField`](TextField.md), [`Textarea`](Textarea.md), [`Dropdown`](Dropdown.md) — fields with their own `label` prop.
