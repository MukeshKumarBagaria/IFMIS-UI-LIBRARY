import type { ThemeDefinition } from "./types";

/**
 * Registered themes — the single source of truth.
 *
 * To add a theme (e.g. `"blue"`):
 *   1. Create `src/styles/themes/blue.css` with a `[data-theme="blue"]`
 *      block declaring every CSS variable defined in `purple.css`.
 *   2. Append `@import "./blue.css";` to `src/styles/themes/index.css`.
 *   3. Add an entry below.
 *
 * The literal `as const` is important — it lets TypeScript infer a precise
 * union of `name` values, so `Theme` below is auto-narrowed without any
 * manual maintenance.
 */
export const themes = [
  {
    name: "purple",
    label: "Purple",
    mode: "light",
    description: "IFMIS default brand theme (light).",
  },
  {
    name: "dark",
    label: "Dark",
    mode: "dark",
    description: "Dark companion theme.",
  },
] as const satisfies readonly ThemeDefinition[];

/** Union of registered theme names — auto-derived from `themes`. */
export type Theme = (typeof themes)[number]["name"];

/** The theme used when none is explicitly selected. */
export const DEFAULT_THEME: Theme = "purple";

/** Array of just the theme names (handy for Storybook + selectors). */
export const THEME_NAMES: readonly Theme[] = themes.map((t) => t.name);

/** Map for fast `name → definition` lookup. */
const THEME_MAP: Readonly<Record<Theme, ThemeDefinition>> = Object.freeze(
  Object.fromEntries(themes.map((t) => [t.name, t])) as Record<
    Theme,
    ThemeDefinition
  >,
);

/** Look up a theme by name. Throws if the name isn't registered. */
export function getTheme(name: Theme): ThemeDefinition {
  return THEME_MAP[name];
}

/** Type guard — true if `value` is a registered theme name. */
export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && value in THEME_MAP;
}
