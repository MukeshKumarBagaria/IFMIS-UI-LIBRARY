import type { Preview } from "@storybook/react";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "../src/styles/globals.css";
import { themes, DEFAULT_THEME } from "../src/themes/registry";

/**
 * Storybook reads the available themes straight from the registry,
 * so adding a theme in `src/themes/registry.ts` automatically wires it
 * into the toolbar — no Storybook config change needed.
 */
const themeMap = Object.fromEntries(themes.map((t) => [t.name, t.name]));

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: { disable: true },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: themeMap,
      defaultTheme: DEFAULT_THEME,
      attributeName: "data-theme",
    }),
  ],
};

export default preview;
