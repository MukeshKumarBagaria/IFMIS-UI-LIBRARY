import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_THEME, isTheme } from "../../themes/registry";
import type { Theme } from "../../themes/registry";

export type { Theme };

type ThemeContextValue = {
  /** The currently active theme name (e.g. `"purple"`). */
  theme: Theme;
  /** Switch themes imperatively. Ignored when `<ThemeProvider>` is in controlled mode. */
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /**
   * Controlled theme. When provided, internal state is ignored and the
   * parent owns theme switching. Useful when the host app already has a
   * settings store.
   */
  theme?: Theme;
  /**
   * Initial theme when uncontrolled. Defaults to `DEFAULT_THEME` from the
   * registry (`"purple"` at time of writing).
   */
  defaultTheme?: Theme;
}

/**
 * Applies a registered theme by writing `data-theme="..."` on
 * `<html>`. Children read the active theme via `useTheme()`.
 *
 * The set of valid themes is derived from `src/themes/registry.ts` —
 * adding a theme there automatically widens the `Theme` type here.
 */
export function ThemeProvider({
  children,
  theme: controlledTheme,
  defaultTheme = DEFAULT_THEME,
}: ThemeProviderProps) {
  const [internalTheme, setInternalTheme] = useState<Theme>(defaultTheme);
  const theme = controlledTheme ?? internalTheme;

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: (next) => {
        if (!isTheme(next)) {
          throw new Error(
            `[ThemeProvider] "${String(next)}" is not a registered theme. ` +
              `Register it in src/themes/registry.ts first.`,
          );
        }
        setInternalTheme(next);
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
