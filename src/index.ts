import "./styles/globals.css";

export { Button, buttonVariants } from "./components/ui/Button";
export type { ButtonProps } from "./components/ui/Button";

export { Heading, headingVariants, Text, textVariants } from "./components/ui/Typography";
export type { HeadingProps, TextProps } from "./components/ui/Typography";

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
