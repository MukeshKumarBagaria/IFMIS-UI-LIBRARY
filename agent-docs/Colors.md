# Colors

> The complete colour token reference for `@ifmis/ui`. Every colour is a design token consumed as a **Tailwind utility class** (`bg-green-100`, `text-heading`, `bg-primary`) — **never hardcode a hex**. Colours are CSS variables, so switching themes repaints everything with no code change.

```jsx
import "@ifmis/ui/styles.css";                       // defines all tokens (required once)
import { ThemeProvider, useTheme, themes, DEFAULT_THEME } from "@ifmis/ui";
```

---

## The three layers

1. **Brand palettes** — raw ramps shared across all themes (grey, green, red, orange, yellow, blue). Same meaning in every theme.
2. **Theme palettes** — `purple` (primary) and `neutral` (tinted grey). These change per theme.
3. **Semantic tokens** — the theme-agnostic API components consume (`--primary`, `--background`, `--success`, surface, text, border/focus).

## How to consume a colour

Use the Tailwind utility named after the token, with the usual prefixes (`bg-`, `text-`, `border-`, `ring-`, `fill-`, etc.):

```jsx
// good — themeable
<div className="bg-green-100 border border-green-400 text-green-800">…</div>
<button className="bg-primary text-primary-foreground">…</button>

// bad — hardcoded, breaks theming
<div style={{ background: "#0F8A49" }}>…</div>
```

- Use **semantic tokens** (`bg-primary`, `text-heading`, `border-border`) for theme-shared meaning (brand surfaces, page chrome, focus rings).
- Use **brand ramps** (`bg-green-200`) for status colours that mean the same in every theme.
- Step guidance: `25`/`50` = ambient washes · `100`–`300` = chips/surfaces · `400`–`600` = icons/borders · `700`–`900` = text.

> **`text-*` is overloaded.** `text-heading` / `text-body-primary` set **colour**; `text-h1` / `text-body-sm` set **font size**. The library's `cn()` (project-aware tailwind-merge) keeps a size and a colour from clobbering each other, so `cn("text-body-lg", "text-body-primary")` keeps both.

---

## Brand palettes (theme-independent)

Shared across every theme. Each ramp runs `25` (almost-white) → `950` (near-black). Utility example: `bg-green-500`, `text-green-800`, `border-green-400`.

### Grey — pure neutral (borders, dividers, disabled)

| Step | Hex | Step | Hex |
| --- | --- | --- | --- |
| `grey-25` | `#FAFAFA` | `grey-500` | `#8E8E8E` |
| `grey-50` | `#F8F8F8` | `grey-600` | `#707070` |
| `grey-100` | `#F1F1F1` | `grey-700` | `#575757` |
| `grey-200` | `#E5E5E5` | `grey-800` | `#3F3F3F` |
| `grey-300` | `#D4D4D4` | `grey-900` | `#2B2B2B` |
| `grey-400` | `#B5B5B5` | `grey-950` | `#1B1B1B` |

### Green — success

| Step | Hex | Step | Hex |
| --- | --- | --- | --- |
| `green-25` | `#F6FEFB` | `green-500` | `#1AE57A` |
| `green-50` | `#E8FCF2` | `green-600` | `#14B862` |
| `green-100` | `#D1FAE5` | `green-700` | `#0F8A49` |
| `green-200` | `#A3F5CA` | `green-800` | `#0A5C31` |
| `green-300` | `#75F0AF` | `green-900` | `#084525` |
| `green-400` | `#47EB95` | `green-950` | `#06321B` |

### Red — danger / destructive

| Step | Hex | Step | Hex |
| --- | --- | --- | --- |
| `red-25` | `#FEF6F6` | `red-500` | `#E51A1A` |
| `red-50` | `#FCE8E8` | `red-600` | `#B81414` |
| `red-100` | `#FAD1D1` | `red-700` | `#8A0F0F` |
| `red-200` | `#F5A3A3` | `red-800` | `#5C0A0A` |
| `red-300` | `#F07575` | `red-900` | `#450808` |
| `red-400` | `#EB4747` | `red-950` | `#320606` |

### Orange — pending / returned / attention

| Step | Hex | Step | Hex |
| --- | --- | --- | --- |
| `orange-25` | `#FEF9F6` | `orange-500` | `#E5641A` |
| `orange-50` | `#FCF0E8` | `orange-600` | `#B85014` |
| `orange-100` | `#FAE0D1` | `orange-700` | `#8A3C0F` |
| `orange-200` | `#F5C1A3` | `orange-800` | `#5C280A` |
| `orange-300` | `#F0A275` | `orange-900` | `#451E08` |
| `orange-400` | `#EB8347` | `orange-950` | `#321606` |

### Yellow — warning

| Step | Hex | Step | Hex |
| --- | --- | --- | --- |
| `yellow-25` | `#FEFCF6` | `yellow-500` | `#E5C31A` |
| `yellow-50` | `#FCF7E8` | `yellow-600` | `#B88F14` |
| `yellow-100` | `#FAF0D1` | `yellow-700` | `#8A6B0F` |
| `yellow-200` | `#F5E0A3` | `yellow-800` | `#5C470A` |
| `yellow-300` | `#F0D175` | `yellow-900` | `#453608` |
| `yellow-400` | `#EBC247` | `yellow-950` | `#322706` |

### Blue — info

| Step | Hex | Step | Hex |
| --- | --- | --- | --- |
| `blue-25` | `#F6FBFE` | `blue-500` | `#1AA2E5` |
| `blue-50` | `#E8F6FC` | `blue-600` | `#1481B8` |
| `blue-100` | `#D1ECFA` | `blue-700` | `#0F618A` |
| `blue-200` | `#A3DAF5` | `blue-800` | `#0A415C` |
| `blue-300` | `#75C7F0` | `blue-900` | `#083045` |
| `blue-400` | `#47B4EB` | `blue-950` | `#062432` |

---

## Theme palettes (theme-dependent — values shown for `purple`, the default)

### Purple — primary brand (`bg-purple-600`, `text-purple-800`, …)

| Step | Hex | Step | Hex |
| --- | --- | --- | --- |
| `purple-25` | `#FAF7FD` | `purple-500` | `#8B39C2` |
| `purple-50` | `#F3ECFA` | `purple-600` | `#701FA7` |
| `purple-100` | `#E8D8F5` | `purple-700` | `#56108A` |
| `purple-200` | `#D4B3EB` | `purple-800` | `#470D73` |
| `purple-300` | `#BE8AE0` | `purple-900` | `#37095A` |
| `purple-400` | `#A663D4` | `purple-950` | `#24043D` |

### Neutral — purple-tinted greys (`bg-neutral-100`, …)

Prefer these over pure `grey-*` when a surface should pick up the brand temperature.

| Step | Hex | Step | Hex |
| --- | --- | --- | --- |
| `neutral-25` | `#FCFBFD` | `neutral-500` | `#8E7E9F` |
| `neutral-50` | `#F8F6FA` | `neutral-600` | `#6F617E` |
| `neutral-100` | `#F1EDF5` | `neutral-700` | `#564A63` |
| `neutral-200` | `#E5DFEB` | `neutral-800` | `#3E3548` |
| `neutral-300` | `#D4CBDD` | `neutral-900` | `#2A2431` |
| `neutral-400` | `#B5A9C2` | `neutral-950` | `#1A1620` |

---

## Semantic tokens (theme-aware)

The canonical names components reach for. Utility form: `bg-primary`, `text-primary-foreground`, `border-border`, `ring-ring`, `bg-success`, etc. Values below are for the `purple` theme.

### Brand

| Utility | Resolves to (purple) | Use |
| --- | --- | --- |
| `primary` | `purple-500` `#8B39C2` | Solid brand colour |
| `primary-foreground` | `#FFFFFF` | Text on primary |
| `secondary` | `purple-50` `#F3ECFA` | Secondary surface |
| `secondary-foreground` | `purple-700` `#56108A` | Text on secondary |
| `accent` | `purple-100` `#E8D8F5` | Highlight surface |
| `accent-foreground` | `purple-800` `#470D73` | Text on accent |

### Status (same meaning in every theme)

| Utility | Resolves to (purple) | Meaning |
| --- | --- | --- |
| `success` / `success-foreground` | `green-600` `#14B862` / white | Confirmed / complete |
| `destructive` / `destructive-foreground` | `red-500` `#E51A1A` / white | Danger / destructive |
| `warning` / `warning-foreground` | `yellow-500` `#E5C31A` / white | Warning / attention |
| `info` / `info-foreground` | `blue-500` `#1AA2E5` / white | Neutral information |
| `pending` / `pending-foreground` | `orange-500` `#E5641A` / white | In-progress / awaiting |

### Surfaces

| Utility | Resolves to (purple) | Use |
| --- | --- | --- |
| `background` | `#F1EFF3` | Page background |
| `foreground` | `#2E2E2E` | Default text on background |
| `card` | `#FFFFFF` | Card surface |
| `card-foreground` | `#2E2E2E` | Text on card |
| `muted` | `#F7F7F7` | Muted/disabled fill |
| `muted-foreground` | `#595959` | Text on muted |
| `surface-page` | `#F1EFF3` | Page chrome wash |
| `surface-grey-bg` | `#F7F7F7` | Generic grey surface |
| `surface-grey-header` | `#EDEDED` | Greyed-out header strip |
| `surface-card` | `#FFFFFF` | Solid card white |
| `surface-border-grey` | `#A6A6A6` | Default border |
| `surface-border-purple` | `#A58FBC` | Brand border |

### Lines & focus

| Utility | Resolves to (purple) | Use |
| --- | --- | --- |
| `border` | `#A6A6A6` | Standard border |
| `border-strong` | `#A58FBC` | Strong / brand border |
| `input` | `#A6A6A6` | Form input border |
| `ring` | `purple-500` `#8B39C2` | Focus ring colour |

### Typography colours

| Utility | Resolves to (purple) | Use |
| --- | --- | --- |
| `text-heading` | `#4B3960` | Headings |
| `text-subheading` | `#371452` | Sub-headings |
| `text-body-primary` | `#2E2E2E` | Primary body text |
| `text-body-secondary` | `#595959` | Secondary / muted text |
| `text-body-disabled` | `#CCCCCC` | Disabled text |

---

## Gradients

Decorative wash gradients (shared across themes), consumed via arbitrary-value utilities like `bg-[image:var(--brand-gradient-green)]`.

| Token | Value | Used by |
| --- | --- | --- |
| `--brand-gradient-orange` | `linear-gradient(90deg, #ECA993 0%, #F4D9BE 100%)` | [ActionCard](ActionCard.md) `pending` header |
| `--brand-gradient-green` | `linear-gradient(90deg, #93ECBF 0%, #BEF4D9 100%)` | ActionCard `success`, [ReferenceIdSuccessCard](ReferenceIdSuccessCard.md) |
| `--brand-gradient-red` | `linear-gradient(90deg, #EC9393 0%, #F4BEBE 100%)` | ActionCard `danger` header |
| `--gradient-card-checked` | `linear-gradient(105deg, #48146C 0.35%, #A461D1 100%)` | [CheckboxCard](CheckboxCard.md) checked (theme-dependent) |
| `--gradient-card-checked-hover` | `linear-gradient(105deg, #3A1056 0.35%, #8D3AC5 100%)` | CheckboxCard checked + hover |

## StatCard tints

Bespoke pale surface / border / progress-track / progress-fill quartets per tone, used by [StatCard](StatCard.md). Consumed via `bg-[var(--statcard-<tone>-surface)]`, etc. (text + icon colours reuse the regular palette steps, e.g. `text-purple-800`).

| Tone | surface | border | track | fill (gradient) |
| --- | --- | --- | --- | --- |
| purple | `#F8F2FD` | `#DDBEF4` | `#F3E9FB` | `95deg, #D4DAF7 → #BA7DE8` |
| green | `#F2FDF7` | `#BEF4D9` | `#E9FBF2` | `95deg, #E0F7D4 → #7DE8B2` |
| red | `#FDF2F2` | `#F4BEBE` | `#FBE9E9` | `95deg, #F7E3D4 → #E87D7D` |
| yellow | `#FDFBF2` | `#F4EBBE` | `#FBF8E9` | `95deg, #F7E3D4 → #E8D67D` |
| blue | `#F2F9FD` | `#BEE2F4` | `#E9F5FB` | `95deg, #D4F7F7 → #7DC4E8` |

---

## Themes & switching

Two themes are registered: **`purple`** (default, light) and **`dark`** (companion). Switch by wrapping the app in `ThemeProvider` or setting `data-theme` on a root element. Brand ramps (grey/green/red/orange/yellow/blue) stay the same; only the **theme palette + semantic/surface/text tokens** change.

```jsx
import { ThemeProvider } from "@ifmis/ui";

<ThemeProvider theme="purple">   {/* or "dark" */}
  <App />
</ThemeProvider>
```

The `dark:` Tailwind variant applies inside `[data-theme="dark"]`. Dark overrides include (provisional — dark spec not yet finalised):

| Utility | purple | dark |
| --- | --- | --- |
| `background` | `#F1EFF3` | `#1A1620` |
| `card` / `surface-card` | `#FFFFFF` | `#2A2431` |
| `primary` / `ring` | `#8B39C2` | `#A663D4` |
| `text-heading` | `#4B3960` | `#D4C5E8` |
| `text-body-primary` | `#2E2E2E` | `#F1F1F1` |
| `border` | `#A6A6A6` | `#575757` |

Status tokens in dark use the `500` steps of the shared ramps with white foreground.

## Best practices

- **Never inline a hex.** Use the named token / utility every time — the moment you "just need this one custom colour" is the moment your theme breaks.
- **Prefer semantic tokens** (`bg-primary`) over raw palette steps (`bg-purple-600`) when the meaning is theme-shared (brand surfaces, focus rings, status).
- **Use brand ramps for status** that means the same everywhere (`bg-green-100` for a success chip).
- **Status colour is reinforcement, not signal** — always pair it with a label or icon; never carry meaning with colour alone (WCAG 1.4.1).
- Follow the step guidance (25/50 washes → 700–900 text) for consistent contrast.

## Common mistakes

- **Hardcoding hex / `style={{ color }}`** — breaks theming and dark mode.
- **Reaching for `bg-purple-600` for a brand button** — use `bg-primary` so it follows the theme.
- **Confusing `text-heading` (colour) with `text-h1` (size)** — both use the `text-` prefix; use [Typography](Typography.md) components for text rather than raw classes where possible.
- **Using a status palette decoratively** — a `bg-red-100` surface implies an error; don't use it for neutral decoration.

## Related

- [Typography](Typography.md) — text components + the `text-*` size vs colour distinction.
- [Badge](Badge.md), [Banner](Banner.md), [StatCard](StatCard.md), [ActionCard](ActionCard.md), [ProgressCard](ProgressCard.md) — components whose variants/tones map onto these palettes.
- [README](README.md) — library-wide conventions (incl. `ThemeProvider`, `cn`).
