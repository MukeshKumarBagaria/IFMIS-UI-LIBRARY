import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
