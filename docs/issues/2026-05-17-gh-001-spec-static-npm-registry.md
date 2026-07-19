---
Status: retired
Owner: repository maintainers
Created: 2026-05-17
Last verified: 2026-07-19
Kind: issue
Level: I1
---

# Spec: Static npm registry on GitHub Pages

## Agent Index

- **Kind:** issue
- **Status:** retired
- **Level:** I1
- **Last verified:** 2026-07-19
- **Resolution:** Resolved
- **Severity:** Low - superseded framing, shipped behavior differs
- **Affected version:** `master` at the GitHub Issues cutover
- **Read when:** tracing why the registry exists or what the original scope was.
- **Search terms:** static npm registry, Verdaccio, GitHub Pages, spec, GitHub issue 1
- **Relates to:** [Registry Format](../architecture/registry-format.md), [README](../../README.md), [migration ledger](../context/github-issues-migration-ledger.md)

## Summary

The umbrella spec issue for a Verdaccio-style static npm registry serving the `@concavetrillion/*` scope. It pointed at a spec and a plan under `docs/superpowers/` that do not exist in this repository's Git history, so the body is a pointer rather than a specification. The registry shipped, and the scope was later renamed to `@pdomain/*`.

## GitHub provenance

- **Node ID:** `I_kwDOSfngyM8AAAABCgbYnA`
- **Number and URL:** [#1](https://github.com/pdomain/pdomain-index-npm/issues/1)
- **Former state:** OPEN (state reason `none`)
- **Author:** `ConcaveTrillion`
- **Created:** 2026-05-17T10:36:01Z
- **Updated:** 2026-05-17T10:36:01Z
- **Closed:** None
- **Labels:** `kind:spec`, `status:backlog`
- **Milestone:** None
- **Assignees, issue type, project items, parent and sub-issues, reactions, attachments:** None
- **Comments:** 0
- **Raw SHA-256:** `3b7d286d799580bc7329c788f8a9de9e26902fcdd1488317adb813ce606612ab`
- **Raw record:** `migration/github-issues/raw/issue-1.json`

## Original body (verbatim)

```text
Spec: docs/superpowers/specs/2026-05-17-superpowers-gh-workflow-integration-design.md
Plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md

Stand up Verdaccio-style static npm registry for @concavetrillion/* scope.
```

## Comments (verbatim)

None.

## Impact

- Framed the whole build-out; issues #2 through #9 each carried `Tracks: #1`.
- The scope name in the body is stale: `@concavetrillion/*` no longer exists.
- No specification content is recoverable from the issue itself.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Original scope: @concavetrillion/* (renamed to @pdomain/* in f439db8, e45e654)
Referenced plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md (absent from this repo's history)
Current architecture: docs/architecture/registry-format.md
```

## Evidence

1. The registry is live and described in present tense by [Registry Format](../architecture/registry-format.md).
2. Commits `5fd3d1d`, `bc011b5`, and `02123ba` build the generation and deployment path.
3. `scripts/regen-index.ts` and `tests/test_regen_index.test.ts` are the shipped implementation and its tests.
4. Commits `f439db8` and `e45e654` renamed the scope to `@pdomain/*`.

## Root-cause hypotheses

Not applicable. This was a build-out task, not a defect report, so there is no failure to explain. The issue body carried no analysis of its own: it read `Approach: (see plan)` and pointed at a plan file that does not exist in this repository's Git history. The implementation commits listed under Evidence are the surviving record of what was actually built.

## Defects to fix

None. The registry shipped.

## Next steps

None. Superseded by [Registry Format](../architecture/registry-format.md), which is the current architecture record.

## Outcome

Completed. The static registry shipped and is described in present tense by [Registry Format](../architecture/registry-format.md). Evidence: commits `5fd3d1d`, `bc011b5`, `02123ba`; `scripts/regen-index.ts`; `tests/test_regen_index.test.ts`. The `@concavetrillion/*` scope was renamed to `@pdomain/*` in `f439db8` and `e45e654`.

## Resolution

_Retired._ Durable content lives in the governed docs named above. This record is archived in Git history; see the [migration ledger](../context/github-issues-migration-ledger.md) for the removal commit.
