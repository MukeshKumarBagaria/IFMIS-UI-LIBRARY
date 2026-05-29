import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SectionTitle } from "./SectionTitle";

describe("SectionTitle", () => {
  it("renders the title as a level-2 heading by default", () => {
    render(<SectionTitle title="Sub Section Title" />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Sub Section Title" }),
    ).toBeInTheDocument();
  });

  it("honours a custom heading tag via `as`", () => {
    render(<SectionTitle title="Items" as="h3" />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Items" }),
    ).toBeInTheDocument();
  });

  it("renders the default more button only when onMore is given, and fires it", async () => {
    const onMore = vi.fn();
    const { rerender } = render(<SectionTitle title="Items" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    rerender(<SectionTitle title="Items" onMore={onMore} />);
    const more = screen.getByRole("button", { name: "More options" });
    await userEvent.click(more);
    expect(onMore).toHaveBeenCalledOnce();
  });

  it("supports a custom more-button label", () => {
    render(<SectionTitle title="Items" onMore={() => {}} moreLabel="Section actions" />);
    expect(
      screen.getByRole("button", { name: "Section actions" }),
    ).toBeInTheDocument();
  });

  it("renders a custom action and ignores the default more button", () => {
    render(
      <SectionTitle
        title="Attachments"
        action={<button type="button">Add file</button>}
        onMore={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Add file" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "More options" }),
    ).not.toBeInTheDocument();
  });

  it("forwards className and arbitrary props to the root", () => {
    const { container } = render(
      <SectionTitle title="Items" className="custom-bar" data-testid="bar" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("custom-bar");
    expect(root).toHaveAttribute("data-testid", "bar");
  });
});
