import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Sidebar,
  SidebarSearch,
  SidebarCollapseButton,
  WorklistButton,
  AdminButton,
  SidebarHelpLinks,
} from "./Sidebar";
import type { MenuNode } from "./Sidebar";
import type { ModuleId } from "./modules";
import { AssignedModules } from "./parts/AssignedModules";
import { SidebarMenu } from "./parts/SidebarMenu";

/* -------------------------------------------------------------------------- */
/* Shared fixtures                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Reference menu tree used across stories. Copy this shape directly into your
 * product configuration.
 *
 * Each node requires only `id` and `label`. Add `children` to make a row
 * expandable, and `badge` to display a count.
 *
 * - `id`       — stable key, usually a route path. Used by `activeId` and `onSelect`.
 * - `label`    — visible text in the menu row.
 * - `badge`    — optional counter (string or number). Shown on the right of the row.
 * - `children` — optional sub-items. Presence opens a floating right-side card.
 */
const MENU: MenuNode[] = [
  { id: "dashboard", label: "Dashboard" },
  {
    id: "hrms",
    label: "HRMS",
    children: [
      { id: "hrms.exit", label: "Exit Management" },
      {
        id: "hrms.pay",
        label: "Pay Related",
        children: [
          { id: "hrms.pay.salary", label: "Salary" },
          { id: "hrms.pay.bonus", label: "Bonus" },
          { id: "hrms.pay.arrears", label: "Arrears" },
        ],
      },
      { id: "hrms.discipline", label: "Disciplinary Proceeding" },
      { id: "hrms.leave", label: "Leave Management" },
      { id: "hrms.pension", label: "Pension" },
    ],
  },
  {
    id: "vouchers",
    label: "Vouchers",
    badge: 12,
    children: [
      { id: "vouchers.pending", label: "Pending Verification", badge: 8 },
      { id: "vouchers.approved", label: "Approved" },
      {
        id: "vouchers.rejected",
        label: "Rejected",
        children: [
          { id: "vouchers.rejected.today", label: "Today" },
          { id: "vouchers.rejected.week", label: "This Week" },
          { id: "vouchers.rejected.month", label: "This Month" },
        ],
      },
    ],
  },
  { id: "payments", label: "Payments" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Settings" },
];

/** Full list of 17 module IDs — used in stories that need many modules. */
const ALL_MODULES: ModuleId[] = [
  "hrms",
  "e-sanction",
  "e-accounts",
  "deposit",
  "budget",
  "strong-room",
  "pension",
  "receipt",
  "vendor",
  "bsg",
  "internal-audit",
  "lfa",
  "bookkeeping",
  "dig",
  "cash-management",
  "purchase-inventory",
  "lms-ats",
];

/** Wrapper that gives every story the same grey background and 6px padding. */
function StoryShell({ children }: { children: React.ReactNode }) {
  return <div className="bg-grey-50 min-h-screen p-6">{children}</div>;
}

/* -------------------------------------------------------------------------- */
/* Meta                                                                       */
/* -------------------------------------------------------------------------- */

const meta: Meta<typeof Sidebar> = {
  title: "UI/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The IFMIS primary navigation rail. **Purely presentational and fully controlled** —
every interactive value (search text, active module, active menu leaf, collapsed flag)
is a prop you own. The Sidebar never calls your router or persists anything.

### Layout

The Sidebar is a \`279px\`-wide \`<aside>\` built from two stacked white cards
(separated by \`24px\`):

1. **Top card** — search input, collapse button, worklist pill.
2. **Body card** — assigned-modules section + sub-modules menu.

Every slot is optional. Omit a prop to hide that section entirely.

### Props at a glance

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| \`search\` | \`SidebarSearchProps\` | — | Pill search input (omit to hide) |
| \`worklist\` | \`WorklistButtonProps\` | — | Orange worklist pill (omit to hide) |
| \`modules\` | \`AssignedModulesProps\` | — | Assigned-modules section (omit to hide) |
| \`menu\` | \`SidebarMenuProps\` | — | Sub-modules menu (omit to hide) |
| \`collapsed\` | \`boolean\` | \`undefined\` (uncontrolled) | Collapse state — omit to let the rail self-manage |
| \`onCollapseToggle\` | \`() => void\` | — | Pair with \`collapsed\` for controlled collapse |
| \`footer\` | \`ReactNode\` | — | Extra content rendered below the body card |

### Quick start

\`\`\`jsx
import { useState } from "react";
import { Sidebar } from "@ifmis/ui";

const MENU = [
  { id: "dashboard", label: "Dashboard" },
  { id: "hrms", label: "HRMS", children: [
    { id: "hrms.exit", label: "Exit Management" },
  ]},
];

function AppShell() {
  const [activeModule, setActiveModule] = useState("hrms");
  const [activeMenu, setActiveMenu]     = useState("dashboard");
  const [search, setSearch]             = useState("");

  return (
    <Sidebar
      search={{ value: search, onChange: setSearch }}
      worklist={{ count: 12, onClick: openWorklist }}
      modules={{ assigned: ["hrms", "budget"], activeId: activeModule, onChange: setActiveModule }}
      menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
    />
  );
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    search: {
      description:
        "Search input configuration. Omit the entire prop to hide the input. " +
        "Pass `{ value, onChange }` for a controlled input. The search value is " +
        "automatically forwarded to the menu to trigger the search-results view.",
      table: {
        type: {
          summary: "SidebarSearchProps",
          detail:
            "{ value?: string; onChange?: (value: string) => void; placeholder?: string }",
        },
      },
    },
    worklist: {
      description:
        "Orange worklist pill below the search row. Omit to hide. Pass `count` to " +
        "show a badge, `onClick` to handle clicks, and `label` to override the text.",
      table: {
        type: {
          summary: "WorklistButtonProps",
          detail: "{ count?: number; onClick?: () => void; label?: string }",
        },
      },
    },
    modules: {
      description:
        "Assigned-modules section. Omit to hide. " +
        "Pass `assigned` (array of ModuleId strings), `activeId` (selected module or null), " +
        "and `onChange` to switch modules.",
      table: {
        type: {
          summary: "AssignedModulesProps",
          detail:
            "{ assigned: ModuleId[]; activeId: ModuleId | null; onChange?: (id: ModuleId) => void; maxInlineInactive?: number }",
        },
      },
    },
    menu: {
      description:
        "Sub-modules menu. Omit to hide. Provide `items` (your MenuNode[] tree) plus " +
        "`activeId` and `onSelect` to wire selection to your router. " +
        "Children nest to unlimited depth via cascading right-side cards.",
      table: {
        type: {
          summary: "SidebarMenuProps",
          detail:
            "{ title?: string; items: MenuNode[]; activeId?: string; onSelect?: (id: string) => void; searchValue?: string; searchResultsTitle?: string; searchEmptyTitle?: string }",
        },
      },
    },
    collapsed: {
      description:
        "Controlled collapse state. When omitted the Sidebar manages its own toggle " +
        "internally. Pass both `collapsed` and `onCollapseToggle` to persist the choice " +
        "(e.g. localStorage or URL param).",
      control: "boolean",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "undefined (uncontrolled)" } },
    },
    onCollapseToggle: {
      description: "Fires when the collapse circle is clicked. Pair with `collapsed`.",
      table: { type: { summary: "() => void" } },
    },
    help: {
      description:
        "Help links pinned to the bottom of the body card. Pass `helpDesk` and/or " +
        "`help`, each `{ label?, onClick? }`. Omit a link to hide it. In the collapsed " +
        "rail these render as icon-only circles (purple headset / blue question mark).",
      table: {
        type: {
          summary: "SidebarHelpProps",
          detail:
            "{ helpDesk?: { label?: string; onClick?: () => void }; help?: { label?: string; onClick?: () => void } }",
        },
      },
    },
    footer: {
      description:
        "Optional ReactNode rendered below the body card. Useful for logout buttons, " +
        "version info, or user avatars.",
      table: { type: { summary: "ReactNode" } },
    },
    className: {
      description: "Extra CSS class added to the outer `<aside>` element.",
      table: { type: { summary: "string" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

/* ========================================================================== */
/* 1. FULL INTEGRATION                                                         */
/* ========================================================================== */

/**
 * **Full integration** — all four slots active.
 *
 * Every input is **controlled**: selection state for the active module and
 * active menu item lives in the parent component. The Sidebar is purely
 * presentational — it never calls the router or persists anything.
 *
 * Click a top-level menu row with a `▸` chevron to open its right-side card.
 * Click a module thumbnail to switch modules. Type in the search box to enter
 * the search-results view.
 */
function DefaultDemo() {
  const [activeModule, setActiveModule] = useState<ModuleId>("hrms");
  const [activeMenu, setActiveMenu] = useState("hrms.exit");
  const [search, setSearch] = useState("");

  return (
    <StoryShell>
      <Sidebar
        search={{ value: search, onChange: setSearch }}
        worklist={{ count: 12, onClick: () => alert("open worklist") }}
        admin={{ onClick: () => alert("open admin") }}
        modules={{
          assigned: ALL_MODULES,
          activeId: activeModule,
          onChange: setActiveModule,
        }}
        menu={{
          items: MENU,
          activeId: activeMenu,
          onSelect: setActiveMenu,
        }}
        help={{
          helpDesk: { onClick: () => alert("open help desk") },
          help: { onClick: () => alert("open help") },
        }}
      />
    </StoryShell>
  );
}

export const Default: Story = {
  name: "Default (Full Integration)",
  render: () => <DefaultDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Canonical end-to-end usage. All four slots (`search`, `worklist`, `modules`, `menu`) are active. " +
          "Type in the search box to switch to the search-results view. Click module thumbnails to switch modules.",
      },
    },
  },
};

/* ========================================================================== */
/* 2. COLLAPSED STATE                                                          */
/* ========================================================================== */

/**
 * **Controlled collapse** — `collapsed` + `onCollapseToggle` are both passed,
 * so the parent owns the state. Click the purple circle (or any icon in the
 * body card) to expand back to the full rail.
 *
 * The collapsed rail mirrors the full layout in two icon-sized cards:
 * - Top card: search icon + expand-toggle + compact worklist pill
 * - Body card: "Assigned Modules" label + active module thumbnail + expand chevron + menu toggle
 */
function CollapsedDemo() {
  const [collapsed, setCollapsed] = useState(true);
  const [activeModule, setActiveModule] = useState<ModuleId>("hrms");
  const [activeMenu, setActiveMenu] = useState("hrms.exit");
  const [search, setSearch] = useState("");

  return (
    <StoryShell>
      <Sidebar
        collapsed={collapsed}
        onCollapseToggle={() => setCollapsed((v) => !v)}
        search={{ value: search, onChange: setSearch }}
        worklist={{ count: 28, onClick: () => alert("open worklist") }}
        modules={{
          assigned: ALL_MODULES,
          activeId: activeModule,
          onChange: setActiveModule,
        }}
        menu={{
          items: MENU,
          activeId: activeMenu,
          onSelect: setActiveMenu,
        }}
        help={{
          helpDesk: { onClick: () => alert("open help desk") },
          help: { onClick: () => alert("open help") },
        }}
      />
    </StoryShell>
  );
}

export const Collapsed: Story = {
  name: "Collapsed State",
  render: () => <CollapsedDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Starts collapsed. Pass both `collapsed` and `onCollapseToggle` to control the state externally " +
          "(e.g. persist to localStorage). Click any icon in the rail to expand. " +
          "The collapsed rail is `120px` wide vs the full `279px`.",
      },
    },
  },
};

/* ========================================================================== */
/* 3. UNCONTROLLED COLLAPSE                                                    */
/* ========================================================================== */

/**
 * **Uncontrolled collapse** — omit both `collapsed` and `onCollapseToggle`
 * and the Sidebar manages its own toggle state internally. This is the
 * simplest integration when you don't need to persist the collapsed state.
 */
function UncontrolledCollapseDemo() {
  const [activeModule, setActiveModule] = useState<ModuleId>("hrms");
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [search, setSearch] = useState("");

  return (
    <StoryShell>
      <Sidebar
        search={{ value: search, onChange: setSearch }}
        worklist={{ count: 5, onClick: () => alert("open worklist") }}
        modules={{
          assigned: ["hrms", "budget", "e-accounts", "deposit"],
          activeId: activeModule,
          onChange: setActiveModule,
        }}
        menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
      />
    </StoryShell>
  );
}

export const UncontrolledCollapse: Story = {
  name: "Uncontrolled Collapse",
  render: () => <UncontrolledCollapseDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "When `collapsed` is omitted the Sidebar self-manages its own toggle state. " +
          "Click the purple circle button to collapse/expand without any extra state in your component. " +
          "Use this when you don't need to persist the collapsed preference.",
      },
    },
  },
};

/* ========================================================================== */
/* 4. NO MODULE SELECTED                                                       */
/* ========================================================================== */

/**
 * **No module selected** — pass `activeId: null` to render the empty state:
 * an illustration, a prompt, and a "Select Module" button that opens the
 * overflow popover. Pick a module and the normal active card takes over.
 */
function NoModuleDemo() {
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [search, setSearch] = useState("");

  return (
    <StoryShell>
      <Sidebar
        search={{ value: search, onChange: setSearch }}
        worklist={{ count: 12, onClick: () => alert("open worklist") }}
        modules={{
          assigned: ALL_MODULES,
          activeId: activeModule,
          onChange: setActiveModule,
        }}
        menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
      />
    </StoryShell>
  );
}

export const NoModuleSelected: Story = {
  name: "No Module Selected",
  render: () => <NoModuleDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Pass `modules.activeId: null` to show the empty state — an illustration with a " +
          '"Select Module" button. Clicking that button opens the same overflow popover used ' +
          "when there are more than `maxInlineInactive` modules. Selecting a module in the popover " +
          "calls `onChange` and the normal active-card layout takes over.",
      },
    },
  },
};

/* ========================================================================== */
/* 5. SEARCH PROP                                                              */
/* ========================================================================== */

/**
 * **Search — custom placeholder** — the `placeholder` field on the `search`
 * prop overrides the default `"Search menu..."` text shown when the input is empty.
 */
function CustomSearchPlaceholderDemo() {
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <StoryShell>
      <Sidebar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search HRMS modules...",
        }}
        menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
      />
    </StoryShell>
  );
}

export const SearchCustomPlaceholder: Story = {
  name: "Search — Custom Placeholder",
  render: () => <CustomSearchPlaceholderDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "`search.placeholder` overrides the default `\"Search menu...\"` placeholder. " +
          "Useful when the sidebar is scoped to a single module and you want the hint to " +
          "reflect that context.",
      },
    },
  },
};

/**
 * **Search — results view** — pre-fill `search.value` to enter search mode
 * immediately. The menu switches to a flat list of matching leaves, each with a
 * breadcrumb path showing its parent hierarchy.
 *
 * The search is wired automatically: the `<Sidebar>` parent forwards its
 * `search.value` to the menu. You can also override it by setting
 * `menu.searchValue` explicitly.
 */
function SearchResultsDemo() {
  const [search, setSearch] = useState("pay");
  const [activeMenu, setActiveMenu] = useState("hrms.pay.salary");

  return (
    <StoryShell>
      <Sidebar
        search={{ value: search, onChange: setSearch }}
        menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
      />
    </StoryShell>
  );
}

export const SearchResults: Story = {
  name: "Search — Results View",
  render: () => <SearchResultsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "When `search.value` is non-empty, the menu enters search mode — the cascading " +
          "pill rows are replaced with a flat list of matching leaves. Each result shows a " +
          "breadcrumb of its parent path. The match algorithm is a **case-insensitive " +
          "substring search** that also surfaces all leaves under a matched parent " +
          "(e.g. typing `\"pay\"` returns Salary, Bonus, Arrears because their parent " +
          "\"Pay Related\" matched). Clear the input to return to the normal tree view.",
      },
    },
  },
};

/**
 * **Search — no matches** — when the query produces zero results, the menu
 * shows an empty-state placeholder. The `searchEmptyTitle` prop on `menu`
 * lets you customise the "No matches" heading.
 */
function SearchNoResultsDemo() {
  const [search, setSearch] = useState("xyzzy");
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <StoryShell>
      <Sidebar
        search={{ value: search, onChange: setSearch }}
        menu={{
          items: MENU,
          activeId: activeMenu,
          onSelect: setActiveMenu,
          searchEmptyTitle: "Nothing found",
        }}
      />
    </StoryShell>
  );
}

export const SearchNoResults: Story = {
  name: "Search — No Results",
  render: () => <SearchNoResultsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "When the search query produces zero matches, an empty-state placeholder is shown. " +
          "`menu.searchEmptyTitle` (default `\"No matches\"`) is displayed as the section heading. " +
          "The placeholder also repeats the query so the user knows what was searched.",
      },
    },
  },
};

/* ========================================================================== */
/* 6. WORKLIST PROP                                                            */
/* ========================================================================== */

/**
 * **Worklist — with count badge** — pass `worklist.count` to display an orange
 * badge with the number of pending items. The badge is hidden when `count` is
 * omitted.
 */
function WorklistWithCountDemo() {
  return (
    <StoryShell>
      <Sidebar
        search={{ value: "", onChange: () => {} }}
        worklist={{ count: 42, onClick: () => alert("open worklist") }}
      />
    </StoryShell>
  );
}

export const WorklistWithCount: Story = {
  name: "Worklist — With Count Badge",
  render: () => <WorklistWithCountDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "`worklist.count` shows a round orange badge to the right of the worklist label. " +
          "Pass any number — the badge grows to fit. Omit `count` entirely to hide the badge.",
      },
    },
  },
};

/**
 * **Worklist — without count** — omit `worklist.count` and the badge is hidden.
 * The pill still renders with the icon and label, and calls `onClick` on press.
 */
function WorklistWithoutCountDemo() {
  return (
    <StoryShell>
      <Sidebar
        search={{ value: "", onChange: () => {} }}
        worklist={{ onClick: () => alert("open worklist") }}
      />
    </StoryShell>
  );
}

export const WorklistWithoutCount: Story = {
  name: "Worklist — Without Count Badge",
  render: () => <WorklistWithoutCountDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "When `worklist.count` is omitted, the orange pill still renders with the icon and label " +
          "but no badge. Use this when the pending count is unavailable or zero.",
      },
    },
  },
};

/**
 * **Worklist — custom label** — the `worklist.label` prop overrides the default
 * `"Worklist"` text on the pill.
 */
function WorklistCustomLabelDemo() {
  return (
    <StoryShell>
      <Sidebar
        search={{ value: "", onChange: () => {} }}
        worklist={{
          label: "Pending Tasks",
          count: 7,
          onClick: () => alert("open tasks"),
        }}
      />
    </StoryShell>
  );
}

export const WorklistCustomLabel: Story = {
  name: "Worklist — Custom Label",
  render: () => <WorklistCustomLabelDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "`worklist.label` overrides the default `\"Worklist\"` text. Useful when the worklist " +
          "concept has a different name in your product (e.g. \"Pending Tasks\", \"Inbox\"). " +
          "The collapsed rail still reads this label in its `aria-label`.",
      },
    },
  },
};

/* ========================================================================== */
/* 6b. ADMIN BUTTON PROP                                                       */
/* ========================================================================== */

/**
 * **Admin button** — pass `admin` to render the blue gradient "Admin" pill at
 * the top of the body card. Provide an `onClick` (and optional `label`).
 */
function AdminButtonDemo() {
  const [activeModule, setActiveModule] = useState<ModuleId>("e-sanction");
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [search, setSearch] = useState("");

  return (
    <StoryShell>
      <Sidebar
        search={{ value: search, onChange: setSearch }}
        admin={{ onClick: () => alert("open admin") }}
        modules={{
          assigned: ["e-sanction", "e-accounts", "deposit", "budget", "hrms"],
          activeId: activeModule,
          onChange: setActiveModule,
        }}
        menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
        help={{
          helpDesk: { onClick: () => alert("open help desk") },
          help: { onClick: () => alert("open help") },
        }}
      />
    </StoryShell>
  );
}

export const Admin: Story = {
  name: "Admin Button",
  render: () => <AdminButtonDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "`admin` renders the blue gradient \"Admin\" pill (247×48, 16px radius) pinned to the top " +
          "of the body card. Decorative white petals bleed off the left edge and the user-with-sync-arrows " +
          "glyph precedes the label. Pass `onClick` to open your admin console and `label` to override the text. " +
          "In the collapsed rail it becomes an icon-only gradient square.",
      },
    },
  },
};

/* ========================================================================== */
/* 7. MODULES PROP                                                             */
/* ========================================================================== */

/**
 * **Modules — few (2 modules)** — with only 2 assigned modules there is no
 * overflow. The active card is shown at full size; the single inactive module
 * sits in the 2×2 grid with empty slots.
 */
function FewModulesDemo() {
  const [activeModule, setActiveModule] = useState<ModuleId>("hrms");
  return (
    <StoryShell>
      <Sidebar
        search={{ value: "", onChange: () => {} }}
        modules={{
          assigned: ["hrms", "budget"],
          activeId: activeModule,
          onChange: setActiveModule,
        }}
      />
    </StoryShell>
  );
}

export const ModulesFew: Story = {
  name: "Modules — 2 Modules (No Overflow)",
  render: () => <FewModulesDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "When the user is assigned only 2 modules there is nothing to overflow. " +
          "The active card is shown at full size; the single inactive thumbnail occupies " +
          "one slot in the 2×2 grid.",
      },
    },
  },
};

/**
 * **Modules — exactly 4 (fills grid, no overflow chevron)** — 4 assigned modules
 * fits the 2×2 grid perfectly with `maxInlineInactive: 3` (default). Use
 * `maxInlineInactive: 4` to fill all four slots without an overflow chevron.
 *
 * This story uses `maxInlineInactive: 4` to demonstrate the behaviour.
 */
function FourModulesDemo() {
  const [activeModule, setActiveModule] = useState<ModuleId>("hrms");
  return (
    <StoryShell>
      <Sidebar
        search={{ value: "", onChange: () => {} }}
        modules={{
          assigned: ["hrms", "budget", "e-accounts", "deposit"],
          activeId: activeModule,
          onChange: setActiveModule,
          maxInlineInactive: 4,
        }}
      />
    </StoryShell>
  );
}

export const ModulesFour: Story = {
  name: "Modules — 4 Modules (Full 2×2 Grid)",
  render: () => <FourModulesDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "With exactly 4 assigned modules and `maxInlineInactive: 4`, the 2×2 grid is filled " +
          "by all 3 inactive thumbnails plus the active card — no overflow chevron needed. " +
          "The default `maxInlineInactive` is `3` (leaving the 4th slot for the overflow chevron " +
          "when there are more modules). Set it to `4` only when you know the user has at most 4 modules.",
      },
    },
  },
};

/**
 * **Modules — many (overflow popover)** — when there are more inactive modules
 * than `maxInlineInactive` (default 3), a chevron button appears in the 4th
 * grid slot. Clicking it opens an overflow popover listing all assigned modules.
 */
function ManyModulesDemo() {
  const [activeModule, setActiveModule] = useState<ModuleId>("hrms");
  return (
    <StoryShell>
      <Sidebar
        search={{ value: "", onChange: () => {} }}
        modules={{
          assigned: ALL_MODULES,
          activeId: activeModule,
          onChange: setActiveModule,
        }}
      />
    </StoryShell>
  );
}

export const ModulesMany: Story = {
  name: "Modules — 17 Modules (Overflow Popover)",
  render: () => <ManyModulesDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "When there are more inactive modules than `maxInlineInactive` (default `3`), the 4th " +
          "grid slot becomes a circular `▸` button. Clicking it opens an overflow popover showing " +
          "all assigned modules in a 2-column grid. Close it by clicking the × button, pressing " +
          "Escape, or clicking outside the popover.",
      },
    },
  },
};

/**
 * **Modules — `maxInlineInactive` override** — set `maxInlineInactive: 2` to
 * always leave two slots for the overflow button even when there are few modules.
 * This shows the overflow chevron with fewer inline thumbnails.
 */
function MaxInlineInactiveDemo() {
  const [activeModule, setActiveModule] = useState<ModuleId>("budget");
  return (
    <StoryShell>
      <Sidebar
        search={{ value: "", onChange: () => {} }}
        modules={{
          assigned: ["hrms", "budget", "e-accounts", "deposit", "pension"],
          activeId: activeModule,
          onChange: setActiveModule,
          maxInlineInactive: 2,
        }}
      />
    </StoryShell>
  );
}

export const ModulesMaxInlineInactive: Story = {
  name: "Modules — maxInlineInactive Override",
  render: () => <MaxInlineInactiveDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "`modules.maxInlineInactive` (default `3`) controls how many inactive thumbnails appear " +
          "inline before the overflow chevron kicks in. This story sets it to `2`, so the 3rd slot " +
          "always shows the overflow button even with only 5 assigned modules. " +
          "Lowering this is useful when you want to guarantee there's always a quick path to the picker.",
      },
    },
  },
};

/* ========================================================================== */
/* 8. MENU PROP                                                                */
/* ========================================================================== */

/**
 * **Menu — custom title** — the `menu.title` prop overrides the default
 * `"Sub-Modules"` section heading above the menu list.
 */
function MenuCustomTitleDemo() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  return (
    <StoryShell>
      <Sidebar
        search={{ value: "", onChange: () => {} }}
        menu={{
          items: MENU,
          activeId: activeMenu,
          onSelect: setActiveMenu,
          title: "HRMS Navigation",
        }}
      />
    </StoryShell>
  );
}

export const MenuCustomTitle: Story = {
  name: "Menu — Custom Section Title",
  render: () => <MenuCustomTitleDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "`menu.title` overrides the default `\"Sub-Modules\"` heading above the menu list. " +
          "Useful when the sidebar is scoped to a single module and you want a more contextual label.",
      },
    },
  },
};

/**
 * **Menu — badges** — pass a `badge` value on any `MenuNode` to display a
 * rounded counter on the right side of the row. Works at every nesting depth.
 * The badge colour flips automatically (purple-on-white inactive,
 * white-on-purple active).
 */
function MenuBadgesDemo() {
  const [activeMenu, setActiveMenu] = useState("vouchers.pending");

  const menuWithBadges: MenuNode[] = [
    { id: "dashboard", label: "Dashboard" },
    {
      id: "vouchers",
      label: "Vouchers",
      badge: 20,
      children: [
        { id: "vouchers.pending", label: "Pending Verification", badge: 8 },
        { id: "vouchers.approved", label: "Approved", badge: 0 },
        { id: "vouchers.rejected", label: "Rejected", badge: 4 },
      ],
    },
    { id: "payments", label: "Payments", badge: "NEW" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <StoryShell>
      <Sidebar
        search={{ value: "", onChange: () => {} }}
        menu={{ items: menuWithBadges, activeId: activeMenu, onSelect: setActiveMenu }}
      />
    </StoryShell>
  );
}

export const MenuWithBadges: Story = {
  name: "Menu — Badges (Counters)",
  render: () => <MenuBadgesDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "`MenuNode.badge` accepts a `string | number`. The component renders it in a small " +
          "rounded pill on the right side of each row — works at the top level and inside submenu cards. " +
          "The pill colour inverts when the row is active (white on purple vs. purple on white). " +
          "Passing `0` still shows the badge; omit `badge` entirely to hide it.",
      },
    },
  },
};

/**
 * **Menu — deep nesting (3 levels)** — items nest to unlimited depth. Each
 * parent row opens a floating right-side card; rows inside that card can
 * themselves have children, opening another card to the right.
 */
function DeepNestingDemo() {
  const [activeMenu, setActiveMenu] = useState("l3.a");

  const deepMenu: MenuNode[] = [
    {
      id: "level1",
      label: "Finance",
      children: [
        {
          id: "l2.a",
          label: "Expenditure",
          children: [
            { id: "l3.a", label: "Capital Expenditure" },
            { id: "l3.b", label: "Revenue Expenditure" },
            {
              id: "l3.c",
              label: "Contingency",
              children: [
                { id: "l4.a", label: "Approved" },
                { id: "l4.b", label: "Pending Approval" },
              ],
            },
          ],
        },
        { id: "l2.b", label: "Revenue" },
        { id: "l2.c", label: "Budget Transfers" },
      ],
    },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <StoryShell>
      <Sidebar
        search={{ value: "", onChange: () => {} }}
        menu={{ items: deepMenu, activeId: activeMenu, onSelect: setActiveMenu }}
      />
    </StoryShell>
  );
}

export const MenuDeepNesting: Story = {
  name: "Menu — Deep Nesting (4 Levels)",
  render: () => <DeepNestingDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Children can be nested to **unlimited depth**. Click `Finance` to open a right-side card, " +
          "then `Expenditure` to open another card to its right, and so on. " +
          "A leaf click collapses the entire popover chain in one step. " +
          "`Escape` closes the innermost open card.",
      },
    },
  },
};

/**
 * **Menu — custom search result titles** — `menu.searchResultsTitle` and
 * `menu.searchEmptyTitle` let you override the heading shown above search
 * results and the empty state.
 */
function MenuCustomSearchTitlesDemo() {
  const [search, setSearch] = useState("pay");
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <StoryShell>
      <Sidebar
        search={{ value: search, onChange: setSearch }}
        menu={{
          items: MENU,
          activeId: activeMenu,
          onSelect: setActiveMenu,
          searchResultsTitle: "Matching items",
          searchEmptyTitle: "No menu items found",
        }}
      />
    </StoryShell>
  );
}

export const MenuCustomSearchTitles: Story = {
  name: "Menu — Custom Search Titles",
  render: () => <MenuCustomSearchTitlesDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "`menu.searchResultsTitle` (default `\"Search results\"`) and `menu.searchEmptyTitle` " +
          "(default `\"No matches\"`) customise the headings shown in search mode. " +
          "Try clearing the search box and typing a non-matching query to see the empty-state heading.",
      },
    },
  },
};

/* ========================================================================== */
/* 9. OPTIONAL SLOTS — HIDE SECTIONS                                           */
/* ========================================================================== */

/**
 * **Menu only** — omit `modules` to hide the assigned-modules section and
 * render only the sub-modules menu. Use this for single-module products
 * where switching modules is irrelevant.
 */
function MenuOnlyDemo() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [search, setSearch] = useState("");

  return (
    <StoryShell>
      <Sidebar
        search={{ value: search, onChange: setSearch }}
        worklist={{ count: 3, onClick: () => alert("open worklist") }}
        menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
      />
    </StoryShell>
  );
}

export const MenuOnly: Story = {
  name: "Slot — Menu Only (No Modules)",
  render: () => <MenuOnlyDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Omit the `modules` prop entirely to hide the assigned-modules section. " +
          "The body card then contains only the sub-modules menu. " +
          "Ideal for single-module products where users don't switch between modules.",
      },
    },
  },
};

/**
 * **Modules only** — omit `menu` to hide the sub-modules menu and render only
 * the assigned-modules section. Use this for landing/dashboard screens where
 * the user picks a module but navigation is handled elsewhere.
 */
function ModulesOnlyDemo() {
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null);

  return (
    <StoryShell>
      <Sidebar
        search={{ value: "", onChange: () => {} }}
        modules={{
          assigned: ALL_MODULES,
          activeId: activeModule,
          onChange: setActiveModule,
        }}
      />
    </StoryShell>
  );
}

export const ModulesOnly: Story = {
  name: "Slot — Modules Only (No Menu)",
  render: () => <ModulesOnlyDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Omit the `menu` prop to hide the sub-modules menu. " +
          "The body card then contains only the assigned-modules section — useful for a " +
          "landing screen where the user selects a module and navigates elsewhere. " +
          "Starts with `activeId: null` to show the empty state.",
      },
    },
  },
};

/**
 * **Top card only** — omit both `modules` and `menu` to show only the top card
 * (search + worklist). The body card is hidden entirely.
 */
function TopCardOnlyDemo() {
  const [search, setSearch] = useState("");

  return (
    <StoryShell>
      <Sidebar
        search={{ value: search, onChange: setSearch }}
        worklist={{ count: 9, onClick: () => alert("open worklist") }}
      />
    </StoryShell>
  );
}

export const TopCardOnly: Story = {
  name: "Slot — Top Card Only (No Body)",
  render: () => <TopCardOnlyDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Omit both `modules` and `menu` and the body card disappears. " +
          "Only the top card (search + worklist) is rendered. " +
          "This is the minimal configuration.",
      },
    },
  },
};

/**
 * **No search input** — omit the `search` prop to hide the search input from
 * the top card. The collapse button still appears on the right.
 */
function NoSearchDemo() {
  const [activeModule, setActiveModule] = useState<ModuleId>("hrms");
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <StoryShell>
      <Sidebar
        worklist={{ count: 5, onClick: () => alert("open worklist") }}
        modules={{
          assigned: ["hrms", "budget", "e-accounts", "deposit"],
          activeId: activeModule,
          onChange: setActiveModule,
        }}
        menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
      />
    </StoryShell>
  );
}

export const NoSearch: Story = {
  name: "Slot — No Search Input",
  render: () => <NoSearchDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Omit the `search` prop and the search input is hidden from the top card. " +
          "The collapse button still renders. The body card's menu also loses its " +
          "automatic search-value wiring (since there is no search input).",
      },
    },
  },
};

/**
 * **No worklist** — omit the `worklist` prop to hide the orange worklist pill.
 * The top card then contains only the search input and the collapse button.
 */
function NoWorklistDemo() {
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <StoryShell>
      <Sidebar
        search={{ value: search, onChange: setSearch }}
        menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
      />
    </StoryShell>
  );
}

export const NoWorklist: Story = {
  name: "Slot — No Worklist",
  render: () => <NoWorklistDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Omit the `worklist` prop to hide the orange pill from the top card. " +
          "The top card then contains only the search input and the collapse button.",
      },
    },
  },
};

/* ========================================================================== */
/* 10. FOOTER PROP                                                             */
/* ========================================================================== */

/**
 * **Custom footer** — the `footer` prop renders any `ReactNode` below the body
 * card. Useful for logout buttons, app version labels, or user avatar rows.
 */
function WithFooterDemo() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [search, setSearch] = useState("");

  return (
    <StoryShell>
      <Sidebar
        search={{ value: search, onChange: setSearch }}
        menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
        footer={
          <div className="flex items-center gap-3 px-3 py-2 rounded-2xl border border-grey-300 bg-white w-full">
            <div className="flex w-8 h-8 rounded-full bg-purple-100 items-center justify-center text-purple-700 text-sm font-bold shrink-0">
              RK
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-heading truncate">Rajesh Kumar</span>
              <span className="text-xs text-body-secondary truncate">Senior Accountant</span>
            </div>
          </div>
        }
      />
    </StoryShell>
  );
}

export const WithFooter: Story = {
  name: "Footer — Custom Content",
  render: () => <WithFooterDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "The `footer` prop accepts any `ReactNode` and renders it below the body card. " +
          "Common uses: a user avatar + name row, a logout button, or an app version label. " +
          "The footer is not styled by the Sidebar — supply your own layout.",
      },
    },
  },
};

/* ========================================================================== */
/* 10b. HELP LINKS PROP                                                        */
/* ========================================================================== */

/**
 * **Help links** — pass `help.helpDesk` and `help.help` to render the two
 * support links pinned to the bottom of the body card. Each is a coloured icon
 * circle (purple headset / blue question mark) with a label. Omit either to
 * hide just that link.
 */
function HelpLinksDemo() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [search, setSearch] = useState("");

  return (
    <StoryShell>
      <Sidebar
        search={{ value: search, onChange: setSearch }}
        menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
        help={{
          helpDesk: { onClick: () => alert("open help desk") },
          help: { onClick: () => alert("open help") },
        }}
      />
    </StoryShell>
  );
}

export const HelpLinks: Story = {
  name: "Help Links — Help Desk & Help",
  render: () => <HelpLinksDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "`help.helpDesk` and `help.help` render the support links at the bottom of the body card. " +
          "Each link takes an optional `label` and an `onClick`. Omit one to hide it, or omit the whole " +
          "`help` prop to hide both. When the rail is collapsed they become icon-only circles.",
      },
    },
  },
};

/* ========================================================================== */
/* 11. COLLAPSED RAIL VARIANTS                                                 */
/* ========================================================================== */

/**
 * **Collapsed — no worklist** — the collapsed rail adapts when `worklist` is
 * omitted: the compact worklist button disappears from the top card.
 */
function CollapsedNoWorklistDemo() {
  const [collapsed, setCollapsed] = useState(true);
  const [activeModule, setActiveModule] = useState<ModuleId>("hrms");
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [search, setSearch] = useState("");

  return (
    <StoryShell>
      <Sidebar
        collapsed={collapsed}
        onCollapseToggle={() => setCollapsed((v) => !v)}
        search={{ value: search, onChange: setSearch }}
        modules={{
          assigned: ["hrms", "budget", "e-accounts", "pension"],
          activeId: activeModule,
          onChange: setActiveModule,
        }}
        menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
      />
    </StoryShell>
  );
}

export const CollapsedNoWorklist: Story = {
  name: "Collapsed — Without Worklist",
  render: () => <CollapsedNoWorklistDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "The collapsed rail correctly omits the compact worklist button when `worklist` is not passed. " +
          "Every interactive slot in the collapsed rail is optional — the layout adapts to match the " +
          "expanded sidebar's visible slots.",
      },
    },
  },
};

/**
 * **Collapsed — no module selected** — when `modules.activeId` is `null` the
 * collapsed rail shows a dashed placeholder square instead of the module thumbnail.
 * Clicking it expands the sidebar.
 */
function CollapsedNoModuleSelectedDemo() {
  const [collapsed, setCollapsed] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <StoryShell>
      <Sidebar
        collapsed={collapsed}
        onCollapseToggle={() => setCollapsed((v) => !v)}
        search={{ value: "", onChange: () => {} }}
        worklist={{ count: 3, onClick: () => alert("open worklist") }}
        modules={{
          assigned: ALL_MODULES,
          activeId: null,
          onChange: () => setCollapsed(false),
        }}
        menu={{ items: MENU, activeId: activeMenu, onSelect: setActiveMenu }}
      />
    </StoryShell>
  );
}

export const CollapsedNoModuleSelected: Story = {
  name: "Collapsed — No Module Selected",
  render: () => <CollapsedNoModuleSelectedDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "When `modules.activeId` is `null` and the rail is collapsed, the module thumbnail " +
          "area shows a dashed placeholder square with a `+` icon. Clicking it expands the sidebar " +
          "so the user can pick a module from the full picker.",
      },
    },
  },
};

/* ========================================================================== */
/* 12. SUB-COMPONENT STORIES                                                   */
/* ========================================================================== */

/**
 * **SidebarSearch — standalone** — the search input can be used on its own
 * outside the full Sidebar. Pass `value` + `onChange` for a controlled input.
 *
 * Props: `value`, `onChange`, `placeholder`.
 */
export const SubSearch: Story = {
  name: "Sub-component — SidebarSearch",
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="p-6 bg-grey-50 flex gap-4 flex-col items-start">
        <SidebarSearch
          value={value}
          onChange={setValue}
          placeholder="Search menu..."
        />
        <SidebarSearch
          value={value}
          onChange={setValue}
          placeholder="Custom placeholder..."
        />
        <p className="text-sm text-body-secondary">Current value: "{value}"</p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "`SidebarSearch` is the pill-shaped search input. It is stateless — pass `value` and " +
          "`onChange` to control it. `placeholder` defaults to `\"Search menu...\"`. " +
          "Focus applies a purple ring matching the Sidebar's design system.",
      },
    },
  },
};

/**
 * **SidebarCollapseButton — standalone** — the 40×40 purple circle that
 * toggles the rail. Exported for use in bespoke headers that don't host a
 * full Sidebar.
 *
 * Props: `collapsed`, `onClick`.
 */
export const SubCollapseButton: Story = {
  name: "Sub-component — SidebarCollapseButton",
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <div className="p-6 bg-grey-50 flex items-center gap-4">
        <SidebarCollapseButton
          collapsed={collapsed}
          onClick={() => setCollapsed((v) => !v)}
        />
        <span className="text-sm text-body-secondary">
          State: {collapsed ? "collapsed" : "expanded"}
        </span>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "`SidebarCollapseButton` is the 40×40 purple-tinted circular toggle. " +
          "It is exported so you can place it in bespoke app-shell headers independently of the full Sidebar. " +
          "`collapsed` drives the `aria-pressed` and `aria-label` states. " +
          "`onClick` should flip your collapse state.",
      },
    },
  },
};

/**
 * **WorklistButton — standalone** — the orange worklist pill. Exported for use
 * on screens that host the pill without a full Sidebar.
 *
 * Props: `count`, `onClick`, `label`.
 */
export const SubWorklist: Story = {
  name: "Sub-component — WorklistButton",
  render: () => (
    <div className="p-6 bg-grey-50 flex flex-col gap-4 items-start">
      <WorklistButton count={12} onClick={() => alert("open worklist")} />
      <WorklistButton onClick={() => alert("open worklist")} />
      <WorklistButton label="Pending Tasks" count={3} onClick={() => alert("open tasks")} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`WorklistButton` is the orange pill. Three variants shown: with count badge, without badge, " +
          "and with a custom label. Exported from `@ifmis/ui` for standalone use in other layouts.",
      },
    },
  },
};

/**
 * **AdminButton — standalone** — the blue gradient "Admin" pill. Exported for
 * use outside the full Sidebar frame.
 *
 * Props: `label`, `onClick`.
 */
export const SubAdminButton: Story = {
  name: "Sub-component — AdminButton",
  render: () => (
    <div className="p-6 bg-grey-50 flex flex-col gap-4 items-start">
      <AdminButton onClick={() => alert("open admin")} />
      <AdminButton label="Administration" onClick={() => alert("open admin")} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`AdminButton` is the 247×48 blue gradient pill (`114deg, #3981E0 → #1FB9E4`, 16px radius) " +
          "with decorative white petals and the user-with-sync-arrows glyph. " +
          "Pass `onClick` and an optional `label`. Exported from `@ifmis/ui` for standalone use.",
      },
    },
  },
};

/**
 * **SidebarHelpLinks — standalone** — the "Help Desk" / "Help" links used at
 * the bottom of the Sidebar. Exported for bespoke layouts that host the links
 * without the full Sidebar frame.
 *
 * Props: `helpDesk`, `help` — each `{ label?, onClick? }`.
 */
export const SubHelpLinks: Story = {
  name: "Sub-component — SidebarHelpLinks",
  render: () => (
    <div className="p-6 bg-grey-50 flex flex-col gap-6 items-start w-[15rem]">
      <SidebarHelpLinks
        helpDesk={{ onClick: () => alert("open help desk") }}
        help={{ onClick: () => alert("open help") }}
      />
      <SidebarHelpLinks
        helpDesk={{ label: "Support", onClick: () => alert("open support") }}
        help={{ label: "Documentation", onClick: () => alert("open docs") }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`SidebarHelpLinks` renders the two support links — a purple headset (\"Help Desk\") and a " +
          "blue question mark (\"Help\"). Both links are optional and accept a custom `label`. " +
          "Exported from `@ifmis/ui` for standalone use.",
      },
    },
  },
};

/**
 * **AssignedModules — standalone** — the module-switching section used inside
 * the Sidebar body card. Can be rendered directly in any layout.
 *
 * Props: `assigned`, `activeId`, `onChange`, `maxInlineInactive`.
 */
export const SubAssignedModules: Story = {
  name: "Sub-component — AssignedModules",
  render: () => {
    const [activeModule, setActiveModule] = useState<ModuleId>("hrms");
    return (
      <div className="p-6 bg-grey-50 flex flex-col gap-6">
        <div className="w-[15rem] p-4 rounded-3xl border border-purple-200 bg-white">
          <AssignedModules
            assigned={ALL_MODULES}
            activeId={activeModule}
            onChange={setActiveModule}
          />
        </div>
        <p className="text-sm text-body-secondary">Active module: {activeModule}</p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "`AssignedModules` renders the active-module card, up to `maxInlineInactive` (default `3`) " +
          "inactive thumbnails in a 2×2 grid, and a `▸` overflow button when there are more. " +
          "The active module card triggers a fade-and-scale animation when switching. " +
          "Each inactive thumbnail shows a hover tooltip with the module name.",
      },
    },
  },
};

/**
 * **SidebarMenu — standalone** — the recursive sub-modules menu. Can be used
 * independently in screens that need only the menu without the full Sidebar frame.
 *
 * Props: `title`, `items`, `activeId`, `onSelect`, `searchValue`,
 * `searchResultsTitle`, `searchEmptyTitle`.
 */
export const SubSidebarMenu: Story = {
  name: "Sub-component — SidebarMenu",
  render: () => {
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [search, setSearch] = useState("");

    return (
      <div className="p-6 bg-grey-50 flex flex-col gap-4 w-[17rem]">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type to search..."
          className="px-3 py-2 border border-grey-400 rounded-2xl text-sm outline-none focus:border-purple-500"
        />
        <div className="p-4 rounded-3xl border border-purple-200 bg-white">
          <SidebarMenu
            items={MENU}
            activeId={activeMenu}
            onSelect={setActiveMenu}
            searchValue={search}
            searchResultsTitle="Matching items"
            searchEmptyTitle="Nothing found"
          />
        </div>
        <p className="text-sm text-body-secondary">Active: {activeMenu}</p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "`SidebarMenu` renders the sub-modules pill list with cascading right-side cards. " +
          "Pass `searchValue` to switch it to the flat search-results view. " +
          "The menu is stateless — all selection logic lives in your component via `activeId` / `onSelect`. " +
          "Type in the input above to see the search-results view with custom titles.",
      },
    },
  },
};
