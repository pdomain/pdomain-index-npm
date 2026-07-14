---
Status: active
Owner: repository maintainers
Created: 2026-07-14
Last verified: 2026-07-14
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

## Blocked (waiting on)

None.

## Needs owner decision

None.

## Legacy-unverified sweep

- The historical release-asset plan and design were classified as implemented
  from commits `bc011b5`, `02123ba`, and `15f75de`, then retired after their
  current truth and residual intent were preserved.
- [`docs/process/writing-style.md`](../process/writing-style.md) — still-active;
  `CLAUDE.md` and `CONVENTIONS.md` continue to require it.
