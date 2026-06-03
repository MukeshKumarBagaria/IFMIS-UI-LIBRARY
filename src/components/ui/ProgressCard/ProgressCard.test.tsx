import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressCard, initialsFromName } from "./ProgressCard";

describe("ProgressCard", () => {
  it("renders the label, default badge, timestamp, and user", () => {
    render(
      <ProgressCard
        status="success"
        label="Creator"
        timestamp="Submitted on 05 May 2026"
        user={{ name: "Amit Mohan", role: "Employee" }}
      />,
    );
    expect(screen.getByText("Creator")).toBeInTheDocument();
    expect(screen.getByText("Submitted")).toBeInTheDocument();
    expect(screen.getByText("Submitted on 05 May 2026")).toBeInTheDocument();
    expect(screen.getByText("Amit Mohan")).toBeInTheDocument();
    expect(screen.getByText("Employee")).toBeInTheDocument();
    expect(screen.getByText("AM")).toBeInTheDocument();
  });

  it("emits a data-status attribute per status", () => {
    const { rerender, container } = render(
      <ProgressCard status="success" label="X" />,
    );
    expect(container.firstChild).toHaveAttribute("data-status", "success");
    rerender(<ProgressCard status="pending" label="X" />);
    expect(container.firstChild).toHaveAttribute("data-status", "pending");
    rerender(<ProgressCard status="rejected" label="X" />);
    expect(container.firstChild).toHaveAttribute("data-status", "rejected");
    rerender(<ProgressCard status="returned" label="X" />);
    expect(container.firstChild).toHaveAttribute("data-status", "returned");
  });

  it("uses default badge labels per status", () => {
    const { rerender } = render(
      <ProgressCard status="success" label="X" />,
    );
    expect(screen.getByText("Submitted")).toBeInTheDocument();

    rerender(<ProgressCard status="pending" label="X" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();

    rerender(<ProgressCard status="rejected" label="X" />);
    expect(screen.getByText("Rejected")).toBeInTheDocument();

    rerender(<ProgressCard status="returned" label="X" />);
    expect(screen.getByText("Returned")).toBeInTheDocument();
  });

  it("allows custom badge labels", () => {
    render(
      <ProgressCard status="success" label="Drafted" badgeLabel="Filed" />,
    );
    expect(screen.getByText("Filed")).toBeInTheDocument();
    expect(screen.queryByText("Submitted")).toBeNull();
  });

  it("hides the badge when badgeLabel is null", () => {
    render(
      <ProgressCard status="success" label="Creator" badgeLabel={null} />,
    );
    expect(screen.queryByText("Submitted")).toBeNull();
  });

  it("renders a custom badge icon node when provided", () => {
    render(
      <ProgressCard
        status="success"
        label="Creator"
        badgeIcon={<span data-testid="custom-glyph">★</span>}
      />,
    );
    expect(screen.getByTestId("custom-glyph")).toBeInTheDocument();
  });

  it("omits the timestamp row when not given", () => {
    render(<ProgressCard status="success" label="Creator" />);
    expect(screen.queryByText(/on \d/)).toBeNull();
  });

  it("derives initials from the name when not supplied", () => {
    render(
      <ProgressCard
        status="success"
        label="Creator"
        user={{ name: "Amit Mohan" }}
      />,
    );
    expect(screen.getByText("AM")).toBeInTheDocument();
  });

  it("uses explicit initials when supplied", () => {
    render(
      <ProgressCard
        status="success"
        label="Creator"
        user={{ name: "Amit Mohan", initials: "XY" }}
      />,
    );
    expect(screen.getByText("XY")).toBeInTheDocument();
    expect(screen.queryByText("AM")).toBeNull();
  });

  it("renders an avatar image when avatarSrc is provided", () => {
    render(
      <ProgressCard
        status="success"
        label="Creator"
        user={{
          name: "Amit Mohan",
          avatarSrc: "/avatar.png",
          avatarAlt: "Amit's photo",
        }}
      />,
    );
    const img = screen.getByAltText("Amit's photo") as HTMLImageElement;
    expect(img.src).toContain("/avatar.png");
  });

  it("renders the remarks block only when truthy", () => {
    const { rerender } = render(
      <ProgressCard status="pending" label="Verifier" />,
    );
    expect(screen.queryByText("Remarks")).toBeNull();

    rerender(
      <ProgressCard
        status="pending"
        label="Verifier"
        remarks="Need clarification"
      />,
    );
    expect(screen.getByText("Remarks")).toBeInTheDocument();
    expect(screen.getByText("Need clarification")).toBeInTheDocument();
  });

  it("supports a custom remarks title", () => {
    render(
      <ProgressCard
        status="pending"
        label="Verifier"
        remarks="…"
        remarksTitle="Reviewer note"
      />,
    );
    expect(screen.getByText("Reviewer note")).toBeInTheDocument();
    expect(screen.queryByText("Remarks")).toBeNull();
  });

  it("merges className onto the outer card", () => {
    const { container } = render(
      <ProgressCard status="success" label="X" className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("initialsFromName", () => {
  it("uses first letter of first + last word", () => {
    expect(initialsFromName("Amit Mohan")).toBe("AM");
    expect(initialsFromName("Asha P Pillai")).toBe("AP");
  });

  it("handles single-word names", () => {
    expect(initialsFromName("Cher")).toBe("C");
  });

  it("returns '?' for empty input", () => {
    expect(initialsFromName("")).toBe("?");
    expect(initialsFromName("   ")).toBe("?");
  });

  it("uppercases letters", () => {
    expect(initialsFromName("amit mohan")).toBe("AM");
  });
});
