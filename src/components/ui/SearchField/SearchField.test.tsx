import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchField, type SearchSuggestion } from "./SearchField";

const NAMES: SearchSuggestion[] = [
  { value: "John Doe" },
  { value: "John Woe" },
  { value: "John Wick" },
  { value: "Jane Roe" },
];

function getInput() {
  return screen.getByRole("combobox");
}

describe("SearchField", () => {
  it("renders a search input with the placeholder", () => {
    render(<SearchField aria-label="Search" placeholder="Search..." />);
    const input = getInput();
    expect(input).toHaveAttribute("placeholder", "Search...");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onValueChange while typing (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    render(<SearchField aria-label="Search" onValueChange={onValueChange} />);
    await userEvent.type(getInput(), "Jo");
    expect(onValueChange).toHaveBeenLastCalledWith("Jo");
    expect(getInput()).toHaveValue("Jo");
  });

  it("opens a filtered suggestion list as you type", async () => {
    render(<SearchField aria-label="Search" suggestions={NAMES} />);
    await userEvent.type(getInput(), "John");
    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");
    // "Jane Roe" is filtered out.
    expect(options.map((o) => o.textContent)).toEqual([
      "John Doe",
      "John Woe",
      "John Wick",
    ]);
    expect(getInput()).toHaveAttribute("aria-expanded", "true");
  });

  it("selects a suggestion on click, fills the value, and closes", async () => {
    const onSuggestionSelect = vi.fn();
    const onValueChange = vi.fn();
    render(
      <SearchField
        aria-label="Search"
        suggestions={NAMES}
        onSuggestionSelect={onSuggestionSelect}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.type(getInput(), "John");
    await userEvent.click(screen.getByRole("option", { name: "John Wick" }));

    expect(onSuggestionSelect).toHaveBeenCalledWith({ value: "John Wick" });
    expect(onValueChange).toHaveBeenLastCalledWith("John Wick");
    expect(getInput()).toHaveValue("John Wick");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("navigates suggestions with the keyboard and selects with Enter", async () => {
    const onSuggestionSelect = vi.fn();
    render(
      <SearchField
        aria-label="Search"
        suggestions={NAMES}
        onSuggestionSelect={onSuggestionSelect}
      />,
    );
    await userEvent.type(getInput(), "John");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}"); // 1st -> 2nd
    expect(onSuggestionSelect).toHaveBeenCalledWith({ value: "John Woe" });
  });

  it("marks the value-matching suggestion as selected", async () => {
    render(<SearchField aria-label="Search" suggestions={NAMES} />);
    await userEvent.type(getInput(), "John Doe");
    expect(screen.getByRole("option", { name: "John Doe" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("fires onSearch on Enter when no suggestion is highlighted", async () => {
    const onSearch = vi.fn();
    render(<SearchField aria-label="Search" onSearch={onSearch} />);
    await userEvent.type(getInput(), "ledger{Enter}");
    expect(onSearch).toHaveBeenCalledWith("ledger");
  });

  it("closes the list on Escape but keeps the value", async () => {
    render(<SearchField aria-label="Search" suggestions={NAMES} />);
    await userEvent.type(getInput(), "John");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(getInput()).toHaveValue("John");
  });

  it("shows suggestions verbatim when autoFilter is false", async () => {
    render(
      <SearchField aria-label="Search" autoFilter={false} suggestions={NAMES} />,
    );
    await userEvent.type(getInput(), "zzz");
    expect(within(screen.getByRole("listbox")).getAllByRole("option")).toHaveLength(
      4,
    );
  });

  it("respects minChars before opening", async () => {
    render(<SearchField aria-label="Search" minChars={3} suggestions={NAMES} />);
    await userEvent.type(getInput(), "Jo");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await userEvent.type(getInput(), "h");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("does not open or accept input when disabled", async () => {
    render(<SearchField aria-label="Search" disabled suggestions={NAMES} />);
    const input = getInput();
    expect(input).toBeDisabled();
    await userEvent.type(input, "John");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("skips disabled suggestions during keyboard navigation", async () => {
    const onSuggestionSelect = vi.fn();
    const opts: SearchSuggestion[] = [
      { value: "John Doe" },
      { value: "John Woe", disabled: true },
      { value: "John Wick" },
    ];
    render(
      <SearchField
        aria-label="Search"
        suggestions={opts}
        onSuggestionSelect={onSuggestionSelect}
      />,
    );
    await userEvent.type(getInput(), "John");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}"); // Doe -> Wick
    expect(onSuggestionSelect).toHaveBeenCalledWith({ value: "John Wick" });
  });

  it("works as a controlled input", async () => {
    function Controlled() {
      const [v, setV] = useState("");
      return (
        <SearchField aria-label="Search" value={v} onValueChange={setV} />
      );
    }
    render(<Controlled />);
    await userEvent.type(getInput(), "abc");
    expect(getInput()).toHaveValue("abc");
  });

  it("exposes a labelled listbox for assistive tech", async () => {
    render(<SearchField aria-label="People" suggestions={NAMES} />);
    await userEvent.type(getInput(), "John");
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-label", "People");
    expect(getInput()).toHaveAttribute("aria-autocomplete", "list");
  });

  describe("collapsible", () => {
    it("starts as a 40px icon button and expands to a focused input", async () => {
      render(<SearchField collapsible aria-label="Search" />);
      const button = screen.getByRole("button", { name: "Search" });
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();

      await userEvent.click(button);
      const input = getInput();
      expect(input).toBeInTheDocument();
      expect(input).toHaveFocus();
    });

    it("honours a controlled collapsed state", () => {
      const { rerender } = render(
        <SearchField collapsible collapsed aria-label="Search" />,
      );
      expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();

      rerender(<SearchField collapsible collapsed={false} aria-label="Search" />);
      expect(getInput()).toBeInTheDocument();
    });
  });
});
