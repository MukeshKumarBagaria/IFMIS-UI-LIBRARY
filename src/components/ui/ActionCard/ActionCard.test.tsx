import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActionCard } from "./ActionCard";

describe("ActionCard", () => {
  it("renders title, heading and description in the prop-driven layout", () => {
    render(
      <ActionCard
        tone="pending"
        title="Pending"
        heading="Quarterly report"
        description="Awaiting approval."
      />,
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Quarterly report")).toBeInTheDocument();
    expect(screen.getByText("Awaiting approval.")).toBeInTheDocument();
  });

  it("exposes the tone via data-tone on the root", () => {
    const { container } = render(<ActionCard tone="success" title="Done" />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "success");
  });

  it("renders the default badge when badge={true} with the default label", () => {
    render(<ActionCard title="X" badge />);
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  it("renders a custom badge label and icon=null hides the glyph", () => {
    render(
      <ActionCard title="X" badge badgeLabel="3 reviewers" badgeIcon={null} />,
    );
    expect(screen.getByText("3 reviewers")).toBeInTheDocument();
    // No SVG inside the badge pill (the heading row has the badge as its
    // second child).
    const badge = screen.getByText("3 reviewers").closest("span");
    expect(badge?.querySelector("svg")).toBeNull();
  });

  it("renders a custom badge node when badge={<...>}", () => {
    render(
      <ActionCard
        title="X"
        badge={<span data-testid="custom-badge">Custom</span>}
      />,
    );
    expect(screen.getByTestId("custom-badge")).toBeInTheDocument();
  });

  it("hides the footer when no counter / handlers are provided", () => {
    render(<ActionCard title="X" />);
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Open" })).toBeNull();
  });

  it("hideFooter={true} drops the footer even if counter is set", () => {
    render(<ActionCard title="X" counter="20 of 30" hideFooter />);
    expect(screen.queryByText("20 of 30")).toBeNull();
  });

  it("fires onCancel and onOpen", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onOpen = vi.fn();
    render(<ActionCard title="X" onCancel={onCancel} onOpen={onOpen} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("renders only the open button when onCancel is omitted", () => {
    render(<ActionCard title="X" onOpen={() => {}} />);
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });

  it("compound mode: children override the prop-driven layout", () => {
    render(
      <ActionCard tone="success" title="ignored">
        <div data-testid="custom">just children</div>
      </ActionCard>,
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
    // The prop-driven title should not be rendered when children take over.
    expect(screen.queryByText("ignored")).toBeNull();
  });

  it("sub-parts read tone from context", () => {
    render(
      <ActionCard tone="danger">
        <ActionCard.Header>Rejected</ActionCard.Header>
        <ActionCard.Body heading="H" description="D" />
        <ActionCard.Footer counter="20 of 30">
          <ActionCard.Button>Open</ActionCard.Button>
        </ActionCard.Footer>
      </ActionCard>,
    );
    // Counter picks up danger tone (red-800).
    const counter = screen.getByText("20 of 30");
    expect(counter.className).toContain("text-red-800");
    // Open button picks up the danger primary classes.
    expect(screen.getByRole("button", { name: /open/i }).className).toContain(
      "bg-red-600",
    );
  });

  it("forwards arbitrary props and className to the root", () => {
    const { container } = render(
      <ActionCard title="X" className="custom" id="my-card" data-x="y" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("custom");
    expect(root).toHaveAttribute("id", "my-card");
    expect(root).toHaveAttribute("data-x", "y");
  });

  it("applies the tone-specific gradient class on the header", () => {
    const { container } = render(<ActionCard tone="pending" title="X" />);
    // The header is the first child of the card root.
    const header = container.firstElementChild?.firstElementChild;
    expect(header?.className).toContain("brand-gradient-orange");
  });
});
