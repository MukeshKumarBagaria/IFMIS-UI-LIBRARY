/**
 * `Header` barrel.
 *
 * Public surface:
 *   - `Header`              — gradient frame + brand/actions slots.
 *   - `HeaderActions`       — canonical 16px-gap row for the right side.
 *   - `HeaderBrand`         — logo + title/subtitle (left side).
 *   - `AccessibilityMenu`   — accessibility pill trigger.
 *   - `LanguageToggle`      — segmented language selector (English / Hindi).
 *   - `FontSizeControl`     — A · A · A font-size stepper.
 *   - `NotificationButton`  — bell + unread badge.
 *   - `ProfileMenu`         — profile pill + 400px dropdown card.
 *   - `RoleBadge`           — colour-coded role pill (Creator / Verifier / Approver).
 *   - `GlassSurface` / `GlassButton` — shared glassmorphism primitives, exported
 *     for products that need to add a bespoke action that matches the header look.
 *
 * The default export of every part is value + types so consumers can
 * import either:
 *   `import { Header, ProfileMenu } from "@ifmis/ui";`
 *   `import type { ProfileUser } from "@ifmis/ui";`
 */
export { Header, HeaderActions } from "./Header";
export type { HeaderProps, HeaderActionsProps } from "./Header";

export { HeaderBrand } from "./parts/HeaderBrand";
export type { HeaderBrandProps } from "./parts/HeaderBrand";

export { AccessibilityMenu } from "./parts/AccessibilityMenu";
export type { AccessibilityMenuProps } from "./parts/AccessibilityMenu";

export { LanguageToggle } from "./parts/LanguageToggle";
export type { LanguageToggleProps, LanguageOption } from "./parts/LanguageToggle";

export { FontSizeControl } from "./parts/FontSizeControl";
export type { FontSizeControlProps, FontSizeStep } from "./parts/FontSizeControl";

export { NotificationButton } from "./parts/NotificationButton";
export type { NotificationButtonProps } from "./parts/NotificationButton";

export { ProfileMenu } from "./parts/ProfileMenu";
export type {
  ProfileMenuProps,
  ProfileMenuLabels,
  ProfileUser,
  ProfileRole,
} from "./parts/ProfileMenu";

export { RoleBadge } from "./parts/RoleBadge";
export type { RoleBadgeProps, RoleVariant } from "./parts/RoleBadge";

export { GlassSurface, GlassButton, GLASS_BG } from "./parts/GlassPill";
export type { GlassSurfaceProps, GlassButtonProps } from "./parts/GlassPill";
