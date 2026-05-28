import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Banner, BannerTitle, BannerDescription } from "./Banner";

describe("Banner", () => {
  it("renders children", () => {
    render(<Banner>Hello</Banner>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("uses role='alert' for the danger variant", () => {
    render(<Banner variant="danger">Critical</Banner>);
    expect(screen.getByRole("alert")).toHaveTextContent("Critical");
  });

  it("uses role='status' for success and info variants", () => {
    const { rerender } = render(<Banner variant="success">Ok</Banner>);
    expect(screen.getByRole("status")).toHaveTextContent("Ok");
    rerender(<Banner variant="info">FYI</Banner>);
    expect(screen.getByRole("status")).toHaveTextContent("FYI");
  });

  it("allows overriding the role prop", () => {
    render(
      <Banner variant="danger" role="region" aria-label="Inline">
        x
      </Banner>,
    );
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("renders the default icon for each variant", () => {
    const { container, rerender } = render(<Banner variant="danger">x</Banner>);
    expect(container.querySelector("svg")).toBeInTheDocument();
    rerender(<Banner variant="success">x</Banner>);
    expect(container.querySelector("svg")).toBeInTheDocument();
    rerender(<Banner variant="info">x</Banner>);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("hides the icon when icon={null}", () => {
    const { container } = render(
      <Banner variant="info" icon={null}>
        x
      </Banner>,
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders a custom icon when provided", () => {
    render(
      <Banner variant="info" icon={<span data-testid="custom-icon">!</span>}>
        x
      </Banner>,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("does not render a dismiss button by default", () => {
    render(<Banner>x</Banner>);
    expect(screen.queryByRole("button", { name: /dismiss/i })).toBeNull();
  });

  it("renders a dismiss button and fires onDismiss when clicked", async () => {
    const onDismiss = vi.fn();
    render(<Banner onDismiss={onDismiss}>x</Banner>);
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("uses a custom dismissLabel when provided", () => {
    render(
      <Banner onDismiss={() => {}} dismissLabel="Close notification">
        x
      </Banner>,
    );
    expect(
      screen.getByRole("button", { name: "Close notification" }),
    ).toBeInTheDocument();
  });

  it("forwards arbitrary props and className to the root", () => {
    render(
      <Banner data-testid="root" className="custom-class">
        x
      </Banner>,
    );
    const root = screen.getByTestId("root");
    expect(root).toHaveClass("custom-class");
  });

  it("renders BannerTitle and BannerDescription as paragraphs", () => {
    render(
      <Banner variant="success">
        <BannerTitle>Title</BannerTitle>
        <BannerDescription>Description</BannerDescription>
      </Banner>,
    );
    const title = screen.getByText("Title");
    const desc = screen.getByText("Description");
    expect(title.tagName).toBe("P");
    expect(desc.tagName).toBe("P");
  });
});
