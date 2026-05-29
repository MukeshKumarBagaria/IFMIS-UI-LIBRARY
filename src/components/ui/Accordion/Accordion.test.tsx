import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./Accordion";
import { AccordionSection } from "./AccordionSection";
import { Badge } from "../Badge";

function Basic(props: React.ComponentProps<typeof Accordion>) {
  return (
    <Accordion {...props}>
      <AccordionSection value="s1" number="01" title="First section">
        <p>Body one</p>
      </AccordionSection>
      <AccordionSection value="s2" number="02" title="Second section">
        <p>Body two</p>
      </AccordionSection>
    </Accordion>
  );
}

const trigger = (name: RegExp) => screen.getByRole("button", { name });

describe("Accordion", () => {
  it("wraps each trigger in a heading and exposes aria-expanded", () => {
    render(<Basic />);
    expect(
      screen.getByRole("heading", { level: 3, name: /First section/ }),
    ).toBeInTheDocument();
    expect(trigger(/First section/)).toHaveAttribute("aria-expanded", "false");
  });

  it("opens and closes on click", async () => {
    render(<Basic />);
    const btn = trigger(/First section/);
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("single mode: opening one closes the others", async () => {
    render(<Basic defaultValue="s1" />);
    expect(trigger(/First section/)).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(trigger(/Second section/));
    expect(trigger(/Second section/)).toHaveAttribute("aria-expanded", "true");
    expect(trigger(/First section/)).toHaveAttribute("aria-expanded", "false");
  });

  it("multiple mode: sections open independently", async () => {
    render(<Basic type="multiple" defaultValue={["s1"]} />);
    await userEvent.click(trigger(/Second section/));
    expect(trigger(/First section/)).toHaveAttribute("aria-expanded", "true");
    expect(trigger(/Second section/)).toHaveAttribute("aria-expanded", "true");
  });

  it("collapsible=false keeps the open section open when re-clicked", async () => {
    render(<Basic collapsible={false} defaultValue="s1" />);
    await userEvent.click(trigger(/First section/));
    expect(trigger(/First section/)).toHaveAttribute("aria-expanded", "true");
  });

  it("does not open a disabled section", async () => {
    render(
      <Accordion>
        <AccordionSection value="s1" title="Locked section" disabled>
          <p>Body</p>
        </AccordionSection>
      </Accordion>,
    );
    const btn = trigger(/Locked section/);
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("supports controlled usage", async () => {
    const onValueChange = vi.fn();
    render(<Basic value="s1" onValueChange={onValueChange} />);
    expect(trigger(/First section/)).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(trigger(/Second section/));
    // Controlled: parent decides — our value prop didn't change, so it stays.
    expect(onValueChange).toHaveBeenCalledWith("s2");
    expect(trigger(/First section/)).toHaveAttribute("aria-expanded", "true");
  });

  it("wires aria between trigger and panel region", async () => {
    render(<Basic defaultValue="s1" />);
    const btn = trigger(/First section/);
    const region = screen.getByRole("region", { name: /First section/ });
    expect(btn).toHaveAttribute("aria-controls", region.id);
    expect(region).toHaveAttribute("aria-labelledby", btn.id);
  });

  it("renders number, title and badges in the header", () => {
    render(
      <Accordion>
        <AccordionSection
          value="s1"
          number="07"
          title="Mappings"
          badges={<Badge variant="success">Complete</Badge>}
        >
          <p>Body</p>
        </AccordionSection>
      </Accordion>,
    );
    const btn = trigger(/Mappings/);
    expect(within(btn).getByText("07")).toBeInTheDocument();
    expect(within(btn).getByText("Mappings")).toBeInTheDocument();
    expect(within(btn).getByText("Complete")).toBeInTheDocument();
  });

  it("unmounts collapsed panels when unmountOnCollapse is set", () => {
    render(<Basic unmountOnCollapse defaultValue="s1" />);
    expect(screen.getByText("Body one")).toBeInTheDocument();
    expect(screen.queryByText("Body two")).not.toBeInTheDocument();
  });

  it("keeps collapsed panels mounted by default", () => {
    render(<Basic defaultValue="s1" />);
    // Both bodies remain in the DOM so form state survives.
    expect(screen.getByText("Body one")).toBeInTheDocument();
    expect(screen.getByText("Body two")).toBeInTheDocument();
  });
});
