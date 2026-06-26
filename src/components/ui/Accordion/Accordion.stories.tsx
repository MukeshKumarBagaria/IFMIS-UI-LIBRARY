import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";
import { AccordionSection } from "./AccordionSection";
import { AccordionItem } from "./AccordionItem";
import { AccordionTrigger } from "./AccordionTrigger";
import { AccordionPanel } from "./AccordionPanel";
import { Badge } from "../Badge";
import { SectionTitle } from "../SectionTitle";

const meta: Meta<typeof Accordion> = {
  title: "UI/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The core sectioning container for IFMIS module screens. A compound",
          "component: `Accordion` owns state, while `AccordionSection`",
          "(Item + Trigger + Panel) renders each collapsible section with a",
          "standardized header — number chip, title, status `Badge`s, and the",
          "open/close arrow.",
          "",
          "Single-open by default; switch to `type=\"multiple\"` to allow many",
          "open at once. Panels stay mounted when collapsed, so forms keep their",
          "state.",
        ].join("\n"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const SampleBody = () => (
  <div className="space-y-3 text-body-xs text-body-primary">
    <p>
      Any content goes here — subsections, forms, tables, banners. Compose the
      other library primitives freely.
    </p>
    <SectionTitle as="h4" title="A subsection inside the panel" />
  </div>
);

/** Single-open (default). First section starts open; opening another closes it. */
export const Default: Story = {
  render: () => (
    <Accordion defaultValue="s1">
      <AccordionSection
        value="s1"
        number="01"
        title="Account closure decision"
        badges={<Badge variant="success">Complete</Badge>}
      >
        <SampleBody />
      </AccordionSection>
      <AccordionSection
        value="s2"
        number="02"
        title="Head of account mappings"
        badges={<Badge variant="pending">Pending</Badge>}
      >
        <SampleBody />
      </AccordionSection>
      <AccordionSection
        value="s3"
        number="03"
        title="Review &amp; submit"
        badges={<Badge variant="default">Not started</Badge>}
      >
        <SampleBody />
      </AccordionSection>
    </Accordion>
  ),
};

/** Matches the Figma header — number chip, title, all four status badges. */
export const FigmaHeader: Story = {
  render: () => (
    <Accordion>
      <AccordionSection
        value="title"
        number="01"
        title="Title"
        badges={
          <>
            <Badge variant="success">Complete</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="pending">Pending</Badge>
            <Badge variant="info">Info</Badge>
          </>
        }
      >
        <SampleBody />
      </AccordionSection>
    </Accordion>
  ),
};

/** `type="multiple"` — any number open at once. */
export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["s1", "s2"]}>
      <AccordionSection value="s1" number="01" title="First section">
        <SampleBody />
      </AccordionSection>
      <AccordionSection value="s2" number="02" title="Second section">
        <SampleBody />
      </AccordionSection>
      <AccordionSection value="s3" number="03" title="Third section">
        <SampleBody />
      </AccordionSection>
    </Accordion>
  ),
};

/** Controlled — the parent owns which section is open. */
function ControlledDemo() {
  const [open, setOpen] = useState<string | string[]>("s2");
  return (
    <div className="space-y-3">
      <p className="text-body-xs text-body-secondary">
        Open section: <strong>{String(open) || "none"}</strong>
      </p>
      <Accordion value={open} onValueChange={setOpen}>
        <AccordionSection value="s1" number="01" title="First section">
          <SampleBody />
        </AccordionSection>
        <AccordionSection value="s2" number="02" title="Second section">
          <SampleBody />
        </AccordionSection>
        <AccordionSection value="s3" number="03" title="Third section">
          <SampleBody />
        </AccordionSection>
      </Accordion>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

/** A disabled section can't be opened. */
export const WithDisabledSection: Story = {
  render: () => (
    <Accordion defaultValue="s1">
      <AccordionSection value="s1" number="01" title="Available">
        <SampleBody />
      </AccordionSection>
      <AccordionSection
        value="s2"
        number="02"
        title="Locked until prerequisites are met"
        disabled
        badges={<Badge variant="default">Locked</Badge>}
      >
        <SampleBody />
      </AccordionSection>
    </Accordion>
  ),
};

/** Low-level primitives, for non-standard headers. */
export const UsingPrimitives: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["a"]}>
      <AccordionItem value="a">
        <AccordionTrigger title="Composed by hand" number="01" />
        <AccordionPanel>
          <SampleBody />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
};
