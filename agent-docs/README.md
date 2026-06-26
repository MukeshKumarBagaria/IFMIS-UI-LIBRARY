# @ifmis/ui — Agent Documentation

AI-agent-optimized reference for the IFMIS shared React UI library. One Markdown file per component, written so a coding agent (Claude, Cursor, Copilot, Windsurf) can use each component correctly **without reading its source**.

## How to read these docs

Each component file follows the same structure: a one-line summary, import, purpose, when to use / when NOT to use, variants/states, a full props table (types + defaults), usage examples, best practices, common mistakes, accessibility, and related components.

## Library-wide conventions

These hold across **every** component — they are not repeated in full in each file.

- **Install / import:** everything is a named export from the package root.
  ```jsx
  import { Button, TextField, Dropdown /* … */ } from "@ifmis/ui";
  import "@ifmis/ui/styles.css";   // required once at app root (fonts + tokens)
  ```
  Icons (sub-path): `import { … } from "@ifmis/ui/icons";` — components also accept any icon node from `@phosphor-icons/react`. See [Icons](Icons.md) for sizing/colour/weight conventions.
- **Plain JS/JSX works** — TypeScript is optional. Types are exported for autocomplete (e.g. `ButtonProps`).
- **Controlled vs uncontrolled:** stateful components support both. Controlled = the `value`/`checked`/`selected`/`page`/etc. prop + its `on*Change` callback; uncontrolled = the `default*` prop. This mirrors React conventions across the whole library.
- **`className` is merged**, not replaced, via the project's tailwind-merge (`cn`) — your classes win on conflict. `cn` is exported for your own composition.
- **Theming via tokens:** colours are CSS-variable design tokens, so swapping a theme repaints components with no code change. Wrap your app in `ThemeProvider` (`import { ThemeProvider, useTheme } from "@ifmis/ui"`); themes come from the exported `themes` registry (`Theme`, `getTheme`, `isTheme`, `DEFAULT_THEME`).
- **Interaction states are automatic:** hover / active / focus / disabled map to native pseudo-classes (`:hover`, `:active`, `:focus-visible`, `:disabled`) — you never pass them as props. The focus ring is keyboard-only (`:focus-visible`).
- **Icons are dynamic slots:** where a component takes an `icon` prop, **omit** = default, **`null`** = none, **a node** = custom (auto-sized + colour-inherited).
- **Dialog/popup components are panels, not overlays:** `AadhaarESign`, `OtpDialog`, `ConfirmationPopup` render `role="dialog"`/`alertdialog` panels with no backdrop or focus trap — wrap them in your own modal container.
- **Cards/fields are `width: 100%`:** size them via the parent container (grid / flex / max-width).
- **Accessibility is built in:** real semantic elements, ARIA wiring, keyboard support, visible focus rings. For icon-only controls, pass an `aria-label`.

## Foundations
- [Colors](Colors.md) — full colour token reference (brand ramps, theme palettes, semantic tokens, gradients, StatCard tints, theming).
- [Icons](Icons.md) — Phosphor Icons usage: import paths, sizing/colour patterns, weight conventions.

## Components

### Actions & buttons
- [Button](Button.md) — base button (variants, sizes, loading, `asChild`).
- [FormButton](FormButton.md) — preset form CTAs (Submit/Save/Reject…) + base.
- [CtaTray](CtaTray.md) — sticky form action bar (auto-tints to the clicked tone).
- [SelectionPill](SelectionPill.md) — toggleable selection chip.
- [Toggle](Toggle.md) — on/off switch.

### Form fields
- [FormField](FormField.md) — shared label/error/helper shell + ARIA wiring.
- [TextField](TextField.md) — labelled single-line input.
- [Textarea](Textarea.md) — labelled multi-line input + counter.
- [Dropdown](Dropdown.md) — single/multi select with search, chips, preview.
- [SearchField](SearchField.md) — search input with autocomplete + collapsible.
- [Checkbox](Checkbox.md) — checkbox (incl. indeterminate).
- [CheckboxCard](CheckboxCard.md) — card-style selectable checkbox.
- [Label](Label.md) — standalone form label.
- [OtpInput](OtpInput.md) — segmented OTP/PIN code input.

### Dialogs & verification
- [ConfirmationPopup](ConfirmationPopup.md) — "Are you sure?" confirm/cancel panel.
- [OtpDialog](OtpDialog.md) — E-Sign OTP entry dialog (resend countdown).
- [AadhaarESign](AadhaarESign.md) — Aadhaar last-4 e-sign dialog.

### Cards & status
- [ActionCard](ActionCard.md) — status-tinted card with actions.
- [StatCard](StatCard.md) — dashboard metric tile.
- [ProgressCard](ProgressCard.md) — workflow-step status card.
- [ProgressStepper](ProgressStepper.md) — collapsible vertical workflow tracker.
- [ReferenceIdSuccessCard](ReferenceIdSuccessCard.md) — success card with copyable reference id.
- [Badge](Badge.md) — static status pill.
- [Banner](Banner.md) — inline notification.
- [HoverPill](HoverPill.md) — hover/focus tooltip pill.

### Navigation & layout
- [Header](Header.md) — app header (brand + actions, i18n-ready).
- [Sidebar](Sidebar.md) — primary navigation rail (modules + menu).
- [Breadcrumb](Breadcrumb.md) — page-trail chips.
- [PageTitle](PageTitle.md) — page heading band.
- [SectionTitle](SectionTitle.md) — section heading bar.
- [Accordion](Accordion.md) — collapsible form sections.

### Data & primitives
- [DataTable](DataTable.md) — sortable financial data grid.
- [Pagination](Pagination.md) — page navigator.
- [Scrollbar](Scrollbar.md) — horizontal scroll slider.
- [Upload](Upload.md) — file-upload field (controlled state machine).
- [Typography](Typography.md) — `Heading` & `Text`.
