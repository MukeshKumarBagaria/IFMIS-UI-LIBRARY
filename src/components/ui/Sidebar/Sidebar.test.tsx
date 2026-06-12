import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar } from "./Sidebar";

const MODULES_CONFIG = {
  assigned: ["deposit", "e-accounts", "hrms"] as const,
  activeId: "deposit" as const,
};

describe("Sidebar — module hover pills", () => {
  it("reveals a non-active module's name in a hover pill", async () => {
    const onChange = vi.fn();
    render(
      <Sidebar modules={{ ...MODULES_CONFIG, onChange }} />,
    );

    // e-accounts is inactive (deposit is active). Its name isn't visible yet.
    const inactive = screen.getByRole("button", { name: "E-Accounts" });
    expect(screen.queryByText("E-Accounts")).not.toBeInTheDocument();

    await userEvent.hover(inactive);
    // The hover pill now shows the module label.
    expect(screen.getByText("E-Accounts")).toBeInTheDocument();

    await userEvent.unhover(inactive);
    expect(screen.queryByText("E-Accounts")).not.toBeInTheDocument();
  });

  it("still switches modules when an inactive thumbnail is clicked", async () => {
    const onChange = vi.fn();
    render(<Sidebar modules={{ ...MODULES_CONFIG, onChange }} />);
    await userEvent.click(screen.getByRole("button", { name: "HRMS" }));
    expect(onChange).toHaveBeenCalledWith("hrms");
  });
});

describe("Sidebar — no module selected", () => {
  it("renders the empty state when activeId is null", () => {
    render(
      <Sidebar
        modules={{ assigned: ["deposit", "hrms"], activeId: null }}
      />,
    );
    expect(screen.getByText("No module selected")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /select module/i }),
    ).toBeInTheDocument();
  });

  it("opens the module picker and selects a module", async () => {
    const onChange = vi.fn();
    render(
      <Sidebar
        modules={{ assigned: ["deposit", "hrms"], activeId: null, onChange }}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /select module/i }),
    );
    // The picker dialog lists every assigned module.
    const picker = screen.getByRole("dialog", { name: /assigned modules/i });
    await userEvent.click(within(picker).getByRole("button", { name: "HRMS" }));
    expect(onChange).toHaveBeenCalledWith("hrms");
  });
});
