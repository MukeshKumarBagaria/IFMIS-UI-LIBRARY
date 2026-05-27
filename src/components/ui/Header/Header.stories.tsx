import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Header,
  HeaderActions,
  HeaderBrand,
  AccessibilityMenu,
  LanguageToggle,
  FontSizeControl,
  NotificationButton,
  ProfileMenu,
  RoleBadge,
} from ".";
import type { FontSizeStep, ProfileUser } from ".";
import headerBg from "./assets/header-bg.webp";

const meta: Meta<typeof Header> = {
  title: "UI/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

const SAMPLE_USER: ProfileUser = {
  name: "Mukesh Kumar",
  designation: "Assistant Internal Audit Officer",
  employeeId: "0000442105",
  organisation: "Directorate of Treasuries and Accounts, Bhopal",
  lastLogin: { date: "19 Jan, 2026", time: "09:59:01" },
  roles: [
    { variant: "creator" },
    { variant: "verifier" },
    { variant: "approver" },
  ],
};

/* -------------------------------------------------------------------------- */
/* Stateful demo wrapper                                                      */
/* -------------------------------------------------------------------------- */

function Demo({
  initialLang = "en",
  initialFont = "md",
  notifications = 5,
  user = SAMPLE_USER,
  title = "Department of Finance",
  subtitle = "Integrated Financial Management Information System",
}: {
  initialLang?: string;
  initialFont?: FontSizeStep;
  notifications?: number;
  user?: ProfileUser;
  title?: string;
  subtitle?: string;
}) {
  const [lang, setLang] = useState(initialLang);
  const [fontSize, setFontSize] = useState<FontSizeStep>(initialFont);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  // Demonstrates one wiring of FontSizeControl — applies a CSS variable
  // scaling factor to the demo container so the effect is visible.
  const fontScale = fontSize === "sm" ? 0.92 : fontSize === "lg" ? 1.08 : 1;

  return (
    <div style={{ fontSize: `calc(1rem * ${fontScale})` }}>
      <Header
        backgroundImage={headerBg}
        brand={<HeaderBrand title={title} subtitle={subtitle} />}
        actions={
          <HeaderActions>
            <AccessibilityMenu
              open={accessibilityOpen}
              onClick={() => setAccessibilityOpen((o) => !o)}
            />
            <LanguageToggle value={lang} onChange={setLang} />
            <FontSizeControl value={fontSize} onChange={setFontSize} />
            <NotificationButton
              count={notifications}
              onClick={() => alert("Open notifications")}
            />
            <ProfileMenu
              user={user}
              onSettings={() => alert("Open settings")}
              onLogout={() => alert("Sign out")}
            />
          </HeaderActions>
        }
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stories                                                                    */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
  render: () => <Demo />,
};

export const Hindi: Story = {
  name: "Hindi locale",
  render: () => (
    <Demo
      initialLang="hi"
      title="वित्त विभाग"
      subtitle="एकीकृत वित्तीय प्रबंधन सूचना प्रणाली"
      user={{
        name: "मुकेश कुमार",
        designation: "सहायक आंतरिक लेखा परीक्षा अधिकारी",
        employeeId: "0000442105",
        organisation: "कोषालय एवं लेखा निदेशालय, भोपाल",
        lastLogin: { date: "19 जन, 2026", time: "09:59:01" },
        roles: [
          { variant: "creator", label: "रचनाकार" },
          { variant: "verifier", label: "सत्यापक" },
          { variant: "approver", label: "अनुमोदक" },
        ],
      }}
    />
  ),
};

export const NoNotifications: Story = {
  render: () => <Demo notifications={0} />,
};

export const HighNotificationCount: Story = {
  render: () => <Demo notifications={250} />,
};

export const SingleRole: Story = {
  render: () => (
    <Demo
      user={{
        ...SAMPLE_USER,
        roles: [{ variant: "creator" }],
      }}
    />
  ),
};

export const NoAvatar: Story = {
  name: "Avatar fallback (initials)",
  render: () => (
    <Demo
      user={{
        name: "Aarti Singh",
        designation: "District Treasury Officer",
        roles: [{ variant: "approver" }],
      }}
    />
  ),
};

/* -------------------------------------------------------------------------- */
/* Per-part stories — useful for design reviews                               */
/* -------------------------------------------------------------------------- */

export const BrandOnly: Story = {
  render: () => (
    <Header
      backgroundImage={headerBg}
      brand={
        <HeaderBrand
          title="Department of Finance"
          subtitle="Integrated Financial Management Information System"
        />
      }
    />
  ),
};

export const GradientOnly: Story = {
  name: "No background image (gradient only)",
  render: () => (
    <Header
      brand={
        <HeaderBrand
          title="Department of Finance"
          subtitle="Integrated Financial Management Information System"
        />
      }
    />
  ),
};

export const LanguageToggleOnly: Story = {
  name: "Part · LanguageToggle",
  render: () => {
    function Demo() {
      const [lang, setLang] = useState("en");
      return (
        <div className="p-8 bg-purple-900 inline-block rounded-xl">
          <LanguageToggle value={lang} onChange={setLang} />
        </div>
      );
    }
    return <Demo />;
  },
};

export const FontSizeOnly: Story = {
  name: "Part · FontSizeControl",
  render: () => {
    function Demo() {
      const [size, setSize] = useState<FontSizeStep>("md");
      return (
        <div className="p-8 bg-purple-900 inline-block rounded-xl">
          <FontSizeControl value={size} onChange={setSize} />
        </div>
      );
    }
    return <Demo />;
  },
};

export const NotificationOnly: Story = {
  name: "Part · NotificationButton",
  render: () => (
    <div className="p-8 bg-purple-900 inline-flex gap-4 rounded-xl">
      <NotificationButton count={0} />
      <NotificationButton count={3} />
      <NotificationButton count={250} />
    </div>
  ),
};

export const RoleBadges: Story = {
  name: "Part · RoleBadge",
  render: () => (
    <div className="p-8 inline-flex flex-col gap-4 bg-neutral-50 rounded-xl">
      <div className="flex gap-2">
        <RoleBadge variant="creator" />
        <RoleBadge variant="verifier" />
        <RoleBadge variant="approver" />
      </div>
      <div className="flex flex-col gap-2">
        <RoleBadge variant="creator" width="fixed" />
        <RoleBadge variant="verifier" width="fixed" />
        <RoleBadge variant="approver" width="fixed" />
      </div>
    </div>
  ),
};
