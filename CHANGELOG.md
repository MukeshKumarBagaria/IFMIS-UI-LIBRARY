# Changelog

All notable changes to `@ifmis/ui` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
See [PUBLISHING.md](./PUBLISHING.md) for the release process.

## [Unreleased]

## [0.2.0] — 2026-06-26

### Added

- **`ProgressTracker`** — the IFMIS workflow tracker: a stage bar (Creator →
  Verifier → Approver pills on a connector rail), a stage timeline (a dotted
  vertical list of every actor with status badge + timestamp), and an Activity
  Log panel (Remarks / Comments / Files tab switcher). Works controlled
  (`activeTab` + `onTabChange`) or uncontrolled (`defaultTab`).
- **`PreviewWindow`** — the file/format preview shell: a header row (file name,
  a "Print" chip, expand and close actions) over a content slot for the actual
  preview (PDF canvas, iframe, image…); shows a placeholder frame when no
  `children` are passed.
- **`Sidebar` — Admin button.** New `admin` prop renders an "Admin" pill action
  above the module list. Exposes a standalone `AdminButton` component plus
  `AdminButtonProps` (`label`, `onClick`). Renders as an icon-only circle in
  the collapsed rail.
- **`Sidebar` — Help links.** New `help` prop renders "Help Desk" and "Help"
  links pinned to the bottom of the body card (purple headset / blue question-mark
  icon circles + label). Each link takes an optional `label` and an `onClick`; omit
  a link to hide it. In the collapsed rail these render as icon-only circles.
  Exposes a standalone `SidebarHelpLinks` component plus `SidebarHelpProps` /
  `SidebarHelpItem` types.
- **`Badge` — `default` variant.** New grey "draft/unscheduled" tone; it's now
  the default `variant`.

### Changed

- **`Badge` — `info` is blue again.** `info` no longer shares the grey
  "default/draft" look it had picked up; it renders blue. Anything relying on
  `info` for a neutral/grey badge should switch to the new `default` variant
  (pre-1.0 breaking change — see the [pre-1.0 caveat](./PUBLISHING.md#5-versioning-policy-semver)).
- **`Button` / `FormButton` — cursor.** The cursor is `pointer` while the
  button is enabled, falling back to the platform `default` arrow on
  `:disabled` (was `not-allowed`).
- **`Sidebar` modules — icon badge shadow.** Each module's circular icon badge now
  carries a per-module drop shadow (a soft tint of the module's own colour, per
  Figma), applied identically in the active (large), inactive (small), overflow
  popover, and collapsed-rail variants. `ModuleDef` gains a required `shadow` field.
- **`Sidebar` active module card — label.** The icon and label now share a single
  centred container with an 8px gap (16px card padding), and the label renders at
  18px / weight 600 / line-height normal for every module (per Figma).
- **`Sidebar` collapsed rail — module section.** Fixed the expand chevron
  overflowing the module container: the collapsed body card padding is now 8px
  (per Figma), keeping the 40px thumbnail + chevron inside. The container is
  restyled to match Figma — `border-radius: 16px`, `border: 1px solid #E8D8F5`
  (purple-100), `background: #FAF7FD` (purple-25).

### Fixed

- **`Checkbox` / `CheckboxCard` — hidden input positioning.** The visually-hidden
  native `<input>` is now `position: relative` (kept in normal flow) instead of
  `absolute`, so it can no longer be clipped or repositioned out of the
  `<label>` by an ancestor that clips/repositions absolutely-positioned
  descendants.
- **Responsive overflow fixes** across `CtaTray`, `ActionCard`,
  `ConfirmationPopup`, and `Upload`: the `CtaTray` action pill now wraps onto a
  second line instead of overflowing on narrow viewports; long `ActionCard`
  titles wrap instead of forcing the card wider; `ConfirmationPopup`'s
  confirm/cancel buttons shrink to fit instead of overflowing; and `Upload`
  file names truncate with an ellipsis instead of pushing the preview/delete
  actions outside the container.

### Docs

- **`Sidebar` guide (`Sidebar.mdx`).** Documented the new `help` prop (with the
  `SidebarHelpProps` / `SidebarHelpItem` shapes and the standalone
  `SidebarHelpLinks` export), added the `...rest` passthrough to the props table,
  expanded the module catalogue with the full `ModuleDef` shape (including
  `shadow` + `textColor`) and a per-module table of icon, text colour, and badge
  shadow, and refreshed the anatomy diagram, collapsed-rail notes, sub-component
  list, and file map.
- **`agent-docs/`** updated for `Badge`, `Button`, `FormButton`, `Checkbox`,
  `CheckboxCard`, and `CtaTray` to reflect the changes above.

## [0.1.3] — 2026-06-12

### Changed

- Registry/configuration only — **no API, component, or behaviour changes**.
  Versions `0.1.1`–`0.1.3` were republishes while moving the publish target to the
  internal **Verdaccio** registry (`.npmrc` / `publishConfig` retargeting). The
  library code is identical to `0.1.0`. Consumers should use `0.1.3`.

## [0.1.2] — 2026-06-12

_Registry/config bump only — superseded by `0.1.3`._

## [0.1.1] — 2026-06-12

_Registry/config bump only — superseded by `0.1.3`._

## [0.1.0] — 2026-06-08

### Added

- **`Toggle`** — accessible labelled on/off switch (`role="switch"`), controlled
  or uncontrolled, two sizes, configurable label position.
- **`SelectionPill`** — toggleable selection chip (`aria-pressed`), controlled or
  uncontrolled, two sizes, dynamic check icon.
- **`Checkbox`** — icon + label checkbox over a real `<input>`, with
  checked / unchecked / indeterminate / disabled states and three sizes.
- **`CheckboxCard`** — selectable gradient card (title + subtext) over a real
  `<input>`, with hover treatment and themeable gradient tokens.
- **`ActionCard`** — status-tinted card (`pending` / `success` / `danger`) with a
  gradient header, body, and footer actions. Prop-driven **or** compound API
  (`ActionCard.Header` / `.Body` / `.Footer` / `.Badge` / `.Button`) plus
  `useActionCardTone()`.
- **`StatCard`** — tonal dashboard metric card (`purple` / `green` / `red` /
  `yellow` / `blue`) with a title, value/total counter, ringed icon, and a
  gradient progress bar (`role="progressbar"`, derived or explicit progress).
- **`OtpInput`** — reusable accessible segmented code input (sequential entry,
  paste, keyboard nav, `onComplete`, controlled/uncontrolled, error/success
  states). Shared by `AadhaarESign` and `OtpDialog`.
- **`AadhaarESign`** — Aadhaar e-sign / OTP-request dialog panel built on
  `OtpInput`, with `default` / `error` / `success` states, a self-contained
  masked Aadhaar card preview (`AadhaarCardPreview`), and a Send OTP action.
- **`OtpDialog`** — E-Sign OTP entry dialog with a masked contact list, the
  shared `OtpInput`, an internally-managed **resend countdown** (or controlled
  via `secondsRemaining`), Back + Resend OTP actions, and error/success banners.
- **`FormField`** — shared form-control shell (label + icon + required marker,
  control slot, helper/error subtext) with full id + ARIA wiring via a
  render-prop. Exports `fieldStateClasses` and the `FieldIconBox` affix.
- **`TextField`** — labelled text input on `FormField` with leading icon,
  trailing affix, and `default` / `error` / `disabled` / `fetched` states (hover
  + focus handled natively).
- **`Textarea`** — multi-line field on `FormField` with the same states and an
  optional live character counter.
- Design tokens: `--text-body-disabled` (#CCC), `--brand-gradient-orange|green|red`,
  `--gradient-card-checked[-hover]`, `--shadow-card`, and the
  `--statcard-<tone>-surface|border|track|fill` tint set — all theme-aware.
- Component **MDX guides** for Button, Input, Banner, Upload, Card, Label, and the
  five new components.
- Storybook **stories** for Card and Label (previously undocumented).
- **`PUBLISHING.md`**, `.gitlab-ci.yml`, `CODEOWNERS`, and the MR template for
  GitLab-based releases.
- Tests for `Input`, `Card`, and `Label`.

### Fixed

- **`Card`, `Label`, and `Input` are now exported** from the package root — they
  were previously unreachable for consumers (`Card` had no `index.ts`).
- **`Sidebar`** no longer hardcodes `#4B3960`; it uses the themeable `text-heading`
  token so it adapts to theme/dark mode.
- **`Button`** disabled state uses the `body-disabled` token instead of a raw
  `#CCCCCC`.
- **`LanguageToggle`** now sets a `displayName` for consistent devtools output.
- **`.npmrc`** pins the `@ifmis` scope to the GitLab registry so an accidental
  local `npm publish` can't target the public npm registry.

<!--
Template for a released version:

## [1.0.0] — YYYY-MM-DD
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
-->
