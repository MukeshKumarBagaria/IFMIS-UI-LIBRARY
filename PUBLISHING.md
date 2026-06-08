# Releasing & Maintaining `@ifmis/ui`

This is the **single source of truth** for everyone who develops, releases, or
maintains `@ifmis/ui`. If you just landed on this project, read sections 1–4
before touching anything, then 6–8 before you cut a release.

> **Status (kept current):** Releases are **published manually** from a
> maintainer's workstation. The tag-driven GitLab CI pipeline is **written but
> not yet operational** because the GitLab host is air-gapped — see
> [§9](#9-the-automated-pipeline-future-goal). The first release, `v0.1.0`, went
> out on **2026-06-08** via the manual flow in [§7](#7-cutting-a-release-the-manual-flow-current).

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

| Thing                   | Value                                                                 |
| ----------------------- | --------------------------------------------------------------------- |
| Package name            | `@ifmis/ui` (scoped, **restricted**)                                   |
| GitLab host             | `http://172.18.210.110` (self-hosted, **HTTP**, on the internal LAN)   |
| Project path            | `ifmis_ng/uiuxlib`                                                      |
| **Project ID**          | **`45`** (Settings → General)                                          |
| Package registry URL    | `http://172.18.210.110/api/v4/projects/45/packages/npm/`               |
| Build output            | `dist/` only (`package.json#files = ["dist"]`)                         |
| Git remotes             | `gitlab` → the GitLab repo; `origin` → a GitHub backup mirror          |

### What's already wired in the repo (don't re-do these)

- **`package.json`**
  - `name`, `version`, `repository`, `homepage`, `bugs` → all point at `172.18.210.110/ifmis_ng/uiuxlib`.
  - `publishConfig.@ifmis:registry` → the project-45 registry. **This is what
    makes `npm publish` target GitLab instead of public npm.**
  - `publishConfig.access = "restricted"`, `files = ["dist"]`.
  - `exports` map: `.` (components), `./icons`, `./styles.css`.
- **`.npmrc`** (committed, **no token**) — maps the `@ifmis` scope to the
  project-45 registry so a stray `npm publish` can never hit public npm.
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
> (so it can reach `172.18.210.110`) **and** can reach public npm (so `npm install`
> for deps works). Windows examples below; macOS/Linux is identical apart from
> the env-var syntax.

### One-time per workstation: store a publish token

1. In GitLab: **avatar → Edit profile → Access Tokens → Add new token**, scope
   **`api`**, copy the `glpat-…` value.
2. Save it into your **user** `~/.npmrc` (npm does this for you — never edit the
   repo `.npmrc`):

   ```powershell
   npm config set "//172.18.210.110/api/v4/projects/45/packages/npm/:_authToken" "glpat-XXXX"
   ```

   (`npm config get` on an `_authToken` returns "protected" — that's normal; the
   value is still saved.)

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

# 6. Publish to the GitLab registry. NO arguments — publishConfig handles the target.
npm publish

# 7. Push the commit and the tag to GitLab.
git push gitlab main --follow-tags
```

> **First-release note.** For `v0.1.0` the version already matched `0.1.0`, so we
> skipped `npm version` and tagged directly (`git tag -a v0.1.0`). Every release
> after that uses `npm version` as above.

> **The tag triggers a pipeline that currently FAILS** at the Docker image-pull
> step (air-gap). That red pipeline is **expected and harmless** — the package is
> already published by step 6. If you want to avoid the noise, create the tag
> locally and don't push it until CI is fixed.

### Verify & announce

1. GitLab → **Deploy → Package Registry** → the new version is listed.
2. Sanity-check a consumer can resolve it (from an on-network machine with the
   read token configured): `npm view @ifmis/ui version`.
3. Announce in the team channel: version, one-line summary, CHANGELOG link.

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
- [ ] Package visible in Deploy → Package Registry
- [ ] Pushed `main --follow-tags`
- [ ] Announced
```

**Things that bite people:**

- **Tag ↔ version mismatch.** The tag must be `v` + the exact `package.json`
  version. The future CI enforces this; in the manual flow *you* enforce it.
- **Never re-publish a version number.** npm/GitLab will reject it, and even if it
  didn't, consumers cache by version. Broken release → publish a new patch and
  deprecate the bad one ([§11](#11-deprecating-yanking--rollback)).
- **`dist/` is all that ships.** If you add a new entry point, update
  `package.json#exports` **and** `files`. Run `npm pack --dry-run` to see exactly
  what will be published.
- **Two majors in one release** hide breakage — surface every breaking change in
  the CHANGELOG with migration notes.
- **Network.** You must be on the IFMIS LAN/VPN to reach `172.18.210.110`. An
  `ETIMEDOUT` on publish/view means you're off-network, not that the package is broken.

---

## 9. The automated pipeline (future goal)

`.gitlab-ci.yml` already defines the intended flow:

- **`verify`** (typecheck + lint + test) on every MR and on `main`.
- **`build`** (`dist/`) on `main` and on `vX.Y.Z` tags.
- **`publish`** (`npm publish`) **only** on a `vX.Y.Z` tag, gated by a check that
  the tag matches `package.json`, using a `NPM_PUBLISH_TOKEN` CI variable.
- **`pages`** to deploy Storybook on a tag.

### Why it doesn't work yet

The RHEL machine that runs GitLab (`172.18.210.110`) is **IP-whitelisted with no
general outbound internet**. A GitLab Runner *is* installed and online (Docker
executor, project-scoped to `uiuxlib`), but jobs fail because:

1. The runner can't pull `node:20-alpine` from **Docker Hub** (`registry-1.docker.io` times out).
2. Even with an image, `npm ci` can't reach the **public npm registry**.

IP-whitelisting your way out doesn't work — Docker Hub and npm are CDN-backed
with many rotating IPs.

### What needs to be done (platform/network team)

Pick a path and make it real **before** relying on tag-driven releases:

1. **Internal npm mirror** (Nexus/Artifactory) that the host *is* allowed to
   reach, and set the default registry (in CI) to it so `npm ci` works.
2. **Container image source without Docker Hub** — either a whitelisted internal
   container registry, **or** pre-load the image on the runner host:

   ```bash
   # on an internet-connected machine:
   docker pull node:20-alpine && docker save node:20-alpine -o node20.tar
   # copy node20.tar to the runner host, then:
   docker load -i node20.tar
   ```
   …and set the runner's `pull_policy = ["if-not-present"]` in
   `/etc/gitlab-runner/config.toml`.
3. **Or** host the runner on a machine that has **both** internet and a LAN route
   to `172.18.210.110`, instead of the locked-down GitLab box.

### One code fix to apply when CI is enabled

`.gitlab-ci.yml` builds the publish auth line with `${CI_API_V4_URL#https:}`.
Because this host is **HTTP**, change it to `${CI_API_V4_URL#http*:}` (strips both
`http:` and `https:`) — otherwise the npm auth line is malformed and `publish`
returns `401`.

### How a release works once CI is live

The manual `npm publish` step disappears. You only:

```bash
npm version minor -m "release: %s"   # bumps + tags
git push gitlab main --follow-tags   # tag triggers verify → build → publish → pages
```

Set the CI variables first: `NPM_PUBLISH_TOKEN` (publish, scope `api`) and
`NPM_READ_TOKEN` (read, for consumers), both **Protected + Masked**; and protect
`main` and `v*` tags (Settings → Repository).

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
  npm deprecate @ifmis/ui@0.2.1 "Broken — use >=0.2.2, see CHANGELOG"
  ```
  (Run with your `.npmrc` pointed at the project-45 registry.) Prefer deprecation
  over deleting a version — deletion gives consumers a mysterious 404.
- **Consumer rollback.** `npm install @ifmis/ui@<last-good>`, pin, ship; unpin
  once the library is fixed.

---

## 12. Security: tokens & secrets

- **Never commit a token.** The repo `.npmrc` has the registry URL only. Auth
  lives in your **user** `~/.npmrc` (via `npm config set`) or, in CI, in a
  **Protected + Masked** variable.
- **Right scope for the job:** publishing needs **`api`**; consumers need only
  **read** (a Deploy token with `read_package_registry`, or `read_api`). Don't
  hand out `api` tokens to consumers.
- **Rotate on exposure.** If a token is pasted into a chat, ticket, or log,
  revoke it immediately (Access Tokens / Runners → Reset token) and mint a new one.
- **Token expiry.** Set expirations and calendar a rotation before they lapse, or
  releases silently start failing with `401`.

---

## 13. Troubleshooting

| Symptom                                                        | Cause                                               | Fix                                                            |
| ------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| `npm publish` → `401 Unauthorized`                            | Token missing/expired/wrong scope.                  | Re-store an `api` token (§7) via `npm config set`.            |
| `npm publish gitlab` → times out to `registry.npmjs.org`      | Passed a git remote name to npm.                    | Run `npm publish` with **no arguments**.                      |
| `npm publish`/`view` → `ETIMEDOUT 172.18.210.110`             | Off the IFMIS network.                              | Connect to the LAN/VPN; retry.                                |
| Publish `400 / version exists`                                | That version is already in the registry.            | Bump to a new version; never reuse a number.                  |
| Published but `dist` is empty/missing files                   | `files`/`exports` regressed.                        | `npm pack --dry-run` before publishing; fix `package.json`.   |
| `npm version` refuses                                         | Dirty working tree.                                 | Commit/stash first; `npm version` needs a clean tree.         |
| CI job stuck "pending" forever                                | No runner picks it up (untagged/protected mismatch).| Runner must allow untagged jobs and not be "protected-only".  |
| CI job fails pulling `node:20-alpine`                         | Air-gapped host (see §9).                           | Use a mirror / pre-loaded image, or publish manually.         |

Add every new failure mode here as it's solved.

---

## 14. Glossary

- **`@ifmis` scope** — npm name prefix mapped to the GitLab registry via `.npmrc`.
- **Package registry** — GitLab's npm-compatible registry, per project
  (`/api/v4/projects/45/packages/npm/`).
- **`publishConfig`** — the `package.json` block that pins where `npm publish`
  sends this package. Independent of git remotes.
- **Project / personal access token (PAT)** — GitLab token; `api` = publish,
  `read_api` / Deploy token `read_package_registry` = consume.
- **Protected / Masked variable** — CI variable visible only on protected
  refs / redacted from logs. Use both for any token.
- **Build artifact** — the `dist/` directory (`files: ["dist"]`). The only thing
  consumers receive.
- **Tag-driven release** — pushing `vX.Y.Z` triggers the publish pipeline (the
  future model). Today the tag is for record; publish is manual.

— end —
