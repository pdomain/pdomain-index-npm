---
Status: retired
Owner: repository maintainers
Created: 2026-05-17
Last verified: 2026-07-19
Kind: issue
Level: I1
---

# Create the GitHub repo + initial scaffold

## Agent Index

- **Kind:** issue
- **Status:** retired
- **Level:** I1
- **Last verified:** 2026-07-19
- **Resolution:** Resolved
- **Severity:** Low - scaffold task, fully shipped
- **Affected version:** `master` at the GitHub Issues cutover
- **Read when:** tracing the origin of the repository scaffold.
- **Search terms:** repo scaffold, initial setup, package.json, Makefile, GitHub issue 2
- **Relates to:** [Current State](../context/current-state.md), [README](../../README.md), [migration ledger](../context/github-issues-migration-ledger.md)

## Summary

A build-out task tracking creation of the GitHub repository and its initial scaffold. The body carries no detail beyond a pointer to a plan file absent from this repository's history.

## GitHub provenance

- **Node ID:** `I_kwDOSfngyM8AAAABCgcGeg`
- **Number and URL:** [#2](https://github.com/pdomain/pdomain-index-npm/issues/2)
- **Former state:** OPEN (state reason `none`)
- **Author:** `ConcaveTrillion`
- **Created:** 2026-05-17T10:41:32Z
- **Updated:** 2026-05-17T10:41:32Z
- **Closed:** None
- **Labels:** `kind:feature`, `status:backlog`
- **Milestone:** spec: pd-index-npm-new-repo (#1)
- **Assignees, issue type, project items, parent and sub-issues, reactions, attachments:** None
- **Comments:** 0
- **Raw SHA-256:** `8c7a4d1bf10989f4bb9cd5d90d90f8b2cd904c2ce7b3bb78ef16d9a3ce2422a8`
- **Raw record:** `migration/github-issues/raw/issue-2.json`

## Original body (verbatim)

```text
Approach: (see plan)

Plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md#create-the-github-repo-initial-scaffold
Tracks: #1
```

## Comments (verbatim)

None.

## Impact

- Blocked every later build-out task until the repository existed.
- No lasting impact: the scaffold is present and in use.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Original scope: @concavetrillion/* (renamed to @pdomain/* in f439db8, e45e654)
Referenced plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md (absent from this repo's history)
Scaffold files: package.json, Makefile, tsconfig.json
```

## Evidence

1. Commit `5fd3d1d` creates the scaffold.
2. `package.json`, `Makefile`, and `tsconfig.json` are present in the working tree and drive the current CI gate.

## Root-cause hypotheses

Not applicable. This was a build-out task, not a defect report, so there is no failure to explain. The issue body carried no analysis of its own: it read `Approach: (see plan)` and pointed at a plan file that does not exist in this repository's Git history. The implementation commits listed under Evidence are the surviving record of what was actually built.

## Defects to fix

None. The scaffold shipped.

## Next steps

None. Current repository state is recorded in [Current State](../context/current-state.md).

## Outcome

Completed. The scaffold exists in the working tree. Evidence: commit `5fd3d1d`; `package.json`; `Makefile`; `tsconfig.json`.

## Resolution

_Retired._ Durable content lives in the governed docs named above. This record is archived in Git history; see the [migration ledger](../context/github-issues-migration-ledger.md) for the removal commit.
