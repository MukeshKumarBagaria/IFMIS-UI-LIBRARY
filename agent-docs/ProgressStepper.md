# ProgressStepper

> A **collapsible vertical workflow tracker** — a purple header bar with a collapse toggle, a body with a coloured **dot rail** + dashed connectors and a stack of [`ProgressCard`](ProgressCard.md) steps, and an optional "View Details" footer button.

```jsx
import { ProgressStepper } from "@ifmis/ui";
```

- **Type:** Workflow tracker (`<div>` panel; the organism around `ProgressCard`).
- **Types:** `ProgressStepperProps`, `ProgressStep`, `ProgressStepStatus` (deprecated alias of `ProgressCardStatus`), `ProgressStepUser` (deprecated alias of `ProgressCardUser`).

---

## Purpose

Visualize a multi-step approval/workflow as a vertical rail of status cards. This component owns the panel shell, the dot rail + connectors, collapse behaviour, and the footer; the per-step rendering comes from [`ProgressCard`](ProgressCard.md).

## When to use

- Showing an application/record's workflow history (Creator → Verifier → Approver…).
- Any ordered series of status steps with timestamps, users, and remarks.

## When NOT to use

- A single status callout → use [`ProgressCard`](ProgressCard.md).
- A horizontal numbered step indicator for a wizard → consider [`Accordion`](Accordion.md) sections or a custom stepper.
- Page navigation breadcrumbs → use [`Breadcrumb`](Breadcrumb.md).

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `steps` | `ProgressStep[]` | — | **Required.** The workflow steps, in order. |
| `title` | `ReactNode` | `"Progress"` | Header title. |
| `collapsible` | `boolean` | `true` | Whether the header shows a toggle. |
| `defaultCollapsed` | `boolean` | `false` | Uncontrolled initial collapsed state. |
| `collapsed` | `boolean` | — | Controlled state; pair with `onCollapsedChange`. |
| `onCollapsedChange` | `(next: boolean) => void` | — | Fires on user toggle. |
| `collapseLabel` | `string` | state-dependent | Accessible name for the toggle. |
| `showViewDetails` | `boolean` | `false` | Render the footer button. |
| `viewDetailsLabel` | `ReactNode` | `"View Details"` | Footer button label. |
| `viewDetailsIcon` | `ReactNode \| null` | `ArrowCircleUpRight` | Footer trailing icon; `null` hides it. |
| `onViewDetails` | `() => void` | — | Footer button handler. |
| `className` | `string` | — | Merged onto the outer panel. |

All other native `<div>` props are forwarded. The panel is `width: 100%`.

### `ProgressStep` shape

Each step is `ProgressCardProps` plus an `id`:

```ts
{
  id?: string,                    // stable React key (recommended)
  label: ReactNode,               // e.g. "Creator"
  status: "success" | "pending" | "rejected" | "returned",
  badgeLabel?: ReactNode | null,  // override or null to hide
  badgeIcon?: ReactNode | null,
  timestamp?: ReactNode,
  user?: { name, role?, initials?, avatarSrc?, avatarAlt? },
  remarks?: ReactNode,
  remarksTitle?: ReactNode,       // default "Remarks"
}
```

See [`ProgressCard`](ProgressCard.md) for full field semantics.

## Usage examples

### Minimal

```jsx
<ProgressStepper
  steps={[
    { id: "creator",  label: "Creator",  status: "success",
      timestamp: "Submitted on 05 May 2026",
      user: { name: "Amit Mohan", role: "Employee" } },
    { id: "verifier", label: "Verifier", status: "pending",
      timestamp: "Received on 05 May 2026",
      user: { name: "Amit Mohan", role: "Employee" },
      remarks: "Need clarification on annexure B" },
    { id: "approver", label: "Approver", status: "rejected",
      timestamp: "Received on 05 May 2026",
      user: { name: "Amit Mohan", role: "Employee" },
      remarks: "Application doesn't meet eligibility" },
  ]}
  showViewDetails
  onViewDetails={() => router.push("/applications/123")}
/>
```

### Controlled collapse

```jsx
const [collapsed, setCollapsed] = useState(false);
<ProgressStepper steps={steps} collapsed={collapsed} onCollapsedChange={setCollapsed} />
```

### Variations

```jsx
<ProgressStepper steps={steps} defaultCollapsed />
<ProgressStepper steps={steps} collapsible={false} />            {/* always expanded, no toggle */}
<ProgressStepper steps={steps.map((s) => ({ ...s, badgeLabel: null }))} />  {/* hide all badges */}
```

## Best practices

- Provide a stable `id` per step for React keys.
- Use controlled collapse when the state must sync with surrounding UI (URL, another panel).
- Size via the parent (e.g. `w-[320px]` rail or fluid column).
- Per IFMIS convention, keep the Creator step `success` or `pending`, never `rejected` (not enforced).

## Common mistakes

- **Omitting `id`** — falls back to index keys (fine but less stable on reorder).
- **Expecting it to enforce workflow rules** — it only renders the data you pass.
- **Using it for a single event** — that's [`ProgressCard`](ProgressCard.md).

## Accessibility

- The toggle is a real `<button>` with `aria-expanded`, `aria-controls`, and a state-aware `aria-label`.
- The body uses the `hidden` attribute when collapsed, so AT doesn't see hidden content.
- Clock, dot, and connector decorations are `aria-hidden`.
- The footer button inherits the design system's focus ring.

## Related components

- [`ProgressCard`](ProgressCard.md) — the step atom it renders.
- [`Button`](Button.md) — the footer "View Details" button.
- [`Badge`](Badge.md) — status pills used in step badges.
