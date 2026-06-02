<!--
  Default MR template for @ifmis/ui.
  Fill every section — reviewers will hold the MR until they're complete.
  See PUBLISHING.md §8 for the rationale behind each item.
-->

## What

<!-- One sentence: what does this change do? -->

## Why

<!-- Link the issue/ticket, and/or attach the Figma frame this implements. -->

Closes #

## Version bump

<!-- Tick exactly one. See PUBLISHING.md §5 (SemVer). -->

- [ ] **patch** — backwards-compatible fix, no public-API change
- [ ] **minor** — backwards-compatible addition (new component / variant / prop with a safe default)
- [ ] **major** — breaking change (renamed/removed prop, changed default, breaking visual, renamed export)

## Checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] CHANGELOG entry added under `## [Unreleased]`
- [ ] Stories + MDX updated for any new/changed component
- [ ] Tests added/updated for new behaviour
- [ ] Visual diff attached below (Storybook screenshot or Figma side-by-side)

## Visual diff

<!-- Drag in before/after screenshots for any visual change. -->

## Migration notes

<!-- REQUIRED if the bump is `major`. How should consumers update their code? -->

_None — backwards compatible._

/label ~"design-system"
