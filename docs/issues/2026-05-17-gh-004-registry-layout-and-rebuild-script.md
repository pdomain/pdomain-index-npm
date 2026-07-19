---
Status: retired
Owner: repository maintainers
Created: 2026-05-17
Last verified: 2026-07-19
Kind: issue
Level: I1
---

# Define the on-disk registry layout + write the `rebuild-packuments` script

## Agent Index

- **Kind:** issue
- **Status:** retired
- **Level:** I1
- **Last verified:** 2026-07-19
- **Resolution:** Resolved
- **Severity:** Low - layout kept, script replaced
- **Affected version:** `master` at the GitHub Issues cutover
- **Read when:** tracing the origin of the on-disk registry layout or the removed rebuild script.
- **Search terms:** registry layout, packument, rebuild-packuments, directory layout, GitHub issue 4
- **Relates to:** [Registry Format](../architecture/registry-format.md), [migration ledger](../context/github-issues-migration-ledger.md)

## Summary

A build-out task defining the on-disk registry layout and a `rebuild-packuments` script. The body carries no detail beyond a pointer to a plan file absent from this repository's history. The layout survives; the script does not.

## GitHub provenance

- **Node ID:** `I_kwDOSfngyM8AAAABCgcGrA`
- **Number and URL:** [#4](https://github.com/pdomain/pdomain-index-npm/issues/4)
- **Former state:** OPEN (state reason `none`)
- **Author:** `ConcaveTrillion`
- **Created:** 2026-05-17T10:41:33Z
- **Updated:** 2026-05-17T10:41:34Z
- **Closed:** None
- **Labels:** `kind:feature`, `status:backlog`
- **Milestone:** spec: pd-index-npm-new-repo (#1)
- **Assignees, issue type, project items, parent and sub-issues, reactions, attachments:** None
- **Comments:** 0
- **Raw SHA-256:** `dd5bb1e74da7b83593c628d67ada29f1b95b0dfc74a0fd17273b8f8590a8e964`
- **Raw record:** `migration/github-issues/raw/issue-4.json`

## Original body (verbatim)

```text
Approach: (see plan)

Plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md#define-the-on-disk-registry-layout-write-the-rebui
Tracks: #1
```

## Comments (verbatim)

None.

## Impact

- The layout this task established is still the served layout.
- References to `rebuild-packuments` in later issues point at code that no longer exists.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Original scope: @concavetrillion/* (renamed to @pdomain/* in f439db8, e45e654)
Referenced plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md (absent from this repo's history)
Replacement script: scripts/regen-index.ts (rebuild-packuments.ts removed in 15f75de)
```

## Evidence

1. Commits `d3ceee2`, `4dd5264`, and `bc011b5` establish the layout and the original script.
2. Commit `15f75de` removes the legacy publishing path.
3. [Registry Format](../architecture/registry-format.md) sections "Directory layout" and "Packument JSON shape" document the surviving layout.
4. `tests/test_regen_index.test.ts` covers the generated output.

## Root-cause hypotheses

Not applicable. This was a build-out task, not a defect report, so there is no failure to explain. The issue body carried no analysis of its own: it read `Approach: (see plan)` and pointed at a plan file that does not exist in this repository's Git history. The implementation commits listed under Evidence are the surviving record of what was actually built.

## Defects to fix

None. The layout shipped and the script was deliberately replaced.

## Next steps

None. The layout is recorded in [Registry Format](../architecture/registry-format.md).

## Outcome

Superseded. The on-disk layout survives and is documented under [Registry Format](../architecture/registry-format.md) sections "Directory layout" and "Packument JSON shape". The `rebuild-packuments` script itself was replaced by `scripts/regen-index.ts` and removed in `15f75de`. Evidence: commits `d3ceee2`, `4dd5264`, `bc011b5`, `15f75de`; `tests/test_regen_index.test.ts`.

## Resolution

_Retired._ Durable content lives in the governed docs named above. This record is archived in Git history; see the [migration ledger](../context/github-issues-migration-ledger.md) for the removal commit.
