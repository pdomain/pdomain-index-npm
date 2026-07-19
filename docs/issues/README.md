---
Status: active
Owner: repository maintainers
Created: 2026-07-15
Last verified: 2026-07-15
Kind: process
Level: I1
---

# Issues

## Agent Index

- **Kind:** process
- **Status:** active
- **Level:** I1
- **Last verified:** 2026-07-15
- **Read when:** filing a bug / defect / investigation report, or looking up an
  open issue's status, evidence, or resolution.
- **Search terms:** issues folder, bug report, defect report, issue template,
  issue lifecycle, kind issue.

## Purpose

`docs/issues/` holds **governed, evidence-bearing issue reports** — bugs, silent
failures, regressions, and investigations that need a durable, citable record
(not a throwaway chat summary). Each report is a docgraph node so it is
retrievable, linkable from specs/plans/context, and carried in the repo rather
than in per-machine harness memory.

## Convention

- **Location:** `docs/issues/`
- **Filename:** `YYYY-MM-DD-short-slug.md` (creation date + a terse kebab slug).
- **Metadata:** YAML frontmatter **and** a matching `## Agent Index` block. Keep
  frontmatter `Status:` and Agent Index `Status:` identical — a mismatch trips a
  `field_conflict` (→ `status-reconciler`).
  - `Kind: issue`
  - `Level:` informational scope — `I1` repo-wide, `I2` narrow/local.
  - `Status:` governed lifecycle, **not** the issue's open/closed state (see below).
- **Issue state vs governed status:** the docgraph lifecycle is
  `draft → active → implemented → retired`. Express the _issue's_ resolution state
  as a separate **`Resolution:`** line in the Agent Index (`Open` / `Resolved` /
  `Won't fix` / `Duplicate`) and a final `## Resolution` section. Map the governed
  `Status:`:
  - **Open** → `Status: active`.
  - **Resolved / Won't fix / Duplicate** → `Status: retired`, routed through
    `doc-retirer`, with the resolving commit/spec linked in `## Resolution`.
- **Link it (no orphans):** reference every new issue from a governed doc — by
  default an **Open issues** bullet in `docs/context/intent-map.md`, or a Risk in
  `docs/context/current-state.md`. This `README` also links the live issues below,
  which satisfies the no-orphan rule.
- **Stage + reindex:** under `mode = "git"` a new doc is invisible until
  `git add`ed; stage it, then `docgraph reindex` and `docgraph check --strict` the
  same turn (a new `dangling` blocks completion).
- **Template:** copy `TEMPLATE.md` in this folder. It is index-excluded (a
  top-of-file `<!-- docgraph: ignore -->` marker), so **do not markdown-link to
  it** from a governed doc — the link would dangle. Refer to it by path / inline
  code.

## Recommended structure

Summary · Impact · Environment/versions · Evidence (reproduction & diagnosis,
with commands/output) · Root-cause hypotheses (ranked) · Defects to fix ·
Recommended next steps · What is NOT broken (scopes the fix) · Resolution.

Lead with the **smallest decisive evidence**, separate **observation** from
**hypothesis**, and always include a **What is NOT broken** section.

## Open issues

- [Decide whether deployments need an automated live smoke](2026-05-17-gh-007-automated-live-smoke.md)

## Resolved issues

Migrated from the GitHub issue tracker. Each record carries its GitHub
provenance, its original body and comments verbatim, and the evidence that
resolved it. See the [migration ledger](../context/github-issues-migration-ledger.md)
for the full inventory.

- [Spec: Static npm registry on GitHub Pages](2026-05-17-gh-001-spec-static-npm-registry.md)
- [Create the GitHub repo + initial scaffold](2026-05-17-gh-002-create-repo-scaffold.md)
- [Wire GitHub Pages + the `gh-pages` content branch](2026-05-17-gh-003-wire-github-pages.md)
- [Define the on-disk registry layout + write the `rebuild-packuments` script](2026-05-17-gh-004-registry-layout-and-rebuild-script.md)
- [Write the `publish.ts` script that adds one tarball to the index](2026-05-17-gh-005-publish-script.md)
- [GitHub Action — `publish.yml`](2026-05-17-gh-006-publish-workflow.md)
- [Consumer documentation in README + `.npmrc` example](2026-05-17-gh-008-consumer-docs-and-npmrc.md)
- [Workspace integration — `.gitignore` anchor + CLAUDE.md notes](2026-05-17-gh-009-workspace-integration.md)
- [Validate tarball package names before writing registry paths](2026-05-22-gh-010-validate-tarball-package-names.md)
- [Fix prerelease semver ordering for dist-tags](2026-05-22-gh-011-prerelease-semver-ordering.md)
- [Fix broken npm smoke script](2026-05-22-gh-012-broken-smoke-script.md)
