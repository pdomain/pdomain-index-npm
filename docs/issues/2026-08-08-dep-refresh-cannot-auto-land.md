---
Status: active
Owner: repository maintainers
Created: 2026-08-08
Last verified: 2026-08-08
Kind: issue
Level: I1
---

# dep-refresh branches accumulate on origin instead of being deleted after merge

## Agent Index

- **Kind:** issue
- **Status:** active
- **Level:** I1
- **Last verified:** 2026-08-08
- **Resolution:** Open
- **Severity:** Low — cosmetic branch accumulation; dependency updates are landing.
- **Affected version:** `master` at 2026-08-08; `.github/workflows/dep-refresh.yml`, PRs #13-#19.
- **Read when:** investigating stray `dep-refresh/*` branches, changing
  `dep-refresh.yml`, or deciding whether to enable delete-on-merge.
- **Search terms:** dep-refresh, stray branch, delete_branch_on_merge, orphaned
  branch, weekly dependency refresh, auto-merge, branch accumulation.
- **Relates to:** `pdomain-ui` design spec (external repo, cited by path, not
  linked — see Evidence 4): `pdomain-ui/docs/specs/2026-07-16-dep-refresh-auto-land-design.md`.

## Summary

The weekly `dep-refresh` workflow opens a dated branch per run
(`dep-refresh/<date>-<run-id>`) and the repository has
`delete_branch_on_merge: false`, so every merged refresh leaves its branch behind
on `origin`. Seven stray `dep-refresh/*` branches exist as of 2026-08-08 even
though all seven of their pull requests merged successfully. The refresh
mechanism itself works; only branch cleanup is missing.

## Impact

- `origin` accumulates one unreachable-but-undeleted branch per successful weekly
  run — 7 as of this writing, growing by 1/week indefinitely.
- No functional harm: nothing depends on the stray branches, and they do not
  block future refreshes (each run creates a new dated name).
- Minor housekeeping cost: branch list clutter for anyone auditing `origin`.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Workflow: .github/workflows/dep-refresh.yml (branch pattern: dep-refresh/$(date +%Y-%m-%d)-$GITHUB_RUN_ID)
Repo setting: delete_branch_on_merge = false
Branch protection (master), required contexts: static-check, test
CI: .github/workflows/ci.yml (pull_request → master), jobs: static-check, test
```

## Evidence

### 1. Seven stray branches on origin, zero open pull requests

```
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

```
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

```
$ gh api repos/pdomain/pdomain-index-npm --jq '.delete_branch_on_merge'
false
```

With this setting off, GitHub does not delete a pull request's head branch on
merge, which is sufficient by itself to explain all 7 stray branches.

### 4. This repository does not have the broken-required-context defect seen in peer repos

```
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
including a fully green one — can ever satisfy the gate. That spec also
documents the same peer defect in `pdomain-ops` and `pdomain-ocr-training`.
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

1. **`dep-refresh.yml` mints a new dated branch every run instead of reusing
   one, and nothing deletes a merged branch.** (Primary — structural cause;
   also prevents a red week's branch from being cleanly superseded rather than
   piling up alongside future dated branches.)
2. **`delete_branch_on_merge` is `false` on this repository.** (Secondary —
   sufficient by itself to fix the observed symptom, but does not address
   accumulation across red weeks the way a reusable branch does.)

## Next steps

1. Apply the fix from `pdomain-ui/docs/specs/2026-07-16-dep-refresh-auto-land-design.md`
   §3.B–C to this repository: replace the dated `dep-refresh/<date>-<run-id>`
   branch with one reusable `dep-refresh` branch, force-pushed from a fresh
   `master` each run; open a pull request only when no open one already exists
   for that branch (checked by state, not mere existence); re-arm
   `gh pr merge --auto --rebase`; and set `delete_branch_on_merge: true` on
   `pdomain/pdomain-index-npm`.
2. This repository does not need the peer `unit-test` aggregation-job fix
   (spec §3.A) — its required contexts already map onto real, unsharded CI job
   names (Evidence 4).
3. After landing, delete the 7 existing stray branches (they are already merged
   and unreachable from any open PR) and verify the next scheduled run reuses a
   single `dep-refresh` branch with delete-on-merge cleaning it up.

## What is NOT broken

- Dependency updates are landing here: all 7 recent `dep-refresh` pull requests
  merged, which is more than the peer repos documented in the `pdomain-ui`
  spec can say.
- Branch protection's required status checks (`static-check`, `test`) are
  directly satisfiable — `ci.yml` produces both by exact name, with no
  matrix-sharding mismatch.
- Auto-merge itself (`gh pr merge --auto --rebase`) is correctly armed and has
  worked on every run.
- The `unit-test`-aggregation defect from the `pdomain-ui` spec (Bug 1) does not
  apply to this repository.

## Resolution

_Open._ When fixed: set frontmatter + Agent Index `Status: retired`, add the
resolving commit/spec link here, move the `docs/issues/README.md` pointer to
"Resolved", and route the retirement through `doc-retirer`.
