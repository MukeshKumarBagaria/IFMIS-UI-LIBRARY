/**
 * Theme types.
 *
 * The registry in `./registry.ts` is the single source of truth for which
 * themes exist. All consumer-facing types (`Theme`, `ThemeName`) are derived
 * from that registry — never edit a hand-rolled union when adding a theme.
 */

/**
 * Whether a theme is light- or dark-appearance.
 *
 * Used by host applications to decide things like:
 *   - which OS-level `color-scheme` hint to set
 *   - which logo / illustration variant to render
 *   - default chart palettes
 *
 * It does NOT affect which CSS variables resolve — that is purely the
 * `data-theme` attribute.
 */
export type ThemeMode = "light" | "dark";

/**
 * A single theme entry.
 *
 * `name` is the value written to `data-theme="..."` and is what consumers
 * pass into `<ThemeProvider theme="..." />`. Keep it kebab-case to match
 * the CSS selector convention.
 */
export interface ThemeDefinition {
  /** Machine-readable id, e.g. `"purple"`. Matches the CSS selector. */
  readonly name: string;
  /** Human-readable label for theme switchers / Storybook toolbar. */
  readonly label: string;
  /** Light or dark appearance. */
  readonly mode: ThemeMode;
  /** Optional one-line description shown in design docs / dev tools. */
  readonly description?: string;
}
