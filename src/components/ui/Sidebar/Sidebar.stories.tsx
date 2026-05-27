import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";
import type { MenuNode } from "./Sidebar";
import type { ModuleId } from "./modules";

const meta: Meta<typeof Sidebar> = {
  title: "UI/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

/**
 * Reference menu tree — kept inside the story file so consumers can copy
 * the exact shape into their own product configuration.
 *
 * The shape is intentionally minimal:
 *   - `id`       — stable key (use a routable path if you have one).
 *   - `label`    — what the user sees.
 *   - `children` — optional sub-items; presence opens a right-side card.
 *   - `badge`    — optional counter shown on the right.
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

const ASSIGNED: ModuleId[] = [
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
];

/**
 * Canonical end-to-end usage. Every input is **controlled** — selection
 * state for both the active module and the active menu item lives in the
 * consumer. The Sidebar is purely presentational; it does not call the
 * router or persist anything.
 */
export const Default: Story = {
  render: () => {
    const [activeModule, setActiveModule] = useState<ModuleId>("hrms");
    const [activeMenu, setActiveMenu] = useState("hrms.exit");
    const [search, setSearch] = useState("");

    return (
      <div className="bg-grey-50 min-h-screen p-6">
        <Sidebar
          search={{ value: search, onChange: setSearch }}
          worklist={{
            count: 12,
            onClick: () => alert("open worklist"),
          }}
          modules={{
            assigned: ASSIGNED,
            activeId: activeModule,
            onChange: setActiveModule,
          }}
          menu={{
            items: MENU,
            activeId: activeMenu,
            onSelect: setActiveMenu,
          }}
        />
      </div>
    );
  },
};

/**
 * The collapsed rail. Click any button to expand back to the full
 * Sidebar.
 */
export const Collapsed: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(true);
    const [activeModule, setActiveModule] = useState<ModuleId>("hrms");
    const [activeMenu, setActiveMenu] = useState("hrms.exit");
    const [search, setSearch] = useState("");

    return (
      <div className="bg-grey-50 min-h-screen p-6">
        <Sidebar
          collapsed={collapsed}
          onCollapseToggle={() => setCollapsed((v) => !v)}
          search={{ value: search, onChange: setSearch }}
          worklist={{ count: 28, onClick: () => alert("open worklist") }}
          modules={{
            assigned: ASSIGNED,
            activeId: activeModule,
            onChange: setActiveModule,
          }}
          menu={{
            items: MENU,
            activeId: activeMenu,
            onSelect: setActiveMenu,
          }}
        />
      </div>
    );
  },
};
