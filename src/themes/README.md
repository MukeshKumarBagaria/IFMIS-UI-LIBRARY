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
│       ├── index.css            # @imports every palette file (load order matters)
│       ├── _brand.css           # SHARED accent scales (green/red/yellow/orange/blue/grey)
│       ├── purple.css           # [data-theme="purple"] — purple scale + neutrals + semantic tokens
│       └── dark.css             # [data-theme="dark"]   — dark-mode overrides
└── themes/
    ├── types.ts                 # ThemeDefinition, ThemeMode
    ├── registry.ts              # themes[] — single source of truth
    └── index.ts                 # barrel export
```

### Three layers

1. **Brand palette** (`_brand.css`) — Raw color scales from Figma that
   are **shared across every theme**: green (success), red (danger),
   yellow (warning), orange (pending), blue (info), grey (untinted
   neutral). Declared on `:root` so any theme can reference them.

2. **Theme palette** (`purple.css`, `dark.css`, …) — Each theme owns:
   - its primary color scale (e.g. `--brand-primary-purple-{25..950}`),
   - its neutral scale (purple-tinted in the purple theme),
   - named **surface tokens** (`--surface-page-bg`, `--surface-grey-bg`,
     `--surface-card-white`, …) mirroring Figma "Brand/Surface/*",
   - **text tokens** (`--text-heading`, `--text-subheading`,
     `--text-body-primary`, `--text-body-secondary`),
   - **semantic tokens** (`--background`, `--primary`, `--border`,
     `--success`, …) that point at the palette entries above.

3. **Tailwind bridge** (`globals.css`) — Maps every CSS variable into
   Tailwind's `@theme` block so utilities like `bg-primary`,
   `text-heading`, `bg-purple-500`, `border-grey-300`, `bg-success`
   resolve regardless of which palette is active.

Components consume **semantic tokens or brand scales** — never raw
palette names like `--brand-primary-purple-500` directly in TSX. That
indirection is what makes theme swapping possible.

## Token reference

### Surface roles (Figma "Brand/Surface/*")

| Variable                  | Tailwind utility            | Figma name                          |
| ------------------------- | --------------------------- | ----------------------------------- |
| `--surface-page-bg`       | `bg-surface-page`           | Page background                     |
| `--surface-grey-bg`       | `bg-surface-grey-bg`        | Brand/Surface/Grey/bg               |
| `--surface-grey-header`   | `bg-surface-grey-header`    | Brand/Surface/Grey/header           |
| `--surface-border-grey`   | `border-surface-border-grey`| Brand/Surface/Borders/grey          |
| `--surface-border-purple` | `border-surface-border-purple` | Brand/Surface/Borders/purple    |
| `--surface-card-white`    | `bg-surface-card`           | Brand/Surface/Cards/White-text      |

### Typography

| Variable                | Tailwind utility       |
| ----------------------- | ---------------------- |
| `--text-heading`        | `text-heading`         |
| `--text-subheading`     | `text-subheading`      |
| `--text-body-primary`   | `text-body-primary`    |
| `--text-body-secondary` | `text-body-secondary`  |

### Semantic (theme-aware)

| Variable                   | Tailwind utility            | Meaning                          |
| -------------------------- | --------------------------- | -------------------------------- |
| `--background`             | `bg-background`             | Page background                  |
| `--foreground`             | `text-foreground`           | Default text                     |
| `--card`                   | `bg-card`                   | Card surface                     |
| `--card-foreground`        | `text-card-foreground`      | Text on card                     |
| `--muted`                  | `bg-muted`                  | Subtle / disabled surface        |
| `--muted-foreground`       | `text-muted-foreground`     | Text on muted                    |
| `--primary`                | `bg-primary`                | Brand primary                    |
| `--primary-foreground`     | `text-primary-foreground`   | Text on primary                  |
| `--secondary`              | `bg-secondary`              | Brand secondary                  |
| `--secondary-foreground`   | `text-secondary-foreground` | Text on secondary                |
| `--accent`                 | `bg-accent`                 | Accent surface                   |
| `--accent-foreground`      | `text-accent-foreground`    | Text on accent                   |
| `--destructive`            | `bg-destructive`            | Errors, destructive              |
| `--success`                | `bg-success`                | Success                          |
| `--warning`                | `bg-warning`                | Warning                          |
| `--info`                   | `bg-info`                   | Info                             |
| `--pending`                | `bg-pending`                | Pending / attention              |
| `--border`                 | `border-border`             | Default border                   |
| `--border-strong`          | `border-border-strong`      | Strong/branded border            |
| `--input`                  | `border-input`              | Input border                     |
| `--ring`                   | `ring-ring`                 | Focus ring                       |

### Brand scales — exposed as Tailwind utilities

Every scale below has steps `25, 50, 100, 200, 300, 400, 500, 600, 700,
800, 900, 950` and resolves to Tailwind utilities like `bg-<scale>-<step>`,
`text-<scale>-<step>`, `border-<scale>-<step>`.

| Scale     | Source         | Purpose                                        |
| --------- | -------------- | ---------------------------------------------- |
| `purple`  | `purple.css`   | Brand primary (theme-specific)                 |
| `neutral` | `purple.css`   | Theme-tinted greys (theme-specific)            |
| `grey`    | `_brand.css`   | Pure neutral greys (shared across themes)      |
| `green`   | `_brand.css`   | Success states (shared)                        |
| `red`     | `_brand.css`   | Danger / destructive states (shared)           |
| `orange`  | `_brand.css`   | Pending / attention states (shared)            |
| `yellow`  | `_brand.css`   | Warning states (shared)                        |
| `blue`    | `_brand.css`   | Info states (shared)                           |

### Shape

| Variable   | Notes                                       |
| ---------- | ------------------------------------------- |
| `--radius` | Base radius; `--radius-{sm,md,lg}` derived. |

## Adding a new theme

Concrete example: adding a `"blue"` light theme.

### 1. Create the palette

Copy `purple.css` as a starting point.

```bash
cp src/styles/themes/purple.css src/styles/themes/blue.css
```

Inside `blue.css`:

1. Change the selector from `[data-theme="purple"]` to `[data-theme="blue"]`
   (and remove `:root,` unless this is the new default).
2. Replace the **theme palette** block with your blue scale + neutral scale.
3. Replace the **surface tokens** with the surface values for this theme.
4. Update **text tokens** to match the theme.
5. **Leave semantic-token mappings structurally the same** — they just
   reference the palette vars above and rarely need editing.

You do not need to redeclare the shared accent scales (green/red/yellow/
orange/blue/grey) — those live in `_brand.css` and apply automatically.

### 2. Register the palette CSS

Add an `@import` to `src/styles/themes/index.css`:

```css
@import "./_brand.css";
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

### 4. (Optional) Make it the default

If the new theme should be the default for uncontrolled `<ThemeProvider>`:

```ts
export const DEFAULT_THEME: Theme = "blue";
```

### 5. (Optional) Wire up `dark:` variants

If the new theme has a dark appearance (e.g. `"purple-dark"`), extend the
`@custom-variant dark` selector in `globals.css`. Light-appearance themes
don't need this.

## FAQ

**Why hex instead of HSL triplets?**
Tailwind 4 handles alpha modifiers (`bg-primary/50`) via `color-mix()` on
any color format, so hex works with alpha and is also legible when
scanning against Figma. Earlier versions of this file used HSL triplets;
the migration to hex was driven by 1:1 Figma traceability.

**Why are accent scales shared instead of per-theme?**
Red means "danger" and green means "success" regardless of the brand
color. Sharing them keeps semantic consistency and avoids 6× duplication
across every theme file.

**How do I do server-side / SSR theming?**
Render `<html data-theme="purple">` server-side. `<ThemeProvider>` will
sync to the same attribute on mount; no flash.
