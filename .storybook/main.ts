import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    // Standalone documentation pages (Foundations, etc.) — picked up
    // independently of any `.stories.*` file.
    "../src/foundations/**/*.mdx",
    // Component stories + their MDX guides (`<Meta of={Stories} />`).
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
