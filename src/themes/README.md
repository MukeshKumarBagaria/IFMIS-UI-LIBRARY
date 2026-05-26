# Theming

The IFMIS UI library ships with two themes out of the box:

| Name     | Mode  | When to use                              |
| -------- | ----- | ---------------------------------------- |
| `purple` | light | Default IFMIS brand theme.               |
| `dark`   | dark  | Dark-mode companion.                     |

Themes are switched at runtime by setting the `data-theme` attribute on
`<html>` (or any ancestor of the UI you want themed). The `<ThemeProvider>`
component handles this for you.

```tsx
import { ThemeProvider } from "@ifmis/ui";

<ThemeProvider defaultTheme="purple">
  <App />
</ThemeProvider>
```

## Architecture

```
src/
├── styles/
│   ├── globals.css              # Tailwind + @theme bridges + base layer
│   └── themes/
│       ├── index.css            # @imports every palette file
│       ├── purple.css           # [data-theme="purple"] { … }
│       └── dark.css             # [data-theme="dark"]   { … }
└── themes/
    ├── types.ts                 # ThemeDefinition, ThemeMode
    ├── registry.ts              # themes[] — single source of truth
    └── index.ts                 # barrel export
```

Two layers, one source of truth:

1. **CSS palettes** in `src/styles/themes/<name>.css`. Each file declares
   the runtime CSS variables (`--background`, `--primary`, …) for one
   theme. `globals.css` then bridges those into Tailwind's `@theme` block
   so utilities like `bg-background` and `text-primary` resolve correctly
   regardless of which palette is active.

2. **TS registry** in `src/themes/registry.ts`. The `themes` array is the
   only place where the set of themes is enumerated. The `Theme` type,
   the Storybook toolbar, and `<ThemeProvider>` all derive from it — so
   adding an entry here automatically widens every consumer.

## Adding a new theme

Concrete example: adding a `"blue"` light theme.

### 1. Create the palette

Copy `purple.css` as a starting point.

```bash
cp src/styles/themes/purple.css src/styles/themes/blue.css
```

Inside `blue.css`, change the selector and replace every value:

```css
[data-theme="blue"] {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;

  --primary: 217 91% 50%;          /* blue/500 */
  --primary-foreground: 0 0% 100%;

  /* …every variable that purple.css declares… */
}
```

> **Important**: declare *every* variable that the other theme files
> declare. Missing variables fall back to whichever theme was loaded last
> at `:root`, which produces subtle visual bugs.

### 2. Register the palette CSS

Add an `@import` to `src/styles/themes/index.css`:

```css
@import "./purple.css";
@import "./dark.css";
@import "./blue.css";    /* ← new */
```

### 3. Register the theme metadata

Add an entry to `src/themes/registry.ts`:

```ts
export const themes = [
  { name: "purple", label: "Purple", mode: "light", description: "…" },
  { name: "dark",   label: "Dark",   mode: "dark",  description: "…" },
  { name: "blue",   label: "Blue",   mode: "light", description: "Alt brand." },
] as const satisfies readonly ThemeDefinition[];
```

That's it. The `Theme` union, `<ThemeProvider>` accepted values, the
Storybook theme toolbar, and any consumer iterating `themes` all update
automatically.

### 4. (Optional) Make it the default

If the new theme should be the default for uncontrolled `<ThemeProvider>`:

```ts
export const DEFAULT_THEME: Theme = "blue";
```

### 5. (Optional) Wire up `dark:` variants

`globals.css` defines the Tailwind `dark:` variant by literal theme name:

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

If you add a second dark-appearance theme (e.g. `"purple-dark"`), extend
the selector so `dark:` utilities also trigger inside it:

```css
@custom-variant dark (&:where(
  [data-theme="dark"], [data-theme="dark"] *,
  [data-theme="purple-dark"], [data-theme="purple-dark"] *
));
```

Light-appearance themes don't need this.

## Token reference

These are the CSS variables every theme file must declare. They map 1:1
to Tailwind utilities via the `@theme` block in `globals.css`.

### Surface / control (HSL triplets, no `hsl()` wrapper)

Tailwind applies `hsl(var(--token))` for you, which lets utilities like
`bg-primary/50` work natively.

| Variable                     | Tailwind utility            | Meaning                          |
| ---------------------------- | --------------------------- | -------------------------------- |
| `--background`               | `bg-background`             | Page background                  |
| `--foreground`               | `text-foreground`           | Default text on background       |
| `--card`                     | `bg-card`                   | Card / surface background        |
| `--card-foreground`          | `text-card-foreground`      | Text on card                     |
| `--muted`                    | `bg-muted`                  | Subtle / disabled surface        |
| `--muted-foreground`         | `text-muted-foreground`     | Text on muted                    |
| `--primary`                  | `bg-primary`                | Brand primary                    |
| `--primary-foreground`       | `text-primary-foreground`   | Text on primary                  |
| `--secondary`                | `bg-secondary`              | Brand secondary                  |
| `--secondary-foreground`     | `text-secondary-foreground` | Text on secondary                |
| `--accent`                   | `bg-accent`                 | Accent surface                   |
| `--accent-foreground`        | `text-accent-foreground`    | Text on accent                   |
| `--destructive`              | `bg-destructive`            | Errors, destructive actions      |
| `--destructive-foreground`   | …                           |                                  |
| `--success`                  | `bg-success`                |                                  |
| `--success-foreground`       | …                           |                                  |
| `--warning`                  | `bg-warning`                |                                  |
| `--warning-foreground`       | …                           |                                  |
| `--border`                   | `border-border`             | Default border color             |
| `--input`                    | `border-input`              | Input border color               |
| `--ring`                     | `ring-ring`                 | Focus ring (usually = primary)   |

### Typography (direct color values)

These take a full color (hex / `rgb(…)` / `hsl(…)`) — not a triplet —
because they're consumed directly, without alpha modifiers.

| Variable                | Tailwind utility       |
| ----------------------- | ---------------------- |
| `--text-heading`        | `text-heading`         |
| `--text-body-primary`   | `text-body-primary`    |
| `--text-body-secondary` | `text-body-secondary`  |

### Neutral

| Variable    | Tailwind utility |
| ----------- | ---------------- |
| `--grey-25` | `bg-grey-25`     |

### Shape

| Variable   | Notes                                       |
| ---------- | ------------------------------------------- |
| `--radius` | Base radius; `--radius-{sm,md,lg}` derived. |

## FAQ

**Why HSL triplets instead of hex for the brand colors?**
Tailwind 4 needs `hsl(var(--primary))` so it can apply alpha modifiers
like `bg-primary/50`. Hex would block that.

**Why are typography colors stored as full color values then?**
They aren't used with alpha modifiers, and storing them as `#hex` makes
them legible when scanning the file against Figma.

**How do I do server-side / SSR theming?**
Render `<html data-theme="purple">` server-side. `<ThemeProvider>` will
sync to the same attribute on mount; no flash.
