---
Status: active
Owner: repository maintainers
Created: 2026-07-14
Last verified: 2026-11-13
Kind: context
---

# Current State

## Agent Index

- **Kind:** context
- **Status:** active
- **Read when:** starting work or checking current operational truth.
- **Search terms:** current state, priorities, risks, tests, registry.

## What matters now

The repository builds a read-only static npm registry. [Registry Format](../architecture/registry-format.md) is the shipped behavior. [Repository boundary](../architecture/repository-boundary.md) says what belongs elsewhere. [Remaining work](../roadmap.md) is the only open list.

GitHub Pages serves packuments. Allowlisted publisher GitHub Releases serve package bytes. `scripts/publish-index.sh` rebuilds the registry and pushes the `gh-pages` branch. Nothing in this repo runs that command on a schedule.

`just ci` is the local gate. It runs TypeScript checking, ESLint, Prettier, actionlint, shell syntax checks, the Node test suite, and strict docgraph. [Repository boundary](../architecture/repository-boundary.md#local-gate-and-tooling-releases) records the gate and release process.

## In flight

The open list is [Remaining work](../roadmap.md). The undecided build is whether publish runs the live smoke. `tests/smoke/run.sh` exists. `scripts/publish-index.sh` does not run it.

## Risks and tests

No red or flaky test is documented. `just ci` does not contact GitHub Pages or GitHub Release assets. `scripts/publish-index.sh` pushes the `gh-pages` branch from this repo. Package bytes stay in publisher GitHub Releases. `tests/smoke/run.sh` checks one deployed package when someone runs `just smoke`.

## Issue records

All twelve GitHub issues were migrated into governed documentation and permanently deleted on 2026-07-19. New reports belong in `docs/issues/`. The [migration ledger](github-issues-migration-ledger.md) holds the inventory, content digests, outcomes, and deletion journal. Full original records are in git at `c64df8e`. Retrieve one with `git show c64df8e:docs/issues/<filename>`. Raw API exports remain under `migration/github-issues/raw/`.

GitHub Issues is still enabled, so anyone can file a new one. A newly filed issue is folded into the ledger with an inventory row, a raw export and digest, and a reconciliation row, then tracked under the [issue index](../issues/README.md).
