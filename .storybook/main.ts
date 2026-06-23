import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    // Standalone documentation pages (Foundations, etc.) — picked up
    // independently of any `.stories.*` file.
    "../src/foundations/**/*.mdx",
    // Per-component MDX guides (`<Meta of={Stories} title="UI/X/Guide" />`).
    // Named `Component.mdx` (no `.stories.` infix), so they need their own glob.
    "../src/components/**/*.mdx",
    // Component stories.
    "../src/**/*.stories.@(ts|tsx|mdx)",
  ],
  addons: ["@storybook/addon-essentials", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
