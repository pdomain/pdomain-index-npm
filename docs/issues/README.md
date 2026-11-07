---
Status: active
Owner: repository maintainers
Created: 2026-07-15
Last verified: 2026-11-06
Kind: process
Level: I1
---

# Issues

## Agent Index

- **Kind:** process
- **Status:** active
- **Level:** I1
- **Last verified:** 2026-11-06
- **Read when:** filing a bug report, or checking which issues are still open.
- **Search terms:** issues folder, bug report, remaining work, issue template,
  issue lifecycle, kind issue.

## Open issues

- Publish does not run the clean-directory install check.

  See the [Automated live smoke plan](../plans/2026-07-21-automated-live-smoke.md) and [Decide whether deployments need an automated live smoke](2026-05-17-gh-007-automated-live-smoke.md).

- Thirteen `dep-refresh/*` branches were still on origin on 2026-11-06. `delete_branch_on_merge` is still false.

  See [dep-refresh branches accumulate on origin instead of being deleted after merge](2026-08-08-dep-refresh-cannot-auto-land.md).

The same open items are listed in [Remaining work](../roadmap.md).

Shipped registry behavior is [Registry Format](../architecture/registry-format.md).

Eleven migrated GitHub issue records were removed from the tree after commit `c64df8e`.

List those filenames with `git show c64df8e --stat`.

Provenance is in the [migration ledger](../context/github-issues-migration-ledger.md).

## What this folder holds

`docs/issues/` holds governed issue reports: bugs, silent failures, regressions, and investigations that need a durable record.

Each report is a docgraph node.

## Rules for each issue file

- **Location:** `docs/issues/`
- **Filename:** `YYYY-MM-DD-short-slug.md`. Use the creation date plus a short kebab slug.
- **Metadata:** YAML frontmatter and a matching `## Agent Index` block.

  Keep frontmatter `Status:` and Agent Index `Status:` identical. A mismatch trips a `field_conflict`.

  - `Kind: issue`
  - `Level:` `I1` for repo-wide scope, `I2` for a narrow scope.
  - `Status:` is the governed lifecycle, not the issue's open or closed state.
- **Issue state versus governed status:** The docgraph lifecycle is `draft → active → implemented → retired`.

  Put the issue's own state on a **`Resolution:`** line in the Agent Index and in a final `## Resolution` section. The values are `Open`, `Resolved`, `Won't fix`, or `Duplicate`.

  - **Open** maps to `Status: active`.
  - **Resolved, Won't fix, or Duplicate** goes through `doc-retirer`, which deletes the report.

    1. Promote any fact a reader still needs into the architecture or process doc that owns it.
    2. Repoint inbound references.
    3. Drop the pointer in the open list above.
    4. Append a tombstone to `docs/context/decisions.md`.

    Git history keeps the report.

    Do not leave a resolved file in the tree.

- **Link it:** Reference every new issue from [Remaining work](../roadmap.md) and from `docs/context/intent-map.md` or `docs/context/current-state.md`.

  This file's open list also links the live issues.

- **Stage and reindex:** Under `mode = "git"` a new doc is invisible until `git add`.

  Stage it, then run `docgraph reindex` and `docgraph check --strict` in the same turn.

- **Template:** Copy `TEMPLATE.md` in this folder.

  A top-of-file `<!-- docgraph: ignore -->` marker excludes it from the index.

  Do not markdown-link to it from a governed doc. Refer to it by path in inline code.

## What to put in a report

- Summary
- Impact
- Environment/versions
- Evidence
- Root-cause hypotheses
- Defects to fix
- Recommended next steps
- What is NOT broken
- Resolution

Lead with the smallest decisive evidence.

Separate observation from hypothesis.

Always include What is NOT broken.
