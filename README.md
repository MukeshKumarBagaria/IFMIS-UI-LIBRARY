# @ifmis/ui

Shared React UI library for IFMIS — **themeable, accessible, fully typed,
trivial to adopt**.

- ✅ 35+ Figma-faithful components (Button, TextField, DataTable, ActionCard,
  ProgressStepper, ConfirmationPopup, OtpDialog, Header, Sidebar, and more).
- ✅ Built on Tailwind v4 `@theme` tokens — switchable themes (`purple`, `dark`),
  **zero Tailwind setup in the consumer**.
- ✅ Tree-shakeable ESM + TypeScript types. Works in Vite, Next.js, and any
  bundler that reads `package.json#exports`.
- ✅ Full Storybook with Foundations docs (Colors, Typography, Spacing, Shadows,
  Theming) plus a how-to-use guide for every component.
- ✅ 300+ unit tests, strict TypeScript, ESLint 9.

> **Maintainers / releasing:** how to cut a release, the changelog rules, and the
> CI roadmap live in **[PUBLISHING.md](./PUBLISHING.md)**. This README is for
> *consumers* of the library.

---

## 1. Install

`@ifmis/ui` is served from the **internal IFMIS npm registry (Verdaccio)** at
**`http://172.18.210.110:6379/`**. That registry does two jobs at once:

- it **hosts `@ifmis/ui`**, and
- it **proxies the public npm registry**, so `react`, `@phosphor-icons/react`,
  and every other dependency come from the same place.

That means a consuming project needs **one registry**, and you must be on the
**IFMIS network / VPN** to reach it. You do **not** need separate public-internet
access — Verdaccio fetches and caches public packages for you.

### 1.1 Point your project at the registry

Create an `.npmrc` at the **root of your consuming project**:

```ini
registry=http://172.18.210.110:6379/
//172.18.210.110:6379/:_authToken=${IFMIS_NPM_TOKEN}
```

> **`registry=`** (not `@ifmis:registry=`) is deliberate — it routes **all**
> installs through Verdaccio, which is what lets one URL serve both `@ifmis/ui`
> and its public dependencies.

Set the token once (don't paste the literal token into a committed file):

```bash
# macOS/Linux
export IFMIS_NPM_TOKEN=<your token>
```
```powershell
# Windows PowerShell — set it permanently for your user:
[Environment]::SetEnvironmentVariable("IFMIS_NPM_TOKEN", "<your token>", "User")
# (open a new terminal afterwards)
```

- **Where the token comes from:** ask a maintainer for an internal registry
  token. **Never commit a real token** — `.npmrc` with a literal token must be
  in `.gitignore`; the `${IFMIS_NPM_TOKEN}` form above is safe to commit because
  the secret lives in your environment, not the file.

### 1.2 Install

```bash
npm install @ifmis/ui
```

`react` and `react-dom` (`>=18`) are **peer dependencies** — they come from your
app, not from this library.

---

## 2. Adopt — three steps

```ts
// 1. Import the styles ONCE at the app root (main.tsx / _app.tsx / layout.tsx).
import "@ifmis/ui/styles.css";
```

```tsx
// 2. Wrap your app in <ThemeProvider>.
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
// 3. Use components anywhere below the provider.
import { Button } from "@ifmis/ui";
import { FloppyDisk } from "@ifmis/ui/icons";

<Button variant="primary" leftIcon={<FloppyDisk />}>
  Save
</Button>;
```

That's it — **no Tailwind config, no PostCSS, no build changes, no copying CSS
variables**. The library brings everything it needs.

---

## 3. Theming

`@ifmis/ui` ships two themes out of the box:

| Name     | Mode  | Description                          |
| -------- | ----- | ------------------------------------ |
| `purple` | light | IFMIS default brand theme (default). |
| `dark`   | dark  | Dark companion theme.                |

`<ThemeProvider>` writes `data-theme="..."` onto `<html>`; every component reads
its colours from the matching CSS variables. Two usage modes:

```tsx
// Uncontrolled — provider owns the state, switch via useTheme().
<ThemeProvider defaultTheme="purple">{children}</ThemeProvider>

// Controlled — your app's settings store owns the value.
<ThemeProvider theme={settings.theme}>{children}</ThemeProvider>
```

```tsx
// Build a theme switcher from the registry — no hard-coded list.
import { useTheme, themes } from "@ifmis/ui";

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value as typeof theme)}>
      {themes.map((t) => (
        <option key={t.name} value={t.name}>{t.label}</option>
      ))}
    </select>
  );
}
```

Registry helpers exported for advanced use: `themes`, `THEME_NAMES`,
`DEFAULT_THEME`, `getTheme(name)`, `isTheme(value)`, and the `Theme` /
`ThemeDefinition` / `ThemeMode` types. To **add** a theme, see
`src/themes/registry.ts` and **Foundations → Theming** in Storybook.

---

## 4. What's in the box

The component playground (Storybook) is the canonical, always-current reference.
At a glance:

| Group                | Components                                                                              |
| -------------------- | -------------------------------------------------------------------------------------- |
| **Layout & chrome**  | `Header` (+ parts), `Sidebar` (+ parts), `Breadcrumb`, `PageTitle`, `SectionTitle`, `CtaTray`, `Scrollbar` |
| **Buttons**          | `Button`, `FormButton` + presets (`SaveButton`, `SubmitButton`, `ApproveButton`, `RejectButton`, `ReturnButton`, `ResetButton`, `ForwardButton`) |
| **Forms & inputs**   | `FormField`, `TextField`, `Textarea`, `Dropdown`, `SearchField`, `Checkbox`, `CheckboxCard`, `Toggle`, `SelectionPill`, `Label`, `OtpInput`, `Upload` |
| **Feedback / overlay** | `Banner`, `ConfirmationPopup`, `HoverPill`, `OtpDialog`, `AadhaarESign`                |
| **Data display**     | `DataTable`, `Pagination`, `Badge`, `Accordion`, `Typography` (`Heading`, `Text`)      |
| **Cards & status**   | `ActionCard` (+ compound API), `StatCard`, `ProgressCard`, `ProgressStepper`, `ReferenceIdSuccessCard` |
| **Theming**          | `ThemeProvider`, `useTheme`, theme registry                                             |
| **Utilities**        | `cn()` (class merge), icons via `@ifmis/ui/icons`                                       |

Every component is **fully typed** — import its props type alongside it
(`import { Button, type ButtonProps } from "@ifmis/ui"`).

---

## 5. Typography

```tsx
import { Heading, Text } from "@ifmis/ui";

<Heading level={1}>Dashboard</Heading>
<Heading level={3}>Recent transactions</Heading>

<Text>Default paragraph copy.</Text>
<Text size="xs" weight="medium">Form field label</Text>
<Text size="xs" color="secondary">Helper text under a field</Text>
```

| Component                | Props                                                | Use for                    |
| ------------------------ | ---------------------------------------------------- | -------------------------- |
| `<Heading level={1..6}>` | `level`, `as`, `align`, `className`                  | Page, section, card titles |
| `<Text>`                 | `size`, `weight`, `color`, `as`, `align`, `truncate` | Paragraphs, labels         |

Sizes map to Figma exactly: `xs=14`, `sm=16`, `md=18`, `lg=20`. Full reference in
**Foundations → Typography**.

---

## 6. Icons

Re-exported from [`@phosphor-icons/react`](https://phosphoricons.com/) under the
`/icons` sub-path, so you don't add a second dependency:

```tsx
import { House, User, Bell } from "@ifmis/ui/icons";

<House size={20} weight="fill" />
```

Icons inherit `currentColor`, so they match the text colour they sit next to.

---

## 7. Versioning & upgrades

The library follows **[Semantic Versioning](https://semver.org/)**. While on
`0.x`, treat **minor** bumps as potentially breaking (see
[PUBLISHING.md §5](./PUBLISHING.md#5-versioning-policy-semver)).

- Pin to a caret range (`"^0.1.0"`) to get backwards-compatible patches.
- Pin exactly (`"0.1.0"`) if you need to defer upgrades deliberately.
- Read the **[CHANGELOG](./CHANGELOG.md)** before upgrading — it lists exactly
  what changed in each version.

```bash
npm view @ifmis/ui versions   # list everything in the registry
npm install @ifmis/ui@latest  # move to the newest
```

---

## 8. Troubleshooting installs

| Symptom                                       | Cause                                              | Fix                                                                 |
| --------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| `npm install` → `401 Unauthorized`            | Token missing / expired / not exported.            | Set `IFMIS_NPM_TOKEN` to a valid registry token; open a new shell.  |
| `npm install` → `404 Not Found`               | `.npmrc` `registry=` line wrong/missing.           | Copy §1.1 exactly — it must be `registry=` (not `@ifmis:registry=`).|
| `ETIMEDOUT` to `172.18.210.110:6379`          | Not on the IFMIS network.                          | Connect to the IFMIS network / VPN, then retry.                     |
| A **public** dep (e.g. `react`) fails to install | The registry isn't proxying public npm for you.  | Confirm `.npmrc` uses `registry=` (routes *all* installs via the registry); raise with a maintainer if it persists. |
| Styles look unthemed / default browser CSS    | `styles.css` not imported, or no `ThemeProvider`.  | Import `@ifmis/ui/styles.css` once; wrap the app in the provider.   |

---

## 9. Local development (contributors)

```bash
npm install
npm run storybook        # component playground at http://localhost:6006
npm run test             # vitest (CI mode)
npm run test:watch       # vitest watch mode
npm run typecheck        # tsc --noEmit (strict)
npm run lint             # eslint 9
npm run format           # prettier --write
npm run build            # build the library to ./dist
npm run build-storybook  # build the docs site to ./storybook-static
```

**Pre-MR gates:** `typecheck` + `lint` + `test` must all be green.

### Project layout

```
src/
├── components/ui/   primitives (Button, TextField, DataTable, …)
├── foundations/     standalone Storybook docs (Colors, Typography, …)
├── providers/       ThemeProvider + useTheme
├── themes/          theme registry + types
├── icons/           re-export of @phosphor-icons/react
├── lib/             cn() and small helpers
├── styles/          globals.css (Tailwind @theme) + one css file per theme
└── test/            vitest setup
```

Each component lives in its own folder with **five files** — keep this shape
exactly when adding one:

```
ComponentName/
├── ComponentName.tsx           implementation
├── ComponentName.stories.tsx   Storybook stories
├── ComponentName.test.tsx      unit tests (vitest + Testing Library)
├── ComponentName.mdx           how-to-use guide
└── index.ts                    public re-exports
```

…then add the export to `src/index.ts`. Full contribution + release process:
**[PUBLISHING.md](./PUBLISHING.md)**.

---

## 10. License

`UNLICENSED` — internal IFMIS use only. Published to the private internal npm
registry; the source is not distributed externally.
