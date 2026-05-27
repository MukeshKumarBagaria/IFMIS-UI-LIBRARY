import { describe, expect, it } from "vitest";
import { searchMenuTree } from "./searchMenu";
import type { MenuNode } from "./SidebarMenu";

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
      { id: "hrms.leave", label: "Leave Management" },
    ],
  },
  { id: "payments", label: "Payments" },
];

describe("searchMenuTree", () => {
  it("returns an empty array for empty / whitespace queries", () => {
    expect(searchMenuTree(MENU, "")).toEqual([]);
    expect(searchMenuTree(MENU, "   ")).toEqual([]);
  });

  it("matches a leaf by substring (case-insensitive)", () => {
    const hits = searchMenuTree(MENU, "salary");
    expect(hits).toHaveLength(1);
    expect(hits[0].node.id).toBe("hrms.pay.salary");
    expect(hits[0].path).toEqual(["HRMS", "Pay Related"]);
    expect(hits[0].idPath).toEqual(["hrms", "hrms.pay"]);
  });

  it("matches a top-level leaf with an empty path", () => {
    const hits = searchMenuTree(MENU, "dashboard");
    expect(hits).toHaveLength(1);
    expect(hits[0].node.id).toBe("dashboard");
    expect(hits[0].path).toEqual([]);
    expect(hits[0].idPath).toEqual([]);
  });

  it("surfaces every descendant leaf when a parent label matches", () => {
    const hits = searchMenuTree(MENU, "pay");
    // "Pay Related" matches → expose all 3 leaves underneath. The
    // outer "Payments" leaf at the root also matches by substring.
    const ids = hits.map((h) => h.node.id).sort();
    expect(ids).toEqual([
      "hrms.pay.arrears",
      "hrms.pay.bonus",
      "hrms.pay.salary",
      "payments",
    ]);
  });

  it("does not return container nodes — only leaves", () => {
    const hits = searchMenuTree(MENU, "hrms");
    // "HRMS" container matches → every leaf under it (5) plus none
    // for the HRMS node itself.
    expect(hits.every((h) => !h.node.children?.length)).toBe(true);
    expect(hits.map((h) => h.node.id).sort()).toEqual([
      "hrms.exit",
      "hrms.leave",
      "hrms.pay.arrears",
      "hrms.pay.bonus",
      "hrms.pay.salary",
    ]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(searchMenuTree(MENU, "zzz")).toEqual([]);
  });

  it("is case-insensitive", () => {
    const lower = searchMenuTree(MENU, "salary");
    const upper = searchMenuTree(MENU, "SALARY");
    const mixed = searchMenuTree(MENU, "SaLaRy");
    expect(lower).toEqual(upper);
    expect(lower).toEqual(mixed);
  });
});
