---
Status: retired
Owner: repository maintainers
Created: 2026-05-17
Last verified: 2026-07-19
Kind: issue
Level: I1
---

# Write the `publish.ts` script that adds one tarball to the index

## Agent Index

- **Kind:** issue
- **Status:** retired
- **Level:** I1
- **Last verified:** 2026-07-19
- **Resolution:** Resolved
- **Severity:** Low - approach replaced by full regeneration
- **Affected version:** `master` at the GitHub Issues cutover
- **Read when:** asking why there is no incremental publish script.
- **Search terms:** publish.ts, incremental publish, tarball, regeneration, GitHub issue 5
- **Relates to:** [Registry Format](../architecture/registry-format.md), [Intent Map](../context/intent-map.md), [migration ledger](../context/github-issues-migration-ledger.md)

## Summary

A build-out task for a `publish.ts` script that would add one tarball to the index at a time. The body carries no detail beyond a pointer to a plan file absent from this repository's history. Incremental publishing was replaced by full regeneration on every trigger.

## GitHub provenance

- **Node ID:** `I_kwDOSfngyM8AAAABCgcGww`
- **Number and URL:** [#5](https://github.com/pdomain/pdomain-index-npm/issues/5)
- **Former state:** OPEN (state reason `none`)
- **Author:** `ConcaveTrillion`
- **Created:** 2026-05-17T10:41:34Z
- **Updated:** 2026-05-17T10:41:34Z
- **Closed:** None
- **Labels:** `kind:feature`, `status:backlog`
- **Milestone:** spec: pd-index-npm-new-repo (#1)
- **Assignees, issue type, project items, parent and sub-issues, reactions, attachments:** None
- **Comments:** 0
- **Raw SHA-256:** `ca30e27bf604912ff00c3bd59cfcaf87c36cbf29e51f87825eae9dac86bf0a60`
- **Raw record:** `migration/github-issues/raw/issue-5.json`

## Original body (verbatim)

```text
Approach: (see plan)

Plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md#write-the-publishts-script-that-adds-one-tarball-t
Tracks: #1
```

## Comments (verbatim)

None.

## Impact

- There is no per-tarball publish path, by design.
- Every trigger rebuilds the whole allowlisted index, which costs more time but removes a class of partial-state bugs.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Original scope: @concavetrillion/* (renamed to @pdomain/* in f439db8, e45e654)
Referenced plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md (absent from this repo's history)
Replacement: full allowlisted regeneration in scripts/regen-index.ts
```

## Evidence

1. Commits `c4acf69` and `5658708` build the original incremental path.
2. Commits `bc011b5` and `15f75de` replace and then remove it.
3. `scripts/regen-index.ts` performs a full scan of allowlisted releases on every run.

## Root-cause hypotheses

Not applicable. This was a build-out task, not a defect report, so there is no failure to explain. The issue body carried no analysis of its own: it read `Approach: (see plan)` and pointed at a plan file that does not exist in this repository's Git history. The implementation commits listed under Evidence are the surviving record of what was actually built.

## Defects to fix

None. The capability was intentionally dropped, not lost.

## Next steps

None required. Incremental regeneration remains an optional deferred item in the [intent map](../context/intent-map.md).

## Outcome

Superseded. Incremental publish was replaced by full allowlisted regeneration on every trigger, which removed the need for a per-tarball publish path. The legacy script was removed in `15f75de`. Incremental regeneration remains recorded as deferred intent in the [intent map](../context/intent-map.md). Evidence: commits `c4acf69`, `5658708`, `bc011b5`, `15f75de`.

## Resolution

_Retired._ Durable content lives in the governed docs named above. This record is archived in Git history; see the [migration ledger](../context/github-issues-migration-ledger.md) for the removal commit.
