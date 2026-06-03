import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProgressStepper, type ProgressStep } from "./ProgressStepper";

const STEPS: ProgressStep[] = [
  {
    id: "creator",
    label: "Creator",
    status: "success",
    timestamp: "Submitted on 05 May 2026",
    user: { name: "Amit Mohan", role: "Employee" },
  },
  {
    id: "verifier",
    label: "Verifier",
    status: "pending",
    timestamp: "Received on 05 May 2026",
    user: { name: "Asha Pillai", role: "Reviewer" },
    remarks: "Need clarification",
  },
  {
    id: "approver",
    label: "Approver",
    status: "rejected",
    user: { name: "Ravi Kumar" },
    remarks: "Wrong category",
  },
];

describe("ProgressStepper", () => {
  it("renders the title and every step label", () => {
    render(<ProgressStepper steps={STEPS} />);
    expect(screen.getByText("Progress")).toBeInTheDocument();
    expect(screen.getByText("Creator")).toBeInTheDocument();
    expect(screen.getByText("Verifier")).toBeInTheDocument();
    expect(screen.getByText("Approver")).toBeInTheDocument();
  });

  it("uses default badge labels per status", () => {
    render(<ProgressStepper steps={STEPS} />);
    expect(screen.getByText("Submitted")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("renders custom badge labels when supplied", () => {
    render(
      <ProgressStepper
        steps={[
          { ...STEPS[0]!, badgeLabel: "Filed" },
          STEPS[1]!,
          STEPS[2]!,
        ]}
      />,
    );
    expect(screen.getByText("Filed")).toBeInTheDocument();
    expect(screen.queryByText("Submitted")).toBeNull();
  });

  it("hides the badge when badgeLabel is null", () => {
    render(
      <ProgressStepper
        steps={[{ ...STEPS[0]!, badgeLabel: null }]}
      />,
    );
    expect(screen.queryByText("Submitted")).toBeNull();
  });

  it("renders the timestamp when given and skips it otherwise", () => {
    render(<ProgressStepper steps={STEPS} />);
    expect(screen.getByText("Submitted on 05 May 2026")).toBeInTheDocument();
    // Approver step has no timestamp.
    expect(screen.queryByText(/Approved on/)).toBeNull();
  });

  it("renders user name + role and falls back to derived initials", () => {
    render(<ProgressStepper steps={STEPS} />);
    expect(screen.getAllByText("Amit Mohan").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Employee").length).toBeGreaterThan(0);
    // 'Amit Mohan' → 'AM'; 'Asha Pillai' → 'AP'; 'Ravi Kumar' → 'RK'.
    expect(screen.getByText("AM")).toBeInTheDocument();
    expect(screen.getByText("AP")).toBeInTheDocument();
    expect(screen.getByText("RK")).toBeInTheDocument();
  });

  it("honours explicit initials", () => {
    render(
      <ProgressStepper
        steps={[
          { ...STEPS[0]!, user: { name: "Amit Mohan", initials: "XY" } },
        ]}
      />,
    );
    expect(screen.getByText("XY")).toBeInTheDocument();
    expect(screen.queryByText("AM")).toBeNull();
  });

  it("renders an avatar image when avatarSrc is set", () => {
    render(
      <ProgressStepper
        steps={[
          {
            ...STEPS[0]!,
            user: {
              name: "Amit Mohan",
              avatarSrc: "/avatar.png",
              avatarAlt: "Amit's photo",
            },
          },
        ]}
      />,
    );
    const img = screen.getByAltText("Amit's photo") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/avatar.png");
  });

  it("renders remarks only when provided", () => {
    render(<ProgressStepper steps={STEPS} />);
    // Two steps have remarks.
    expect(screen.getAllByText("Remarks")).toHaveLength(2);
    expect(screen.getByText("Need clarification")).toBeInTheDocument();
    expect(screen.getByText("Wrong category")).toBeInTheDocument();
  });

  it("supports a custom remarksTitle", () => {
    render(
      <ProgressStepper
        steps={[
          { ...STEPS[1]!, remarksTitle: "Reviewer note" },
        ]}
      />,
    );
    expect(screen.getByText("Reviewer note")).toBeInTheDocument();
    expect(screen.queryByText("Remarks")).toBeNull();
  });

  it("toggles collapse uncontrolled and hides the body", async () => {
    const user = userEvent.setup();
    render(<ProgressStepper steps={STEPS} />);
    expect(screen.getByText("Creator")).toBeVisible();

    const toggle = screen.getByRole("button", { name: "Collapse progress" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAccessibleName("Expand progress");
    expect(screen.queryByText("Creator")).not.toBeVisible();
  });

  it("respects defaultCollapsed", () => {
    render(<ProgressStepper steps={STEPS} defaultCollapsed />);
    const toggle = screen.getByRole("button", { name: "Expand progress" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Creator")).not.toBeVisible();
  });

  it("fires onCollapsedChange and respects controlled state", async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();
    const { rerender } = render(
      <ProgressStepper
        steps={STEPS}
        collapsed={false}
        onCollapsedChange={onCollapsedChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Collapse progress" }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);

    // Controlled — internal state is ignored, body still visible until parent
    // re-renders with the new prop.
    expect(screen.getByText("Creator")).toBeVisible();

    rerender(
      <ProgressStepper
        steps={STEPS}
        collapsed={true}
        onCollapsedChange={onCollapsedChange}
      />,
    );
    expect(screen.queryByText("Creator")).not.toBeVisible();
  });

  it("hides the toggle when collapsible is false", () => {
    render(<ProgressStepper steps={STEPS} collapsible={false} />);
    expect(screen.queryByRole("button", { name: /progress/i })).toBeNull();
    expect(screen.getByText("Creator")).toBeVisible();
  });

  it("renders the View Details button only when enabled", async () => {
    const user = userEvent.setup();
    const onViewDetails = vi.fn();
    const { rerender } = render(<ProgressStepper steps={STEPS} />);
    expect(screen.queryByRole("button", { name: "View Details" })).toBeNull();

    rerender(
      <ProgressStepper
        steps={STEPS}
        showViewDetails
        onViewDetails={onViewDetails}
      />,
    );
    const btn = screen.getByRole("button", { name: "View Details" });
    await user.click(btn);
    expect(onViewDetails).toHaveBeenCalledTimes(1);
  });

  it("accepts a custom viewDetailsLabel and viewDetailsIcon", () => {
    render(
      <ProgressStepper
        steps={STEPS}
        showViewDetails
        viewDetailsLabel="Open application"
        viewDetailsIcon={<span data-testid="footer-glyph">→</span>}
      />,
    );
    expect(
      screen.getByRole("button", { name: /Open application/ }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("footer-glyph")).toBeInTheDocument();
  });

  it("hides the footer icon when viewDetailsIcon is null", () => {
    const { container } = render(
      <ProgressStepper
        steps={STEPS}
        showViewDetails
        viewDetailsIcon={null}
      />,
    );
    const btn = screen.getByRole("button", { name: "View Details" });
    // The Button primitive renders only label children when no rightIcon
    // is supplied — no SVG should be present inside the footer button.
    expect(btn.querySelector("svg")).toBeNull();
    // Sanity: the toggle button in the header still has its caret icon.
    expect(container.querySelectorAll("svg").length).toBeGreaterThan(0);
  });

  it("uses a custom title", () => {
    render(<ProgressStepper steps={STEPS} title="Application status" />);
    expect(screen.getByText("Application status")).toBeInTheDocument();
    expect(screen.queryByText("Progress")).toBeNull();
  });

  it("renders an empty stepper without crashing", () => {
    const { container } = render(<ProgressStepper steps={[]} />);
    // Header still rendered.
    expect(within(container).getByText("Progress")).toBeInTheDocument();
  });
});
