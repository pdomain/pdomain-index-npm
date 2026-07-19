---
Status: retired
Owner: repository maintainers
Created: 2026-05-17
Last verified: 2026-07-19
Kind: issue
Level: I1
---

# Consumer documentation in README + `.npmrc` example

## Agent Index

- **Kind:** issue
- **Status:** retired
- **Level:** I1
- **Last verified:** 2026-07-19
- **Resolution:** Resolved
- **Severity:** Low - documentation task, fully shipped
- **Affected version:** `master` at the GitHub Issues cutover
- **Read when:** asking where consumer installation instructions live.
- **Search terms:** consumer docs, .npmrc, registry override, install instructions, GitHub issue 8
- **Relates to:** [README](../../README.md), [migration ledger](../context/github-issues-migration-ledger.md)

## Summary

A build-out task for consumer documentation in the README plus an `.npmrc` example. The body carries no detail beyond a pointer to a plan file absent from this repository's history.

## GitHub provenance

- **Node ID:** `I_kwDOSfngyM8AAAABCgcHqA`
- **Number and URL:** [#8](https://github.com/pdomain/pdomain-index-npm/issues/8)
- **Former state:** OPEN (state reason `none`)
- **Author:** `ConcaveTrillion`
- **Created:** 2026-05-17T10:41:36Z
- **Updated:** 2026-05-17T10:41:36Z
- **Closed:** None
- **Labels:** `kind:feature`, `status:backlog`
- **Milestone:** spec: pd-index-npm-new-repo (#1)
- **Assignees, issue type, project items, parent and sub-issues, reactions, attachments:** None
- **Comments:** 0
- **Raw SHA-256:** `f070aa83464e295262837e57d2eb94407d41cf43d2708eb576bb8b4efa59e204`
- **Raw record:** `migration/github-issues/raw/issue-8.json`

## Original body (verbatim)

```text
Approach: (see plan)

Plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md#consumer-documentation-in-readme-npmrc-example
Tracks: #1
```

## Comments (verbatim)

None.

## Impact

- Without it, consumers had no documented way to point npm at this registry.
- The shipped examples use the renamed `@pdomain/*` scope.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Original scope: @concavetrillion/* (renamed to @pdomain/* in f439db8, e45e654)
Referenced plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md (absent from this repo's history)
Shipped artifacts: README consumer section, examples/consumer-.npmrc
```

## Evidence

1. Commit `8739278` adds the consumer documentation.
2. Commits `f439db8` and `e45e654` update it for the scope rename.
3. `examples/consumer-.npmrc` is present in the working tree.

## Root-cause hypotheses

Not applicable. This was a build-out task, not a defect report, so there is no failure to explain. The issue body carried no analysis of its own: it read `Approach: (see plan)` and pointed at a plan file that does not exist in this repository's Git history. The implementation commits listed under Evidence are the surviving record of what was actually built.

## Defects to fix

None. The documentation shipped.

## Next steps

None. The README is the live consumer reference.

## Outcome

Completed. Consumer instructions and the `.npmrc` example shipped. Evidence: commits `8739278`, `f439db8`, `e45e654`; `examples/consumer-.npmrc`; README consumer section.

## Resolution

_Retired._ Durable content lives in the governed docs named above. This record is archived in Git history; see the [migration ledger](../context/github-issues-migration-ledger.md) for the removal commit.
