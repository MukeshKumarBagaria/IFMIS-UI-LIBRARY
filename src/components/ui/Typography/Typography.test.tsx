import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading } from "./Heading";
import { Text } from "./Text";

describe("Heading", () => {
  it("renders the matching h tag for each level", () => {
    const levels = [1, 2, 3, 4, 5, 6] as const;
    levels.forEach((level) => {
      const { unmount } = render(<Heading level={level}>Title {level}</Heading>);
      expect(screen.getByRole("heading", { level })).toBeInTheDocument();
      unmount();
    });
  });

  it("respects the `as` prop for semantic override", () => {
    render(
      <Heading level={1} as="h2">
        Override
      </Heading>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(
      <Heading level={2} className="custom-class">
        Hello
      </Heading>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("custom-class");
  });
});

describe("Text", () => {
  it("renders as <p> by default", () => {
    render(<Text>Body</Text>);
    expect(screen.getByText("Body").tagName).toBe("P");
  });

  it("renders as the tag specified by `as`", () => {
    render(<Text as="span">Inline</Text>);
    expect(screen.getByText("Inline").tagName).toBe("SPAN");
  });

  it("applies size and weight variants", () => {
    render(
      <Text size="lg" weight="medium">
        Label
      </Text>,
    );
    const el = screen.getByText("Label");
    expect(el).toHaveClass("text-body-lg");
    expect(el).toHaveClass("font-medium");
  });
});
