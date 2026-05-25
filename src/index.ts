import "./styles/globals.css";

export { Button, buttonVariants } from "./components/ui/Button";
export type { ButtonProps } from "./components/ui/Button";

export { Heading, headingVariants, Text, textVariants } from "./components/ui/Typography";
export type { HeadingProps, TextProps } from "./components/ui/Typography";

export { ThemeProvider, useTheme } from "./providers/ThemeProvider";
export type { Theme, ThemeProviderProps } from "./providers/ThemeProvider";

export { cn } from "./lib/cn";
