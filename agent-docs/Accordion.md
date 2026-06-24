# Accordion

> The core **collapsible sectioning container** for IFMIS module screens. Long forms are broken into numbered, status-badged sections that expand/collapse. A compound component with a one-call convenience wrapper.

```jsx
import {
  Accordion,
  AccordionSection,      // one-call: header + body
  AccordionItem,         // primitive: section shell
  AccordionTrigger,      // primitive: standardized header
  AccordionPanel,        // primitive: collapsible body
} from "@ifmis/ui";
```

- **Type:** Compound component (context-based).
- **Types:** `AccordionProps`, `AccordionType` (`"single" | "multiple"`), `AccordionItemProps`, `AccordionTriggerProps`, `AccordionPanelProps`, `AccordionSectionProps`.

---

## Purpose

Render the standardized collapsible sections used across every IFMIS module. The header (number chip, title, status badges, open/close arrow) is fixed by the design system; the **panel body is yours** — drop in forms, tables, banners, subsections.

## When to use

- Breaking a long form or module screen into collapsible steps/sections.
- Wizards (`type="single"`) where one step shows at a time.
- Reference content the user may want several of open at once (`type="multiple"`).

## When NOT to use

- A single always-visible titled block → use [`SectionTitle`](SectionTitle.md) or [`ActionCard`](ActionCard.md).
- A horizontal step indicator → use [`ProgressStepper`](ProgressStepper.md).
- Don't **nest** accordions — use one `Accordion` per form with sibling sections.

## Composition

```
<Accordion>                       // owns open/close state + layout
  <AccordionSection>              // = Item + Trigger + Panel (90% case)
  — or —
  <AccordionItem>                 // section shell (card chrome)
    <AccordionTrigger />          // standardized header
    <AccordionPanel>…</AccordionPanel>  // collapsible body
  </AccordionItem>
</Accordion>
```

Parts must be rendered inside `<Accordion>` / `<AccordionItem>` or they throw.

## Open behaviour

- `type="single"` (default) — one section open at a time.
- `type="multiple"` — any number open.
- `collapsible` (single only, default `true`) — allow closing the open one. Set `false` to force one always open.
- Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`).
- `onValueChange` receives a **string** in `single` mode, a **string[]** in `multiple` mode.

## Props

### `Accordion` (root)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `type` | `"single" \| "multiple"` | `"single"` | Open behaviour. |
| `value` | `string \| string[]` | — | Controlled open value(s). |
| `defaultValue` | `string \| string[]` | — | Uncontrolled initial open value(s). |
| `onValueChange` | `(v: string \| string[]) => void` | — | Fires on open/close. |
| `collapsible` | `boolean` | `true` | `single` only — allow closing the open one. |
| `unmountOnCollapse` | `boolean` | `false` | Remove collapsed panels from the DOM (loses state). |
| `disabled` | `boolean` | `false` | Disable every section. |

Extends `HTMLAttributes<HTMLDivElement>` (minus `defaultValue`/`onChange`).

### `AccordionSection` / `AccordionTrigger`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | — | **Required**, unique id within the Accordion. |
| `title` | `ReactNode` | — | **Required.** Section title. |
| `number` | `ReactNode` | — | Ordinal shown in the leading white chip (e.g. `"01"`). |
| `badges` | `ReactNode` | — | `<Badge>` element(s) for status; auto-wrapped in the purple pill. |
| `as` | `"h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"h3"` | Heading tag — match your page outline. |
| `hideChevron` | `boolean` | `false` | Hide the open/close arrow. |
| `disabled` | `boolean` | `false` | Disable this section. |
| `children` | `ReactNode` | — | (Section only) Panel body. |
| `triggerClassName` / `panelClassName` | `string` | — | (Section only) Targeted style overrides. |

`AccordionPanel` is `HTMLAttributes<HTMLDivElement>`; pass `className` to override its `p-4` body padding.

## Usage examples

### Quickstart (uncontrolled, single)

```jsx
import { Accordion, AccordionSection, Badge } from "@ifmis/ui";

<Accordion defaultValue="s1">
  <AccordionSection
    value="s1"
    number="01"
    title="Account closure decision"
    badges={<Badge variant="success">Complete</Badge>}
  >
    {/* anything: forms, tables, SectionTitle, … */}
  </AccordionSection>

  <AccordionSection value="s2" number="02" title="Head of account mappings">
    …
  </AccordionSection>
</Accordion>
```

### Multiple open

```jsx
<Accordion type="multiple" defaultValue={["s1", "s2"]}>…</Accordion>
```

### Controlled (auto-advance on completion)

```jsx
const [open, setOpen] = useState("s1");
<Accordion value={open} onValueChange={setOpen}>…</Accordion>
```

### Several status badges

```jsx
badges={
  <>
    <Badge variant="success">Complete</Badge>
    <Badge variant="danger">2 errors</Badge>
  </>
}
```

### Primitives (custom header)

```jsx
<Accordion type="multiple">
  <AccordionItem value="a">
    <AccordionTrigger title="Custom" number="01" />
    <AccordionPanel>…</AccordionPanel>
  </AccordionItem>
</Accordion>
```

## Best practices

- **One Accordion per form** — don't nest; use sibling sections under one stack.
- **Keep panels mounted (default)** for form sections so field state and validation survive a collapse. Only set `unmountOnCollapse` for heavy non-form content.
- **Drive completion with `Badge`** in the header so users can scan what's done.
- Use `type="single"` for wizards, `type="multiple"` for reference content.
- Set `as` so sections land at the right heading level (typically `PageTitle` → h1, Accordion → h2/h3).
- Keep badge content **non-interactive** — the whole header is one button.

## Common mistakes

- **Nesting accordions** — use one stack of sections instead.
- **Expecting the Accordion to enforce completion.** Status is reflected (badge), not enforced — compute it in your form layer and feed it in; use controlled mode to gate progression.
- **Setting `unmountOnCollapse` on forms** — collapsed inputs lose their state.
- **Duplicate or missing `value`** — each section needs a unique `value`.
- **Putting buttons/links inside `badges`** — the header is a single button; interactive children break it.

## Accessibility

- WAI-ARIA Accordion pattern: heading wraps a single button with `aria-expanded` + `aria-controls`; the panel is `role="region"` labelled by its trigger.
- **Keyboard:** `Enter`/`Space` toggle; `↑`/`↓` move between headers; `Home`/`End` jump to first/last.
- Collapsed panels are set `inert` (not focusable, hidden from AT) even while mounted.
- Number chip and arrow are decorative (`aria-hidden`); badge text is announced.
- Height animation respects `prefers-reduced-motion`.

## Related components

- [`Badge`](Badge.md) — status badges in the header.
- [`SectionTitle`](SectionTitle.md) — titling within a panel.
- [`ProgressStepper`](ProgressStepper.md) — horizontal step indicator alternative.
- [`ActionCard`](ActionCard.md) — non-collapsible titled card.
