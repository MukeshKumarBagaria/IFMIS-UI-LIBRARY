import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Trophy, Lightning } from "@phosphor-icons/react";
import { Banner, BannerDescription, BannerTitle } from "./Banner";

const meta: Meta<typeof Banner> = {
  title: "UI/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Inline notification banner with `danger`, `success`, and `info` variants. " +
          "Use for persistent, in-flow status messages tied to a page section. " +
          "For transient floating feedback, prefer a toast.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["danger", "success", "info"],
    },
    children: { control: "text" },
    dismissLabel: { control: "text" },
  },
  args: {
    variant: "info",
    children: "This is a notification banner",
  },
  decorators: [
    (Story) => (
      // Full-width container — banners fill their parent by default.
      <div className="w-full p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Danger: Story = {
  args: { variant: "danger" },
};

export const Success: Story = {
  args: { variant: "success" },
};

export const Info: Story = {
  args: { variant: "info" },
};

/** All three variants stacked — mirrors the Figma reference frame. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Banner variant="danger">This is a notification banner</Banner>
      <Banner variant="success">This is a notification banner</Banner>
      <Banner variant="info">This is a notification banner</Banner>
    </div>
  ),
};

/** Multi-line composition using the title + description sub-parts. */
export const WithTitleAndDescription: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Banner variant="danger">
        <BannerTitle>Validation failed</BannerTitle>
        <BannerDescription>
          Two required fields are missing. Review the highlighted rows and try again.
        </BannerDescription>
      </Banner>
      <Banner variant="success">
        <BannerTitle>Payment recorded</BannerTitle>
        <BannerDescription>
          Receipt #PAY-2026-0042 was sent to the beneficiary.
        </BannerDescription>
      </Banner>
      <Banner variant="info">
        <BannerTitle>New approval workflow</BannerTitle>
        <BannerDescription>
          Vouchers above ₹5,00,000 now require a second approver from Finance.
        </BannerDescription>
      </Banner>
    </div>
  ),
};

/** Text-only banner — pass `icon={null}` to suppress the leading glyph. */
export const NoIcon: Story = {
  args: {
    variant: "info",
    icon: null,
    children: "This banner has no icon.",
  },
};

/** Override the default icon per-instance. */
export const CustomIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Banner variant="success" icon={<Trophy size={20} weight="fill" />}>
        Quarterly target hit ahead of schedule.
      </Banner>
      <Banner variant="info" icon={<Lightning size={20} weight="fill" />}>
        Performance mode active — large reports may load faster.
      </Banner>
    </div>
  ),
};

/** Dismissible banner — the close button only renders when `onDismiss` is set. */
export const Dismissible: Story = {
  render: () => {
    const Demo = () => {
      const [visible, setVisible] = useState({
        danger: true,
        success: true,
        info: true,
      });
      const allHidden = !visible.danger && !visible.success && !visible.info;

      return (
        <div className="flex flex-col gap-3">
          {visible.danger ? (
            <Banner
              variant="danger"
              onDismiss={() => setVisible((v) => ({ ...v, danger: false }))}
            >
              Connection to the server was lost.
            </Banner>
          ) : null}
          {visible.success ? (
            <Banner
              variant="success"
              onDismiss={() => setVisible((v) => ({ ...v, success: false }))}
            >
              All changes synced.
            </Banner>
          ) : null}
          {visible.info ? (
            <Banner
              variant="info"
              onDismiss={() => setVisible((v) => ({ ...v, info: false }))}
            >
              Scheduled maintenance tonight from 11pm IST.
            </Banner>
          ) : null}
          {allHidden ? (
            <button
              type="button"
              onClick={() => setVisible({ danger: true, success: true, info: true })}
              className="self-start text-body-xs text-purple-700 underline"
            >
              Reset banners
            </button>
          ) : null}
        </div>
      );
    };
    return <Demo />;
  },
};

/** Long, wrapping copy — verifies vertical alignment of the icon at top. */
export const LongCopy: Story = {
  args: {
    variant: "danger",
    children:
      "The voucher could not be submitted because the beneficiary bank account " +
      "has not been verified. Ask the maker to re-run KYC, attach the latest " +
      "passbook scan, and resubmit before the cut-off window closes at 6pm IST.",
  },
};
