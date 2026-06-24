# Typography (Heading & Text)

> The IFMIS typography system — the single source of visual truth for all text. Two components: `Heading` (H1–H6) and `Text` (body copy in sizes × weights × colours). Mirrors the Figma scale 1:1. **Never set `font-size`/`font-weight`/`line-height`/text `color` manually** — always use these.

```jsx
import { Heading, headingVariants, Text, textVariants } from "@ifmis/ui";
```

- **Type:** Typography primitives (polymorphic via `as`).
- **Types:** `HeadingProps`, `TextProps`.
- `headingVariants` / `textVariants` are the exported CVA class generators.

---

## Purpose

Render every heading with `Heading` and every body string with `Text`, so font, size, weight, colour, and line-height stay consistent and themeable across the product. `as` decouples the rendered tag (semantics) from the visual level (appearance).

## When to use

- `Heading` — any page/section/card title.
- `Text` — any paragraph, label, helper line, caption, or inline span.

## When NOT to use

- Raw `<h1>`/`<p>`/`<span>` with hand-rolled Tailwind text classes (breaks consistency).
- A form field label tied to an input → use [`Label`](Label.md) (or `Text as="label"`).
- A page-title band → use [`PageTitle`](PageTitle.md); a section bar → [`SectionTitle`](SectionTitle.md).

## `Heading` props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Visual size (`text-h1`…`text-h6`; SemiBold, line-height 100%). |
| `as` | `ElementType` | `h{level}` | Rendered tag — decouple semantics from appearance. |
| `align` | `"left" \| "center" \| "right"` | `"left"` | Text alignment. |
| `className` | `string` | — | Merged onto the element. |
| `children` | `ReactNode` | — | The heading text. |

Sizes: H1=32, H2=24, H3=20, H4=18, H5=16, H6=14px.

## `Text` props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"sm"` | 14 / 16 / 18 / 20px (line-height 1.5). |
| `weight` | `"regular" \| "medium" \| "semibold"` | `"regular"` | 400 / 500 / 600. |
| `color` | `"primary" \| "secondary" \| "muted" \| "inherit"` | `"primary"` | `inherit` keeps the surrounding colour. |
| `align` | `"left" \| "center" \| "right"` | `"left"` | Text alignment. |
| `truncate` | `boolean` | `false` | Single-line ellipsis overflow. |
| `as` | `ElementType` | `"p"` | Use `"span"` inline, `"label"` for fields. |
| `className` | `string` | — | Merged onto the element. |
| `children` | `ReactNode` | — | The body copy. |

Both forward all native attributes of their rendered element (`id`, `aria-*`, `data-*`, `ref`, event handlers).

## Which to use when

| You need… | Use |
| --- | --- |
| A page or section title | `<Heading level={1..6}>` |
| Default paragraph text | `<Text>` (16 regular) |
| A form/table label | `<Text size="xs" weight="medium">` |
| A card title (not page-level) | `<Heading level={4}>` |
| Helper/hint under a field | `<Text size="xs" color="secondary">` |
| A dashboard stat number | `<Heading level={2}>` |

## Usage examples

### Headings

```jsx
<Heading level={1}>Dashboard</Heading>
<Heading level={2}>Active Beneficiaries</Heading>
{/* Looks like H4, semantically an h2 (e.g. inside an accordion) */}
<Heading level={4} as="h2">Section title</Heading>
```

### Body text

```jsx
<Text>Default — size sm, weight regular, color primary</Text>
<Text size="md" weight="medium">Larger label</Text>
<Text size="xs" color="secondary">Helper text under a field</Text>
<Text as="label" size="xs" weight="medium" htmlFor="email">Email address</Text>
<Text as="span" weight="semibold">inline emphasis</Text>
```

### Responsive heading (visual size only)

```jsx
{/* keep the semantic level correct via `as`, vary the visual size by breakpoint */}
<Heading as="h1" className="text-h3 md:text-h1">Dashboard</Heading>
```

## Best practices

- Use semantic heading levels in document order (H1 → H2 → H3); pick `level` for looks and `as` for the correct tag — never skip levels for sizing.
- Exactly one `<h1>` per page.
- Use `color="secondary"` for supporting info; `color="inherit"` inside coloured surfaces (e.g. a badge).
- For long-form copy, constrain the measure (`className="max-w-prose"`) instead of changing size.

## Common mistakes

- **Hand-rolling text styles** (`text-3xl font-bold text-gray-700`) — use these components.
- **Skipping heading levels for visual reasons** — use `as` to fix the outline.
- **Hardcoding hex text colours** — use the `color` prop / tokens.
- **Using a heading tag for non-heading emphasis** — use `<Text as="span" weight="semibold">`.

## Accessibility

- Keep the `h1`→`h6` outline logical (screen readers navigate by it); set `as` when visuals and semantics diverge.
- Exactly one `h1` per page.
- Colour is decorative — don't rely on `secondary`/`muted` alone to convey meaning; the tokens meet AA on white.

## Related components

- [`Label`](Label.md) — form-field label.
- [`PageTitle`](PageTitle.md) / [`SectionTitle`](SectionTitle.md) — title bands that compose `Heading`.
