import "./styles/globals.css";

export { Button, buttonVariants } from "./components/ui/Button";
export type { ButtonProps } from "./components/ui/Button";

export { Heading, headingVariants, Text, textVariants } from "./components/ui/Typography";
export type { HeadingProps, TextProps } from "./components/ui/Typography";

export {
  Banner,
  BannerTitle,
  BannerDescription,
  bannerVariants,
} from "./components/ui/Banner";
export type {
  BannerProps,
  BannerTitleProps,
  BannerDescriptionProps,
  BannerVariant,
} from "./components/ui/Banner";

export {
  Header,
  HeaderActions,
  HeaderBrand,
  AccessibilityMenu,
  LanguageToggle,
  FontSizeControl,
  NotificationButton,
  ProfileMenu,
  RoleBadge,
  GlassSurface,
  GlassButton,
  GLASS_BG,
} from "./components/ui/Header";
export type {
  HeaderProps,
  HeaderActionsProps,
  HeaderBrandProps,
  AccessibilityMenuProps,
  LanguageToggleProps,
  LanguageOption,
  FontSizeControlProps,
  FontSizeStep,
  NotificationButtonProps,
  ProfileMenuProps,
  ProfileMenuLabels,
  ProfileUser,
  ProfileRole,
  RoleBadgeProps,
  RoleVariant,
  GlassSurfaceProps,
  GlassButtonProps,
} from "./components/ui/Header";

export {
  Sidebar,
  SidebarSearch,
  SidebarCollapseButton,
  WorklistButton,
  AssignedModules,
  ActiveModuleCard,
  InactiveModuleCard,
  SidebarMenu,
  searchMenuTree,
  MODULES,
  MODULE_LIST,
} from "./components/ui/Sidebar";
export type {
  SidebarProps,
  SidebarSearchProps,
  SidebarCollapseButtonProps,
  WorklistButtonProps,
  AssignedModulesProps,
  SidebarMenuProps,
  MenuNode,
  MenuSearchResult,
  ModuleId,
  ModuleDef,
} from "./components/ui/Sidebar";

export { ThemeProvider, useTheme } from "./providers/ThemeProvider";
export type { ThemeProviderProps } from "./providers/ThemeProvider";

/**
 * Theme registry — the source of truth for which themes exist.
 *
 * Consumers can:
 *   - Iterate `themes` to render a theme switcher.
 *   - Pass any `Theme` name to `<ThemeProvider theme={...} />`.
 *   - Guard untrusted input with `isTheme(value)`.
 *   - Look up metadata with `getTheme(name)`.
 *
 * To add a theme see `src/themes/README.md`.
 */
export {
  themes,
  THEME_NAMES,
  DEFAULT_THEME,
  getTheme,
  isTheme,
} from "./themes";
export type { Theme, ThemeDefinition, ThemeMode } from "./themes";

export { cn } from "./lib/cn";
