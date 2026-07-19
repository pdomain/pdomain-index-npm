---
Status: active
Owner: repository maintainers
Created: 2026-07-15
Last verified: 2026-07-19
Kind: process
Level: I1
---

# Issues

## Agent Index

- **Kind:** process
- **Status:** active
- **Level:** I1
- **Last verified:** 2026-07-19
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

Eleven migrated GitHub issues resolved before the tracker cutover. Their full
records — GitHub provenance, original bodies and comments verbatim, evidence,
and root-cause analysis — were committed and then removed from the working
tree. **Git history is the archive.**

Retrieve any of them with:

```bash
git show c64df8e --stat                    # list all 11 records
git show c64df8e:docs/issues/<filename>    # read one record
```

| Issue | Record filename                                           |
| ----- | --------------------------------------------------------- |
| #1    | `2026-05-17-gh-001-spec-static-npm-registry.md`           |
| #2    | `2026-05-17-gh-002-create-repo-scaffold.md`               |
| #3    | `2026-05-17-gh-003-wire-github-pages.md`                  |
| #4    | `2026-05-17-gh-004-registry-layout-and-rebuild-script.md` |
| #5    | `2026-05-17-gh-005-publish-script.md`                     |
| #6    | `2026-05-17-gh-006-publish-workflow.md`                   |
| #8    | `2026-05-17-gh-008-consumer-docs-and-npmrc.md`            |
| #9    | `2026-05-17-gh-009-workspace-integration.md`              |
| #10   | `2026-05-22-gh-010-validate-tarball-package-names.md`     |
| #11   | `2026-05-22-gh-011-prerelease-semver-ordering.md`         |
| #12   | `2026-05-22-gh-012-broken-smoke-script.md`                |

Durable behavior from these issues lives in
[Registry Format](../architecture/registry-format.md). Provenance, digests, and
outcomes live in the
[migration ledger](../context/github-issues-migration-ledger.md). The raw API
exports remain in the working tree under `migration/github-issues/raw/`.
