import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Project-aware tailwind-merge.
 *
 * Our design tokens reuse the `text-*` prefix for two unrelated things:
 *   - **font size**  — `text-body-{xs,sm,md,lg}`, `text-h1`…`text-h6`
 *   - **text color** — `text-heading`, `text-subheading`,
 *                      `text-body-primary`, `text-body-secondary`,
 *                      `text-muted-foreground`
 *
 * Stock tailwind-merge doesn't know these custom values, so it lumps them
 * all into one `text-*` group and treats e.g. `text-body-lg` and
 * `text-body-primary` as conflicting — silently dropping the size. We teach
 * it which token is which so a size and a colour can coexist.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "body-xs",
            "body-sm",
            "body-md",
            "body-lg",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
          ],
        },
      ],
      "text-color": [
        {
          text: [
            "heading",
            "subheading",
            "body-primary",
            "body-secondary",
            "body-disabled",
            "muted-foreground",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
