# @ifmis/ui

Shared React UI library for IFMIS — themeable, accessible, and trivial to adopt.

## Adoption — 3 steps

```bash
npm install @ifmis/ui
```

```ts
// app entry (main.tsx / index.tsx / App.tsx)
import "@ifmis/ui/styles.css";
```

```tsx
import { ThemeProvider, Button } from "@ifmis/ui";

export default function App() {
  return (
    <ThemeProvider theme="government">
      <Button variant="primary">Submit</Button>
    </ThemeProvider>
  );
}
```

That's it. No Tailwind setup, no PostCSS config, no build changes.

## Typography

The library ships a typography system that mirrors the IFMIS Figma design 1:1. Never set font sizes or weights manually — always use `<Heading>` or `<Text>`.

```tsx
import { Heading, Text } from "@ifmis/ui";

<Heading level={1}>Dashboard</Heading>
<Heading level={3}>Recent transactions</Heading>

<Text>Default paragraph copy.</Text>
<Text size="xs" weight="medium">Form field label</Text>
<Text size="xs" color="secondary">Helper text under a field</Text>
```

| Component | Props | Use for |
| --- | --- | --- |
| `<Heading level={1..6}>` | `level`, `as`, `align`, `className` | Page, section, card titles |
| `<Text>` | `size`, `weight`, `color`, `as`, `align`, `truncate` | Paragraphs, labels, captions |

Sizes map to Figma exactly: `xs=14`, `sm=16`, `md=18`, `lg=20`. Headings range 14–32. Full guide in Storybook → **Foundations → Typography**.

## Themes

`light` (default) · `dark` · `government` · `high-contrast`

```tsx
<ThemeProvider theme="dark">{children}</ThemeProvider>
```

## Icons

```tsx
import { House, User, Bell } from "@ifmis/ui/icons";

<House size={20} />
```

## Development

```bash
npm install
npm run storybook    # component playground at http://localhost:6006
npm run test         # run tests
npm run build        # build the library
```

## Folder structure

```
src/
├── components/ui/     reusable primitives (Button, Input, ...)
├── providers/         ThemeProvider, ConfigProvider
├── icons/             re-export of @phosphor-icons/react
├── lib/               cn() and utilities
└── styles/            globals.css (themes + tokens)
```
