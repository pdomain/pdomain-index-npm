---
Status: active
Owner: repository maintainers
Created: 2026-07-14
Last verified: 2026-11-12
Kind: context
---

# Intent Map

## Agent Index

- **Kind:** context
- **Status:** active
- **Read when:** evaluating deferred work, rejected directions, or an owner decision.
- **Search terms:** active intent, deferred work, rejected direction, roadmap.

## Active bets

- **Full allowlisted regeneration:** Every publish rebuilds the whole registry from trusted release assets.
- **Docs as the issue tracker:** Open reports live in `docs/issues/` and the [migration ledger](github-issues-migration-ledger.md). That cutover finished on 2026-07-19, when all twelve GitHub issues were migrated and permanently deleted. GitHub Issues stays enabled as intake. A new GitHub issue is folded into the ledger instead of becoming a second source of truth.

## Deferred work

Both items are on [Remaining work](../roadmap.md). They stay optional.

- **Incremental regeneration:** A single-repository fast path may reduce work. The full rebuild is simpler and already idempotent. Evidence: `scripts/regen-index.ts` and `scripts/publish-index.sh`. Commit `290f458` removed `.github/workflows/regen.yml`.
- **Allowlist expansion:** Add publishers only with an explicit trusted repository-to-package mapping and matching validation tests. Evidence: `DEFAULT_EXPECTED_PACKAGES` in `scripts/regen-index.ts`. The mapping today is `pdomain/pdomain-ui` to `@pdomain/pdomain-ui`.

## Rejected directions

- **Writable npm registry:** This repository remains a read-only static index.
- **Pages-hosted package bytes:** New tarballs stay in publisher GitHub Releases. Historical Pages tarball URLs are not a compatibility promise.
- **Dispatch-payload publishing:** A dispatch was only a regeneration signal. The removed workflow did not trust or publish payload-provided tarball URLs. There is no dispatch path now.
- **Retaining migrated GitHub issues:** Considered and rejected on 2026-07-19. Retention was recorded, then superseded the same day in favour of permanent deletion, because leaving eleven finished items open misrepresented the project once their content was promoted and pushed. Both entries stay in [decisions](decisions.md).
- **Disabling GitHub Issues:** The shared runbook ends by disabling Issues. This repository declines that step so the tracker stays open for new reports.

## Blocked (waiting on)

None.

## Needs owner decision

Detail for each item is on [Remaining work](../roadmap.md).

- [Automated live smoke](../issues/2026-05-17-gh-007-automated-live-smoke.md). `scripts/publish-index.sh` does not run `just smoke`. The [plan](../plans/2026-07-21-automated-live-smoke.md) is not implemented. Decide whether every publish must run the clean-directory install check.
- [dep-refresh branches](../issues/2026-08-08-dep-refresh-cannot-auto-land.md). On 2026-11-06 the GitHub API still listed 13 `dep-refresh/*` branches, dated 2026-06-21 through 2026-09-13, and `delete_branch_on_merge` was false. Commit `290f458` deleted the workflow that opened them. The remaining choice is branch deletion, not a new workflow.
- **Shared release driver.** `scripts/release-common.sh` is a vendored copy, and the `pdomain-index-pip` copy already differs. Decide whether one upstream replaces the copies.
- **Dependency refresh as a shared job.** Decide whether the org brings that job back at all. If it does, it does not belong in this repository.
- **Shared release scanner.** Leave the npm and pip generators separate unless both must change for the same bug.

## Recorded classifications

These notes are not open work.

- The historical release-asset plan and design were classified as implemented from commits `bc011b5`, `02123ba`, and `15f75de`, then retired after their current truth and residual intent were preserved. Tombstones are in [decisions](decisions.md).
- [Writing style](../process/writing-style.md) is still active. `CLAUDE.md` and `CONVENTIONS.md` still require it.
- `docs/handoff/2026-07-17-issue-tracker-migration.md` was superseded, then deleted on 2026-07-19. Its procedure never ran. The shared runbook was followed instead. Read it with `git show c378041:docs/handoff/2026-07-17-issue-tracker-migration.md`.
- Eleven completed issue records were archived in `c64df8e` and removed in `832d39c`.
