---
Status: retired
Owner: repository maintainers
Created: 2026-05-17
Last verified: 2026-07-19
Kind: issue
Level: I1
---

# Wire GitHub Pages + the `gh-pages` content branch

## Agent Index

- **Kind:** issue
- **Status:** retired
- **Level:** I1
- **Last verified:** 2026-07-19
- **Resolution:** Resolved
- **Severity:** Low - original approach superseded
- **Affected version:** `master` at the GitHub Issues cutover
- **Read when:** asking why the registry is not served from a mutable `gh-pages` branch.
- **Search terms:** gh-pages, GitHub Pages, content branch, deployment, GitHub issue 3
- **Relates to:** [Registry Format](../architecture/registry-format.md), [migration ledger](../context/github-issues-migration-ledger.md)

## Summary

A build-out task for wiring GitHub Pages to a `gh-pages` content branch. The body carries no detail beyond a pointer to a plan file absent from this repository's history. The mutable content branch shipped first and was later replaced by ephemeral artifact deployment.

## GitHub provenance

- **Node ID:** `I_kwDOSfngyM8AAAABCgcGmA`
- **Number and URL:** [#3](https://github.com/pdomain/pdomain-index-npm/issues/3)
- **Former state:** OPEN (state reason `none`)
- **Author:** `ConcaveTrillion`
- **Created:** 2026-05-17T10:41:33Z
- **Updated:** 2026-05-17T10:41:33Z
- **Closed:** None
- **Labels:** `kind:feature`, `status:backlog`
- **Milestone:** spec: pd-index-npm-new-repo (#1)
- **Assignees, issue type, project items, parent and sub-issues, reactions, attachments:** None
- **Comments:** 0
- **Raw SHA-256:** `177df17e13b2c3f098527d3753335c0dc225f74a2c1a39c31af033a85beeeee3`
- **Raw record:** `migration/github-issues/raw/issue-3.json`

## Original body (verbatim)

```text
Approach: (see plan)

Plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md#wire-github-pages-the-gh-pages-content-branch
Tracks: #1
```

## Comments (verbatim)

None.

## Impact

- The approach described here is no longer how the site is deployed.
- A reader who finds the `gh-pages` branch on the remote could mistake it for the current path; it is not.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Original scope: @concavetrillion/* (renamed to @pdomain/* in f439db8, e45e654)
Referenced plan: docs/superpowers/plans/2026-05-16-pd-index-npm-new-repo.md (absent from this repo's history)
Current workflow: .github/workflows/regen.yml (ephemeral _site/ artifact)
```

## Evidence

1. Commits `a1bef62` and `dee91bf` wire the original `gh-pages` content branch.
2. Commit `02123ba` replaces it with the GitHub Pages artifact flow.
3. `.github/workflows/regen.yml` deploys `_site/` as an artifact and does not push to a content branch.

## Root-cause hypotheses

Not applicable. This was a build-out task, not a defect report, so there is no failure to explain. The issue body carried no analysis of its own: it read `Approach: (see plan)` and pointed at a plan file that does not exist in this repository's Git history. The implementation commits listed under Evidence are the surviving record of what was actually built.

## Defects to fix

None. Deployment works; only the mechanism changed.

## Next steps

None. See [Registry Format](../architecture/registry-format.md) section "Shipped architecture" for the current deployment path.

## Outcome

Superseded. The mutable `gh-pages` content branch shipped first and was then replaced by ephemeral `_site/` artifact deployment through the Pages artifact flow. [Registry Format](../architecture/registry-format.md) describes the current path. Evidence: commits `a1bef62`, `dee91bf`, `02123ba`; `.github/workflows/regen.yml`.

## Resolution

_Retired._ Durable content lives in the governed docs named above. This record is archived in Git history; see the [migration ledger](../context/github-issues-migration-ledger.md) for the removal commit.
