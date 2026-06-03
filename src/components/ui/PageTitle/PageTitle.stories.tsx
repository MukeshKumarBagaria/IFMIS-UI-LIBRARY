import type { Meta, StoryObj } from "@storybook/react";
import { PageTitle } from "./PageTitle";

const meta: Meta<typeof PageTitle> = {
  title: "UI/PageTitle",
  component: PageTitle,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The heading band that tops every IFMIS screen: a white card with a",
          "purple border holding the page title and an optional breadcrumb",
          "trail — with the brand diamond motif bleeding off the right edge.",
          "",
          "It composes the shared `<Heading>` and `<Breadcrumb>`, so typography,",
          "colour and accessibility match the rest of the library. (The page's",
          "**Back** action lives in the bottom [`CtaTray`](?path=/docs/ui-ctatray-guide--docs),",
          "not here.)",
          "",
          "### How to use it",
          "```jsx",
          'import { PageTitle } from "@ifmis/ui";',
          "",
          "<PageTitle",
          '  title="Create Voucher"',
          "  breadcrumbs={[",
          '    { label: "Home", href: "/" },',
          '    { label: "Vouchers", href: "/vouchers" },',
          '    { label: "New" }, // last = current page',
          "  ]}",
          "/>",
          "```",
          "",
          "### Props",
          "- `title` — the page heading (rendered as an `<h1>`).",
          "- `breadcrumbs` — items forwarded to `<Breadcrumb>`; omit to hide.",
          "- `hideDecoration` — drop the diamond motif.",
        ].join("\n"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageTitle>;

/** The full band, matching the Figma design 1:1. */
export const Default: Story = {
  args: {
    title: "This is a page title",
    breadcrumbs: [{ label: "Breadcrumb 1", href: "#" }, { label: "Breadcrumb 2" }],
  },
};

/** Just a heading — no breadcrumbs. */
export const TitleOnly: Story = {
  args: {
    title: "Dashboard",
  },
};

/** Title with a breadcrumb trail but no back action. */
export const WithBreadcrumbs: Story = {
  args: {
    title: "Salary Statement",
    breadcrumbs: [
      { label: "Home", href: "#" },
      { label: "HRMS", href: "#" },
      { label: "Pay Related", href: "#" },
      { label: "FY 2025-26" },
    ],
  },
};

/** Decoration removed — useful on very narrow layouts. */
export const NoDecoration: Story = {
  args: {
    title: "This is a page title",
    breadcrumbs: [{ label: "Breadcrumb 1", href: "#" }, { label: "Breadcrumb 2" }],
    hideDecoration: true,
  },
};
