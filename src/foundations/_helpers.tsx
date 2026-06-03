/* ===========================================================================
 * Foundations doc helpers — documentation-only React components used inside
 * Storybook MDX pages to render *live* token references.
 *
 * Each helper reads its values from the actual CSS custom properties (e.g.
 * `--brand-green-600`) at render time, so the docs cannot drift away from
 * the implementation: rename or remove a token in `src/styles/themes/*.css`
 * and the swatch shows it.
 *
 * These are intentionally *not* part of the published bundle — Storybook
 * picks them up via the foundations MDX files only.
 * ========================================================================= */
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

/* ---------------------------------------------------------------------------
 * Resolve a CSS custom property against `:root` at runtime.
 * ------------------------------------------------------------------------- */
function resolveCssVar(name: string): string {
  if (typeof window === "undefined") return "";
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v;
}

/* ---------------------------------------------------------------------------
 * Tiny snapshot of the current theme — re-renders helpers when the user
 * flips themes via the Storybook toolbar.
 * ------------------------------------------------------------------------- */
function useThemeTick() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const obs = new MutationObserver(() => setTick((n) => n + 1));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
    return () => obs.disconnect();
  }, []);
  return tick;
}

/* ---------------------------------------------------------------------------
 * <ColorSwatch /> — single colour chip with token + resolved value.
 * ------------------------------------------------------------------------- */
interface ColorSwatchProps {
  /** CSS variable name *with* the leading double-dash, e.g. `--brand-green-600`. */
  token: string;
  /** Optional friendly label (defaults to the token name). */
  label?: string;
  /** Optional caption rendered under the token name. */
  caption?: string;
}

export function ColorSwatch({ token, label, caption }: ColorSwatchProps) {
  useThemeTick();
  const value = resolveCssVar(token);
  const swatchStyle: CSSProperties = {
    backgroundColor: value.startsWith("linear-gradient(") ? undefined : value,
    backgroundImage: value.startsWith("linear-gradient(") ? value : undefined,
  };
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-grey-200 bg-white p-2 text-left">
      <div
        className="h-12 w-full shrink-0 rounded-md border border-grey-200"
        style={swatchStyle}
        aria-hidden="true"
      />
      <code className="truncate text-[11px] font-medium text-body-primary">
        {label ?? token}
      </code>
      <code className="truncate text-[11px] text-body-secondary">
        {value || "—"}
      </code>
      {caption && (
        <span className="truncate text-[11px] text-body-secondary">
          {caption}
        </span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * <ColorRamp /> — a labelled row of swatches that share a prefix +
 * step list (`25..950`). One CSS line in the brand file = one ramp here.
 * ------------------------------------------------------------------------- */
interface ColorRampProps {
  /** Row title rendered above the ramp. */
  title: string;
  /** CSS prefix shared by every step, e.g. `--brand-green-`. */
  prefix: string;
  /**
   * Steps to render. Defaults to the canonical IFMIS 25→950 ramp.
   */
  steps?: ReadonlyArray<string | number>;
  /** Short description under the title (purpose / semantic role). */
  description?: ReactNode;
}

const DEFAULT_STEPS: readonly (string | number)[] = [
  25,
  50,
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
  950,
];

export function ColorRamp({
  title,
  prefix,
  steps = DEFAULT_STEPS,
  description,
}: ColorRampProps) {
  return (
    <section className="my-6">
      <h4 className="mb-1 text-[16px] font-semibold text-heading">{title}</h4>
      {description && (
        <p className="mb-3 text-sm text-body-secondary">{description}</p>
      )}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
        }}
      >
        {steps.map((step) => (
          <ColorSwatch
            key={String(step)}
            token={`${prefix}${step}`}
            label={`${step}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * <TokenList /> — vertical list of arbitrary tokens. Useful for semantic
 * tokens (`--primary`, `--background`, …) that don't form a ramp.
 * ------------------------------------------------------------------------- */
interface TokenListProps {
  title: string;
  description?: ReactNode;
  tokens: ReadonlyArray<{ token: string; caption?: string }>;
}

export function TokenList({ title, description, tokens }: TokenListProps) {
  return (
    <section className="my-6">
      <h4 className="mb-1 text-[16px] font-semibold text-heading">{title}</h4>
      {description && (
        <p className="mb-3 text-sm text-body-secondary">{description}</p>
      )}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        }}
      >
        {tokens.map(({ token, caption }) => (
          <ColorSwatch key={token} token={token} caption={caption} />
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * <TypeSample /> — a single row of a typography token: the sample text
 * rendered with the token + a metadata column showing size/weight/leading.
 * ------------------------------------------------------------------------- */
interface TypeSampleProps {
  /** Display name (e.g. `H1 — Page title`). */
  label: string;
  /** CSS class that applies the token (e.g. `text-h1`). */
  className: string;
  /** Sample text to render. Defaults to the label. */
  sample?: string;
}

export function TypeSample({ label, className, sample }: TypeSampleProps) {
  useThemeTick();
  const [meta, setMeta] = useState({
    size: "",
    weight: "",
    leading: "",
  });
  useEffect(() => {
    const probe = document.createElement("span");
    probe.className = className;
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.textContent = sample ?? label;
    document.body.appendChild(probe);
    const computed = getComputedStyle(probe);
    setMeta({
      size: computed.fontSize,
      weight: computed.fontWeight,
      leading: computed.lineHeight,
    });
    document.body.removeChild(probe);
  }, [className, sample, label]);

  return (
    <div className="flex flex-col gap-2 border-b border-grey-200 py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6">
      <div className="flex-1">
        <p className={className} style={{ color: "var(--text-heading)" }}>
          {sample ?? label}
        </p>
        <p className="mt-1 text-xs text-body-secondary">{label}</p>
      </div>
      <dl className="grid shrink-0 grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs text-body-secondary sm:w-[260px]">
        <dt className="font-medium">Class</dt>
        <dd>
          <code>{className}</code>
        </dd>
        <dt className="font-medium">Size</dt>
        <dd>{meta.size || "—"}</dd>
        <dt className="font-medium">Weight</dt>
        <dd>{meta.weight || "—"}</dd>
        <dt className="font-medium">Leading</dt>
        <dd>{meta.leading || "—"}</dd>
      </dl>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * <SpacingSample /> — a horizontal bar at the chosen size, captioned with
 * the token + resolved px.
 * ------------------------------------------------------------------------- */
interface SpacingSampleProps {
  label: string;
  /** Either a Tailwind utility (`p-4`) or a CSS length (`16px`, `1rem`). */
  size: string;
  /** What this scale step is intended for. */
  caption?: string;
}

export function SpacingSample({ label, size, caption }: SpacingSampleProps) {
  // If `size` looks like a CSS length, render it directly. Otherwise treat
  // it as the visible width of the bar in px.
  const cssLength = /^\d/.test(size) ? size : "";
  return (
    <div className="grid items-center gap-3 border-b border-grey-200 py-3 last:border-b-0 sm:grid-cols-[160px_1fr_auto]">
      <code className="text-xs text-body-primary">{label}</code>
      <div className="flex items-center">
        <div
          className="h-3 rounded-sm bg-purple-300"
          style={{ width: cssLength || size }}
          aria-hidden="true"
        />
      </div>
      <span className="text-xs text-body-secondary">
        {caption ?? cssLength}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * <ShadowSample /> — a square card rendered with the given shadow token.
 * ------------------------------------------------------------------------- */
interface ShadowSampleProps {
  token: string;
  label?: string;
  caption?: string;
}

export function ShadowSample({ token, label, caption }: ShadowSampleProps) {
  useThemeTick();
  const value = resolveCssVar(token);
  return (
    <div className="flex flex-col items-start gap-2">
      <div
        className="h-24 w-full rounded-2xl bg-white"
        style={{ boxShadow: value || "none" }}
        aria-hidden="true"
      />
      <code className="text-xs text-body-primary">{label ?? token}</code>
      <code className="text-xs text-body-secondary">{value || "—"}</code>
      {caption && <span className="text-xs text-body-secondary">{caption}</span>}
    </div>
  );
}
