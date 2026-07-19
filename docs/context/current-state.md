---
Status: active
Owner: repository maintainers
Created: 2026-07-14
Last verified: 2026-07-19
Kind: context
---

# Current State

## Agent Index

- **Kind:** context
- **Status:** active
- **Read when:** starting work or checking current operational truth.
- **Search terms:** current state, priorities, risks, tests, registry.

## What matters now

The repository builds a read-only static npm registry. GitHub Pages serves
packuments, while allowlisted publisher GitHub Releases serve package bytes.
[`docs/architecture/registry-format.md`](../architecture/registry-format.md) is the current architecture.

**This repository has no GitHub issues.** All twelve were migrated into governed
documentation and then permanently deleted on 2026-07-19. Issue tracking lives
in `docs/issues/`, and the
[GitHub issues migration ledger](github-issues-migration-ledger.md) holds the
inventory, content digests, outcomes, and deletion journal. The full original
records are archived in Git history at `c64df8e`; retrieve one with
`git show c64df8e:docs/issues/<filename>`. Raw API exports remain under
`migration/github-issues/raw/`.

GitHub Issues is still enabled, so anyone can file a new one. A newly filed
issue is folded into the ledger with an inventory row, a raw export and digest,
and a reconciliation row, then tracked as a governed record under
the [repository issue process](../issues/README.md).

`make ci` is the required local gate. It runs TypeScript type checking, ESLint,
Prettier, actionlint, shell syntax checks, and the Node test suite.

## In-flight work

The [automated live smoke decision](../issues/2026-05-17-gh-007-automated-live-smoke.md)
remains open. The smoke is available manually, but the current deployment does
not run it.

## Risks and tests

No red or flaky test is documented. External GitHub Release assets and GitHub
Pages availability remain operational dependencies. `tests/smoke/run.sh`
validates the deployed package path after deployment.
