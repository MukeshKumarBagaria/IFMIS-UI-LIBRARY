import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown, type DropdownOption } from "./Dropdown";

const OPTIONS: DropdownOption[] = [
  { value: "in", label: "India" },
  { value: "np", label: "Nepal" },
  { value: "bt", label: "Bhutan" },
];

function getTrigger() {
  return screen.getByRole("combobox");
}

describe("Dropdown", () => {
  it("renders the label and placeholder, closed by default", () => {
    render(
      <Dropdown label="Country" placeholder="Pick one" options={OPTIONS} />,
    );
    expect(getTrigger()).toHaveTextContent("Pick one");
    expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    // The label is wired to the trigger via htmlFor/id.
    expect(screen.getByText("Country").closest("label")).toHaveAttribute(
      "for",
      getTrigger().id,
    );
  });

  it("opens on click and lists every option", async () => {
    render(<Dropdown label="Country" options={OPTIONS} />);
    await userEvent.click(getTrigger());
    const listbox = screen.getByRole("listbox");
    expect(getTrigger()).toHaveAttribute("aria-expanded", "true");
    expect(within(listbox).getAllByRole("option")).toHaveLength(3);
  });

  it("selects a single value, closes, and shows it in the trigger", async () => {
    const onValueChange = vi.fn();
    render(
      <Dropdown label="Country" options={OPTIONS} onValueChange={onValueChange} />,
    );
    await userEvent.click(getTrigger());
    await userEvent.click(screen.getByRole("option", { name: "Nepal" }));

    expect(onValueChange).toHaveBeenCalledWith("np");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(getTrigger()).toHaveTextContent("Nepal");
  });

  it("supports multiple selection and stays open", async () => {
    const onValueChange = vi.fn();
    render(
      <Dropdown
        multiple
        label="Countries"
        options={OPTIONS}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(getTrigger());
    await userEvent.click(screen.getByRole("option", { name: "India" }));
    await userEvent.click(screen.getByRole("option", { name: "Bhutan" }));

    // Last call carries both values; popover is still open.
    expect(onValueChange).toHaveBeenLastCalledWith(["in", "bt"]);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "India" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    // Multiple mode renders the selection as chips in the trigger.
    expect(getTrigger()).toHaveTextContent("India");
    expect(getTrigger()).toHaveTextContent("Bhutan");
  });

  it("toggles a selected value off in multiple mode", async () => {
    const onValueChange = vi.fn();
    render(
      <Dropdown
        multiple
        label="Countries"
        defaultValue={["in"]}
        options={OPTIONS}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(getTrigger());
    await userEvent.click(screen.getByRole("option", { name: "India" }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("collapses chips past maxVisibleChips into a +N more affordance", () => {
    render(
      <Dropdown
        multiple
        maxVisibleChips={2}
        label="Countries"
        options={OPTIONS}
        defaultValue={["in", "np", "bt"]}
      />,
    );
    // Two chips visible, the third folded into "+1 more".
    expect(getTrigger()).toHaveTextContent("India");
    expect(getTrigger()).toHaveTextContent("Nepal");
    expect(getTrigger()).toHaveTextContent("+1 more");
    expect(getTrigger()).not.toHaveTextContent("Bhutan");
  });

  it("removes a single value via a chip's × without opening the menu", async () => {
    const onValueChange = vi.fn();
    render(
      <Dropdown
        multiple
        label="Countries"
        options={OPTIONS}
        defaultValue={["in", "np"]}
        onValueChange={onValueChange}
      />,
    );
    // The chips render their × first; the trailing svg is the caret. The first
    // svg therefore belongs to India's remove control.
    const removeX = getTrigger().querySelectorAll("svg")[0]!
      .parentElement as HTMLElement;
    await userEvent.click(removeX);

    expect(onValueChange).toHaveBeenLastCalledWith(["np"]);
    // Removing a chip must not pop the listbox open.
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("clears the whole selection from the popover footer", async () => {
    const onValueChange = vi.fn();
    render(
      <Dropdown
        multiple
        label="Countries"
        options={OPTIONS}
        defaultValue={["in", "np"]}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(getTrigger());
    await userEvent.click(screen.getByRole("button", { name: /clear all/i }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("shows the circular indicator only in multiple mode", async () => {
    const { rerender } = render(
      <Dropdown label="Country" options={OPTIONS} defaultValue="in" />,
    );
    await userEvent.click(getTrigger());
    // Single mode: no outlined-circle indicator on unselected rows.
    expect(
      document.querySelector(".rounded-full.border-2"),
    ).not.toBeInTheDocument();

    rerender(
      <Dropdown
        multiple
        label="Country"
        options={OPTIONS}
        defaultValue={["in"]}
      />,
    );
    // Multiple mode: outlined circles appear for the unselected rows.
    expect(document.querySelector(".rounded-full.border-2")).toBeInTheDocument();
  });

  it("is keyboard operable (arrow to open, navigate, Enter to select)", async () => {
    render(<Dropdown label="Country" options={OPTIONS} />);
    const trigger = getTrigger();
    trigger.focus();

    await userEvent.keyboard("{ArrowDown}"); // opens, active = first
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowDown}"); // active = Nepal
    await userEvent.keyboard("{Enter}"); // select Nepal

    expect(trigger).toHaveTextContent("Nepal");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<Dropdown label="Country" options={OPTIONS} />);
    const trigger = getTrigger();
    await userEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes when clicking outside", async () => {
    render(
      <div>
        <Dropdown label="Country" options={OPTIONS} />
        <button type="button">outside</button>
      </div>,
    );
    await userEvent.click(getTrigger());
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "outside" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not open when disabled", async () => {
    render(<Dropdown label="Country" options={OPTIONS} disabled />);
    expect(getTrigger()).toBeDisabled();
    await userEvent.click(getTrigger());
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("skips disabled options during keyboard navigation and click", async () => {
    const opts: DropdownOption[] = [
      { value: "a", label: "Alpha" },
      { value: "b", label: "Beta", disabled: true },
      { value: "c", label: "Gamma" },
    ];
    const onValueChange = vi.fn();
    render(<Dropdown label="Greek" options={opts} onValueChange={onValueChange} />);
    getTrigger().focus();

    await userEvent.keyboard("{ArrowDown}"); // active = Alpha
    await userEvent.keyboard("{ArrowDown}"); // skips Beta -> Gamma
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("c");

    // Direct click on the disabled option is a no-op.
    onValueChange.mockClear();
    await userEvent.click(getTrigger());
    await userEvent.click(screen.getByRole("option", { name: "Beta" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("honours a controlled value", async () => {
    function Controlled() {
      const [v, setV] = useState("in");
      return (
        <Dropdown
          label="Country"
          options={OPTIONS}
          value={v}
          onValueChange={(next) => setV(next as string)}
        />
      );
    }
    render(<Controlled />);
    expect(getTrigger()).toHaveTextContent("India");
    await userEvent.click(getTrigger());
    await userEvent.click(screen.getByRole("option", { name: "Bhutan" }));
    expect(getTrigger()).toHaveTextContent("Bhutan");
  });

  it("renders the preview-selection list below the field", () => {
    const { container } = render(
      <Dropdown
        multiple
        previewSelection
        label="Countries"
        options={OPTIONS}
        defaultValue={["in", "bt"]}
      />,
    );
    // The preview box lists each selected label on its own row.
    const preview = container.querySelector(
      ".rounded-2xl.bg-surface-grey-bg",
    ) as HTMLElement;
    expect(preview).toBeInTheDocument();
    const rows = within(preview).getAllByText(/India|Bhutan|Nepal/);
    expect(rows.map((r) => r.textContent)).toEqual(["India", "Bhutan"]);
  });

  it("exposes aria-multiselectable for multiple mode", async () => {
    render(<Dropdown multiple label="Countries" options={OPTIONS} />);
    await userEvent.click(getTrigger());
    expect(screen.getByRole("listbox")).toHaveAttribute(
      "aria-multiselectable",
      "true",
    );
  });

  it("shows an error alert and marks the trigger invalid", () => {
    render(
      <Dropdown label="Country" options={OPTIONS} error="Required field" />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Required field");
    expect(getTrigger()).toHaveAttribute("aria-invalid", "true");
  });

  it("emits hidden inputs for form submission", () => {
    const { container } = render(
      <Dropdown
        multiple
        name="country"
        label="Country"
        options={OPTIONS}
        defaultValue={["in", "np"]}
      />,
    );
    const hidden = container.querySelectorAll('input[type="hidden"][name="country"]');
    expect(hidden).toHaveLength(2);
    expect([...hidden].map((n) => (n as HTMLInputElement).value)).toEqual([
      "in",
      "np",
    ]);
  });
});
