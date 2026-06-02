import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./Card";

describe("Card", () => {
  it("renders the full composition", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders CardTitle as an h3", () => {
    render(<CardTitle>Heading</CardTitle>);
    const heading = screen.getByRole("heading", { level: 3, name: "Heading" });
    expect(heading).toBeInTheDocument();
  });

  it("applies the surface classes on the root", () => {
    const { container } = render(<Card>Body</Card>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("rounded-lg");
    expect(root.className).toContain("border");
    expect(root.className).toContain("bg-card");
  });

  it("forwards className and arbitrary props on each part", () => {
    const { container } = render(
      <Card className="card-x" data-testid="card" id="c1">
        <CardContent className="content-x">Body</CardContent>
      </Card>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("card-x");
    expect(root).toHaveAttribute("id", "c1");
    expect(screen.getByText("Body")).toHaveClass("content-x");
  });

  it("forwards refs", () => {
    let node: HTMLDivElement | null = null;
    render(<Card ref={(n) => (node = n)}>X</Card>);
    expect(node).toBeInstanceOf(HTMLDivElement);
  });
});
