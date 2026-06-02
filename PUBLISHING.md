# Publishing `@ifmis/ui`

This document is the **single source of truth** for releasing
`@ifmis/ui` to other IFMIS teams over **GitLab's npm Package Registry**.

It covers:

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
