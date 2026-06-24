# Sidebar

> The IFMIS primary navigation rail. One slot-based component composes search + worklist, an assigned-modules section, and a sub-modules menu (with cascading right-side cards). **Purely presentational** — every selection is controlled via props you own. Has an expanded (279px) and collapsed (120px) mode.

```jsx
import {
  Sidebar,
  SidebarSearch, SidebarCollapseButton, WorklistButton, AdminButton,
  SidebarHelpLinks, AssignedModules, ActiveModuleCard, InactiveModuleCard,
  SidebarMenu, searchMenuTree, MODULES, MODULE_LIST,
} from "@ifmis/ui";
```

- **Type:** Navigation rail (`<aside>`; composite, slot-based).
- **Types:** `SidebarProps`, `SidebarSearchProps`, `SidebarCollapseButtonProps`, `WorklistButtonProps`, `AdminButtonProps`, `SidebarHelpProps`, `SidebarHelpItem`, `AssignedModulesProps`, `SidebarMenuProps`, `MenuNode`, `MenuSearchResult`, `ModuleId`, `ModuleDef`.

---

## Purpose

Render the consistent left navigation rail for IFMIS apps. It never talks to the router, never persists the active module, never owns search state — you wire all of that to your app's store and pass values down through slots. Every slot is optional; omit it to hide that region.

## When to use

- The primary navigation rail of a multi-module IFMIS app.
- Just the menu tree (`SidebarMenu`) or module picker (`AssignedModules`) standalone in a bespoke layout.

## When NOT to use

- Single-module product with no sub-navigation → use top tabs/breadcrumbs.
- The top app bar → use [`Header`](Header.md).
- Mobile/phone viewports → host the **full** Sidebar inside your own drawer rather than showing the 120px collapsed rail permanently.

## `Sidebar` props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `search` | `SidebarSearchProps` | — | Search input config. Omit to hide. Its value auto-forwards into `menu` for search mode. |
| `worklist` | `WorklistButtonProps` | — | Orange worklist pill. Omit to hide. |
| `admin` | `AdminButtonProps` | — | Blue gradient "Admin" pill pinned to the top of the body card. Omit to hide. |
| `modules` | `AssignedModulesProps` | — | Assigned-modules section. Omit to hide. |
| `menu` | `SidebarMenuProps` | — | Sub-modules menu. Omit to hide. |
| `help` | `SidebarHelpProps` | — | "Help Desk" / "Help" links at the bottom. Omit to hide. |
| `collapsed` | `boolean` | self-managed | Controlled collapse state; pair with `onCollapseToggle`. |
| `onCollapseToggle` | `() => void` | — | Fires when the collapse circle is clicked. |
| `footer` | `ReactNode` | — | Extra content below the body card (unstyled). |
| `className` | `string` | — | Added to the outer `<aside>`. |

Other `<aside>` attributes (`id`, `data-*`, `style`) are forwarded.

### Slot prop shapes

```ts
// search
interface SidebarSearchProps { value?: string; onChange?: (v: string) => void; placeholder?: string; }

// worklist
interface WorklistButtonProps { count?: number; onClick?: () => void; label?: string; }  // default label "Worklist"

// admin
interface AdminButtonProps { label?: string; onClick?: () => void; }  // default label "Admin"

// modules
interface AssignedModulesProps {
  assigned: ModuleId[];                 // ordered assigned module ids
  activeId: ModuleId | null;            // selected, or null → empty state
  onChange?: (id: ModuleId) => void;
  maxInlineInactive?: number;           // default 3 (inline thumbnails before overflow)
}

// menu
interface SidebarMenuProps {
  title?: string;                       // default "Sub-Modules"
  items: MenuNode[];
  activeId?: string;                    // current leaf id (set to your route)
  onSelect?: (id: string) => void;
  searchValue?: string;                 // auto-forwarded from search.value
  searchResultsTitle?: string;          // default "Search results"
  searchEmptyTitle?: string;            // default "No matches"
}

// help
interface SidebarHelpItem { label?: string; onClick?: () => void; }
interface SidebarHelpProps { helpDesk?: SidebarHelpItem; help?: SidebarHelpItem; }

// menu node
interface MenuNode {
  id: string;            // stable key — use a route path if you have one
  label: string;
  badge?: string | number;
  children?: MenuNode[]; // presence makes the row a parent (opens a right-side card); unlimited depth
}
```

## Usage examples

### Quickstart

```jsx
const MENU = [
  { id: "dashboard", label: "Dashboard" },
  { id: "hrms", label: "HRMS", children: [
    { id: "hrms.exit",  label: "Exit Management" },
    { id: "hrms.leave", label: "Leave Management" },
  ]},
];

const [activeModule, setActiveModule] = useState("hrms");
const [activeMenu, setActiveMenu] = useState("dashboard");
const [search, setSearch] = useState("");

<Sidebar
  search={{ value: search, onChange: setSearch }}
  worklist={{ count: 12, onClick: openWorklist }}
  modules={{ assigned: ["hrms", "e-accounts", "deposit"], activeId: activeModule, onChange: setActiveModule }}
  menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
/>
```

### Bind to the router; switch menu per module

```jsx
const MENUS = { hrms: HRMS_MENU, "e-accounts": E_ACCOUNTS_MENU, budget: BUDGET_MENU };

<Sidebar
  modules={{ assigned, activeId: activeModule, onChange: setActiveModule }}
  menu={{
    items: MENUS[activeModule] ?? [],
    activeId: pathname,
    onSelect: (id) => navigate(id),   // use route paths as MenuNode ids
  }}
/>
```

### Controlled collapse (persisted)

```jsx
const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sidebar.collapsed") === "true");

<Sidebar
  collapsed={collapsed}
  onCollapseToggle={() => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar.collapsed", String(next));
  }}
  {...slots}
/>
```

### Help links + admin

```jsx
<Sidebar
  admin={{ onClick: openAdminConsole }}
  help={{ helpDesk: { onClick: openHelpDesk }, help: { onClick: openHelpCenter } }}
  {...slots}
/>
```

## Height & scrolling

The rail caps itself at the viewport height (`max-h-screen`). When the combined
content is taller than that, **only the sub-modules list scrolls** — the top
card, the Admin button, the assigned-modules header and the Help Desk/Help
footer all stay pinned. Shorter content renders at its natural height with no
scroll (footer sits directly under the menu).

- Drop it in at the top of the viewport and it just works.
- Place it in a flex/grid column with a **definite** height (e.g.
  `<div className="flex h-screen">…`) and the rail stretches to that height
  instead, scrolling the list within it.
- The floating sub-menu cards use `position: fixed`, so they open correctly
  even when their row is scrolled — they're never clipped by the scroll area.

## The module catalogue (`MODULES` / `MODULE_LIST`)

The canonical source of truth for module metadata (icon, gradient, label, text colour, badge shadow). 17 modules: `e-sanction`, `e-accounts`, `hrms`, `deposit`, `budget`, `strong-room`, `pension`, `receipt`, `vendor`, `bsg`, `internal-audit`, `lfa`, `bookkeeping`, `dig`, `cash-management`, `purchase-inventory`, `lms-ats`.

```jsx
import { MODULES, MODULE_LIST } from "@ifmis/ui";
const { Icon, label, gradient, textColor, shadow } = MODULES["hrms"];
MODULE_LIST.map((m) => (/* render a module grid */));
```

`ModuleDef`: `{ id, label, Icon, gradient, textColor?, shadow }`. **Do not** redefine module gradients/icons/shadows in product code — `modules.ts` is the single source.

## Search behaviour

Built-in search is a case-insensitive substring match over the whole menu tree (matching a parent surfaces all its leaves), with ancestor breadcrumbs and highlighted matches. It's scoped to `menu.items` only — update `items` when the module changes. The algorithm is exported as `searchMenuTree(items, query)`.

## Standalone exports

Every part is exported for bespoke layouts: `SidebarSearch`, `SidebarCollapseButton`, `WorklistButton`, `AdminButton`, `AssignedModules`, `ActiveModuleCard`/`InactiveModuleCard`, `SidebarMenu`, `SidebarHelpLinks`, `searchMenuTree`, `MODULES`, `MODULE_LIST`.

## Best practices

- Keep the Sidebar presentational — wire `onChange`/`onSelect`/`onCollapseToggle` to your store/router; it persists nothing.
- Use route paths as `MenuNode` ids, set `menu.activeId` to the current pathname, and `onSelect` to `navigate`.
- Keep a menu tree per module (record keyed by `ModuleId`) and swap `menu.items` when the active module changes.
- Pass `modules` only when the user has at least one assigned module; `activeId: null` renders the empty "Select Module" state.
- On small viewports, host the full Sidebar in your own drawer rather than the collapsed rail.

## Common mistakes

- **Expecting it to navigate or persist** — it doesn't; you own all state.
- **Redefining module visuals in product code** — read from `MODULES`/`MODULE_LIST`.
- **Setting `menu.searchValue` manually inside a `<Sidebar>`** — it's auto-forwarded from `search.value` (only set it when using `<SidebarMenu>` standalone).
- **Mixing controlled `collapsed` without `onCollapseToggle`** — collapse won't toggle.

## Accessibility

- Wrapped in `<aside aria-label="Primary navigation">` (collapsed: `"… (collapsed)"`).
- Submenu rows are `role="menuitem"`; cards are `role="menu"`; triggers expose `aria-expanded` + `aria-haspopup="menu"`.
- The active leaf carries `aria-current="page"`.
- The collapse button exposes `aria-label` + `aria-pressed`; `Escape` closes the open submenu card.
- Inactive module thumbnails carry an `aria-label` with the module name; the overflow popover is a `role="dialog"`.

## Related components

- [`Header`](Header.md) — the top app bar.
- [`HoverPill`](HoverPill.md) — used for collapsed-module hover labels.
- [`Breadcrumb`](Breadcrumb.md) — page-trail navigation.
