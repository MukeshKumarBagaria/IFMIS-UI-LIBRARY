# Icons

> `@ifmis/ui` uses [**Phosphor Icons**](https://phosphoricons.com) (`@phosphor-icons/react`) as its only icon set — every `icon` / `leftIcon` / `rightIcon` prop across the library accepts a Phosphor icon element. There is no built-in icon font or SVG sprite; you always import and render a real React component.

```jsx
import { FloppyDisk, Warning, CaretRight } from "@phosphor-icons/react";
// or, equivalently, from the library's re-exported sub-path:
import { FloppyDisk, Warning, CaretRight } from "@ifmis/ui/icons";

<Button leftIcon={<FloppyDisk weight="bold" />}>Save</Button>
```

---

## Two equivalent import paths

- **`@phosphor-icons/react`** — the upstream package directly. It's a normal `dependency` of `@ifmis/ui` (not a `peerDependency`), so it's already installed transitively in any app that has `@ifmis/ui` in `node_modules` — you don't have to add it to your own `package.json` to use it.
- **`@ifmis/ui/icons`** — a sub-path export that does `export * from "@phosphor-icons/react"`, built as its own bundle entry (`dist/icons.js`) so it tree-shakes independently of the component bundle. Same icons, same types, same everything — it exists purely so consumers who don't want a direct `@phosphor-icons/react` entry in their own `package.json` still have a clean import path.

Either is correct. Components themselves only ever care that you pass a `ReactNode` — they have no special-case logic for "a Phosphor icon" vs. any other element, so a custom SVG works too if you ever need one outside this set.

## Icon props are nodes, not names

Every icon-accepting prop in the library (`icon`, `leftIcon`, `rightIcon`) is typed `ReactNode`. You always construct the element yourself — there's no `iconName="floppy-disk"` string API:

```jsx
<Button leftIcon={<FloppyDisk weight="bold" />}>Save</Button>
<Banner variant="success" icon={<Trophy weight="fill" />}>You did it!</Banner>
```

The dynamic-slot convention used throughout the library (see [README](README.md)): **omit** the prop = the component's own default icon, **pass `null`** = no icon at all, **pass a node** = your custom icon.

## Sizing & colour — two patterns

Phosphor's `<Icon>` defaults to `size="1em"`, `weight="regular"`, `color="currentColor"` — and renders `width`/`height`/`fill` as plain SVG attributes, not inline styles. That last detail matters: a CSS class always wins over a presentational attribute, which is what makes pattern A below work.

**A. Auto-sized slots — `Button` / `FormButton` and similar.** These wrap their content with a Tailwind arbitrary-variant rule like `[&_svg]:size-6` that force-sizes *any* descendant `<svg>` via CSS, no matter what (or whether) you set `size` on the icon you pass in. Colour comes along for free too, since the icon's `fill` defaults to `currentColor` and the button sets its own `text-*`. **You don't size or colour the icon yourself here** — just drop it in:

```jsx
<Button leftIcon={<FloppyDisk />}>Save</Button>          {/* sized to 24px standard / 20px small automatically */}
<SubmitButton leftIcon={<PaperPlaneTilt />}>Send</SubmitButton>
```

**B. Manual-sized slots — a custom `icon` override on `Banner`, `ConfirmationPopup`, `RoleBadge`, etc.** These render whatever node you pass *as-is* inside a fixed box (e.g. Banner wraps its icon in a plain `h-5 w-5` flex container — it doesn't force-resize the SVG). Here **you** set `size`/`weight`/colour to match the slot, matching the same value the component's own default icon uses:

```jsx
// Banner's own default renders <Icon size={20} weight="fill" />
<Banner variant="success" icon={<Trophy size={20} weight="fill" />}>Done</Banner>

// ConfirmationPopup's danger icon is size={60}
<ConfirmationPopup icon={<Trash size={60} weight="fill" className="text-red-600" />} />
```

When in doubt which pattern a component uses, check its own default icon in source/agent-docs and match its `size`/`weight` exactly.

### Colour: let `currentColor` do the work

Never pass Phosphor's `color` prop with a hardcoded hex — nothing in this library does that. Instead, set a `text-*` token class (on the icon itself, or rely on inheriting the parent's text colour) and let the SVG's default `fill="currentColor"` pick it up:

```jsx
// good — themeable, matches the Colors.md "never hardcode a hex" rule
<Warning weight="fill" className="text-red-600" aria-hidden="true" />

// avoid
<Warning weight="fill" color="#B81414" aria-hidden="true" />
```

See [Colors](Colors.md) for the full token reference.

## Weight — pick deliberately, every time

Phosphor ships six weights: `"thin" | "light" | "regular" | "bold" | "fill" | "duotone"`. The library never leaves `weight` unset (the upstream default is `"regular"`, but relying on it is an accident waiting to happen if Phosphor's default ever changes). Conventions observed across the library:

| Weight | Used for | Examples |
| --- | --- | --- |
| `fill` | Semantic/status icons — success, danger, warning, info, "done" states. The heaviest, most legible-at-a-glance look. | `Badge`'s `success`/`danger`/`info` glyphs, `ActionCard` check, `Banner` default icons |
| `bold` | Small UI chrome glyphs — carets, chevrons, close (`X`), check, minus. Crisp at 12–16px. | `Dropdown` check/clear, `Accordion` arrow, `Pagination` carets, `Breadcrumb` separator |
| `regular` | Neutral, non-status contexts — header/profile/menu iconography, body-level icons. | `Header` bell/gear/sign-out, `SearchField` magnifying glass |
| `duotone` | Reserved for `Sidebar` module/category icons specifically — a distinct two-tone visual language for primary navigation. Don't borrow it elsewhere. | `Sidebar` module icons |
| `thin` / `light` | Not currently used anywhere in the library. Avoid introducing them without a Figma reference — they read as visually inconsistent next to everything else. | — |

## Size — pixel literal vs. Tailwind class

Both are used, interchangeably, depending on whether the icon needs other classes too:

```jsx
<CaretRight size={16} weight="bold" className="text-grey-600" />
<Check weight="bold" className="size-3.5" />
```

Common literal sizes seen across the library: `12`, `14`, `16`, `18`, `20`, `24`, `60` (the last is for large illustrative icons like `ConfirmationPopup`'s danger glyph). Prefer `className="size-N"` when you're already adding other classes (so everything lives in one `className`), and the bare `size={N}` prop when it's the only thing you're setting.

## Usage examples

### A component-default override

```jsx
import { Files } from "@phosphor-icons/react";
import { StatCard } from "@ifmis/ui";

<StatCard title="Documents" value={42} icon={<Files weight="fill" />} />
```

### Icon-only button (needs `aria-label` on the control, not the icon)

```jsx
import { List } from "@phosphor-icons/react";
import { Button } from "@ifmis/ui";

<Button aria-label="Open menu" leftIcon={<List />} />
```

### Suppressing a default icon entirely

```jsx
<Banner variant="info" icon={null}>No icon here.</Banner>
```

## Best practices

- **Never hardcode `color` on an icon.** Use a `text-*` token class, or just let it inherit `currentColor` from its container — same rule as [Colors](Colors.md).
- **Always set `weight` explicitly.** Match the table above; don't rely on Phosphor's `"regular"` default by omission.
- **Match the slot's sizing pattern.** Check whether the prop you're filling is auto-sized (Button-style) or manual (Banner-style) before deciding whether to set `size` yourself.
- **Pair `shrink-0`** on icons inside flex rows next to text that might wrap or truncate, so the icon never gets squashed.
- **Reach for `@ifmis/ui/icons`** if you'd rather not add `@phosphor-icons/react` directly to your own `package.json` — otherwise either import path is fine.

## Common mistakes

- **Passing a string instead of an element** — there's no `icon="floppy-disk"` API; always `<FloppyDisk />`.
- **Forgetting `aria-hidden="true"`** on a purely decorative icon — every icon in this library's own source sets it.
- **Relying on an icon alone for an accessible name** — an icon-only `Button`/`FormButton` still needs `aria-label` on the *button*, not the icon.
- **Sizing a manual-slot icon (pattern B) with a Tailwind class and expecting it to match a `size={N}` default** — match the literal pixel value the component's own default uses, not an approximate `size-*` class.
- **Mixing `duotone` into non-Sidebar UI** — it's a deliberately reserved look for primary navigation.

## Accessibility

- Decorative icons get `aria-hidden="true"` (or the boolean `aria-hidden` shorthand) — they carry no meaning on their own, and screen readers should skip them.
- Status communicated via an icon (success/danger/warning) must always be paired with a text label or colour-independent cue — never icon-only, never colour-only (WCAG 1.4.1).
- For icon-only interactive controls, the accessible name comes from `aria-label` on the control element, never from the icon.

## Related

- [Colors](Colors.md) — the token system icons should pull their colour from via `currentColor`.
- [Badge](Badge.md), [Banner](Banner.md), [Button](Button.md), [FormButton](FormButton.md), [StatCard](StatCard.md) — components with the most varied icon-prop usage worth referencing for examples.
- [README](README.md) — library-wide conventions, including the icon dynamic-slot rule (omit / `null` / node).
