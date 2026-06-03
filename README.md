# @ifmis/ui

Shared React UI library for IFMIS — **themeable, accessible, fully typed,
trivial to adopt**.

- ✅ 30+ Figma-faithful components (Button, Input, Card, ActionCard,
  ProgressStepper, ProgressCard, ConfirmationPopup, OtpDialog, Header,
  Sidebar, and more)
- ✅ Built on Tailwind v4 `@theme` tokens — switchable themes (`purple`,
  `dark`), zero Tailwind setup in the consumer.
- ✅ Tree-shakeable ESM + TS types. Works in Vite, Next.js, and any
  bundler that can read `package.json#exports`.
- ✅ Full Storybook with Foundations docs (Colors, Typography, Spacing,
  Shadows, Theming) plus a how-to-use MDX guide for every component.
- ✅ 100+ unit tests, strict TS, ESLint.

---

## Install

```bash
npm install @ifmis/ui
```

> First time? Wire the consumer `.npmrc` to read from our GitLab registry —
> see [PUBLISHING.md §7](./PUBLISHING.md#7-consuming-the-package).

Peer deps `react` and `react-dom` come from the host app (`>=18`).

---

## Adopt — three steps

```ts
// 1. Import the styles ONCE at the app root (main.tsx / _app.tsx).
import "@ifmis/ui/styles.css";
```

```tsx
// 2. Wrap the app with ThemeProvider.
import { ThemeProvider } from "@ifmis/ui";

export default function App() {
  return (
    <ThemeProvider theme="purple">
      <Routes />
    </ThemeProvider>
  );
}
```

```tsx
// 3. Use the components.
import { Button, ProgressStepper, ConfirmationPopup } from "@ifmis/ui";

<Button variant="primary" leftIcon={<FloppyDisk />}>
  Save
</Button>;
```

That's it. **No Tailwind setup, no PostCSS config, no build changes**, no
copying CSS variables. The library brings everything it needs.

---

## Documentation

The component playground (Storybook) is the canonical reference. Run it
locally:

```bash
npm install
npm run storybook        # http://localhost:6006
```

Or browse the hosted Storybook at the URL in
[PUBLISHING.md §12](./PUBLISHING.md#12-storybook-deployment-gitlab-pages).

### Foundations

Every visible part of every component comes from a token. The
**Foundations** section in Storybook is the single source of truth:

| Page                                  | What it covers                                                  |
| ------------------------------------- | --------------------------------------------------------------- |
| Foundations → Introduction            | How the theming / tokens / Tailwind layers fit together.        |
| Foundations → Colors                  | Every brand ramp + every semantic colour token, live swatches.  |
| Foundations → Typography              | Heading + body scale, weights, colour roles.                    |
| Foundations → Spacing & Radius        | The 4-px scale + corner-radius conventions.                     |
| Foundations → Shadows                 | Elevation tokens.                                               |
| Foundations → Theming                 | `<ThemeProvider>`, dark mode, registering a new theme.          |

> **Rule of thumb.** If a colour, size, padding, or shadow isn't on a
> Foundations page, **raise it as a token first** — don't hard-code it in
> a consumer.

### Components

Each component has a `Guide` doc with: variants, props, examples,
accessibility notes, responsive behaviour, and best-practices. Pinned in
the Storybook sidebar under `UI → <Name> → Guide`.

---

## Themes

`@ifmis/ui` ships **two themes**:

| Name      | Mode  | Description                          |
| --------- | ----- | ------------------------------------ |
| `purple`  | light | IFMIS default brand theme (default). |
| `dark`    | dark  | Dark companion theme.                |

```tsx
<ThemeProvider theme="dark">{children}</ThemeProvider>
```

To add a third theme (`government`, `high-contrast`, …), follow the
walkthrough in **Foundations → Theming**. The whole flow is one CSS file
plus one registry entry — components do not change.

---

## Typography

```tsx
import { Heading, Text } from "@ifmis/ui";

<Heading level={1}>Dashboard</Heading>
<Heading level={3}>Recent transactions</Heading>

<Text>Default paragraph copy.</Text>
<Text size="xs" weight="medium">Form field label</Text>
<Text size="xs" color="secondary">Helper text under a field</Text>
```

| Component                  | Props                                                  | Use for                            |
| -------------------------- | ------------------------------------------------------ | ---------------------------------- |
| `<Heading level={1..6}>`   | `level`, `as`, `align`, `className`                    | Page, section, card titles         |
| `<Text>`                   | `size`, `weight`, `color`, `as`, `align`, `truncate`   | Paragraphs, labels, captions       |

Sizes map to Figma exactly: `xs=14`, `sm=16`, `md=18`, `lg=20`. Headings
range 14–32. Full reference in **Foundations → Typography**.

---

## Icons

Re-exported from [`@phosphor-icons/react`](https://phosphoricons.com/)
under the `/icons` sub-path, so consumers don't add a second dependency:

```tsx
import { House, User, Bell } from "@ifmis/ui/icons";

<House size={20} weight="fill" />
```

Icons inherit `currentColor`, so they match whatever text colour they
sit next to.

---

## Development

```bash
npm install
npm run storybook        # component playground at http://localhost:6006
npm run test             # vitest in CI mode
npm run test:watch       # vitest watch mode
npm run typecheck        # tsc --noEmit (strict)
npm run lint             # eslint
npm run format           # prettier --write
npm run build            # build the library to ./dist
npm run build-storybook  # build the docs site to ./storybook-static
```

Pre-MR gates: **typecheck + lint + test** must all be green. CI runs the
same three on every push and MR; see PUBLISHING.md §6.

---

## Project layout

```
src/
├── components/ui/        primitives (Button, Input, ProgressCard, …)
├── foundations/          standalone Storybook docs (Colors, Typography, …)
├── providers/            ThemeProvider, hook
├── themes/               theme registry + types
├── icons/                re-export of @phosphor-icons/react
├── lib/                  cn() and small helpers
├── styles/
│   ├── globals.css       Tailwind @theme block + base
│   └── themes/           one CSS file per theme + shared brand ramps
└── test/                 vitest setup
```

Each component lives in its own folder with **five files**:

```
ComponentName/
├── ComponentName.tsx       implementation
├── ComponentName.stories.tsx   Storybook stories
├── ComponentName.test.tsx  unit tests (vitest + RTL)
├── ComponentName.mdx       how-to-use guide
└── index.ts                public re-exports
```

When adding a component, follow that shape exactly — the library memory
relies on it.

---

## Releasing

The full release flow (SemVer policy, CI pipeline, hotfix flow, Storybook
deployment, troubleshooting) lives in **[PUBLISHING.md](./PUBLISHING.md)**.

The TL;DR:

```bash
# After landing your changes on main:
npm version minor -m "release: %s"
git push origin main --follow-tags
```

The CI publishes on the tag.

If you're cutting `v0.1.0` for the very first time, read
[PUBLISHING.md §0](./PUBLISHING.md#0-bootstrap-to-v010--the-first-launch) —
it walks through bootstrapping a fresh self-hosted GitLab project end-to-end.

---

## Contributing

1. Open an issue first if the change is non-trivial — designs land in
   Figma before they land in code.
2. Branch off `main`. Naming: `feat/...`, `fix/...`, `chore/...`.
3. Write the test first; make it pass; make it pretty.
4. Update the MDX guide if you added a prop, variant, or behaviour.
5. Bump the CHANGELOG under `## Unreleased` in your MR.

See **[PUBLISHING.md §8](./PUBLISHING.md#8-day-2-making-changes)** for
the full MR checklist.

---

## License

`UNLICENSED` — internal IFMIS use only. The package is published to a
private GitLab registry; the source is not distributed externally.
