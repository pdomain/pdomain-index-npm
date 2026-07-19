---
Status: retired
Owner: repository maintainers
Created: 2026-05-17
Last verified: 2026-07-19
Kind: issue
Level: I1
---

# Workspace integration — `.gitignore` anchor + CLAUDE.md notes

## Agent Index

- **Kind:** issue
- **Status:** retired
- **Level:** I1
- **Last verified:** 2026-07-19
- **Resolution:** Resolved
- **Severity:** Low - superseded by AGENTS.md and DOCGRAPH.md
- **Affected version:** `master` at the GitHub Issues cutover
- **Read when:** tracing repository agent guidance or the workspace `.gitignore` anchor.
- **Search terms:** workspace integration, gitignore anchor, CLAUDE.md, AGENTS.md, GitHub issue 9
- **Relates to:** [Agent guidance](../../AGENTS.md), [migration ledger](../context/github-issues-migration-ledger.md)

## Summary

A build-out task for workspace integration: a `.gitignore` anchor for workspace-local agent memory, plus CLAUDE.md notes. The body carries no detail beyond a pointer to a plan file absent from this repository's history. The CLAUDE-only process it assumed has since been superseded.

## GitHub provenance

- **Node ID:** `I_kwDOSfngyM8AAAABCgcHxw`
- **Number and URL:** [#9](https://github.com/pdomain/pdomain-index-npm/issues/9)
- **Former state:** OPEN (state reason `none`)
- **Author:** `ConcaveTrillion`
- **Created:** 2026-05-17T10:41:37Z
- **Updated:** 2026-05-17T10:41:37Z
- **Closed:** None
- **Labels:** `kind:feature`, `status:backlog`
- **Milestone:** spec: pd-index-npm-new-repo (#1)
- **Assignees, issue type, project items, parent and sub-issues, reactions, attachments:** None
- **Comments:** 0
- **Raw SHA-256:** `193f4b6896099c8e40c7ab7af5fce66d4a956515a7d2fd9126fa8d77fb432529`
- **Raw record:** `migration/github-issues/raw/issue-9.json`

## Original body (verbatim)

```text
Approach: (see plan)

Plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md#workspace-integration-gitignore-anchor-claudemd-no
Tracks: #1
```

## Comments (verbatim)

None.

## Impact

- Without the ignore anchor, workspace-local agent memory could be committed.
- The CLAUDE.md-centred guidance described here no longer reflects how the repo is governed.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Original scope: @concavetrillion/* (renamed to @pdomain/* in f439db8, e45e654)
Referenced plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md (absent from this repo's history)
Current guidance: AGENTS.md (canonical), CLAUDE.md (symlink), DOCGRAPH.md
```

## Evidence

1. Commit `bb3f6b5` adds the workspace integration.
2. Commit `afc4ab0` initialises docgraph governance.
3. `.gitignore`, `CLAUDE.md`, and `DOCGRAPH.md` are present in the working tree.

## Root-cause hypotheses

Not applicable. This was a build-out task, not a defect report, so there is no failure to explain. The issue body carried no analysis of its own: it read `Approach: (see plan)` and pointed at a plan file that does not exist in this repository's Git history. The implementation commits listed under Evidence are the surviving record of what was actually built.

## Defects to fix

None. Both parts shipped.

## Next steps

None. Agent guidance now lives in `AGENTS.md` with `DOCGRAPH.md` for docgraph rules.

## Outcome

Completed. The ignore anchor for workspace-local agent memory and the repository agent guidance both shipped. The original CLAUDE-only process was superseded by `AGENTS.md` with `CLAUDE.md` as a symlink, plus `DOCGRAPH.md`. Evidence: commits `bb3f6b5`, `afc4ab0`; `.gitignore`; `CLAUDE.md`; `DOCGRAPH.md`.

## Resolution

_Retired._ Durable content lives in the governed docs named above. This record is archived in Git history; see the [migration ledger](../context/github-issues-migration-ledger.md) for the removal commit.
