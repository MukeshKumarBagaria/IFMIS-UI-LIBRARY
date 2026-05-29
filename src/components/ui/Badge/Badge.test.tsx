import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge variant="success">Complete</Badge>);
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("renders a default icon for the variant", () => {
    const { container } = render(<Badge variant="success">Complete</Badge>);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("hides the icon when icon={null}", () => {
    const { container } = render(
      <Badge variant="info" icon={null}>
        Draft
      </Badge>,
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders a custom icon", () => {
    render(
      <Badge variant="pending" icon={<svg data-testid="custom-icon" />}>
        Awaiting
      </Badge>,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("applies variant classes and forwards className", () => {
    const { container } = render(
      <Badge variant="danger" className="custom-badge">
        Danger
      </Badge>,
    );
    const badge = container.firstElementChild as HTMLElement;
    expect(badge).toHaveClass("custom-badge");
    expect(badge.className).toContain("bg-red-100");
  });
});
