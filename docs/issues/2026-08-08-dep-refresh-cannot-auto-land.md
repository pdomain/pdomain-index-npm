---
Status: active
Owner: repository maintainers
Created: 2026-08-08
Last verified: 2026-11-12
Kind: issue
Level: I1
---

# dep-refresh branches accumulate on origin instead of being deleted after merge

## Agent Index

- **Kind:** issue
- **Status:** active
- **Level:** I1
- **Last verified:** 2026-11-12
- **Resolution:** Open
- **Severity:** Low — leftover branches on origin. The weekly job no longer runs.
- **Affected version:** `master` at 2026-08-08; `.github/workflows/dep-refresh.yml`, PRs #13-#19. The workflow file was deleted in `290f458`.
- **Read when:** deleting stray `dep-refresh/*` branches, or deciding whether
  `delete_branch_on_merge` still matters.
- **Search terms:** dep-refresh, stray branch, delete_branch_on_merge, orphaned
  branch, weekly dependency refresh, auto-merge, branch accumulation.
- **Relates to:** `pdomain-ui` design spec (external repo, cited by path, not
  linked — see Evidence 4): `pdomain-ui/docs/specs/2026-07-16-dep-refresh-auto-land-design.md`.

## Summary

The weekly job is gone. Thirteen merged `dep-refresh/*` branches were still on
origin on 2026-11-06. Deleting those branches is the remaining work. Do not
restore the workflow in this repository.

While the workflow existed, it opened a dated branch per run
(`dep-refresh/<date>-<run-id>`) and the repository had
`delete_branch_on_merge: false`, so every merged refresh left its branch behind
on `origin`. Seven stray `dep-refresh/*` branches existed as of 2026-08-08 even
though all seven of their pull requests had merged. The refresh
mechanism itself was working then. Only branch cleanup was missing.

Checked on 2026-11-06 with `gh api repos/pdomain/pdomain-index-npm` and `gh api repos/pdomain/pdomain-index-npm/branches?per_page=100`. Commit `290f458` deleted `.github/workflows/dep-refresh.yml`, so that weekly job no longer opens branches. The branch list still had 13 `dep-refresh/*` names, from `dep-refresh/2026-06-21-27896278396` through `dep-refresh/2026-09-13-34744062988`, plus `gh-pages` and `master`. `delete_branch_on_merge` was still false.

## Impact

- On 2026-08-08, origin held 7 stray branches and the weekly job was still
  adding one per successful run.
- On 2026-11-06 the job was gone and 13 `dep-refresh/*` branches remained.
  They do not grow by themselves now.
- Nothing depends on the stray branches. They clutter `origin` for anyone
  auditing branches.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Recorded environment: 2026-08-08, while the workflows still existed
Workflow then: .github/workflows/dep-refresh.yml (branch pattern: dep-refresh/$(date +%Y-%m-%d)-$GITHUB_RUN_ID)
Repo setting: delete_branch_on_merge = false
Branch protection (master), required contexts then: static-check, test
CI then: .github/workflows/ci.yml (pull_request → master), jobs: static-check, test
Removed: commit 290f458 deleted .github/workflows/ on 2026-09-13
```

## Evidence

### 1. Seven stray branches on origin, zero open pull requests

```console
$ gh api repos/pdomain/pdomain-index-npm/branches?per_page=100 --jq '.[].name'
dep-refresh/2026-06-21-27896278396
dep-refresh/2026-06-28-28313377293
dep-refresh/2026-07-05-28731267694
dep-refresh/2026-07-12-29180946740
dep-refresh/2026-07-19-29674470039
dep-refresh/2026-07-26-30189267706
dep-refresh/2026-08-02-30733852984
gh-pages
master
```

```console
$ gh pr list --repo pdomain/pdomain-index-npm --state all --limit 20
19  chore: weekly dep refresh  dep-refresh/2026-08-02-30733852984  MERGED  2026-08-02T05:17:48Z
18  chore: weekly dep refresh  dep-refresh/2026-07-26-30189267706  MERGED  2026-07-26T05:22:30Z
17  chore: weekly dep refresh  dep-refresh/2026-07-19-29674470039  MERGED  2026-07-19T05:12:02Z
16  chore: weekly dep refresh  dep-refresh/2026-07-12-29180946740  MERGED  2026-07-12T05:17:38Z
15  chore: weekly dep refresh  dep-refresh/2026-07-05-28731267694  MERGED  2026-07-05T05:55:52Z
14  chore: weekly dep refresh  dep-refresh/2026-06-28-28313377293  MERGED  2026-06-28T06:08:26Z
13  chore: weekly dep refresh  dep-refresh/2026-06-21-27896278396  MERGED  2026-06-21T06:43:40Z
```

`gh pr list --state all` shows 0 open pull requests and all 7 dep-refresh PRs as
`MERGED`. Every branch left on `origin` corresponds to a pull request that
already merged — the refresh PRs land here; only the branch cleanup is missing.
This is milder than the failure mode in peer repos where refresh PRs also pile
up unmerged.

### 2. The workflow names a new branch every run and never deletes it

`.github/workflows/dep-refresh.yml`:

```yaml
BRANCH="dep-refresh/$(date +%Y-%m-%d)-$GITHUB_RUN_ID"
...
git checkout -b "$BRANCH"
...
gh pr create ... --head "$BRANCH" --label dep-refresh
gh pr merge --auto --rebase
```

No step deletes `$BRANCH` after merge, and nothing reuses a prior branch, so a
successful merge still leaves the branch reachable on `origin`.

### 3. `delete_branch_on_merge` is off for this repository

```console
$ gh api repos/pdomain/pdomain-index-npm --jq '.delete_branch_on_merge'
false
```

With this setting off, GitHub does not delete a pull request's head branch on
merge, which is sufficient by itself to explain all 7 stray branches.

### 4. This repository does not have the broken-required-context defect seen in peer repos

```console
$ gh api repos/pdomain/pdomain-index-npm/branches/master/protection --jq '.required_status_checks.contexts'
["static-check","test"]
```

`.github/workflows/ci.yml` defines exactly two `pull_request` jobs, named
`static-check` and `test` — both required contexts are produced directly by a
same-named job, with no matrix-sharding mismatch. This differs from the defect
documented for `pdomain-ui` in
`pdomain-ui/docs/specs/2026-07-16-dep-refresh-auto-land-design.md` (Bug 1),
where branch protection requires a plain `unit-test` context but CI only ever
reports sharded `unit-test (1/4)` … `unit-test (4/4)`, so no pull request —
including a fully green one — can ever satisfy the gate. The spec covers
`pdomain-ui` only. The same class of defect was found separately on
2026-08-08 in `pdomain-ops`, `pdomain-ocr-training`, and
`pdomain-book-tools`, each from a different cause: stale context names left
by a repo rename in the first two, and a context naming the workflow rather
than a job in the third.
Neither the never-satisfiable-gate defect nor its symptom (unmerged,
accumulating PRs) is present here: the required contexts are directly
satisfiable, and all 7 recent dep-refresh PRs did in fact merge.

## Root-cause hypotheses

1. **(Confirmed) `delete_branch_on_merge: false` combined with a fresh dated
   branch name every run.** Every merged PR's head branch survives because the
   repo setting does not auto-delete it, and the workflow never reuses or
   explicitly deletes a prior branch. Fully explains all 7 stray branches with
   zero open PRs. Confirmed directly by Evidence 1–3; no alternative hypothesis
   is needed.

## Defects to fix

1. **Thirteen merged `dep-refresh/*` branches were still on origin on
   2026-11-06.** Delete them. They are already merged and no open pull request
   uses them.
2. **`delete_branch_on_merge` is still false.** The setting no longer creates
   branches, because the workflow is gone. Change it only if pull requests
   return.

While `.github/workflows/dep-refresh.yml` existed, the job minted a new dated
branch every run and never deleted it. Commit `290f458` removed that file.
Restoring it is not the fix. The peer design in
`pdomain-ui/docs/specs/2026-07-16-dep-refresh-auto-land-design.md` §3.B–C
described a reusable branch and `delete_branch_on_merge: true`. That design
applied to a live workflow. This repository does not have one. Evidence 4
still holds: this repo did not have the peer `unit-test` aggregation defect.

## Next steps

1. Delete the merged `dep-refresh/*` branches.
2. Do not add `.github/workflows/dep-refresh.yml` back in this repository.
3. If the org wants weekly dependency refresh again, track that on
   [Remaining work](../roadmap.md) as a shared job.

Checked on 2026-11-06: the workflow file was gone, 13 `dep-refresh/*` branches
remained, and `delete_branch_on_merge` was false. Branch deletion is not done.

## What is NOT broken

- On 2026-08-08, pull requests #13 through #19 had merged. The weekly job was
  landing updates then. It no longer runs, so it is not landing new updates.
- The `unit-test` aggregation defect from the `pdomain-ui` spec did not apply
  here. Required contexts `static-check` and `test` matched `ci.yml` job names.
  Commit `290f458` later removed `.github/workflows/`, including `ci.yml`.
- The stray branches do not block `master` or `gh-pages`.

## Resolution

_Open._ When fixed, route the retirement through `doc-retirer`. That
deletes this file, drops its pointer from the open list in
`docs/issues/README.md`, and appends a tombstone to
`docs/context/decisions.md`. Do not leave a resolved copy in the tree.
