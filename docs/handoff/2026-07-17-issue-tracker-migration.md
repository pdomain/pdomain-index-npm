---
kind: handoff
status: "active"
created: "2026-07-17"
created_at: "2026-07-17T09:19:00Z"
owner: CT
branch: master
scope: issue-tracker-migration
worktree: /workspaces/pdomain/pdomain-index-npm
base_commit: c6c3e86f2c9c8b4189187bf588cff1f9fc35083b
supersedes: ""
---

# Issue tracker migration — pickup prompt

## Agent Index

- Kind: handoff
- Status: active
- Read when: you are about to migrate this repo's GitHub issue tracker into
  docs, or you are asked to clear/archive/close out the open issue backlog
  for `pdomain-index-npm`.
- Search terms: issue tracker migration, roadmap migration, archive issues,
  close issues, docs/roadmap, docs/decisions, gh issue delete

## Goal

Clear this repo's GitHub issue tracker: migrate the open backlog into
`docs/roadmap.md`, archive every issue's full text (body + comments) into Git
history via a decision doc, then delete the issues from GitHub. This follows
the same pattern already executed in two sibling repos:
`pdomain-ocr-cli` (50 issues archived) and `pdomain-ocr-simple-gui` (37
issues, roadmap-first). Do not perform the migration in this handoff — this
document only sets up the next session to do it.

## Current state

As of this handoff:

- Open issues: 11 (`#1`-`#12`, missing `#7`, which does not exist in this
  repo's numbering).
- Closed issues: 1.
- Admin access on the repo is confirmed, so `gh issue delete` will work when
  the time comes.
- docgraph is present in this repo (`DOCGRAPH.md` at the root).
- `docs/decisions/` does **not** exist yet. The archive step below must
  create this directory — it is not a matter of adding a file to an existing
  folder.
- `docs/roadmap.md` does not exist yet either.
- `docs/handoff/` did not exist before this file was written.
- `ls docs/` currently shows: `context/`, `conventions/`, `process/`, and
  `REGISTRY_FORMAT.md`. These are the only pre-existing docs surfaces —
  there is no `roadmap/`, `decisions/`, `specs/`, or `plans/` folder yet.

### Label breakdown (11 open issues)

- `kind:feature` — 7 issues (`#2`, `#3`, `#4`, `#5`, `#6`, `#8`, `#9`)
- `kind:bug` — 2 issues (`#10`, `#11`)
- `kind:chore` — 1 issue (`#12`)
- `kind:spec` — 1 issue (`#1`)

All 11 open issues carry `status:backlog`. Several also carry `effort:*`,
`model:sonnet`, and `model-effort:*` labels, which are scheduling metadata,
not scope signals.

### Representative titles (all 11 open issues, since the set is small)

- `#1` — Spec: Static npm registry on GitHub Pages (`kind:spec`)
- `#2` — Create the GitHub repo + initial scaffold (`kind:feature`)
- `#3` — Wire GitHub Pages + the `gh-pages` content branch (`kind:feature`)
- `#4` — Define the on-disk registry layout + write the
  `rebuild-packuments` script (`kind:feature`)
- `#5` — Write the `publish.ts` script that adds one tarball to the index
  (`kind:feature`)
- `#6` — GitHub Action — `publish.yml` (workflow_dispatch +
  repository_dispatch) (`kind:feature`)
- `#8` — Consumer documentation in README + `.npmrc` example
  (`kind:feature`)
- `#9` — Workspace integration — `.gitignore` anchor + CLAUDE.md notes
  (`kind:feature`)
- `#10` — Validate tarball package names before writing registry paths
  (`kind:bug`)
- `#11` — Fix prerelease semver ordering for dist-tags (`kind:bug`)
- `#12` — Fix broken npm smoke script (`kind:chore`)

### Read

This is a real, unfinished backlog, not a stale or duplicate pile. `#1`
through `#9` form a single coherent build-out sequence for a static npm
registry served from GitHub Pages: spec, scaffold, GitHub Pages wiring,
on-disk registry layout, publish script, publish workflow, consumer docs,
and workspace integration. `#10`-`#12` are bug/chore items layered on top of
that same registry (semver ordering, path validation, a broken smoke
script). None of this reads as done-but-not-closed — none of the 11 issues
should be deleted outright without first carrying their content into
`docs/roadmap.md`.

## Decisions

- **Scope**: migrate all 11 open issues (`#1`-`#6`, `#8`-`#12`). This is the
  entire open backlog, so there is no partial-scope question to resolve.
- **Roadmap-first is required.** Because the open issues are unfinished
  backlog (not stale/duplicate/already-shipped), do not delete any issue
  before its content is captured in `docs/roadmap.md`. This mirrors the
  `pdomain-ocr-simple-gui` precedent, not the simpler cases where an issue
  can be archived straight away.
- The single closed issue is optional to include in the archive doc; the
  proven pattern from the sibling repos archives closed issues too when
  convenient, but the required work is the 11 open ones.

## The proven procedure

1. **Pull each in-scope issue's full content.** For each issue number `N`:

   ```
   gh issue view N --repo pdomain/pdomain-index-npm \
     --json number,title,author,createdAt,closedAt,state,stateReason,labels,body,comments,url \
     > /tmp/issue-N.json
   sha256sum /tmp/issue-N.json
   ```

   Keep the JSON in scratch space and note the checksum so content can be
   verified against what lands in the archive doc.

2. **Author `docs/roadmap.md`.** Mirror the structure of
   `../pdomain-ocr-cli/docs/roadmap.md` (now/next/later, or whatever section
   layout that file uses). Each roadmap item must be tagged with its source
   issue number, e.g. `#4`, so a reader can trace a roadmap line back to the
   archived issue text.

3. **Create `docs/decisions/` (it does not exist yet) and render the
   archive doc** at `docs/decisions/2026-07-DD-closed-issues-archive.md`
   (pick the actual date when you do this). Structure:
   - docgraph frontmatter with `kind: decision`, `status: retired`.
   - An `## Agent Index` section per docgraph convention.
   - `## Context`, `## Decision`, `## Consequences`, `## Supersedes`
     sections.
   - Add `<!-- markdownlint-disable -->` immediately after the frontmatter,
     before the H1 — the verbatim issue bodies/comments below it will not be
     clean markdown.
   - Then one `## #N — <title>` section per issue, each containing:
     author, `createdAt`, `closedAt`, `state`, `stateReason`, labels, the
     issue `url`, the full body verbatim, and all comments verbatim in
     order.

4. **Commit roadmap + archive together, then remove the archive in a
   second commit.** First commit adds both `docs/roadmap.md` and the new
   `docs/decisions/2026-07-DD-closed-issues-archive.md`. Then, in a second
   commit, `git rm docs/decisions/2026-07-DD-closed-issues-archive.md`,
   with a commit message that cites the first commit's SHA and the
   retrieval command `git show <sha>:docs/decisions/2026-07-DD-closed-issues-archive.md`.
   Git history is the permanent tombstone for the full issue text; only the
   roadmap stays live in the working tree.

5. **After the archive is committed, delete the issues from GitHub.** For
   each issue: `gh issue delete N --repo pdomain/pdomain-index-npm --yes`.
   This is permanent — get an explicit human "go" before running any
   `gh issue delete` command, even though admin access is already confirmed.

## Gotchas

- The `pre-commit-update` hook may bump `.pre-commit-config.yaml` as a side
  effect of any commit in this repo, which aborts the commit. If that
  happens: `git checkout -- .pre-commit-config.yaml` to revert the bump,
  then commit again with `SKIP=pre-commit-update git commit ...`.
- Validate new/changed markdown with the `markdownlint-cli2` pre-commit hook
  and with the docgraph check MCP tool
  (`mcp__docgraph__docgraph_check` or the plugin-namespaced equivalent). An
  orphan-doc advisory on the archive file right before its `git rm` is
  expected and fine — the doc is intentionally short-lived.
- This repo has no existing "tombstone" convention for retired docs (no
  prior `docs/decisions/` directory at all). The archive-then-`git rm`
  approach still applies — it does not depend on a pre-existing decisions
  folder, it creates one.

## Pointers

- `docs/roadmap.md` — does not exist yet; to be created by this migration.
- `docs/decisions/` — does not exist yet; to be created by this migration.
- `DOCGRAPH.md` — confirms docgraph is active in this repo.
- `../pdomain-ocr-cli/docs/roadmap.md` — structural template for the new
  roadmap.
- `../pdomain-ocr-simple-gui/docs/roadmap.md` — second reference template,
  roadmap-first precedent.

## Reference worked examples

- `pdomain-ocr-cli` archived its closed-issue backlog in commit `9498407`.
- `pdomain-ocr-simple-gui` did the add-then-remove pair in commits
  `ec3979f` (add roadmap + archive) then `7f3be6b` (remove archive,
  citing `ec3979f`).
- Agent memory has a distilled version of this whole procedure under the
  `closed-issue-archive-pattern` note — read it before starting for the
  condensed checklist form of the same steps above.

## Resume steps

1. `gh issue list --repo pdomain/pdomain-index-npm --state open --limit 300 --json number,title,labels,body,comments` —
   re-confirm the 11-issue set has not changed since this handoff.
2. `gh issue view 1 --repo pdomain/pdomain-index-npm --json number,title,author,createdAt,closedAt,state,stateReason,labels,body,comments,url` —
   pull the spec issue first since `#1` frames the whole roadmap.
3. Draft `docs/roadmap.md` against `../pdomain-ocr-cli/docs/roadmap.md`'s
   structure before touching `docs/decisions/`.
