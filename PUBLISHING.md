# Releasing & Maintaining `@ifmis/ui`

This is the **single source of truth** for everyone who develops, releases, or
maintains `@ifmis/ui`. If you just landed on this project, read sections 1–4
before touching anything, then 6–8 before you cut a release.

> **Status (kept current):** Releases are **published manually** to the internal
> **Verdaccio** registry (`http://172.18.210.110:6379/`) from a maintainer's
> workstation — see [§7](#7-cutting-a-release-the-manual-flow-current). The
> tag-driven GitLab CI pipeline is **written but not yet operational** because the
> GitLab host is air-gapped ([§9](#9-the-automated-pipeline-future-goal)). History:
> `v0.1.0` first went to the legacy GitLab registry on **2026-06-08**; current
> releases (now at `0.1.3`) go to Verdaccio.

## Contents

1. [The setup at a glance](#1-the-setup-at-a-glance)
2. [Who does what](#2-who-does-what)
3. [Local development & quality gates](#3-local-development--quality-gates)
4. [Adding or changing a component](#4-adding-or-changing-a-component)
5. [Versioning policy (SemVer)](#5-versioning-policy-semver)
6. [The CHANGELOG — how "what's new" is defined](#6-the-changelog--how-whats-new-is-defined)
7. [Cutting a release — the manual flow (current)](#7-cutting-a-release-the-manual-flow-current)
8. [Release checklist & what to watch for](#8-release-checklist--what-to-watch-for)
9. [The automated pipeline (future goal)](#9-the-automated-pipeline-future-goal)
10. [Hotfixes & pre-releases](#10-hotfixes--pre-releases)
11. [Deprecating, yanking & rollback](#11-deprecating-yanking--rollback)
12. [Security: tokens & secrets](#12-security-tokens--secrets)
13. [Troubleshooting](#13-troubleshooting)
14. [Glossary](#14-glossary)

---

## 1. The setup at a glance

We publish to **and** install from one internal registry: a **Verdaccio** server
on the GitLab VM. Verdaccio both **hosts `@ifmis/ui`** and **proxies the public
npm registry**, so consumers get the library and its dependencies from a single
URL over the IFMIS network.

| Thing                   | Value                                                                 |
| ----------------------- | --------------------------------------------------------------------- |
| Package name            | `@ifmis/ui` (scoped)                                                   |
| **Registry (publish + install)** | **`http://172.18.210.110:6379/`** (Verdaccio)                |
| Git project (source)    | `ifmis_ng/uiuxlib` at `http://172.18.210.110` (self-hosted GitLab)     |
| Build output            | `dist/` only (`package.json#files = ["dist"]`)                         |
| Git remotes             | `gitlab` → the GitLab repo; `origin` → a GitHub backup mirror          |

> **Legacy:** the GitLab project-45 **Package Registry**
> (`…/api/v4/projects/45/packages/npm/`) was the original target and still holds
> `0.1.0`. It is **retired** — all publishing and installing now goes through
> Verdaccio. Don't publish there anymore.

### What's already wired in the repo (don't re-do these)

- **`package.json`**
  - `name`, `version`, `repository`, `homepage`, `bugs` → point at `172.18.210.110/ifmis_ng/uiuxlib`.
  - `publishConfig.registry` → **`http://172.18.210.110:6379/`**. **This is what
    makes `npm publish` target Verdaccio instead of public npm.**
  - `files = ["dist"]`.
  - `exports` map: `.` (components), `./icons`, `./styles.css`.
- **`.npmrc`** (committed, **no token**) — sets `registry=` (and `@ifmis:registry=`)
  to the Verdaccio URL so a stray `npm publish` can never hit public npm.
- **`.gitlab-ci.yml`** — the future pipeline (see [§9](#9-the-automated-pipeline-future-goal)).
- **`.gitlab/CODEOWNERS`**, **`.gitlab/merge_request_templates/default.md`**.

> ⚠️ **`npm publish` is decided by `publishConfig` / `.npmrc`, NOT by git
> remotes.** A git remote (`gitlab`, `origin`) only affects `git push`. Never
> pass a remote name to `npm publish` — `npm publish gitlab` will try the *public*
> npm registry and time out.

---

## 2. Who does what

| Role                    | Responsibilities                                                          |
| ----------------------- | ------------------------------------------------------------------------ |
| **Maintainer**          | Reviews & merges MRs, cuts releases, owns tokens & the CI roadmap. §3–§12 |
| **Contributor**         | Opens MRs for components/tokens/docs, writes the CHANGELOG entry. §3–§6   |
| **Consumer team**       | Installs and uses the package. See **[README.md](./README.md)**.          |

---

## 3. Local development & quality gates

```bash
npm install              # install deps (uses package-lock.json)
npm run storybook        # component playground at http://localhost:6006
npm run dev              # alias for storybook
npm run test             # vitest (CI mode) — 300+ tests
npm run test:watch       # vitest watch
npm run typecheck        # tsc --noEmit (strict)
npm run lint             # eslint 9 (flat config — eslint.config.js)
npm run format           # prettier --write
npm run build            # tsc -p tsconfig.build.json && vite build → ./dist
npm run build-storybook  # static docs site → ./storybook-static
```

**The three gates that must be green before every merge and every release:**

```bash
npm run typecheck && npm run lint && npm test
```

If you can't reproduce green locally, fix it locally — don't hope CI catches it
(and right now, CI can't — see [§9](#9-the-automated-pipeline-future-goal)).

> **Tooling note.** Linting uses **ESLint 9 flat config** in `eslint.config.js`
> (there is no `.eslintrc`). Story files have `react-hooks/rules-of-hooks`
> disabled because Storybook mounts a story's `render` function as a component.

---

## 4. Adding or changing a component

Every component is a self-contained folder of **five files** under
`src/components/ui/`:

```
ComponentName/
├── ComponentName.tsx           implementation
├── ComponentName.stories.tsx   Storybook stories
├── ComponentName.test.tsx      unit tests (vitest + Testing Library)
├── ComponentName.mdx           how-to-use guide (the human API doc)
└── index.ts                    public re-exports
```

Steps:

1. Create the folder with all five files, matching an existing component's shape.
2. Style **only** with theme tokens (Tailwind `@theme` variables). If a colour,
   size, padding, or shadow isn't already a token, **add the token first** in
   `src/styles/` and document it in **Foundations** — never hard-code a raw value.
3. Export the component **and its types** from `src/index.ts`.
4. Run the three gates. Write the test first; make it pass.
5. Add a **CHANGELOG entry** under `## [Unreleased]` (see [§6](#6-the-changelog--how-whats-new-is-defined)).
6. Open an MR using the template; fill in the bump (`patch`/`minor`/`major`).

Adding a **theme**? Follow `src/themes/registry.ts` (create the CSS file, import
it, add a registry entry). Components never change when a theme is added.

---

## 5. Versioning policy (SemVer)

We follow **[Semantic Versioning 2.0.0](https://semver.org/)**. For
`MAJOR.MINOR.PATCH`:

| Bump      | When                                                            | Examples                                                       |
| --------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| **PATCH** | Backwards-compatible fix; no public API change.                | Tweak a token, fix a focus ring, fix a label typo.            |
| **MINOR** | Backwards-compatible **addition** to the public API.           | New component, new variant, new optional prop with a default.  |
| **MAJOR** | Any **breaking** change.                                       | Removed/renamed prop or export, changed default, breaking visual change. |

Rules of thumb:

- **A prop-default change is a major.** Consumers rely on defaults.
- **Renaming an export or a CSS token is a major** unless the old name keeps
  working as an alias for at least one minor.
- **Deprecate in minor `N`, remove in major `N+1`.** Never remove without a
  deprecation cycle.
- **Storybook-only / internal changes are a patch** (or no bump).

The MR author proposes the bump; the reviewer challenges it. When unsure, **bump
up** — an extra major is cheap, silent breakage is not.

### Pre-1.0 caveat (we are here)

While on `0.x`, a **minor** bump is allowed to break — `0.1 → 0.2` may contain
breaking changes. Communicate them in the CHANGELOG regardless. We cut `1.0.0`
once the API has stabilised across at least two consumer modules.

---

## 6. The CHANGELOG — how "what's new" is defined

[`CHANGELOG.md`](./CHANGELOG.md) is the contract that tells consumers exactly
what changed in each version. It follows **[Keep a Changelog](https://keepachangelog.com/)**.

### How it works

- The top of the file always has an **`## [Unreleased]`** section.
- **Every MR that changes behaviour adds a bullet** under the right subheading in
  `[Unreleased]`. This is part of the MR, not an afterthought at release time.
- At release time, the maintainer **renames `[Unreleased]` content into a new
  version block** and leaves a fresh empty `[Unreleased]` on top (see [§7](#7-cutting-a-release-the-manual-flow-current)).

### Subheadings (use these, in this order)

```md
## [Unreleased]

### Added         — new components, props, variants, tokens
### Changed       — changes to existing behaviour that are NOT breaking
### Deprecated    — APIs still working but scheduled for removal
### Removed       — breaking removals (→ major)
### Fixed         — bug fixes
### Security      — anything security-relevant
```

### Writing a good entry

- Write for the **consumer**, not the implementer. Lead with the component name
  in backticks and say what they can now do.
- One bullet per user-visible change. Link the prop/variant by name.
- For a **breaking** change, add a one-line **migration note** right in the bullet.

```md
### Added
- **`Badge`** variant `warning` (yellow tone) for non-blocking advisories.

### Changed
- **`Toggle`** default size is now `md` (was `sm`). **Migration:** pass
  `size="sm"` to keep the old look. (breaking → major)

### Fixed
- **`Dropdown`** no longer closes when clicking a disabled option.
```

A released block looks like this (note the date, `YYYY-MM-DD`):

```md
## [0.2.0] — 2026-07-15
### Added
- ...
### Fixed
- ...
```

---

## 7. Cutting a release — the manual flow (current)

> Until CI is unblocked ([§9](#9-the-automated-pipeline-future-goal)), a
> maintainer publishes by hand from a workstation that is **on the IFMIS network**
> (so it can reach the Verdaccio registry at `172.18.210.110:6379`). Verdaccio
> proxies public npm, so you do **not** need separate public-internet access for
> `npm install`. Windows examples below; macOS/Linux differs only in env-var syntax.

### One-time per workstation: log in to Verdaccio

```bash
npm login --registry http://172.18.210.110:6379/
```

Enter your Verdaccio username/password. This writes an auth token for the
`:6379` registry into your **user** `~/.npmrc` — never put a token in the repo
`.npmrc`. (`npm config get` on an `_authToken` returns "protected"; that's
normal — the value is saved.)

### Every release, in order

```bash
# 0. Be on a clean, up-to-date main.
git switch main
git pull --rebase gitlab main
git status            # must be clean

# 1. Gates green (never release red).
npm run typecheck && npm run lint && npm test

# 2. Bump the version in package.json WITHOUT committing yet.
#    Choose patch | minor | major per §5.
npm version minor --no-git-tag-version     # e.g. 0.1.0 → 0.2.0
```

```md
3. Update CHANGELOG.md:
   - Rename the `## [Unreleased]` body into `## [X.Y.Z] — YYYY-MM-DD`.
   - Leave a new empty `## [Unreleased]` block on top.
```

```bash
# 4. One clean release commit + matching tag.
git add package.json package-lock.json CHANGELOG.md
git commit -m "release: vX.Y.Z"
git tag -a vX.Y.Z -m "release: vX.Y.Z"

# 5. Build the publishable artifact.
npm run build            # produces dist/ (index.js, icons.js, styles.css, *.d.ts)

# 6. (optional) Inspect exactly what will ship before publishing.
npm pack --dry-run

# 7. Publish to Verdaccio. publishConfig.registry already points there, so plain
#    `npm publish` is enough; the explicit flag below just makes the target obvious.
npm publish --registry http://172.18.210.110:6379/

# 8. Push the commit and the tag to GitLab.
git push gitlab main --follow-tags
```

> **You must bump the version every release.** Verdaccio rejects re-publishing an
> existing version (`cannot publish over the previously published versions`).
> Releases so far: `0.1.0` (originally to the legacy GitLab registry) → `0.1.3`
> on Verdaccio. Step 2 (`npm version`) handles the bump.

> **The tag triggers a GitLab pipeline that currently FAILS** at the Docker
> image-pull step (air-gap). That red pipeline is **expected and harmless** — the
> package is already published by step 7. To avoid the noise, create the tag
> locally and don't push it until CI is fixed.

### Verify & announce

1. Confirm it's live: `npm view @ifmis/ui version --registry http://172.18.210.110:6379/`
   (or browse the Verdaccio web UI).
2. Announce in the team channel: version, one-line summary, CHANGELOG link.

---

## 8. Release checklist & what to watch for

Paste this into the release MR / notes:

```md
## Release vX.Y.Z
- [ ] On clean, up-to-date `main`
- [ ] `npm run typecheck` clean
- [ ] `npm run lint` clean
- [ ] `npm test` green
- [ ] Bump rationale recorded: patch / minor / major because …
- [ ] CHANGELOG `[Unreleased]` moved under `## [X.Y.Z] — <date>`; fresh empty `[Unreleased]` left
- [ ] Migration notes written for every breaking change
- [ ] `npm run build` produced a non-empty `dist/`
- [ ] `npm publish` succeeded
- [ ] Tag `vX.Y.Z` matches `package.json` version
- [ ] Package visible in Verdaccio (`npm view @ifmis/ui version --registry http://172.18.210.110:6379/`)
- [ ] Pushed `main --follow-tags`
- [ ] Announced
```

**Things that bite people:**

- **Tag ↔ version mismatch.** The tag must be `v` + the exact `package.json`
  version. The future CI enforces this; in the manual flow *you* enforce it.
- **Never re-publish a version number.** Verdaccio rejects it, and even if it
  didn't, consumers cache by version. Broken release → publish a new patch and
  deprecate the bad one ([§11](#11-deprecating-yanking--rollback)).
- **`dist/` is all that ships.** If you add a new entry point, update
  `package.json#exports` **and** `files`. Run `npm pack --dry-run` to see exactly
  what will be published.
- **Two majors in one release** hide breakage — surface every breaking change in
  the CHANGELOG with migration notes.
- **Network.** You must be on the IFMIS LAN/VPN to reach `172.18.210.110:6379`. An
  `ETIMEDOUT` on publish/view means you're off-network, not that the package is broken.

---

## 9. The automated pipeline (future goal)

`.gitlab-ci.yml` already defines the intended flow:

- **`verify`** (typecheck + lint + test) on every MR and on `main`.
- **`build`** (`dist/`) on `main` and on `vX.Y.Z` tags.
- **`publish`** (`npm publish`) **only** on a `vX.Y.Z` tag, gated by a check that
  the tag matches `package.json`, using a `NPM_PUBLISH_TOKEN` CI variable.
- **`pages`** to deploy Storybook on a tag.

### Why it doesn't work yet — and what's already solved

The RHEL machine that runs GitLab (`172.18.210.110`) is **IP-whitelisted with no
general outbound internet**. A GitLab Runner *is* installed and online (Docker
executor, project-scoped to `uiuxlib`). Originally two things blocked it; one is
now solved:

1. ❌ **Docker image pull** — the runner still can't pull `node:20-alpine` from
   **Docker Hub** (`registry-1.docker.io` times out). *This is the one remaining blocker.*
2. ✅ **npm dependencies** — solved by **Verdaccio**. It runs on the same VM and
   proxies public npm, so a CI job that sets `registry=http://172.18.210.110:6379/`
   can `npm ci` without public internet.

### What still needs to be done (platform/network team)

Only the image source is left. Pick one:

1. **Pre-load the image on the runner host** (simplest):

   ```bash
   # on an internet-connected machine:
   docker pull node:20-alpine && docker save node:20-alpine -o node20.tar
   # copy node20.tar to the runner host, then:
   docker load -i node20.tar
   ```
   …and set `pull_policy = ["if-not-present"]` under `[runners.docker]` in
   `/etc/gitlab-runner/config.toml`.
2. **A whitelisted internal container registry** the runner can pull from.
3. **Or** host the runner on a machine with both internet and a LAN route to
   `172.18.210.110`.

### Changes to `.gitlab-ci.yml` when CI is enabled

The committed pipeline still targets the **legacy GitLab project-45 registry** —
rewire it to Verdaccio:

- In `before_script`, write `registry=http://172.18.210.110:6379/` into `.npmrc`
  so both `npm ci` and `npm publish` use Verdaccio.
- Authenticate with a **Verdaccio** token in a Protected + Masked CI variable, e.g.
  `//172.18.210.110:6379/:_authToken=${VERDACCIO_TOKEN}`.
- Delete the old GitLab-registry auth line (`${CI_API_V4_URL#https:}…`) — it's no
  longer used.

### How a release works once CI is live

The manual `npm publish` step disappears. You only:

```bash
npm version minor -m "release: %s"   # bumps + tags
git push gitlab main --follow-tags   # tag triggers verify → build → publish → pages
```

Set the CI variable first: `VERDACCIO_TOKEN` (a Verdaccio publish token),
**Protected + Masked**; and protect `main` and `v*` tags (Settings → Repository).

---

## 10. Hotfixes & pre-releases

### Hotfix to an older minor

When `main` has moved on but a consumer needs a fix on, say, `0.2.x`:

1. Branch `release/0.2` from tag `v0.2.<last>` (create it if absent).
2. Apply / cherry-pick the fix.
3. `npm version patch --no-git-tag-version`, update CHANGELOG, commit, tag.
4. Build + `npm publish` from that branch (manual flow).
5. Forward-port the fix to `main`. **Don't merge `release/0.2` into `main`** —
   keep histories separate.

### Pre-release / canary

To trial a risky change with one consumer:

```bash
npm version prerelease --preid=rc --no-git-tag-version   # → 0.2.0-rc.0
# commit + tag vX.Y.Z-rc.N, build, npm publish
```

Consumers opt in with `npm install @ifmis/ui@rc`. Never merge an `-rc` build as
the final — drop the suffix and publish a stable version once validated.

---

## 11. Deprecating, yanking & rollback

- **Deprecate (preferred).** Mark the old API `@deprecated` in JSDoc, keep it
  working for ≥1 minor, document the replacement in the CHANGELOG.
- **Bad version published?** Do **not** reuse the number. Publish a fixed patch,
  then deprecate the broken one:

  ```bash
  npm deprecate @ifmis/ui@0.2.1 "Broken — use >=0.2.2, see CHANGELOG" --registry http://172.18.210.110:6379/
  ```
  Prefer deprecation over deleting a version — deletion gives consumers a
  mysterious 404.
- **Consumer rollback.** `npm install @ifmis/ui@<last-good>`, pin, ship; unpin
  once the library is fixed.

---

## 12. Security: tokens & secrets

- **Never commit a token.** The repo `.npmrc` has the registry URL only. Auth
  lives in your **user** `~/.npmrc` (written by `npm login`) or, in CI, in a
  **Protected + Masked** variable.
- **Least privilege:** give consumers a token that can only **read** from
  Verdaccio; keep publish-capable tokens with maintainers. Configure who can
  read/publish each scope in Verdaccio's `config.yaml` (`access` / `publish`).
- **Rotate on exposure.** If a token is pasted into a chat, ticket, or log,
  revoke it immediately and issue a new one.
- **Token expiry.** Set expirations and calendar a rotation before they lapse, or
  releases silently start failing with `401`.

---

## 13. Troubleshooting

| Symptom                                                        | Cause                                               | Fix                                                            |
| ------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| `npm publish` → `401 Unauthorized`                            | Not logged in / token expired.                      | `npm login --registry http://172.18.210.110:6379/` (§7).     |
| `npm publish gitlab` → times out to `registry.npmjs.org`      | Passed a git remote name to npm.                    | Run `npm publish` with **no arguments**.                      |
| `npm publish`/`view` → `ETIMEDOUT 172.18.210.110:6379`        | Off the IFMIS network.                              | Connect to the LAN/VPN; retry.                                |
| `cannot publish over previously published versions`           | That version already exists in Verdaccio.           | Bump the version (`npm version …`); never reuse a number.     |
| A public dep won't install in CI/consumer                     | Registry not set to Verdaccio (no npm proxy).       | Ensure `.npmrc` has `registry=http://172.18.210.110:6379/`.  |
| Published but `dist` is empty/missing files                   | `files`/`exports` regressed.                        | `npm pack --dry-run` before publishing; fix `package.json`.   |
| `npm version` refuses                                         | Dirty working tree.                                 | Commit/stash first; `npm version` needs a clean tree.         |
| CI job stuck "pending" forever                                | No runner picks it up (untagged/protected mismatch).| Runner must allow untagged jobs and not be "protected-only".  |
| CI job fails pulling `node:20-alpine`                         | Air-gapped host (see §9).                           | Use a mirror / pre-loaded image, or publish manually.         |

Add every new failure mode here as it's solved.

---

## 14. Glossary

- **`@ifmis` scope** — npm name prefix for our packages; resolved via the
  Verdaccio registry in `.npmrc`.
- **Verdaccio** — the internal npm registry at `http://172.18.210.110:6379/`. It
  hosts `@ifmis/*` **and** proxy-caches the public npm registry, so it's the one
  registry both publishing and installing use.
- **`publishConfig`** — the `package.json` block (`registry` → Verdaccio) that
  pins where `npm publish` sends this package. Independent of git remotes.
- **Legacy GitLab Package Registry** — the original target
  (`/api/v4/projects/45/packages/npm/`), now retired; holds only `0.1.0`.
- **Protected / Masked variable** — CI variable visible only on protected
  refs / redacted from logs. Use both for any token.
- **Build artifact** — the `dist/` directory (`files: ["dist"]`). The only thing
  consumers receive.
- **Tag-driven release** — pushing `vX.Y.Z` triggers the publish pipeline (the
  future model). Today the tag is for record; publish is manual.

— end —
