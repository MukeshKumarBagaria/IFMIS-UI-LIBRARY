import "./styles/globals.css";

export { Button, buttonVariants } from "./components/ui/Button";
export type { ButtonProps } from "./components/ui/Button";

export { Heading, headingVariants, Text, textVariants } from "./components/ui/Typography";
export type { HeadingProps, TextProps } from "./components/ui/Typography";

export { Upload } from "./components/ui/Upload";
export type { UploadProps, UploadState, UploadFile } from "./components/ui/Upload";

export {
  FormButton,
  formButtonVariants,
  ForwardButton,
  SubmitButton,
  ApproveButton,
  SaveButton,
  ReturnButton,
  ResetButton,
  RejectButton,
} from "./components/ui/FormButton";
export type {
  FormButtonProps,
  FormButtonTone,
  PresetButtonProps,
  PresetButton,
} from "./components/ui/FormButton";

export { CtaTray } from "./components/ui/CtaTray";
export type {
  CtaTrayProps,
  CtaTrayTone,
  CtaTrayAlign,
} from "./components/ui/CtaTray";

export { Breadcrumb } from "./components/ui/Breadcrumb";
export type {
  BreadcrumbProps,
  BreadcrumbItem,
} from "./components/ui/Breadcrumb";

export { PageTitle } from "./components/ui/PageTitle";
export type { PageTitleProps } from "./components/ui/PageTitle";

export { SectionTitle } from "./components/ui/SectionTitle";
export type { SectionTitleProps } from "./components/ui/SectionTitle";

export { Badge, badgeVariants } from "./components/ui/Badge";
export type { BadgeProps, BadgeVariant } from "./components/ui/Badge";

export { Toggle, toggleVariants } from "./components/ui/Toggle";
export type { ToggleProps } from "./components/ui/Toggle";

export { Scrollbar } from "./components/ui/Scrollbar";
export type { ScrollbarProps } from "./components/ui/Scrollbar";

export { Pagination, paginationRange } from "./components/ui/Pagination";
export type {
  PaginationProps,
  PaginationItem,
} from "./components/ui/Pagination";

export { DataTable } from "./components/ui/DataTable";
export type {
  DataTableProps,
  DataTableColumn,
  DataTableAlign,
  DataTableSort,
  SortDirection,
} from "./components/ui/DataTable";

export {
  SelectionPill,
  selectionPillVariants,
} from "./components/ui/SelectionPill";
export type { SelectionPillProps } from "./components/ui/SelectionPill";

export { Checkbox } from "./components/ui/Checkbox";
export type { CheckboxProps } from "./components/ui/Checkbox";

export {
  CheckboxCard,
  checkboxCardVariants,
} from "./components/ui/CheckboxCard";
export type { CheckboxCardProps } from "./components/ui/CheckboxCard";

export {
  ActionCard,
  ActionCardHeader,
  ActionCardBody,
  ActionCardFooter,
  ActionCardBadge,
  ActionCardButton,
  actionCardButtonVariants,
  useActionCardTone,
} from "./components/ui/ActionCard";
export type {
  ActionCardProps,
  ActionCardTone,
  ActionCardHeaderProps,
  ActionCardBodyProps,
  ActionCardFooterProps,
  ActionCardBadgeProps,
  ActionCardButtonProps,
} from "./components/ui/ActionCard";

export { StatCard } from "./components/ui/StatCard";
export type { StatCardProps, StatCardTone } from "./components/ui/StatCard";

export { ReferenceIdSuccessCard } from "./components/ui/ReferenceIdSuccessCard";
export type { ReferenceIdSuccessCardProps } from "./components/ui/ReferenceIdSuccessCard";

export { OtpInput } from "./components/ui/OtpInput";
export type { OtpInputProps, OtpInputState } from "./components/ui/OtpInput";

export { AadhaarESign, AadhaarCardPreview } from "./components/ui/AadhaarESign";
export type {
  AadhaarESignProps,
  AadhaarESignState,
  AadhaarCardPreviewProps,
} from "./components/ui/AadhaarESign";

export { OtpDialog } from "./components/ui/OtpDialog";
export type { OtpDialogProps, OtpDialogState } from "./components/ui/OtpDialog";

export { ConfirmationPopup } from "./components/ui/ConfirmationPopup";
export type { ConfirmationPopupProps } from "./components/ui/ConfirmationPopup";

export { ProgressCard, initialsFromName } from "./components/ui/ProgressCard";
export type {
  ProgressCardProps,
  ProgressCardStatus,
  ProgressCardUser,
  ProgressStatusTokens,
} from "./components/ui/ProgressCard";
export { PROGRESS_STATUS_TOKENS } from "./components/ui/ProgressCard";

export { ProgressStepper } from "./components/ui/ProgressStepper";
export type {
  ProgressStepperProps,
  ProgressStep,
  ProgressStepStatus,
  ProgressStepUser,
} from "./components/ui/ProgressStepper";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
  AccordionSection,
} from "./components/ui/Accordion";
export type {
  AccordionProps,
  AccordionType,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionPanelProps,
  AccordionSectionProps,
} from "./components/ui/Accordion";

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
  AdminButton,
  SidebarHelpLinks,
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
  AdminButtonProps,
  SidebarHelpProps,
  SidebarHelpItem,
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

export { Label } from "./components/ui/Label";
export type { LabelProps } from "./components/ui/Label";

export { Dropdown } from "./components/ui/Dropdown";
export type { DropdownProps, DropdownOption } from "./components/ui/Dropdown";

export { SearchField } from "./components/ui/SearchField";
export type {
  SearchFieldProps,
  SearchSuggestion,
} from "./components/ui/SearchField";

export { HoverPill, HoverPillTip } from "./components/ui/HoverPill";
export type {
  HoverPillProps,
  HoverPillTipProps,
  HoverPillPlacement,
} from "./components/ui/HoverPill";

export { FormField, FieldIconBox, fieldStateClasses } from "./components/ui/FormField";
export type {
  FormFieldProps,
  FormFieldRenderProps,
  FieldIconBoxProps,
  FieldState,
} from "./components/ui/FormField";

export { TextField } from "./components/ui/TextField";
export type { TextFieldProps } from "./components/ui/TextField";

export { Textarea } from "./components/ui/Textarea";
export type { TextareaProps } from "./components/ui/Textarea";

export { cn } from "./lib/cn";
