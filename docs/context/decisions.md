---
Status: active
Owner: repository maintainers
Created: 2026-07-14
Last verified: 2026-11-12
Kind: context
---

# Decisions

## Agent Index

- **Kind:** context
- **Status:** active
- **Read when:** researching durable architecture and lifecycle decisions.
- **Search terms:** decisions, rationale, tombstone, registry migration.

### 2026-07-14 — Keep full regeneration as the trusted deployment path

- **Context:** The historical release-asset design proposed a simple full scan
  and left incremental work outside its first scope.
- **Decision:** Every cron, manual, publisher-dispatch, and tooling-release
  trigger uses the reusable full-regeneration workflow.
- **Rationale:** A complete scan keeps payload input untrusted, preserves one
  deterministic path, and catches missed publisher dispatches.
- **Evidence:** `.github/workflows/regen.yml`, `scripts/regen-index.ts`,
  `tests/test_workflows.test.ts`, commits `7a71477`, `c83b5b3`, and `87e7e04`.
- **Remaining work:** Incremental regeneration remains deferred.

### 2026-07-14 — Expand validation beyond the migration design

- **Context:** Package bytes come from external GitHub Release assets.
- **Decision:** Require an allowlisted repository-to-package mapping, exact
  release-download repository URLs, canonical `package/package.json`, bounded
  compressed and extracted data, and immutable duplicate versions.
- **Rationale:** These checks keep package identity and resource use under the
  registry's control.
- **Evidence:** `scripts/regen-index.ts`, `tests/test_regen_index.test.ts`,
  `docs/architecture/registry-format.md`, commits `59ae42b`, `123c36b`, and `83ca383`.
- **Remaining work:** Add new publishers only with explicit mappings and tests.

### 2026-07-14 — Retired: npm Release Asset Registry Implementation Plan

- **Old path:** `docs/archive/plans/2026-05-30-npm-release-asset-registry.md`
- **Outcome:** Implemented and deleted after promotion.
- **Superseded by:** [`docs/architecture/registry-format.md`](../architecture/registry-format.md)
- **Removal commit:** `f7ca51d`.
- **Rationale kept:** [`docs/architecture/registry-format.md`](../architecture/registry-format.md) records
  the shipped workflow and deviations. The decision “Keep full regeneration as
  the trusted deployment path” records why. The
  [`intent map`](intent-map.md) retains incremental regeneration and allowlist
  expansion.
- **Remaining work:** The two deferred intent items remain optional.

### 2026-07-14 — Retired: npm Release Asset Registry Design

- **Old path:** `docs/archive/specs/2026-05-30-npm-release-asset-registry-design.md`
- **Outcome:** Implemented and deleted after promotion.
- **Superseded by:** [`docs/architecture/registry-format.md`](../architecture/registry-format.md)
- **Removal commit:** `f7ca51d`.
- **Rationale kept:** [`docs/architecture/registry-format.md`](../architecture/registry-format.md) and the
  decision “Expand validation beyond the migration design” preserve the
  shipped design and material deviations.
- **Remaining work:** The two deferred intent items remain optional.

### 2026-07-19 — Retain migrated GitHub issues; keep Issues enabled (SUPERSEDED)

- **Decision:** Do not delete this repository's migrated GitHub issues, and
  leave GitHub Issues enabled.
- **Context:** The shared runbook
  `shared-devtools/docs/runbooks/github-issues-to-docgraph-migration-prompt.md`
  ends in permanent deletion and `hasIssuesEnabled: false`. This repository
  stops short of both.
- **Rationale:** The durable content already lives in governed docs, and the
  [migration ledger](github-issues-migration-ledger.md) proves every issue has
  an architecture, decision, intent, or active-record destination. The GitHub
  copies are redundant rather than authoritative, so deleting them would add
  irreversibility without adding truth. Keeping Issues open preserves an intake
  channel for anyone reporting a problem.
- **Consequences:** The runbook's deletion gates do not apply here — the
  org-level deletion setting, the deletion journal, and the delete-then-verify
  batches are all out of scope. The ledger becomes a living document: a newly
  filed issue is folded in with an inventory row, a raw export and digest, and a
  reconciliation row.
- **Remaining work:** Eleven issues remain open on GitHub while classified
  Completed or Superseded. Closing them would be accurate but is outward-facing
  and needs explicit owner approval.
- **Superseded by:** the decision below, recorded the same day. The owner chose
  permanent deletion instead of retention. This entry is kept because it records
  the reasoning that was weighed and rejected.

### 2026-07-19 — Retired: Issue tracker migration pickup prompt

- **Old path:** `docs/handoff/2026-07-17-issue-tracker-migration.md` (deleted)
- **Outcome:** Superseded before execution.
- **Superseded by:** [`migration ledger`](github-issues-migration-ledger.md)
- **Removal commit:** Deleted on 2026-07-19, after the migration it described
  had completed. Last present at `c378041`; read it with
  `git show c378041:docs/handoff/2026-07-17-issue-tracker-migration.md`. It was
  briefly retained in place with a correction banner, then removed once the
  cutover finished and `docs/handoff/` had no active handoff left.
- **Rationale kept:** The ledger records what shipped. The handoff proposed a
  different procedure — `docs/roadmap.md`, a `docs/decisions/` archive doc,
  an add-then-`git rm` tombstone, then issue deletion — none of which ran. The
  migration followed the shared runbook instead, and deletion was dropped by the
  retention decision above.
- **Remaining work:** None. The file carries a retirement banner correcting its
  two false claims: that issue `#7` does not exist, and that the backlog was
  unfinished rather than largely already shipped.

### 2026-07-19 — Permanently delete migrated GitHub issues; keep Issues enabled

- **Decision:** Permanently delete all twelve migrated GitHub issues. Leave
  GitHub Issues enabled.
- **Supersedes:** the retention decision above, recorded earlier the same day.
- **Context:** The shared runbook
  `shared-devtools/docs/runbooks/github-issues-to-docgraph-migration-prompt.md`
  ends in permanent deletion and `hasIssuesEnabled: false`. This repository
  takes the deletion step and declines the disable step, so the tracker stays
  open for new reports.
- **Rationale:** The durable content is already promoted and pushed. Behavior
  lives in [`registry-format.md`](../architecture/registry-format.md),
  provenance and outcomes in the
  [migration ledger](github-issues-migration-ledger.md), full issue records in
  Git history at `c64df8e`, and the raw API exports in the working tree. Leaving
  eleven finished items open on the tracker misrepresented the project's state.
- **Consequences:** Every issue URL cited in the ledger and in the issue 7
  record stops resolving. Those links become historical identifiers rather than
  working references; the raw exports and archived records carry the content.
  Deletion is permanent and has no rollback.
- **Integrity note:** The full-record digests recorded at export are no longer
  reproducible, because pushing the migration commits added cross-reference
  timeline events to most issues. Content digests over the GraphQL payload were
  verified identical for all twelve immediately before deletion, and are
  recorded in the ledger. See the ledger's "Digest integrity" section.
- **Remaining work:** None once the deletion journal records verified absence
  for all twelve.

### 2026-09-13 — Regeneration is a local script

- **Context:** Commit `290f458` removed every GitHub workflow, including
  `regen.yml`, `dep-refresh.yml`, `ci.yml`, and `release.yml`.
- **Decision:** `scripts/publish-index.sh` is the regeneration path. A person
  runs it. It rebuilds the registry from allowlisted release assets and pushes
  the `gh-pages` branch. This replaces the workflow trigger in the 2026-07-14
  decision "Keep full regeneration as the trusted deployment path". The full
  allowlisted scan itself stays.
- **Rationale:** GitHub Actions no longer runs in this repo. Pages serves the
  `gh-pages` branch, which a local script can update. A workflow artifact
  upload cannot.
- **Evidence:** `scripts/publish-index.sh`, `scripts/regen-index.ts`, commit
  `290f458`, and [Registry Format](../architecture/registry-format.md).
- **Remaining work:** The live smoke still does not run after publish. See
  [Remaining work](../roadmap.md).

### 2026-11-12 — One open-work list, and a written repository boundary

- **Context:** The same two open items were restated in the roadmap, the issue
  index, the intent map, and current state. Scope questions had no home:
  the copied release driver, a revived dependency-refresh job, and a shared
  scanner with `pdomain-index-pip`.
- **Decision:** [Remaining work](../roadmap.md) is the only open-work list.
  [Repository boundary](../architecture/repository-boundary.md) records what
  this repository ships today. Separate-repo ideas on the roadmap are
  proposals. None is an approved build.
- **Rationale:** A reader should find unfinished work in one place, and should
  not treat a proposal as shipped architecture. The smoke design stays a spec
  until the owner accepts it and it ships.
- **Evidence:** `docs/roadmap.md`, `docs/architecture/repository-boundary.md`,
  `scripts/release-common.sh`, and the `pdomain-index-pip` copy of that file
  (182 lines here, 175 lines there, compared on 2026-11-12).
- **Remaining work:** The roadmap. Owner decisions stay in the
  [intent map](intent-map.md).
