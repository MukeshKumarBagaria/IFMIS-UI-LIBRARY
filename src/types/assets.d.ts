/**
 * Ambient module declarations for non-code imports.
 *
 * Vite handles these at runtime (returning a URL string), but TypeScript
 * needs the shape to typecheck `import bg from "./foo.png"`.
 */
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}
