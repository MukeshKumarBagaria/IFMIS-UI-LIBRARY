# Header

> The IFMIS application header — the page chrome that frames every screen. One `Header` frame with plug-in parts (brand, accessibility menu, language toggle, font-size control, notifications, profile menu), fully driven by props so each product localizes text and owns its popover/route logic.

```jsx
import {
  Header, HeaderActions, HeaderBrand,
  AccessibilityMenu, LanguageToggle, FontSizeControl,
  NotificationButton, ProfileMenu, RoleBadge,
  GlassSurface, GlassButton, GLASS_BG,
} from "@ifmis/ui";
```

- **Type:** App header (composite, slot-based). `<header>` frame + parts.
- **Types:** `HeaderProps`, `HeaderActionsProps`, `HeaderBrandProps`, `AccessibilityMenuProps`, `LanguageToggleProps`, `LanguageOption`, `FontSizeControlProps`, `FontSizeStep`, `NotificationButtonProps`, `ProfileMenuProps`, `ProfileMenuLabels`, `ProfileUser`, `ProfileRole`, `RoleBadgeProps`, `RoleVariant`, `GlassSurfaceProps`, `GlassButtonProps`.

---

## Purpose

Render the consistent top bar across all IFMIS apps: a purple gradient frame with a brand block on the left and a configurable cluster of action controls on the right. The library never owns translation — every visible string is a prop.

## When to use

- The persistent top app bar of an IFMIS screen.
- Building the brand + actions row (logo, language, font-size, notifications, profile).

## When NOT to use

- Side navigation → use [`Sidebar`](Sidebar.md).
- A page-level title → use [`PageTitle`](PageTitle.md).
- A breadcrumb trail → use [`Breadcrumb`](Breadcrumb.md).

## Anatomy

| Region | Component | Notes |
| --- | --- | --- |
| Frame | `Header` | Gradient + optional bg image + layout |
| Left | `HeaderBrand` | Logo + title + subtitle |
| Right | `HeaderActions` | Layout primitive (flex row, responsive gap) |
| Action | `AccessibilityMenu` | Pill trigger (host owns popover) |
| Action | `LanguageToggle` | Segmented EN/हिन्दी radiogroup |
| Action | `FontSizeControl` | A·A·A trio (radiogroup) |
| Action | `NotificationButton` | Bell + unread badge |
| Action | `ProfileMenu` | Avatar pill + 400px dropdown card |

`GlassSurface`/`GlassButton` are the shared glassmorphism primitives; `RoleBadge` shows colour-coded roles inside `ProfileMenu`.

## Component props

### `Header`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `brand` | `ReactNode` | — | Left slot (usually `<HeaderBrand>`). |
| `actions` | `ReactNode` | — | Right slot (usually `<HeaderActions>`). |
| `backgroundImage` | `string` | — | Image URL behind the gradient (not bundled). Gradient always paints on top. |
| `children` | `ReactNode` | — | Centred content between brand and actions. |
| `className` / `style` | — | — | Merged onto the `<header>`. |

The header is `position: relative`, `z-30`, and **not** `overflow-hidden` (so popovers escape downward).

### `HeaderActions`

Flex row with a responsive gap. `gapClassName` (default `"gap-2 sm:gap-3 lg:gap-4"`) overrides the gap. Other `<div>` props forwarded.

### `HeaderBrand`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | — | **Required.** Primary brand line. |
| `subtitle` | `string` | — | Secondary line. |
| `logo` | `ReactNode` | bundled IFMIS logo | Custom mark; overrides `logoSrc`. |
| `logoSrc` | `string` | bundled logo | `src` of the default `<img>`. |
| `logoAlt` | `string` | `"IFMIS"` | Alt for the default logo (pass translated). |
| `logoSize` | `number` | `55` | Logo diameter in px. |

### `AccessibilityMenu` (trigger only — host owns the popover)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | `"Accessibility"` | Visible label. |
| `ariaLabel` | `string` | — | Accessible name when no visible label. |
| `onClick` | `() => void` | — | Toggle handler. |
| `open` | `boolean` | — | Rotates the caret when open. |
| `disabled` | `boolean` | — | Disables the trigger. |

### `LanguageToggle` (fully controlled, generic `<T extends string>`)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `T` | — | **Required.** Selected language code. |
| `onChange` | `(value: T) => void` | — | **Required.** Selection handler. |
| `options` | `LanguageOption<T>[]` | English + Hindi | `{ value, label, ariaLabel? }[]`; any number. |
| `ariaLabel` | `string` | `"Select language"` | Radiogroup label. |

### `FontSizeControl` (fully controlled — does NOT apply the size globally)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `"sm" \| "md" \| "lg"` | — | **Required.** Selected step. |
| `onChange` | `(value: FontSizeStep) => void` | — | **Required.** Reports the choice; host applies it. |
| `labels` | `{ sm?, md?, lg?, group? }` | English defaults | i18n labels. |

### `NotificationButton` (trigger only)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `count` | `number` | `0` | Unread count; `0` hides the badge. |
| `max` | `number` | `99` | Caps the badge (`99+`). |
| `ariaLabel` | `string` | `"Notifications"` | Folded into `"…, N unread"` when there's a count. |
| `onClick` | `() => void` | — | Open handler. |
| `open` | `boolean` | — | Sets `aria-expanded`. |
| `disabled` | `boolean` | — | Disables the trigger. |

### `ProfileMenu` (controlled or uncontrolled; manages outside-click + Escape)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `user` | `ProfileUser` | — | **Required.** See below. |
| `labels` | `ProfileMenuLabels` | English defaults | `{ trigger, rolesHeading, lastLoginPrefix, settings, logout }`. |
| `onSettings` | `() => void` | — | Settings action. **Omit to hide it.** |
| `onLogout` | `() => void` | — | Logout action. **Omit to hide it.** |
| `open` | `boolean` | — | Controlled open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Required when `open` is set. |
| `children` | `ReactNode` | — | Extra dropdown rows above the action row. |

`ProfileUser`: `{ name (required), designation?, avatarUrl?, initials?, roles?: ProfileRole[], employeeId?, organisation?, lastLogin?: { date, time? } }`. Fields are independent — pass only what you have; the dropdown identity card shows `${designation}-${employeeId}` (or fallbacks), uppercased organisation, and the last-login line (time in red accent). The dropdown is portaled to `document.body` with `fixed` positioning, so it's never clipped.

### `RoleBadge`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `"creator" \| "verifier" \| "approver"` | — | **Required.** Drives colour only. |
| `label` | `string` | English label for the variant | Visible text. |
| `icon` | `ReactNode` | — | Trailing icon (switches layout to space-between). |
| `width` | `"auto" \| "fixed"` | `"auto"` | `"fixed"` locks to 110px. |

### `GlassSurface` / `GlassButton`

Shared glassmorphism primitives (`shape="pill" | "rounded"`). `GlassSurface` is a `<div>`; `GlassButton` is a `<button>` with focus/hover/disabled affordances. `GLASS_BG` is the exported translucent fill string.

## Usage examples

### Minimum

```jsx
<Header
  brand={<HeaderBrand title="IFMIS" subtitle="Government of India" />}
  actions={<ProfileMenu user={user} />}
/>
```

### Full row (i18n via props)

```jsx
const [lang, setLang] = useState("en");
const [fontSize, setFontSize] = useState("md");

<Header
  brand={<HeaderBrand title={t("brand.title")} subtitle={t("brand.subtitle")} />}
  actions={
    <HeaderActions>
      <AccessibilityMenu label={t("header.accessibility")} onClick={openA11y} />
      <LanguageToggle
        value={lang}
        onChange={setLang}
        options={[
          { value: "en", label: "English" },
          { value: "hi", label: "हिन्दी" },
        ]}
      />
      <FontSizeControl value={fontSize} onChange={setFontSize} />
      <NotificationButton count={unread} onClick={openInbox} />
      <ProfileMenu
        user={{
          name: "Mukesh Kumar",
          designation: "Assistant Internal Audit Officer",
          employeeId: "0000442105",
          organisation: "Directorate of Treasuries and Accounts, Bhopal",
          lastLogin: { date: "19 Jan, 2026", time: "09:59:01" },
          roles: [{ variant: "creator" }, { variant: "verifier" }, { variant: "approver" }],
        }}
        onSettings={() => navigate("/settings")}
        onLogout={signOut}
      />
    </HeaderActions>
  }
/>
```

### Apply the font-size choice (host wiring)

```jsx
const [size, setSize] = useState("md");
useEffect(() => {
  document.documentElement.style.fontSize =
    size === "sm" ? "92%" : size === "lg" ? "108%" : "100%";
}, [size]);
<FontSizeControl value={size} onChange={setSize} />
```

### Background image (host-supplied)

```jsx
import headerBg from "@/assets/header-bg.png";
<Header backgroundImage={headerBg} brand={…} actions={…} />
```

### Custom glass action

```jsx
import { GlassButton } from "@ifmis/ui";
import { Question } from "@phosphor-icons/react";

<GlassButton shape="rounded" onClick={openHelp} className="h-[50px] px-3 gap-3">
  <Question size={24} />
  <span className="font-semibold text-sm">{t("header.help")}</span>
</GlassButton>
```

## Best practices

- **Drive every string from your i18n layer** — the header is locale-agnostic.
- Render only the actions the product uses; they're independent.
- Use `HeaderActions` for the right side so spacing stays consistent.
- `FontSizeControl` only reports the choice — you apply the scale globally.
- `AccessibilityMenu` and `NotificationButton` are triggers only — the host owns the popover/panel.
- For custom header pills, use `GlassButton`/`GlassSurface`, not raw Tailwind.

## Common mistakes

- **Expecting `FontSizeControl` to resize text** — it doesn't; wire `onChange` to a root font scale yourself.
- **Reaching into part internals to restyle** — add a prop or role variant instead.
- **Putting product-specific logic (tenant switcher) inside the library** — wrap it and slot through `HeaderActions`.
- **Adding `overflow-hidden` to the header** — it would clip the profile/notification popovers.

## Accessibility

- All pills are real `<button>`s with visible focus rings (`focus-visible:ring-white/70`).
- `LanguageToggle` and `FontSizeControl` use `role="radiogroup"` + `role="radio"`.
- `ProfileMenu` closes on outside click and `Escape`; trigger announces `aria-expanded`.
- Notification badge is `aria-hidden`; the count folds into the button's `aria-label`.
- Decorative images (logo, avatar) use empty `alt`.

## Related components

- [`Sidebar`](Sidebar.md) — primary navigation.
- [`Breadcrumb`](Breadcrumb.md) — page trail.
- [`PageTitle`](PageTitle.md) — page heading.
- [`Badge`](Badge.md) — status pills (RoleBadge is header-specific).
