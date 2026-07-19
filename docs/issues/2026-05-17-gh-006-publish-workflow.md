---
Status: retired
Owner: repository maintainers
Created: 2026-05-17
Last verified: 2026-07-19
Kind: issue
Level: I1
---

# GitHub Action — `publish.yml` (workflow_dispatch + repository_dispatch)

## Agent Index

- **Kind:** issue
- **Status:** retired
- **Level:** I1
- **Last verified:** 2026-07-19
- **Resolution:** Resolved
- **Severity:** Low - workflow replaced by regen.yml
- **Affected version:** `master` at the GitHub Issues cutover
- **Read when:** tracing why `publish.yml` no longer exists or how dispatch triggers work now.
- **Search terms:** publish.yml, workflow_dispatch, repository_dispatch, regen.yml, GitHub issue 6
- **Relates to:** [Registry Format](../architecture/registry-format.md), [Decisions](../context/decisions.md), [migration ledger](../context/github-issues-migration-ledger.md)

## Summary

A build-out task for a `publish.yml` GitHub Action triggered by `workflow_dispatch` and `repository_dispatch`. The body carries no detail beyond a pointer to a plan file absent from this repository's history. It shipped and was then replaced by the reusable `regen.yml` workflow.

## GitHub provenance

- **Node ID:** `I_kwDOSfngyM8AAAABCgcG4Q`
- **Number and URL:** [#6](https://github.com/pdomain/pdomain-index-npm/issues/6)
- **Former state:** OPEN (state reason `none`)
- **Author:** `ConcaveTrillion`
- **Created:** 2026-05-17T10:41:35Z
- **Updated:** 2026-05-17T10:41:35Z
- **Closed:** None
- **Labels:** `kind:feature`, `status:backlog`
- **Milestone:** spec: pd-index-npm-new-repo (#1)
- **Assignees, issue type, project items, parent and sub-issues, reactions, attachments:** None
- **Comments:** 0
- **Raw SHA-256:** `8dcfb40226d1c7b1fc1bb3834e13e9adbb8c7958ced4a310cf569c22c02b7a72`
- **Raw record:** `migration/github-issues/raw/issue-6.json`

## Original body (verbatim)

```text
Approach: (see plan)

Plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md#github-action-publishyml-workflowdispatch-reposito
Tracks: #1
```

## Comments (verbatim)

None.

## Impact

- The dispatch entry point survives, but under a different workflow file and event name.
- Dispatch payload content is deliberately ignored, which closes a trust gap the original design left open.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Original scope: @concavetrillion/* (renamed to @pdomain/* in f439db8, e45e654)
Referenced plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md (absent from this repo's history)
Current workflow: .github/workflows/regen.yml; dispatch event: pdomain-npm-publish
```

## Evidence

1. Commits `dee91bf` and `02123ba` ship and then replace `publish.yml`.
2. Commits `c83b5b3` and `87e7e04` harden the replacement.
3. `tests/test_workflows.test.ts` asserts the current workflow set, including that regeneration follows release publication.
4. [Registry Format](../architecture/registry-format.md) records that every trigger runs a full allowlisted rebuild and that payload content is not trusted.

## Root-cause hypotheses

Not applicable. This was a build-out task, not a defect report, so there is no failure to explain. The issue body carried no analysis of its own: it read `Approach: (see plan)` and pointed at a plan file that does not exist in this repository's Git history. The implementation commits listed under Evidence are the surviving record of what was actually built.

## Defects to fix

None. The workflow shipped and was deliberately superseded.

## Next steps

None. The current trigger design is recorded in [Registry Format](../architecture/registry-format.md) and [Decisions](../context/decisions.md).

## Outcome

Superseded. `publish.yml` shipped and was then replaced by the reusable `regen.yml` workflow, which deploys an ephemeral `_site/` artifact. Every trigger runs a full allowlisted rebuild, and dispatch payload content is not trusted. Evidence: commits `dee91bf`, `02123ba`, `c83b5b3`, `87e7e04`; `tests/test_workflows.test.ts`.

## Resolution

_Retired._ Durable content lives in the governed docs named above. This record is archived in Git history; see the [migration ledger](../context/github-issues-migration-ledger.md) for the removal commit.
