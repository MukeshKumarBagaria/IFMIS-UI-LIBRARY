# UI_LIBRARY_SETUP_GUIDE

# 0. Guiding Principle — SIMPLICITY ABOVE ALL

The library must be trivial to adopt across all 18 modules. If integration takes more than 5 minutes for a developer who has never seen this library, we have failed.

## The 3-step rule

Any module — regardless of stack (CRA, Vite, Next.js, legacy Webpack) — must be able to adopt the library in exactly 3 steps:

1. `npm install @ifmis/ui`
2. Import one CSS file
3. Wrap app in `<ThemeProvider>` and start using components

No `tailwind.config.ts` edits. No build tool configuration. No PostCSS plugins. No environment variables. No peer-dep gymnastics.

## Simplicity rules for every decision

- **Consumer config files touched: 0** (only their app entry + a provider)
- **Things to learn before first component renders: 1** (just import and use)
- **Documentation needed for adoption: a single README "Getting Started" with 3 code blocks**
- **If a feature requires config in 18 places, it does not ship** — solve it inside the library instead
- **Defaults must be correct** — most teams should never pass props beyond `children`
- **Errors must explain the fix** — never just "invalid prop"; say "use variant='primary' instead of variant='blue'"

If a section of this document conflicts with simplicity, simplicity wins.

---

# 1. Goal

Create a centralized enterprise-grade React UI library that:

- works across 18+ React modules
- supports centralized updates
- supports semantic versioning
- supports multiple themes
- supports future scaling
- maintains design consistency
- supports accessibility standards
- integrates with self-hosted GitLab
- supports Storybook documentation
- supports dark mode and white-labeling
- can evolve into a complete design system

---

# 2. Enterprise Architecture Overview

```
Figma Design System
        ↓
Design Tokens
        ↓
Semantic Tokens
        ↓
Theme Engine
        ↓
Reusable UI Components
        ↓
Storybook Documentation
        ↓
GitLab Package Registry
        ↓
18+ React Applications
```

---

# 3. Final Recommended Tech Stack

| Purpose | Technology |
| --- | --- |
| UI Framework | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Variant Management | class-variance-authority |
| Utility Classes | clsx + tailwind-merge |
| Accessibility Primitives | Radix UI |
| Component Documentation | Storybook |
| Build Tool | Vite |
| Package Distribution | npm |
| Registry | GitLab Package Registry |
| Testing | Vitest |
| Linting | ESLint |
| Formatting | Prettier |
| CI/CD | GitLab CI |

---

# 4. High-Level Enterprise Folder Structure

```
company-ui-library/
│
├── .storybook/
│
├── src/
│   │
│   ├── components/
│   │
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   ├── Tabs/
│   │   │   ├── Checkbox/
│   │   │   ├── Radio/
│   │   │   ├── Tooltip/
│   │   │   ├── Toast/
│   │   │   ├── Badge/
│   │   │   ├── Avatar/
│   │   │   ├── Dropdown/
│   │   │   ├── Popover/
│   │   │   └── Card/
│   │   │
│   │   ├── form/
│   │   │   ├── FormField/
│   │   │   ├── FormLabel/
│   │   │   ├── FormError/
│   │   │   └── FormGroup/
│   │   │
│   │   ├── data-display/
│   │   │   ├── DataTable/
│   │   │   ├── EmptyState/
│   │   │   ├── StatusPill/
│   │   │   ├── Timeline/
│   │   │   └── StatisticCard/
│   │   │
│   │   ├── feedback/
│   │   │   ├── Alert/
│   │   │   ├── Loader/
│   │   │   ├── Skeleton/
│   │   │   └── Progress/
│   │   │
│   │   └── navigation/
│   │       ├── Sidebar/
│   │       ├── Navbar/
│   │       ├── Breadcrumb/
│   │       ├── Pagination/
│   │       └── Stepper/
│   │
│   ├── layouts/
│   │   ├── DashboardLayout/
│   │   ├── AuthLayout/
│   │   ├── FormLayout/
│   │   └── PageContainer/
│   │
│   ├── themes/
│   │   ├── light/
│   │   │   ├── colors.css
│   │   │   └── index.ts
│   │   │
│   │   ├── dark/
│   │   │   ├── colors.css
│   │   │   └── index.ts
│   │   │
│   │   ├── government/
│   │   │   ├── colors.css
│   │   │   └── index.ts
│   │   │
│   │   ├── high-contrast/
│   │   │   ├── colors.css
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── providers/
│   │   ├── ThemeProvider/
│   │   ├── ToastProvider/
│   │   └── ConfigProvider/
│   │
│   ├── tokens/
│   │   ├── primitive/
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   ├── radius.ts
│   │   │   ├── typography.ts
│   │   │   └── shadows.ts
│   │   │
│   │   ├── semantic/
│   │   │   ├── light.ts
│   │   │   ├── dark.ts
│   │   │   ├── government.ts
│   │   │   └── highContrast.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useDisclosure.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useDebounce.ts
│   │   └── useKeyboard.ts
│   │
│   ├── lib/
│   │   ├── cn.ts
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── accessibility.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── animations.css
│   │   └── tailwind.css
│   │
│   ├── icons/
│   │
│   ├── types/
│   │   └── global.ts
│   │
│   └── index.ts
│
├── tests/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── .npmrc
├── .gitignore
├── .eslintrc
├── .prettierrc
├── README.md
└── .gitlab-ci.yml
```

---

# 5. Multi-Theme Architecture (CRITICAL)

# Why Themes Matter

Future requirements may include:

- dark mode
- department-wise branding
- white-labeling
- accessibility themes
- government branding updates
- high contrast themes

Without proper theme architecture:

❌ components become impossible to maintain

---

# 6. Theme System Architecture

```
Primitive Tokens
        ↓
Semantic Tokens
        ↓
CSS Variables
        ↓
Theme Provider
        ↓
Components
```

---

# 7. Primitive Tokens

These are raw design values.

Example:

```
exportconstprimitiveColors= {
  blue500:"#005BAC",
  gray100:"#F1F5F9",
  gray900:"#0F172A",
};
```

---

# 8. Semantic Tokens (IMPORTANT)

Never directly use:

```
blue500
gray900
```

Instead use:

```
primary
background
foreground
border
success
warning
destructive
muted
accent
```

---

# 9. Semantic Theme Example

```
exportconstgovernmentTheme= {
  primary:"#005BAC",
  background:"#FFFFFF",
  foreground:"#0F172A",
  border:"#CBD5E1",
};
```

---

# 10. CSS Variable Strategy

## government/colors.css

```
:root {
--primary:210100%36%;
--background:00%100%;
--foreground:22247%11%;
--border:21432%91%;
}
```

---

# 11. Dark Theme Example

```
.dark {
--primary:210100%60%;
--background:22247%11%;
--foreground:21040%98%;
--border:21733%17%;
}
```

---

# 12. Tailwind Theme Mapping

## tailwind.config.ts

```
colors: {
primary:"hsl(var(--primary))",
background:"hsl(var(--background))",
foreground:"hsl(var(--foreground))",
border:"hsl(var(--border))",
}
```

---

# 13. Correct Component Styling Strategy

BAD:

```
className="bg-blue-600 text-white"
```

GOOD:

```
className="bg-primary text-primary-foreground"
```

This enables unlimited theming.

---

# 14. Theme Provider Architecture

```
providers/
 └── ThemeProvider/
```

---

# 15. Theme Provider Example

```
typeTheme=
|"light"
|"dark"
|"government"
|"high-contrast";
```

---

# 16. Theme Usage Example

```
<ThemeProvidertheme="government">
<App/>
</ThemeProvider>
```

---

# 17. Why Accessibility Still Matters

Even with custom components:

- keyboard navigation
- focus management
- screen readers
- semantic markup
- modal focus traps

are extremely difficult to build correctly repeatedly.

Use Radix only for:

- Dialog
- Select
- Dropdown
- Tooltip
- Tabs
- Popover

Everything else can remain fully custom-styled.

---

# 18. Important Enterprise Rule

# NEVER Add Business Logic Inside UI Library

BAD:

```
<BeneficiaryApprovalTable/>
```

GOOD:

```
<Table/>
```

The library must remain:

- generic
- reusable
- scalable

---

# 19. Recommended Component Design Principles

All components must be:

- reusable
- configurable
- theme-aware
- responsive
- accessible
- composable
- independent of business logic

---

# 20. Component Folder Structure

```
Button/
├── Button.tsx
├── Button.types.ts
├── Button.styles.ts
├── Button.stories.tsx
├── Button.test.tsx
└── index.ts
```

---

# 21. Enterprise Button Example

```
import {cva }from"class-variance-authority";

constbuttonVariants=cva(
"rounded-xl font-medium transition-all",
  {
    variants: {
      variant: {
        primary:
"bg-primary text-primary-foreground",

        secondary:
"bg-secondary text-secondary-foreground",
      },

      size: {
        sm:"h-9 px-3",
        md:"h-10 px-4",
        lg:"h-11 px-6",
      },
    },

    defaultVariants: {
      variant:"primary",
      size:"md",
    },
  }
);
```

---

# 22. Storybook Integration

Purpose:

- design reference
- component playground
- documentation portal
- developer onboarding

Run:

```
npm run storybook
```

---

# 23. GitLab Package Registry Flow

## Publish

```
npm publish
```

---

## Install In Modules

```
npm install @company/ui
```

---

# 24. Semantic Versioning (CRITICAL)

Format:

```
MAJOR.MINOR.PATCH
```

| Change | Version |
| --- | --- |
| Bug fix | 1.0.1 |
| New component | 1.1.0 |
| Breaking changes | 2.0.0 |

---

# 25. Recommended CI/CD

## .gitlab-ci.yml

```
stages:
  - lint
  - test
  - build
  - publish

lint:
  stage: lint
  script:
    - npm install
    - npm run lint

test:
  stage: test
  script:
    - npm run test

build:
  stage: build
  script:
    - npm run build

publish:
  stage: publish
  script:
    - npm publish
```

---

# 26. Recommended Development Workflow

```
Figma Design
      ↓
Design Tokens
      ↓
Build Component
      ↓
Storybook Documentation
      ↓
Testing
      ↓
Version Bump
      ↓
Publish
      ↓
Module Projects Update
```

---

# 27. Recommended Initial Component Priority

Phase 1:

- Typography
- Button
- Input
- Card
- Modal

Phase 2:

- Select
- Tabs
- Table
- Sidebar
- Toast

Phase 3:

- Charts
- Data Grid
- File Upload
- Workflow Components
- Advanced Forms

---

# 28. Enterprise Best Practices

## DO

✅ Keep components generic

✅ Use semantic tokens

✅ Use centralized themes

✅ Maintain accessibility

✅ Use Storybook

✅ Version every release

✅ Keep APIs consistent

✅ Use TypeScript strictly

✅ Create reusable hooks

---

# 29. DO NOT

❌ Hardcode colors

❌ Put APIs inside components

❌ Add business workflows

❌ Duplicate components

❌ Skip versioning

❌ Directly use primitive colors inside components

---

# 30. Final Enterprise Architecture

```
Figma Design System
        ↓
Primitive Tokens
        ↓
Semantic Tokens
        ↓
Theme Engine
        ↓
Reusable Components
        ↓
Storybook
        ↓
GitLab Package Registry
        ↓
18+ React Applications
```

---

# 31. Final Recommendation

Your ideal long-term enterprise setup is:

```
Separate UI Library Repository
        +
Multi-Theme Architecture
        +
Semantic Design Tokens
        +
GitLab Package Registry
        +
React + TypeScript
        +
Tailwind CSS
        +
Storybook
        +
Semantic Versioning
```

This architecture is:

- enterprise scalable
- theme scalable
- maintainable
- reusable
- future-proof
- white-label ready
- accessibility-ready
- optimized for large frontend ecosystems

# Icons Handling - Re-export the Entire Phosphor Library Through Your UI Package

NOT manual mappings.

---

# BEST Architecture For Your Case

Instead of this:

```
<Iconname="home"/>
```

Use direct icon imports:

```
import {House }from"@ifmis/ui/icons";
```

This is the correct scalable enterprise approach.

---

# Recommended Architecture

```
@ifmis/ui
│
├── components/
├── themes/
├── tokens/
└── icons/
```

---

# Inside icons/

```
src/icons/index.ts
```

Simply re-export Phosphor:

```
export*from"@phosphor-icons/react";
```

That’s it.

---

# Then Developers Use

```
import {
House,
User,
Bell,
Gear
}from"@ifmis/ui/icons";
```

---

## 1. Zero Maintenance

No mappings.

No manual exports.

No wrapper hell.

---

# 2. Tree Shaking Works Properly

Only imported icons get bundled.

Example:

```
import {House }from"@ifmis/ui/icons";
```

Only `House` is included.

Not all 2000 icons.

This is extremely important.

---

# 3. Keeps Design Consistent

Since Figma also uses Phosphor:

✅ same naming

✅ same visual language

✅ same icon weights

✅ easier developer handoff

---

# 4. Future Flexibility

Later if you switch libraries:

```
Phosphor → Lucide
```

you only change internal exports.

All projects continue using:

```
@ifmis/ui/icons
```

This abstraction is valuable.

---

# 5. Supports Theming Automatically

Phosphor icons use:

```
currentColor
```

So:

```
text-primary
text-danger
text-muted
```

works automatically with your theme engine.

---

# Recommended Folder Structure

```
src/
│
├── icons/
│   ├── index.ts
│   ├── custom/
│   │   ├── IFMISLogo.tsx
│   │   ├── DepartmentSeal.tsx
│   │   └── SchemeIcon.tsx
│   │
│   └── README.md
```

---

# index.ts

```
export*from"@phosphor-icons/react";
```

---

# Custom Icons Strategy

ONLY keep custom icons for:

- IFMIS branding
- department logos
- illustrations
- unique workflow icons

NOT standard UI icons.

---

# Best Practice For Developers

## Correct

```
import {
House,
User,
Bell
}from"@ifmis/ui/icons";
```

---

## Wrong

```
import {House }from"@phosphor-icons/react";
```

Why?

Because all apps should depend only on:

```
@ifmis/ui
```

not directly on external UI dependencies.

This centralizes control.

---

# Recommended Package Structure

```
@ifmis/ui
@ifmis/ui/icons
@ifmis/ui/themes
@ifmis/ui/tokens
```

---

# Optional Better Enterprise Structure

You can even separate icons later:

```
@ifmis/icons
```

But initially:

```
@ifmis/ui/icons
```

is perfectly fine.

---

# Final Recommendation

For IFMIS:

# DO THIS

## src/icons/index.ts

```
export*from"@phosphor-icons/react";
```

## Usage

```
import {House }from"@ifmis/ui/icons";
```

## Keep ONLY custom icons locally

```
IFMIS logos
department logos
illustrations
special graphics
```

---

# 32. Package Distribution Configuration (CRITICAL)

The `package.json` must be configured precisely — this controls how 18 modules consume the library.

## Required fields

```json
{
  "name": "@ifmis/ui",
  "version": "0.1.0",
  "type": "module",
  "sideEffects": ["**/*.css"],
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./icons": {
      "types": "./dist/icons/index.d.ts",
      "import": "./dist/icons/index.js"
    },
    "./themes": {
      "types": "./dist/themes/index.d.ts",
      "import": "./dist/themes/index.js"
    },
    "./tokens": {
      "types": "./dist/tokens/index.d.ts",
      "import": "./dist/tokens/index.js"
    },
    "./tailwind-preset": "./dist/tailwind-preset.js",
    "./styles.css": "./dist/styles.css"
  },
  "files": ["dist"],
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

## Why this matters

- `peerDependencies` — prevents duplicate React copies across 18 modules
- `sideEffects` — enables tree-shaking; CSS files are the only side-effectful imports
- `exports` subpaths — `@ifmis/ui/icons` works without bundling the whole library
- ESM-only — modern bundlers (Vite, Next 13+, Webpack 5) all support it; drop CJS unless a module is stuck on legacy

---

# 33. Distribution Strategy — Pre-Compiled CSS (Simplicity First)

**Adoption goal: 3 steps, zero config files touched.**

The library compiles its own Tailwind internally and ships ONE CSS file. Consumer apps do NOT need Tailwind installed. They do NOT edit `tailwind.config.ts`. They do NOT scan library files.

## The 3-step adoption (this is the entire integration)

```bash
# Step 1: install
npm install @ifmis/ui
```

```ts
// Step 2: import CSS once in your app entry
import "@ifmis/ui/styles.css";
```

```tsx
// Step 3: wrap your app and use components
import { ThemeProvider, Button } from "@ifmis/ui";

<ThemeProvider theme="government">
  <Button variant="primary">Submit</Button>
</ThemeProvider>
```

That's it. Works in any React app — CRA, Vite, Next.js, Remix, legacy Webpack — regardless of whether they use Tailwind, CSS Modules, styled-components, or nothing.

## Why pre-compiled CSS

| Approach | Consumer effort | Works for non-Tailwind apps |
| --- | --- | --- |
| **Pre-compiled CSS (chosen)** | Import 1 file | Yes |
| Tailwind preset + content scan | Edit config in every app | No |
| CSS-in-JS runtime | Install runtime deps | Yes but heavier |

For 18 modules with mixed stacks, pre-compiled CSS is the only approach that adopts in minutes per app.

## Optional escape hatch (advanced)

If a team wants to use Tailwind utilities themselves AND have them share tokens with the library, ship an optional preset at `@ifmis/ui/tailwind-preset`. Document it as optional — 95% of teams won't need it.

## What the library does internally

- Uses Tailwind during its own build only
- Outputs `dist/styles.css` containing: CSS variables for all themes + every utility class used by library components
- Consumer's bundle adds ~15-30KB gzipped CSS (one time, cached)

---

# 34. Tailwind Version — v4 (Locked)

**Decision: Tailwind CSS v4.**

## Why v4

- CSS-first configuration via `@theme` and `@import "tailwindcss"` — no `tailwind.config.ts` to maintain
- Built-in Vite plugin (`@tailwindcss/vite`) — no PostCSS, no autoprefixer config
- ~5x faster builds, smaller output
- Native CSS variables — perfect fit for our multi-theme architecture
- Lightning CSS handles vendor prefixes automatically

## What this changes for the library

- No `tailwind.config.ts` file
- No `postcss.config.js` file
- All token-to-utility mapping lives inside `src/styles/globals.css` under `@theme { }`
- Theme switching uses `@custom-variant` with our `[data-theme="..."]` attribute

## What this changes for consumers

Nothing. Pre-compiled CSS distribution (§33) hides Tailwind entirely from consuming apps. They never see v3 vs v4.

---

# 35. Forms Strategy (CRITICAL FOR 18 GOVT MODULES)

Forms dominate govt applications. Standardize once.

## Stack

```
react-hook-form  (state + validation engine)
zod              (schema validation)
@ifmis/ui FormField, FormError (presentation)
```

## Pattern

```tsx
const schema = z.object({
  beneficiaryId: z.string().min(1, "Required"),
});

const form = useForm({ resolver: zodResolver(schema) });

<FormField
  control={form.control}
  name="beneficiaryId"
  label="Beneficiary ID"
  render={({ field }) => <Input {...field} />}
/>
```

The library's `FormField` integrates with `react-hook-form`'s `Controller` — it is NOT a dumb wrapper. This is the only acceptable deviation from "no business logic" since form handling is presentation infrastructure, not business logic.

---

# 36. DataTable Strategy

Build on top of `@tanstack/react-table` (headless). Do NOT roll your own table engine.

```
@tanstack/react-table  →  engine (sorting, filtering, pagination, virtualization)
@ifmis/ui DataTable    →  styled shell + sensible defaults
```

Standard props: `columns`, `data`, `pageSize`, `onSortChange`, `serverSide`, `loading`, `emptyState`.

For server-side data, document the contract:

```ts
type ServerQuery = {
  page: number;
  pageSize: number;
  sort?: { id: string; desc: boolean }[];
  filters?: Record<string, unknown>;
};
```

---

# 37. Date / Time / Number Components

Govt forms = dates and currency everywhere. Plan these in Phase 1, not later.

| Component | Base library |
| --- | --- |
| DatePicker | react-day-picker |
| DateRangePicker | react-day-picker |
| TimePicker | custom on top of Input |
| NumberInput | custom (locale-aware) |
| CurrencyInput | custom (₹ + locale formatting) |

Use `Intl.NumberFormat` and `Intl.DateTimeFormat` — do NOT add moment.js or date-fns globally. If a date utility is needed, `date-fns` per-function imports only.

---

# 38. Component API Consistency Rules (LOCK THIS EARLY)

Inconsistent APIs across 50+ components cause more pain than missing components. Codify:

| Concept | Convention |
| --- | --- |
| Controlled value | `value` + `onValueChange` (Radix-style, not `onChange`) |
| Open/close | `open` + `onOpenChange` + `defaultOpen` |
| Size scale | `"sm" \| "md" \| "lg"` (never `"small"`, never numbers) |
| Variant | `variant` prop, never `type` |
| Disabled | `disabled` boolean, never `isDisabled` |
| Loading | `loading` boolean |
| Refs | All components use `React.forwardRef` |
| Composition | Support `asChild` (Radix Slot) where it makes sense |
| ClassName | Always accept and merge via `cn()` |
| Children | Prefer composition over config props for complex content |

Document this in `CONTRIBUTING.md`. Reject PRs that violate it.

---

# 39. forwardRef + asChild Pattern

Every component must:

1. Use `React.forwardRef` so refs flow through
2. Accept `className` and merge with `cn(baseClasses, className)`
3. Spread remaining props onto the root element

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
```

`asChild` (from `@radix-ui/react-slot`) lets consumers compose: `<Button asChild><Link to="/x">Go</Link></Button>`.

---

# 40. Z-Index Scale + Portal Strategy

Layering bugs (modal under dropdown, toast under modal) are guaranteed without a scale.

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1100;
--z-overlay: 1200;
--z-modal: 1300;
--z-popover: 1400;
--z-tooltip: 1500;
--z-toast: 1600;
```

All floating UI (Modal, Popover, Tooltip, Toast, Dropdown) renders into a single `<div id="ifmis-portal-root">` appended to body. ThemeProvider mounts this and applies the theme class to it (so portaled content inherits theme).

---

# 41. Internationalization & RTL

Even if launch is English-only, build RTL-safe from day one. Retrofitting later costs more.

## Rules

- Use logical CSS properties: `ms-2` not `ml-2`, `pe-4` not `pr-4` (Tailwind has these built in)
- All user-facing strings flow through an i18n key, never hardcoded
- Number, date, currency via `Intl.*` with explicit locale
- `dir="rtl"` on `<html>` must not break any component — test in Storybook with a `dir` toolbar addon

## Recommended

```
react-i18next  (or formatjs)
```

The library itself ships only English defaults for ARIA labels; consumers provide translations via a `<ConfigProvider locale="hi-IN" messages={...}>`.

---

# 42. Release Management (Changesets)

Do not bump versions manually across an 18-app ecosystem.

```
@changesets/cli
```

## Workflow

1. Every PR includes a changeset file: `npx changeset` (prompts for patch/minor/major + description)
2. CI on merge to `main` opens a "Version Packages" PR aggregating changesets
3. Merging that PR triggers publish to GitLab registry

This gives you automatic CHANGELOG.md, correct semver, and a single chokepoint for releases.

---

# 43. Visual Regression Testing

Theming changes silently break 18 apps without visual coverage. Storybook + screenshot diffing is non-negotiable.

## Options

| Tool | Notes |
| --- | --- |
| Chromatic | Hosted, easiest, paid |
| Playwright + Storybook test-runner | Self-hosted, free, more setup |
| Loki | Self-hosted, simpler than Playwright |

Run on every PR. Block merge on unreviewed visual diffs.

---

# 44. Bundle Size Budget

```
size-limit
```

In CI, enforce per-entry budgets:

```json
[
  { "path": "dist/index.js", "limit": "60 KB" },
  { "path": "dist/icons/index.js", "limit": "5 KB" }
]
```

Fail the build if exceeded. Forces conscious decisions about new dependencies.

---

# 45. Token Sync from Figma

Manual token duplication between Figma and code drifts within weeks.

## Recommended

```
Tokens Studio (Figma plugin)  →  tokens.json  →  Style Dictionary  →  primitive/*.ts + CSS vars
```

Designers edit tokens in Figma. A script (run weekly or via CI) regenerates `src/tokens/primitive/*` and `src/themes/*/colors.css`. Semantic mapping stays in code.

---

# 46. Browser Support Matrix

Declare it in README. Without this, every bug report turns into a browser-version debate.

```
Chrome / Edge: last 2 stable
Firefox:       last 2 stable
Safari:        last 2 stable
Mobile Safari: iOS 15+
Chrome Android: last 2 stable
NO Internet Explorer
```

Drives Babel/SWC targets and CSS feature usage (e.g., `:has()` requires Safari 15.4+).

---

# 47. Density Modes

Govt data screens (registers, ledgers, reports) need tighter spacing than dashboards.

```tsx
<ConfigProvider density="compact">
  <DataTable ... />
</ConfigProvider>
```

Density: `"compact" | "comfortable" | "spacious"`. Components read it via context and adjust padding/height.

---

# 48. Deprecation Policy

When removing or renaming a component/prop:

1. Mark with JSDoc `@deprecated` + replacement guidance
2. Emit `console.warn` in development (silent in production)
3. Keep for at least 1 minor version
4. Remove only in next major

Document in CHANGELOG and a `MIGRATION.md` per major version.

---

# 49. Adoption Playbook for 18 Existing Modules

Adoption is intentionally trivial. No big migration plan needed — teams adopt at their own pace.

## Day 1 for any module (15 minutes)

```bash
npm install @ifmis/ui
```

```ts
// app entry
import "@ifmis/ui/styles.css";
```

```tsx
// root component
import { ThemeProvider } from "@ifmis/ui";
<ThemeProvider theme="government"><App /></ThemeProvider>
```

Done. The app still works exactly as before. Old components untouched.

## Incremental replacement (no deadline)

Whenever a developer touches a screen, they can swap one component:

```tsx
// before
import { Button } from "../components/Button";

// after
import { Button } from "@ifmis/ui";
```

No coordinated migration. No tracking spreadsheet. No phase gates. Each module's team replaces components as they happen to edit files.

## When all modules are on it

Once usage is high, delete each module's legacy component folder. No rush.

---

# 50. Contribution & Governance

## Required for any new component PR

- [ ] `*.tsx` with `forwardRef` and `cn(className)` merge
- [ ] `*.types.ts` with exported prop interface
- [ ] `*.stories.tsx` covering all variants + sizes + states (default, hover, disabled, loading, error)
- [ ] `*.test.tsx` with at least: renders, fires events, respects disabled, a11y check
- [ ] Storybook story passes visual regression
- [ ] Bundle size budget not exceeded
- [ ] Changeset file included
- [ ] Documented in Storybook MDX (props table + usage examples)
- [ ] Keyboard navigation verified
- [ ] Tested in light + dark + government themes
- [ ] Tested with `dir="rtl"`

## RFC process

For new patterns (not just new components), open an RFC issue first. Avoids retroactive API changes.

---

# 51. Final Recommended Phase 1 Deliverables

Before publishing v1.0.0, the following must exist:

1. `package.json` with correct exports/peerDeps/sideEffects
2. Tailwind preset + global CSS bundle
3. ThemeProvider + ConfigProvider (locale, density)
4. Tokens: primitive + semantic for light, dark, government
5. Primitives: Button, Input, Label, Card, Modal/Dialog, Tooltip, Toast
6. Form layer: FormField, FormError integrated with react-hook-form
7. Icons re-export from Phosphor
8. Storybook deployed to internal URL
9. Changesets + GitLab CI pipeline publishing on merge
10. README + CONTRIBUTING + MIGRATION docs
11. Visual regression baseline captured
12. One pilot module migrated and running in production

Only then begin Phase 2 (Select, Tabs, DataTable, Sidebar, DatePicker).
