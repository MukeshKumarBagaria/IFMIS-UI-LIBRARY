import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("renders title, value and total", () => {
    render(<StatCard title="All Grievance" value={13} total={13} />);
    expect(screen.getByText("All Grievance")).toBeInTheDocument();
    expect(screen.getByText("13")).toBeInTheDocument();
    expect(screen.getByText("/ 13")).toBeInTheDocument();
  });

  it("exposes the tone via data-tone and applies tone surface classes", () => {
    const { container } = render(
      <StatCard tone="green" title="Resolved" value={9} total={13} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-tone", "green");
    expect(root.className).toContain("var(--statcard-green-surface)");
  });

  it("defaults to the purple tone", () => {
    const { container } = render(<StatCard title="T" value={1} total={2} />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "purple");
  });

  it("derives progress from value / total", () => {
    render(<StatCard title="T" value={8} total={20} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("honours an explicit progress over the derived value", () => {
    render(<StatCard title="T" value={8} total={20} progress={65} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "65",
    );
  });

  it("clamps progress to 0–100", () => {
    const { rerender } = render(<StatCard title="T" value={1} progress={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    rerender(<StatCard title="T" value={1} progress={-20} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("defaults the progress aria-label to '{value} of {total}'", () => {
    render(<StatCard title="T" value={13} total={13} />);
    expect(
      screen.getByRole("progressbar", { name: "13 of 13" }),
    ).toBeInTheDocument();
  });

  it("supports a custom progressLabel", () => {
    render(
      <StatCard title="T" value={13} total={13} progressLabel="SLA 80% elapsed" />,
    );
    expect(
      screen.getByRole("progressbar", { name: "SLA 80% elapsed" }),
    ).toBeInTheDocument();
  });

  it("renders a default icon, and hides it with icon={null}", () => {
    const { container, rerender } = render(
      <StatCard title="T" value={1} total={2} />,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
    rerender(<StatCard title="T" value={1} total={2} icon={null} />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders a custom icon", () => {
    render(
      <StatCard
        title="T"
        value={1}
        total={2}
        icon={<svg data-testid="custom" />}
      />,
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("omits the total when not provided", () => {
    render(<StatCard title="Open" value={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.queryByText(/\/ /)).not.toBeInTheDocument();
  });

  it("hides the progress bar with hideProgress", () => {
    render(<StatCard title="T" value={1} total={2} hideProgress />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("forwards className and arbitrary props to the root", () => {
    const { container } = render(
      <StatCard title="T" value={1} total={2} className="custom" id="s1" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("custom");
    expect(root).toHaveAttribute("id", "s1");
  });
});
