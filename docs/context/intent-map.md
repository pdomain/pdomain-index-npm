---
Status: active
Owner: repository maintainers
Created: 2026-07-14
Last verified: 2026-07-19
Kind: context
---

# Intent Map

## Agent Index

- **Kind:** context
- **Status:** active
- **Read when:** evaluating roadmap, deferred work, or rejected directions.
- **Search terms:** active intent, deferred work, rejected direction, roadmap.

## Active bets

- **Full allowlisted regeneration:** Keep every trigger deterministic by
  rebuilding the complete registry from trusted release assets.
- **Docs-as-issue-tracker:** Issue history lives in `docs/issues/` and the
  [migration ledger](github-issues-migration-ledger.md), not on GitHub. Completed
  2026-07-19: all twelve GitHub issues were migrated and permanently deleted.
  GitHub Issues stays enabled as an intake channel, and anything filed there is
  folded into the ledger rather than left as a second source of truth.

## Deferred work

- **Incremental regeneration:** A single-repository fast path may reduce work,
  but the current full rebuild is simpler and already idempotent. Evidence:
  `scripts/regen-index.ts` and `.github/workflows/regen.yml`.
- **Allowlist expansion:** Add publishers only with an explicit trusted
  repository-to-package mapping and matching validation tests. Evidence:
  `DEFAULT_EXPECTED_PACKAGES` in `scripts/regen-index.ts`.

## Rejected directions

- **Writable npm registry:** This repository remains a read-only static index.
- **Pages-hosted package bytes:** New tarballs stay in publisher GitHub
  Releases; historical Pages tarball URLs are not a compatibility promise.
- **Dispatch-payload publishing:** Dispatch is only a regeneration signal. The
  workflow does not trust or publish payload-provided tarball URLs directly.
- **Retaining migrated GitHub issues:** Considered and rejected on 2026-07-19.
  Retention was recorded as a decision, then superseded the same day in favour of
  permanent deletion, because leaving eleven finished items open misrepresented
  the project's state once their content was promoted and pushed. Both entries
  are kept in [decisions](decisions.md).
- **Disabling GitHub Issues:** The shared runbook ends by disabling Issues. This
  repository declines that step so the tracker stays open for new reports.

## Blocked (waiting on)

None.

## Needs owner decision

- [Automated live smoke](../issues/2026-05-17-gh-007-automated-live-smoke.md) - decide whether every deployment must run the external clean-directory install check or whether documented manual execution is sufficient.

## Legacy-unverified sweep

- The historical release-asset plan and design were classified as implemented
  from commits `bc011b5`, `02123ba`, and `15f75de`, then retired after their
  current truth and residual intent were preserved.
- [`docs/process/writing-style.md`](../process/writing-style.md) — still-active;
  `CLAUDE.md` and `CONVENTIONS.md` continue to require it.
- `docs/handoff/2026-07-17-issue-tracker-migration.md` — superseded; retired and
  then deleted on 2026-07-19. Its procedure never ran; the shared runbook was
  followed instead. Archived in Git history at `c378041`; read it with
  `git show c378041:docs/handoff/2026-07-17-issue-tracker-migration.md`.
  Tombstone in [decisions](decisions.md).
- The eleven completed issue records created during the migration were archived
  in `c64df8e` and removed in `832d39c` — can-retire, already applied. Only the
  active [automated live smoke](../issues/2026-05-17-gh-007-automated-live-smoke.md)
  record remains in the working tree.
