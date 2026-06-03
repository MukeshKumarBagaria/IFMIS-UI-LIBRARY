# Publishing `@ifmis/ui`

This document is the **single source of truth** for releasing
`@ifmis/ui` to other IFMIS teams over **GitLab's npm Package Registry**.

We run our **own self-hosted GitLab instance** (`gitlab.example.com`
throughout this doc — replace with your actual host once known). The flow
below assumes that; any difference vs. `gitlab.com` is called out inline.

It covers:

0. [**Bootstrap to v0.1.0 — the first launch**](#0-bootstrap-to-v010--the-first-launch)
1. [Who this is for](#1-who-this-is-for)
2. [Concepts](#2-concepts)
3. [One-time setup](#3-one-time-setup)
4. [The release flow (TL;DR)](#4-the-release-flow-tldr)
5. [Versioning policy (SemVer)](#5-versioning-policy-semver)
6. [Automated release pipeline (`.gitlab-ci.yml`)](#6-automated-release-pipeline-gitlab-ciyml)
7. [Consuming the package](#7-consuming-the-package)
8. [Day-2: making changes](#8-day-2-making-changes)
9. [Hotfix flow](#9-hotfix-flow)
10. [Pre-release / canary builds](#10-pre-release--canary-builds)
11. [Deprecating, yanking, and rollback](#11-deprecating-yanking-and-rollback)
12. [Storybook deployment (GitLab Pages)](#12-storybook-deployment-gitlab-pages)
13. [Troubleshooting](#13-troubleshooting)
14. [Glossary](#14-glossary)

---

## 0. Bootstrap to v0.1.0 — the first launch

This is the **literal step-by-step** to ship the first version of
`@ifmis/ui` from a fresh GitLab project to a working package install in a
consumer app. Read this once end-to-end before doing it.

### 0.1 What you'll have at the end

- A protected `main` branch in **your self-hosted GitLab** with this code.
- A `v0.1.0` Git tag.
- A CI pipeline that built `dist/` and pushed `@ifmis/ui@0.1.0` to the
  project's npm registry.
- A Storybook site live at the project's GitLab Pages URL.
- A consumer app that runs `npm install @ifmis/ui` and gets the version.

### 0.2 Prerequisites

- A GitLab user with **Maintainer** on the new project.
- A workstation with `node >=18`, `npm >=9`, `git`, and your GitLab SSH key
  set up.
- The **numeric Project ID** of the new GitLab project (Settings → General).
  Throughout this section: `<UI_PROJECT_ID>`.
- The **hostname** of your self-hosted GitLab. Throughout: `gitlab.example.com`
  (replace).

### 0.3 Bootstrap, step by step

**1. Create the GitLab project.**

In your self-hosted GitLab UI: New project → Create blank project. Name it
`ui`, group it under `ifmis/`, default branch `main`. Do not initialise
with a README (we have one).

**2. Push this repo as `main`.**

```bash
cd ~/code/IFMIS-UI-LIBRARY
git init
git add -A
git commit -m "chore: bootstrap @ifmis/ui"
git branch -M main
git remote add origin git@gitlab.example.com:ifmis/ui.git
git push -u origin main
```

**3. Verify package metadata matches your host.**

In `package.json`, confirm or update:

```jsonc
{
  "name": "@ifmis/ui",
  "version": "0.1.0",
  "repository": { "type": "git", "url": "git+https://gitlab.example.com/ifmis/ui.git" },
  "homepage": "https://gitlab.example.com/ifmis/ui#readme",
  "bugs":     { "url": "https://gitlab.example.com/ifmis/ui/-/issues" },
  "publishConfig": {
    "@ifmis:registry": "https://gitlab.example.com/api/v4/projects/<UI_PROJECT_ID>/packages/npm/",
    "access": "restricted"
  },
  "files": ["dist"]
}
```

> **Self-hosted GitLab note.** The `publishConfig.@ifmis:registry` URL
> uses your host, **not** `gitlab.com`. The same applies everywhere a URL
> appears in this doc.

Commit + push the change.

**4. Run the verification gates locally.**

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build           # produces dist/
npm run build-storybook # produces storybook-static/
```

All four must be green before you tag. If you can't reproduce green
locally, fix it first — never lean on CI to "see if it works".

**5. Create the CI tokens.**

In the GitLab UI, on the new project:

- **Settings → Access Tokens** → New project access token.
  - Name: `ui-publish-bot`
  - Role: **Maintainer**
  - Scopes: `api`, `write_registry`
  - Expiration: 1 year out
- Repeat for `ui-read-only`:
  - Role: **Reporter**
  - Scopes: `read_api`, `read_registry`

Copy the token values somewhere secure for the next step. **They are shown
only once.**

**6. Store the publish token as a protected CI variable.**

- **Settings → CI/CD → Variables → Add variable.**
  - Key: `NPM_PUBLISH_TOKEN`
  - Value: the `ui-publish-bot` token value from step 5.
  - Type: **Variable**.
  - Flags: ✅ **Protected**, ✅ **Masked**.
- Add a second variable `NPM_READ_TOKEN` with the `ui-read-only` value.
  Protect + mask the same way.

> Protected means the variable is only exposed on protected branches /
> tags. Masked redacts it from job logs. **Always both.**

**7. Protect `main` and `v*` tags.**

- **Settings → Repository → Protected branches**: `main` — Maintainers can
  merge; nobody can push directly.
- **Settings → Repository → Protected tags**: `v*` — Maintainers can
  create. **This is the gate that authorises the publish job.**

**8. Add the CI pipeline.**

Create `.gitlab-ci.yml` at the repo root with the contents shown in
[§6 Automated release pipeline](#6-automated-release-pipeline-gitlab-ciyml).
Commit and push.

Wait for the verify+build pipeline on `main` to go green.

**9. Add the merge request template + CODEOWNERS.**

`.gitlab/merge_request_templates/default.md`:

```md
## What changed

## Why

## Bump
- [ ] patch
- [ ] minor
- [ ] major

## CHANGELOG entry added
- [ ] under `## Unreleased`

## Visual diff (component changes)
<!-- attach Figma + Storybook screenshots -->

## Migration notes (if major)
```

`.gitlab/CODEOWNERS`:

```
* @ifmis-design-system-maintainers
/.gitlab-ci.yml @ifmis-platform
/PUBLISHING.md  @ifmis-platform
```

Commit and push.

**10. Cut the release.**

On a clean working tree, on `main`:

```bash
git switch main
git pull --rebase
npm version 0.1.0 -m "release: %s"        # commits + tags v0.1.0
git push origin main --follow-tags
```

The push triggers two jobs:

- **`build`** — runs on the commit, produces `dist/`.
- **`publish`** — runs on the `v0.1.0` tag, posts the package to the
  registry.

Watch the pipeline in the GitLab UI. When `publish` goes green, browse to
**Deploy → Package Registry** on the project — `@ifmis/ui` `0.1.0` is
listed.

**11. Verify a consumer can install.**

In any other GitLab project (or a scratch dir on your machine):

```bash
# .npmrc at the consumer's repo root
@ifmis:registry=https://gitlab.example.com/api/v4/projects/<UI_PROJECT_ID>/packages/npm/
//gitlab.example.com/api/v4/projects/<UI_PROJECT_ID>/packages/npm/:_authToken=${NPM_READ_TOKEN}
```

```bash
export NPM_READ_TOKEN=<your read-only token>
npm install @ifmis/ui@0.1.0 react react-dom
```

The install should succeed and `node_modules/@ifmis/ui/dist/index.js`
should be present.

**12. Publish the Storybook site (optional but strongly recommended).**

Add the `pages` job from [§12](#12-storybook-deployment-gitlab-pages) and
push. After the next tag, Storybook is browsable at
`https://ifmis.gitlab.example.com/ui/` (path depends on your GitLab Pages
config — check **Deploy → Pages** for the actual URL).

**13. Announce.**

Post in `#ifmis-platform`:

> `@ifmis/ui` `0.1.0` is live. Install:
> `npm install @ifmis/ui@0.1.0` (after wiring `.npmrc` per
> §7.1). Storybook: `<url>`. CHANGELOG: `<url>`.

You're done. Future releases follow [§4 The release flow](#4-the-release-flow-tldr).

### 0.4 Self-hosted GitLab — differences vs gitlab.com

Almost nothing. The flow is identical because GitLab's npm registry API
shape (`/api/v4/projects/:id/packages/npm/`) is the same everywhere. The
*only* differences are:

| Concern               | Self-hosted                                              | gitlab.com                              |
| --------------------- | -------------------------------------------------------- | --------------------------------------- |
| Registry URL          | `https://<your-host>/api/v4/projects/<id>/packages/npm/` | `https://gitlab.com/api/v4/…`           |
| GitLab Pages URL      | Whatever your admin configured (often a sub-domain).     | `https://<group>.gitlab.io/<project>/`  |
| CI runner             | Your own runner — check it's tagged and online.          | GitLab.com shared runners (default).    |
| TLS cert              | Make sure your runner trusts the GitLab CA.              | Trusted out of the box.                 |
| Outbound npm registry | You may proxy npm.js through Nexus/Artifactory.          | Direct.                                 |

If your self-hosted GitLab uses a private CA, the CI runners need that CA
in their trust store; otherwise `npm publish` fails with `self-signed
certificate in certificate chain`. Fix it in the runner image, not by
disabling TLS verification.

### 0.5 Smoke-test checklist

Paste this into the `v0.1.0` release MR:

```md
## v0.1.0 launch smoke test
- [ ] `npm ci`, `npm run typecheck`, `npm run lint`, `npm test` all green
- [ ] `npm run build` produces a non-empty `dist/`
- [ ] `npm run build-storybook` produces a non-empty `storybook-static/`
- [ ] Tag `v0.1.0` created via `npm version`
- [ ] CI: `verify` ✅, `build` ✅, `publish` ✅
- [ ] Package visible in **Deploy → Package Registry**
- [ ] Consumer install succeeds with the published `.npmrc`
- [ ] Storybook visible at the GitLab Pages URL
- [ ] Announcement posted in `#ifmis-platform`
```

---

---

## 1. Who this is for

| Reader                | What you do                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| **Library maintainer**| Merges MRs, cuts releases, owns the CI pipeline. Reads §3–§11.               |
| **Library contributor**| Opens MRs that touch components, tokens or docs. Reads §5, §8, §12.         |
| **Consumer team**     | Installs `@ifmis/ui` in a module/page. Reads §7.                             |

Anyone publishing for the first time must read §3 end-to-end.

---

## 2. Concepts

- **Package registry** — GitLab ships an npm-compatible registry on every
  project (`Settings → Packages and registries`). We publish there; consumer
  apps install from there.
- **Scoped package** — we publish under the `@ifmis` scope. Scoped packages
  let us point a whole scope at a private registry without touching the
  global npm config.
- **Project access token (PAT)** — an auth token attached to **this Git
  project**, with `api`, `read_registry`, `write_registry` scopes. CI uses it
  to publish; consumers use it to read.
- **Build artifact** — the `dist/` folder produced by `npm run build`
  (declared in `package.json#files`). Nothing else ships to the registry.
- **Tag-driven release** — pushing a Git tag of the form `vX.Y.Z` triggers
  the publish job. The Git tag is the **release contract**.

---

## 3. One-time setup

### 3.1 Configure `package.json`

Pin the package to the GitLab registry for publishing. This is already done
in this repo but documented here so future maintainers can verify:

```jsonc
{
  "name": "@ifmis/ui",
  "version": "0.1.0",
  "publishConfig": {
    "@ifmis:registry": "https://gitlab.example.com/api/v4/projects/<PROJECT_ID>/packages/npm/",
    "access": "restricted"
  },
  "repository": {
    "type": "git",
    "url": "git+https://gitlab.example.com/ifmis/ui.git"
  },
  "files": ["dist"]
}
```

Replace `<PROJECT_ID>` with the numeric ID from GitLab (`Settings → General`).

> **Why a project-scoped registry?** It scopes auth, audit and quota to this
> one project. The group-scoped registry works too but pulls in everyone.

### 3.2 Create CI tokens

In **`Settings → Access Tokens`** create two **project access tokens**:

| Token name          | Scopes                            | Role      | Used by                                  |
| ------------------- | --------------------------------- | --------- | ---------------------------------------- |
| `ui-publish-bot`    | `api`, `write_registry`           | Maintainer| CI publishing job.                       |
| `ui-read-only`      | `read_api`, `read_registry`       | Reporter  | Consumer projects, distributed via Vault.|

Store both in **`Settings → CI/CD → Variables`** as **protected, masked**:

- `NPM_PUBLISH_TOKEN` = the publish token's value
- `NPM_READ_TOKEN`    = the read-only token (used by consumer pipelines)

Never commit either token to the repo.

### 3.3 Confirm CODEOWNERS

`.gitlab/CODEOWNERS` (create if missing) must require library maintainers'
review on every merge to `main`:

```
# Anything in this repo needs design-system owners' sign-off
* @ifmis-design-system-maintainers

# The publish pipeline is privileged — extra eyes
/.gitlab-ci.yml          @ifmis-platform
/PUBLISHING.md           @ifmis-platform
```

### 3.4 Protect `main` and tags

In **`Settings → Repository`**:

- Protect **`main`** — only Maintainers can push; merges require MR + 1
  approval + green pipeline.
- Protect tags matching `v*` — only Maintainers can create them. This is
  what gates the publish job.

### 3.5 Local `.npmrc` for first manual publish

If you ever need to publish manually (e.g. to bootstrap), create a local
`~/.npmrc` (NOT in the repo):

```
@ifmis:registry=https://gitlab.example.com/api/v4/projects/<PROJECT_ID>/packages/npm/
//gitlab.example.com/api/v4/projects/<PROJECT_ID>/packages/npm/:_authToken=${YOUR_PERSONAL_TOKEN}
```

Use **your own** GitLab personal access token with `write_registry` scope.

---

## 4. The release flow (TL;DR)

For every release, in order:

1. Land all changes via merge requests into `main`. Each MR must include a
   short **CHANGELOG entry** under `## Unreleased`.
2. On `main`, bump the version and move the CHANGELOG entry:

   ```bash
   # patch | minor | major — see §5
   npm version minor -m "release: %s"
   ```
   This commits `package.json` + tags `vX.Y.Z`.
3. Push the commit and the tag:

   ```bash
   git push origin main --follow-tags
   ```
4. GitLab CI runs the **publish** job (gated by the `vX.Y.Z` tag). When it
   goes green the package is live in the registry.
5. Announce in `#ifmis-platform` with the changelog excerpt + the migration
   notes (if any).

That's it. Every other section explains how to make this safe at scale.

---

## 5. Versioning policy (SemVer)

We follow **[Semantic Versioning 2.0.0](https://semver.org/)** strictly.
Given a version `MAJOR.MINOR.PATCH`:

| Bump      | When                                                               | Examples                                                     |
| --------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| **PATCH** | Backwards-compatible fix — no public-API surface change.           | Tweak a token value, fix a focus ring, fix a typo in a label.|
| **MINOR** | Backwards-compatible **addition** to the public API.               | New component, new variant, new prop with a safe default.    |
| **MAJOR** | Any **breaking** change — renamed/removed prop, changed default, changed visual that breaks consumer screens, renamed export. | Removing a deprecated prop, renaming `tone` values.          |

### Rules of thumb

- **A prop default change is a major.** Consumers rely on defaults.
- **Renaming a CSS token is a major** unless the old name keeps working as
  an alias for at least one minor.
- **Removing a deprecated thing is a major.** Deprecate in N (minor), remove
  in N+1 (major).
- **Storybook-only changes are patches** (or no bump at all if version stays).

### How we decide

The MR author proposes a bump in the description (`Bump: minor`). Reviewer
challenges it during review. On `main`, the maintainer running `npm version`
applies the agreed bump. If unsure, **bump up** — extra majors are cheap;
silent breakage is not.

### Pre-1.0 caveat

While `0.x`, MINOR is the de-facto MAJOR (a 0.y → 0.(y+1) bump may break).
We will cut **`1.0.0`** as soon as the API has settled across at least two
consumer modules.

---

## 6. Automated release pipeline (`.gitlab-ci.yml`)

The pipeline has three concerns: **verify** (always), **build** (always),
**publish** (only on `vX.Y.Z` tags). Sketch:

```yaml
# .gitlab-ci.yml
default:
  image: node:20-alpine
  cache:
    key:
      files: [package-lock.json]
    paths: [.npm]

stages: [verify, build, publish]

# --- VERIFY: runs on every push and MR ---------------------------------
verify:
  stage: verify
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run typecheck
    - npm run lint
    - npm test

# --- BUILD: produce dist/, kept as an artifact -------------------------
build:
  stage: build
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run build
  artifacts:
    paths: [dist/]
    expire_in: 7 days

# --- PUBLISH: only on a vX.Y.Z tag -------------------------------------
publish:
  stage: publish
  needs: [build]
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
  before_script:
    # Cross-check: tag must match the version in package.json
    - PKG_VERSION=$(node -p "require('./package.json').version")
    - if [ "v$PKG_VERSION" != "$CI_COMMIT_TAG" ]; then
        echo "Tag $CI_COMMIT_TAG does not match package.json $PKG_VERSION"; exit 1;
      fi
    # Authenticate to the GitLab registry
    - echo "@ifmis:registry=${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/npm/" > .npmrc
    - echo "${CI_API_V4_URL#https:}/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${NPM_PUBLISH_TOKEN}" >> .npmrc
  script:
    - npm publish
  environment:
    name: registry
    url: ${CI_PROJECT_URL}/-/packages
```

Key safety properties:

- **Tag ↔ `package.json` must match** — the publish job exits non-zero if
  they don't, preventing the classic "tag bumped, code not bumped" footgun.
- **`needs: [build]`** — publish reuses the verified artifact; no second
  build that could differ.
- **`rules` over `only/except`** — modern syntax, easier to reason about.
- **`.npmrc` is built at runtime** with a CI variable; the token never
  appears in the repo.

If you change this file, **bump the pipeline version comment at the top**
(`# pipeline v3`) and call it out in the MR description.

---

## 7. Consuming the package

### 7.1 Consumer `.npmrc`

Each consumer project that uses `@ifmis/ui` needs an `.npmrc` at its repo
root:

```
@ifmis:registry=https://gitlab.example.com/api/v4/projects/<UI_PROJECT_ID>/packages/npm/
//gitlab.example.com/api/v4/projects/<UI_PROJECT_ID>/packages/npm/:_authToken=${NPM_READ_TOKEN}
```

- `NPM_READ_TOKEN` is the **read-only** token from §3.2, injected via Vault
  / CI variables — **never committed in plain text**.
- Local devs export it once in their shell profile.

### 7.2 Install

```bash
npm install @ifmis/ui
```

Peer deps (`react`, `react-dom`) come from the host app.

### 7.3 Use

```jsx
// Import the styles ONCE at the app root
import "@ifmis/ui/styles.css";

// Then use components anywhere
import { Button, ActionCard, ThemeProvider } from "@ifmis/ui";

export function App() {
  return (
    <ThemeProvider theme="purple">
      <ActionCard
        tone="pending"
        title="Pending"
        heading="Quarterly report"
        onCancel={discard}
        onOpen={open}
      />
    </ThemeProvider>
  );
}
```

### 7.4 Pinning

Pin to a **minor range** (`^1.4.0`) to receive backwards-compatible patches
automatically. Pin **exactly** (`1.4.0`) only in environments where you
explicitly want to defer upgrades.

---

## 8. Day-2: making changes

### 8.1 Branching

| Branch         | Purpose                                                            |
| -------------- | ------------------------------------------------------------------ |
| `main`         | Always releasable. Protected. Merges only via approved MRs.        |
| `feat/*`       | Single feature or change. Short-lived.                             |
| `fix/*`        | Bug fix targeting current minor.                                   |
| `chore/*`      | Build, tooling, docs-only.                                         |
| `release/x.y`  | Long-lived only when supporting an older minor (see §9 hotfix).    |

### 8.2 Merge request checklist

Every MR description must answer:

- [ ] **What** changed (one sentence).
- [ ] **Why** (link the ticket or screenshot of the Figma frame).
- [ ] **Bump**: `patch` / `minor` / `major` — see §5.
- [ ] **CHANGELOG entry added** under `## Unreleased`.
- [ ] **Visual diff** attached for any component change (Storybook screenshot
      or Figma frame side-by-side).
- [ ] **Migration notes** if the bump is `major`.

The MR template lives at `.gitlab/merge_request_templates/default.md` —
update it if these requirements change.

### 8.3 What a normal change looks like

```bash
git switch -c feat/badge-warning-variant
# edit Badge.tsx, Badge.stories.tsx, Badge.mdx, Badge.test.tsx
npm run typecheck && npm run lint && npm test
git commit -am "feat(badge): add 'warning' variant"
git push -u origin feat/badge-warning-variant
# open MR → review → merge to main → cut release per §4
```

### 8.4 CHANGELOG

We keep a hand-written `CHANGELOG.md` following the
[Keep a Changelog](https://keepachangelog.com/) format. On release the
maintainer moves the `## Unreleased` block under the new version header:

```md
## [1.5.0] — 2026-05-29
### Added
- `Badge` variant `warning` (yellow tone).
- `ActionCard` exposes `useActionCardTone()` for compound consumers.

### Fixed
- `Toggle` focus ring no longer clipped on small size.
```

---

## 9. Hotfix flow

For a critical fix to an older minor (e.g. you're on `1.5.x` but a consumer
still depends on `1.4.x`):

1. Create a `release/1.4` branch from the tag `v1.4.<last>` if it doesn't
   exist.
2. Cherry-pick or apply the fix.
3. Bump as **patch** in that branch (`npm version patch`).
4. Push tag — CI publishes `1.4.<next>` to the registry.
5. Cherry-pick the fix forward to `main` if not already there. **Do not
   merge `release/1.4` into `main`** — keep the histories separate.

We only maintain hotfix branches for **the latest two minors** unless an
exception is agreed in writing with platform leadership.

---

## 10. Pre-release / canary builds

For testing a risky change with a single consumer before promoting it:

```bash
# In a feature branch:
npm version prerelease --preid=rc -m "rc: %s"   # → 1.5.0-rc.0
git push origin <branch> --follow-tags
```

The CI publishes the rc tag if the `vX.Y.Z-rc.N` regex is added to the
pipeline rule. Consumers opt in:

```bash
npm install @ifmis/ui@rc
```

Pre-release tags **must never** be merged back as-is — once the change is
validated, drop the `-rc.N` suffix and publish a stable version.

---

## 11. Deprecating, yanking, and rollback

### Deprecate (preferred)

Mark the old API with `@deprecated` JSDoc, log a one-time `console.warn`
behind `process.env.NODE_ENV !== "production"`, and keep it working for at
least **one minor**. Document the replacement in the CHANGELOG.

### Yank (registry-level)

If a published version is broken, **don't republish the same number** —
publish a new patch with the fix, then deprecate the broken one:

```bash
npm deprecate @ifmis/ui@1.5.2 "Broken, use >=1.5.3 — see CHANGELOG"
```

(Run against the GitLab registry by pointing your local `.npmrc` at it.)

GitLab does support deleting a package version via the API, but **prefer
deprecation**: deletion leaves consumers with mysterious 404s while
deprecation gives them a clear message.

### Consumer rollback

```bash
npm install @ifmis/ui@1.5.1
```

Pin and ship a patch to the consumer; once the library issue is fixed,
unpin to resume getting updates.

---

## 12. Storybook deployment (GitLab Pages)

The component playground is the human-facing API doc. We host it on **GitLab
Pages** so every released minor has a browsable Storybook.

```yaml
# Add to .gitlab-ci.yml
pages:
  stage: publish
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run build-storybook -- -o public
  artifacts:
    paths: [public]
```

The site lands at
`https://ifmis.gitlab.io/ui/` and is updated on every stable release. For
a multi-version index (1.4, 1.5, 1.6, …), have the `build-storybook` step
write to `public/<version>/` and update a small index page that lists each.

---

## 13. Troubleshooting

| Symptom                                                            | Likely cause                                          | Fix                                                       |
| ------------------------------------------------------------------ | ----------------------------------------------------- | --------------------------------------------------------- |
| `npm publish` → `401 Unauthorized`                                 | `NPM_PUBLISH_TOKEN` missing / wrong scope.            | Re-mint with `write_registry`, re-add to CI variables.    |
| `npm install @ifmis/ui` → `404`                                    | Consumer `.npmrc` is missing or scope is wrong.       | Follow §7.1 exactly. Confirm `@ifmis` scope is mapped.    |
| `npm install` → `401` for consumer                                 | `NPM_READ_TOKEN` expired / not injected.              | Rotate token in §3.2 and update Vault / CI variables.     |
| CI publishes but `dist` is empty                                   | `package.json#files` regressed; build artifact missing.| Ensure `"files": ["dist"]` and `build` job artifacts are wired into `publish`. |
| `npm version` refused because workspace is dirty                   | Uncommitted changes in `main`.                        | Commit or stash; `npm version` only works on a clean tree.|
| Tag exists in Git but no package version appears                   | Publish job failed; tag was created before CI passed. | Re-run the failed job; never delete the tag — fix forward.|
| Two MAJORs merged in one release                                   | CHANGELOG didn't surface them; reviewer missed.       | Add a "Bump audit" item to the MR template.               |

Capture every new failure mode here as it's solved. The README explains
**how**; this section explains **what's gone wrong**.

---

## 14. Glossary

- **`@ifmis` scope** — the npm package-name prefix that maps to the GitLab
  registry via `.npmrc`. All our packages live under it.
- **Project access token (PAT)** — GitLab token bound to *this* project,
  with fine-grained scopes (`api`, `read_registry`, `write_registry`).
- **Protected variable** — CI variable visible only to protected branches /
  tags. Use this for any token.
- **Masked variable** — CI variable redacted from job logs. Use this for any
  token, alongside `protected`.
- **Distribution tag** — npm concept (`latest`, `rc`, `next`). `npm install
  @ifmis/ui@<tag>` resolves to whatever version is tagged.
- **Build artifact** — the `dist/` directory produced by `vite build`,
  declared in `package.json#files`. This is what consumers receive.

---

## Appendix: a checklist you can paste into the release MR

```md
## Release `vX.Y.Z`

- [ ] `npm run typecheck` clean
- [ ] `npm run lint` clean
- [ ] `npm test` green
- [ ] CHANGELOG `## Unreleased` block moved under `## [X.Y.Z]`
- [ ] Bump rationale: `patch` / `minor` / `major` because …
- [ ] Migration notes attached (if `major`)
- [ ] Storybook builds locally (`npm run build-storybook`)
- [ ] Tag pushed (`git push origin main --follow-tags`)
- [ ] Publish job green; package visible in registry
- [ ] Announcement posted in `#ifmis-platform`
```

— end —
